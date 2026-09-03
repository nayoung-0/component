(function () {
    // 배너매니저 공통 
    $('.df-bannermanager').each(function () {
        var $wrap = $(this);
        
        // 컬러 변경 
        // white -> #fff
        // black -> #000
        $wrap.find('img[alt]').each(function () {
            var $img = $(this);
            var alt = $.trim($img.attr('alt')).toLowerCase();
            var color = (alt === 'white') ? '#fff' : '#000';
            var $item = $img.closest('.df-bannermanager > *');
            if (!$item.length) { $item = $img.parent(); }
            $item.css('color', color);
        });
    });
})
