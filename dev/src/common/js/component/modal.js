// ==============================================================================================
// component/modal
// ==============================================================================================
$ = require('jquery');
overlay = require('../component/overlay');
// data-modal ========================================
$(function() {
	var trg = 'data-modal-trg';
	var tar = 'data-modal-tar';
	var overlay = $('[data-overlay-layer]');
	var bodyModifier = 'data-modal';
	var toggleData = 'data-is-active';
	var id = $('[' + tar + ']').attr(tar);
	$('[' + tar + '] > div').attr('data-modal-contents', id);
	$('[' + tar + ']').append('<span data-modal-close></span>');
	var close = $('[data-modal-tar] [data-modal-close]');
	if($('[' + trg + ']').length == false) {
		return;
	} else {
		var timer = false;
		var w = $(window).width();
		var h = $(window).height();
		var wr;
		var hr;
		for(var i = 0; i < $('[' + trg + ']').length; i++) {
			if($('[' + trg + ']' [i]).attr(toggleData) == 'true') {
				modalName = $('[' + trg + ']' [i]).attr(trg);
				toggle(modalName, bodyModifier, 'true');
			}
		}
		$('[' + trg + ']').click(function() {
			modalName = $(this).attr(trg);
			if($('body').attr(bodyModifier) == 'true') {
				disabled();
			}
			toggle(modalName, bodyModifier, 'true');
		});
		$(window).resize(function() {
			timer = setTimeout(function() {
				wr = $(window).width();
				hr = $(window).height();
				if(w != wr || h != hr) {
					toggle(modalName, bodyModifier, 'false');
				}
			}, 200);
		});
		$('[data-overlay-layer]').click(function() {
			toggle(modalName, bodyModifier, 'false');
		});
		close.click(function() {
			toggle(modalName, bodyModifier, 'false');
		});
	};

	function toggle(name, bodyModifier, boolean) {
		$('[' + trg + '~=' + name + ']').attr(toggleData, boolean);
		$('[' + tar + '~=' + name + ']').attr(toggleData, boolean);
		$('body').attr(bodyModifier, boolean);
		$('body').attr('data-overlay', boolean);
	}

	function disabled() {
		$('[' + tar + ']').attr(toggleData, 'false');
		$('[' + trg + ']').attr(toggleData, 'false');
		$('body').attr(bodyModifier, 'false');
		$('body').attr('data-overlay', 'false');
	}
});
// function ========================================