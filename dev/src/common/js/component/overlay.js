// ==============================================================================================
// component/overlay
// ==============================================================================================
// setup ========================================
$('body').attr('data-overlay', 'false');
$('body').append('<div data-overlay-layer></div>');
overlayLayer = $('[data-overlay-layer]');
// function ========================================
module.exports = function(boolean) {
	scrollpos = $(window).scrollTop();
	if(boolean) {
		$('body').css({
			'top': -scrollpos
		});
		window.scrollTo(0, scrollpos);
	} else {
		$('body').css({
			'top': 0
		});
	}
	$('body').attr('data-overlay', boolean);
}