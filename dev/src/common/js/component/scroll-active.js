// ==============================================================================================
// component/scroll-active
// ==============================================================================================
// variable ========================================
var tarData = 'data-scroll-active';
var toggleData = 'data-is-active';
// function ========================================
$(function() {
	if($('[' + tarData + ']').length) {
		$('[' + tarData + ']').each(function() {
			var tar = $(this);
			var trgData = $(this).attr(tarData);
			tar.attr(toggleData, 'false');
			if(trgData) {
				var trg = $(trgData);
			} else {
				var trg = $(this);
			}
			var trgOffset = trg.offset().top;
			$(window).scroll(function() {
				var scrollPos = $(window).scrollTop();
				if(scrollPos > trgOffset) {
					tar.attr(toggleData, 'true');
				} else {
					tar.attr(toggleData, 'false');
				}
			});
		});
	} else {
		return;
	};
});