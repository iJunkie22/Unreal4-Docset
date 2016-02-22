$(document).ready(function () {
    var anchor = $('[name="MARKDOWNANCHORNOTUSEDELSEWHERE"]');
    if (anchor.length === 0) {
        anchor = $('#H1TitleId');
    }

    var anchorFromTheTop = anchor.offset().top;
    var header = $('#head');
    var headerBottom = header.offset().top + header.height();
    $(document).scrollTop(anchorFromTheTop - headerBottom);
});