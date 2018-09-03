// ==============================================================================================
// component/loading
// ==============================================================================================
// setup ========================================
$('body').attr('data-loading', 'false');
$('body').append('<div data-loading-layer><div data-loading-animation></div></div>');
// function ========================================
$(window).on('load', function() {
	$('body').attr('data-loading', true);
});