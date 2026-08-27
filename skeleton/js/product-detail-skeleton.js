(function () {
    'use strict';
    /**
     * 상품상세 첫 화면 스켈레톤 UI (공용 컴포넌트)
     *
     * 대응 CSS : css/product-detail-skeleton.css
     * 대응 HTML: html/product-detail-skeleton.snippet.html
     *
     * 동작:
     * - #prdDetailImg(또는 .xans-product-detail .imgArea .RW .prdImg .thumbnail img)
     *   메인 이미지가 로드(load/error) 완료되면 .product-detail-skeleton에
     *   is-hidden 클래스를 붙여서 사라지게 한다.
     * - 이미지 로드가 너무 오래 걸리는 경우를 대비해 FALLBACK_TIMEOUT_MS 이후
     *   강제로 숨김 처리한다.
     *
     * [프로젝트별로 확인할 것]
     * - 메인 이미지 셀렉터(#prdDetailImg 등)가 스킨마다 다를 수 있으니
     *   실제 마크업에 맞게 조정할 것.
     */

    var JQUERY_WAIT_INTERVAL = 50;
    var JQUERY_WAIT_MAX_TRY = 100;
    var FALLBACK_TIMEOUT_MS = 2500;

    waitForJQuery(function ($) {
        $(function () {
            initDetailSkeleton($);
        });
    });

    function waitForJQuery(callback, tryCount) {
        var currentTry = tryCount || 0;

        if (window.jQuery) {
            callback(window.jQuery);
            return;
        }

        if (currentTry >= JQUERY_WAIT_MAX_TRY) {
            console.error('[DETAIL_SKELETON] jQuery 로드 타임아웃 - 스켈레톤 기능 비활성화');
            return;
        }

        window.setTimeout(function () {
            waitForJQuery(callback, currentTry + 1);
        }, JQUERY_WAIT_INTERVAL);
    }

    function initDetailSkeleton($) {
        var $skeleton = $('.product-detail-skeleton').first();
        if (!$skeleton.length) return;

        var hidden = false;
        var fallbackTimer = null;

        var $prdDetailImgEl = $('#prdDetailImg');
        var $mainImage = $prdDetailImgEl.is('img') ? $prdDetailImgEl : $prdDetailImgEl.find('img').first();
        if (!$mainImage.length) {
            $mainImage = $('.xans-product-detail .imgArea .RW .prdImg .thumbnail img').first();
        }

        function hideSkeleton() {
            if (hidden) return;
            hidden = true;
            window.clearTimeout(fallbackTimer);
            if ($mainImage.length) {
                $mainImage.off('load.detailSkeleton error.detailSkeleton');
            }
            $skeleton.addClass('is-hidden');
        }

        fallbackTimer = window.setTimeout(hideSkeleton, FALLBACK_TIMEOUT_MS);

        if (!$mainImage.length) return;

        if ($mainImage[0].complete) {
            hideSkeleton();
            return;
        }

        $mainImage.off('load.detailSkeleton error.detailSkeleton')
            .on('load.detailSkeleton error.detailSkeleton', hideSkeleton);
    }
})();
