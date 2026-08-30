(function () {
    'use strict';

    var BOARD_NO_FAQ = 3;

    waitForJQuery(init);

    function waitForJQuery(callback) {
        if (window.jQuery) {
            callback(window.jQuery);
            return;
        }

        window.setTimeout(function () {
            waitForJQuery(callback);
        }, 50);
    }

    function init($) {
        $(function () {
            initBoardType($);
        });
    }

    /* =====================================================
       게시판 종류
    ===================================================== */
    function initBoardType($) {
        var $boardWrap = $('.ec-base-table.typeList');
        if ($boardWrap.length === 0) return;

        var currentBoardNo = getCurrentBoardNo($);

        if (currentBoardNo !== BOARD_NO_FAQ) return;

        $boardWrap.addClass('board-type-faq');
        initFaqAccordion($boardWrap, $);
    }

    function getCurrentBoardNo($) {
        var boardNo = $('input[name="board_no"]').first().val();

        if (!boardNo) {
            boardNo = new URLSearchParams(window.location.search).get('board_no');
        }

        return Number(boardNo);
    }

    /* =====================================================
       FAQ 아코디언
    ===================================================== */
    function initFaqAccordion($boardWrap, $) {
        var $faqList = $boardWrap.find('.xans-board-list-1002');

        if ($faqList.length === 0) return;

        $faqList.on('click.faqAccordion', '.subject a', function (event) {
            event.preventDefault();

            var $link = $(this);
            var $row = $link.closest('tr');

            toggleFaqRow($row, $link.attr('href'), $);
        });
    }

    function toggleFaqRow($row, url, $) {
        var isOpen = $row.hasClass('is-open');

        closeOtherFaqRows($row, $);

        if (isOpen) {
            closeFaqRow($row, $);
            return;
        }

        $row.addClass('is-open');

        if ($row.data('faqHtml')) {
            showFaqAnswer($row, $row.data('faqHtml'), $);
            return;
        }

        var $answerRow = showFaqAnswer($row, '불러오는 중...', $);

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html'
        })
            .done(function (html) {
                var answerHtml = $(html).find('.detail').html();
                var safeAnswer = answerHtml || '내용을 불러올 수 없습니다.';

                $row.data('faqHtml', safeAnswer);
                $answerRow.find('.faq-answer-inner').html(safeAnswer);
            })
            .fail(function () {
                $answerRow
                    .find('.faq-answer-inner')
                    .text('답변을 불러오는 중 오류가 발생했습니다.');
            });
    }

    function closeOtherFaqRows($row, $) {
        $row
            .siblings('tr.is-open')
            .each(function () {
                closeFaqRow($(this), $);
            });
    }

    function closeFaqRow($row, $) {
        $row.removeClass('is-open');

        $row
            .next('.faq-answer')
            .stop(true, true)
            .slideUp(200, function () {
                $(this).remove();
            });
    }

    function showFaqAnswer($row, html, $) {
        var colspan = $row.children('td').length || 1;

        var $answerRow = $('<tr>', {
            class: 'faq-answer'
        });

        var $cell = $('<td>', {
            colspan: colspan
        });

        var $content = $('<div>', {
            class: 'faq-answer-inner'
        }).html(html);

        $answerRow.append($cell.append($content));
        $row.after($answerRow);

        $answerRow
            .hide()
            .slideDown(200);

        return $answerRow;
    }
})();