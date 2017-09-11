// ==============================================================================================
// component/modal
// ==============================================================================================
// -----------------------------------------------
// require
// -----------------------------------------------
var overlay = require('../component/overlay');
// -----------------------------------------------
// variable
// -----------------------------------------------
var trg = $('[data-modal-trg]');
var tar = $('[data-modal-tar]');
// -----------------------------------------------
// function
// -----------------------------------------------
trg.click(function() {
	var id = $(this).attr('data-modal-trg');
	if($(this).attr('data-is-active') == 'true') {
		$('[data-modal-trg~="' + id + '"]').attr('data-is-active', 'false');
		$('[data-modal-tar~="' + id + '"]').attr('data-is-active', 'false');
		overlay(false);
	} else {
		$(this).attr('data-is-active', 'true');
		$('[data-modal-trg~="' + id + '"]').attr('data-is-active', 'true');
		$('[data-modal-tar~="' + id + '"]').attr('data-is-active', 'true');
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
