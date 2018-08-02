// ==============================================================================================
// component/scroll-active
// ==============================================================================================
// variable ========================================
var tarData = 'data-scroll-active';
var activeData = 'data-is-active';
// function ========================================
$(function() {
	if($('[' + tarData + ']').length == false) {
		return;
	} else {
		$('[' + tarData + ']').each(function() {
			var tar = $(this);
			var trg = $(this).attr(tarData);
			var trgOffset = $(trg).offset().top + $(trg).outerHeight();
			$(window).scroll(function() {
				var scrollPos = $(window).scrollTop() + $(window).height();
				if(scrollPos > trgOffset) {
					tar.attr(activeData, 'true');
				} else {
					tar.attr(activeData, 'false');
				}
			});
		});
	};
});