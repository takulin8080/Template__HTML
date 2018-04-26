// ==============================================================================================
// component/drawer
// ==============================================================================================
$ = require('jquery');
overlay = require('../component/overlay');
/* ======================================== */
module.exports = function(target, trigger, bodyModifier, toggleData) {
	if(!toggleData) {
		toggleData = 'data-is-active';
	}
	tar = $(target);
	trg = $(trigger);
	overlay = $('[data-overlay-layer]');
	bodyModifier = bodyModifier;
	if(!trg) {
		return;
	} else {
		trg.click(function() {
			if($(this).attr(toggleData) == 'true') {
				toggle('false');
			} else {
				toggle('true');
			}
		});
		$(window).resize(function() {
			toggle('false');
		});
		$('[data-overlay-layer]').click(function() {
			toggle('false');
		});
	};

	function toggle(boolean) {
		tar.attr(toggleData, boolean);
		trg.attr(toggleData, boolean);
		$('body').attr(bodyModifier, boolean);
		$('body').attr('data-overlay', boolean);
	}
}