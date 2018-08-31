// ==============================================================================================
// component/modal
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
// variable ========================================
var trg = 'data-modal-trg';
var tar = 'data-modal-tar';
var bodyModifier = 'data-modal';
var toggleData = 'data-is-active';
var close = $('[data-modal-close]');
// function ========================================
$(function() {
	if($('[' + tar + ']').length == false) {
		return;
	} else {
		for(var i = 0; i < $('[' + tar + ']').length; i++) {
			var elmTar = $('[' + tar + ']').eq(i);
			var id = elmTar.attr(tar);
			var elmTrg = $('[' + trg + '~=' + id + ']');
			$('[' + tar + '] > div').attr('data-modal-contents', id);
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
	toggle(id, bodyModifier, 'true');
};
/* ---------------------------------------- */
overlayLayer.click(function() {
	disabled()
});
/* ---------------------------------------- */
close.click(function() {
	disabled()
});
// common fucntion ========================================
function toggle(id, bodyModifier, boolean) {
	$('[' + trg + '~=' + id + ']').attr(toggleData, boolean);
	$('[' + tar + '~=' + id + ']').attr(toggleData, boolean);
	$('body').attr(bodyModifier, boolean);
	overlay(boolean);
}
/* ---------------------------------------- */
function disabled() {
	$('[' + tar + ']').attr(toggleData, 'false');
	$('[' + trg + ']').attr(toggleData, 'false');
	$('body').attr(bodyModifier, 'false');
	overlay('false');
}