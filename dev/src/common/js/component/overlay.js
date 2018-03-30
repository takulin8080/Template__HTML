// ==============================================================================================
// component/overlay
// ==============================================================================================
// require ========================================
$ = require('jquery');
// setup ========================================
$('body').append('<div data-movetotop></div>');
$('body').attr('data-overlay', 'false').append('<div data-overlay-layer></div>');
// function ========================================
module.exports = function(boolean) {
	$('body').attr('data-overlay', boolean);
}