// ==============================================================================================
// component/modal
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
// variable ========================================
var tarData = 'data-modal-tar';
var trgData = 'data-modal-trg';
var booleanData = 'data-is-active';
var closeData = 'data-modal-close';
var bodyModifier = 'data-modal-is-active';
// setup ========================================
$('body').attr(bodyModifier, false);
$('[' + tarData + ']').append('<div ' + closeData + '></div>');
// function ========================================
$(function() {
	if($('[' + tarData + ']').length) {
		$('[' + tarData + ']').each(function() {
			var id = $(this).attr(tarData);
			var tar = $('[' + tarData + '~=' + id + ']');
			var trg = $('[' + trgData + '~=' + id + ']');
			tar.children().first().attr('data-modal-contents', id);
			if(tar.attr(booleanData) == 'true') {
				toggle(id, bodyModifier, true)
			}
		});
	} else {
		return;
	};
});
/* active ---------------------------------------- */
$('[' + trgData + ']').click(function() {
	var id = $(this).attr(trgData);
	var tar = $('[' + tarData + '~=' + id + ']');
	var trg = $('[' + trgData + '~=' + id + ']');
	toggle(id, bodyModifier, true)
});
/* close ---------------------------------------- */
$('[' + closeData + ']').click(function() {
	disabled()
});
overlayLayer.click(function() {
	if($('body').attr(bodyModifier)) {
		disabled();
	}
});
/* plugin ---------------------------------------- */
$.fn.modal = function() {
	var id = $(this).attr(tarData);
	toggle(id, bodyModifier, true);
};
/* common ---------------------------------------- */
function toggle(id, bodyModifier, boolean) {
	$('[' + tarData + '~=' + id + ']').attr(booleanData, boolean);
	$('[' + trgData + '~=' + id + ']').attr(booleanData, boolean);
	$('body').attr(bodyModifier, boolean);
	overlay(boolean);
}

function disabled(boolean = false) {
	$('[' + tarData + ']').attr(booleanData, boolean);
	$('[' + trgData + ']').attr(booleanData, boolean);
	$('body').attr(bodyModifier, boolean);
	overlay(boolean);
}