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
			var trgData = $(this).attr(tarData);
			tar.attr(activeData, 'false');
			if(trgData) {
				var trg = $(trgData);
			} else {
				var trg = $(this);
			}
			var trgOffset = trg.offset().top;
			$(window).scroll(function() {
				var scrollPos = $(window).scrollTop();
				if(scrollPos > trgOffset) {
					tar.attr(activeData, 'true');
				} else {
					tar.attr(activeData, 'false');
				}
			});
		});
	};
});