// ==============================================================================================
// component/overlay
// ==============================================================================================
// setup ========================================
$('body').attr('data-overlay', 'false');
$('body').append('<div data-overlay-layer></div>');
overlayLayer = $('[data-overlay-layer]');
var scrollPosY;
// function ========================================
module.exports = function(boolean) {
	if(boolean) {
		scrollPosY = $(window).scrollTop();
		$('body').attr('data-overlay', boolean);
		$('body').css({
			'top': -1 * scrollPosY
		});
	} else {
		$('body').attr('data-overlay', boolean);
		$('body').css({
			'top': 0
		});
		$('html, body').prop({
			scrollTop: scrollPosY
		});
	}
	$('body').attr('data-overlay', boolean);
}