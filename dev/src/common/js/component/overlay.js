// ==============================================================================================
// component/overlay
// ==============================================================================================
// setup ========================================
$('body').attr('data-overlay', 'false');
$('body').append('<div data-overlay-layer></div>');
overlayLayer = $('[data-overlay-layer]');
// function ========================================
module.exports = function(boolean) {
	$('body').attr('data-overlay', boolean);
}