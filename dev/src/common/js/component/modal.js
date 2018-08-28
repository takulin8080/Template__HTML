// ==============================================================================================
// component/modal
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
// variable ========================================
var trg = 'data-modal-trg';
var tar = 'data-modal-tar';
var overlay = $('[data-overlay-layer]');
var bodyModifier = 'data-modal';
var toggleData = 'data-is-active';
$('[' + tar + ']').append('<span data-modal-close></span>');
var close = $('[data-modal-tar] [data-modal-close]');
// function ========================================
$(function() {
	if($('[' + tar + ']').length == false) {
		return;
	} else {
		for(var i = 0; i < $('[' + tar + ']').length; i++) {
			var elmTar = $('[' + tar + ']').eq(i);
			var id = elmTar.attr(tar);
			var elmTrg = $('[' + trg + '~=' + id + ']')
			if(elmTar.attr(toggleData) == 'true') {
				toggle(id, bodyModifier, 'true');
			}
		}
	};
});
/* ---------------------------------------- */
$('[' + trg + ']').click(function() {
	if($('body').attr(bodyModifier) == 'true') {
		disabled();
	} else {
		var id = $(this).attr(trg);
		toggle(id, bodyModifier, 'true');
	}
});
$.fn.modal = function() {
	var id = $(this).attr(tar);
	$('[' + tar + '~=' + id + '] > div').attr('data-modal-contents', id);
	toggle(id, bodyModifier, 'true');
};
/* ---------------------------------------- */
overlay.click(function() {});
/* ---------------------------------------- */
close.click(function() {
	disabled()
});
/* ---------------------------------------- */
$(window).resize(function() {
	var timer = false;
	var w = $(window).width();
	var h = $(window).height();
	var wr;
	var hr;
	timer = setTimeout(function() {
		wr = $(window).width();
		hr = $(window).height();
		if(w != wr || h != hr) {
			disabled()
		}
	}, 200);
});
// common fucntion ========================================
function toggle(id, bodyModifier, boolean) {
	$('[' + trg + '~=' + id + ']').attr(toggleData, boolean);
	$('[' + tar + '~=' + id + ']').attr(toggleData, boolean);
	$('body').attr(bodyModifier, boolean);
	$('body').attr('data-overlay', boolean);
}
/* ---------------------------------------- */
function disabled() {
	$('[' + tar + ']').attr(toggleData, 'false');
	$('[' + trg + ']').attr(toggleData, 'false');
	$('body').attr(bodyModifier, 'false');
	$('body').attr('data-overlay', 'false');
}