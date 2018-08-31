// ==============================================================================================
// component/scroll-active
// ==============================================================================================
// variable ========================================
var tarData = 'data-scroll-active';
var booleanData = 'data-is-active';
// function ========================================
$(function() {
	if($('[' + tarData + ']').length) {
		$('[' + tarData + ']').each(function() {
			var tar = $(this);
			var trgData = $(this).attr(tarData);
			tar.attr(booleanData, 'false');
			if(trgData) {
				var trg = $(trgData);
			} else {
				var trg = $(this);
			}
			var trgOffset = trg.offset().top;
			$(window).scroll(function() {
				var scrollPos = $(window).scrollTop();
				if(scrollPos > trgOffset) {
					tar.attr(booleanData, 'true');
				} else {
					tar.attr(booleanData, 'false');
				}
			});
		});
	} else {
		return;
	};
});