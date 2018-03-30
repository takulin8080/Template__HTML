// ==============================================================================================
// component/modal
// ==============================================================================================
// require ========================================
$ = require('jquery');
var overlay = require('../component/overlay');
// variable ========================================
var trg = 'data-modal-trg';
var tar = 'data-modal-tar';
var active = 'data-is-active';
// setup ========================================
$('body').append('<div data-movetotop></div>');
if($('[' + tar + ']').length) {
	$('[data-modal-tar]').append('<div data-modal-close>ｆｄｓｆ</div>');
}
// function ========================================
$('[' + trg + ']').each(function() {
	if($(this).attr(active)) {
		var id = $(this).attr(trg);
		$('[' + trg + '~=' + id + ']').attr(active, 'true');
		$('[' + tar + '~=' + id + ']').attr(active, 'true');
		overlay(true);
		return false;
	}
});
/* ---------------------------------------- */
$('[' + trg + ']').click(function() {
	var id = $(this).attr(trg);
	if($(this).attr(active) == 'true') {
		$('[' + trg + '~=' + id + ']').attr(active, 'false');
		$('[' + tar + '~=' + id + ']').attr(active, 'false');
		overlay(false);
	} else {
		$(this).attr(active, 'true');
		$('[' + trg + '~=' + id + ']').attr(active, 'true');
		$('[' + tar + '~=' + id + ']').attr(active, 'true');
		overlay(true);
	}
});
/* ---------------------------------------- */
$(window).resize(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
/* ---------------------------------------- */
$('[data-modal-close]').click(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
/* ---------------------------------------- */
$('[data-overlay-layer]').click(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
/* ---------------------------------------- */
$.fn.modal = function() {
	var id = $(this).attr(trg);
	$('[' + trg + '~=' + id + ']').attr(active, 'true');
	$('[' + tar + '~=' + id + ']').attr(active, 'true');
	overlay(true);
};