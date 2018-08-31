// ==============================================================================================
// component/drawer
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
/* function ======================================== */
module.exports = function(target, trigger, toggleData) {
	if(!toggleData) {
		toggleData = 'data-is-active';
	}
	var tar = $(target);
	var trg = $(trigger);
	var overlay = $('[data-overlay-layer]');
	if(!trg) {
		return;
	} else {
		var timer = false;
		var w = $(window).width();
		var h = $(window).height();
		var wr;
		var hr;
		trg.click(function() {
			if($(this).attr(toggleData) == 'true') {
				toggle('false');
			} else {
				toggle('true');
			}
		});
		$(window).resize(function() {
			timer = setTimeout(function() {
				wr = $(window).width();
				hr = $(window).height();
				if(w != wr || h != hr) {
					toggle('false');
					winWidth = $(window).width();
				}
			}, 200);
		});
		$('[data-overlay-layer]').click(function() {
			toggle('false');
		});
	};

	function toggle(boolean) {
		tar.attr(toggleData, boolean);
		trg.attr(toggleData, boolean);
		$('body').attr('data-overlay', boolean);
	}
}