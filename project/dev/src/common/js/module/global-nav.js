// ==============================================================================================
// module/global-nav
// ==============================================================================================
// -----------------------------------------------
// require
// -----------------------------------------------
var overlay = require('../component/overlay');
// -----------------------------------------------
// variable
// -----------------------------------------------
var trg = $('.global-nav__trg');
var tar = $('.global-nav');
// -----------------------------------------------
// function
// -----------------------------------------------
trg.click(function() {
	if($(this).attr('data-is-active') == 'true') {
		$(this).attr('data-is-active', 'false');
		tar.attr('data-is-active', 'false');
		overlay(false);
	} else {
		$(this).attr('data-is-active', 'true');
		tar.attr('data-is-active', 'true');
		overlay(true);
	}
});
$(window).resize(function() {
	trg.attr('data-is-active', 'false');
	tar.attr('data-is-active', 'false');
	overlay(false);
});
$('[data-overlay-layer]').click(function() {
	trg.attr('data-is-active', 'false');
	tar.attr('data-is-active', 'false');
	overlay(false);
});
