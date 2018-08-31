// ==============================================================================================
// component/drawer
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
// setup ========================================
var bodyModifier = 'data-drawer-is-active';
$('body').attr(bodyModifier, 'false');
/* function ======================================== */
module.exports = function(target, trigger) {
	var tar = $(target);
	var trg = $(trigger);
	var toggleData = 'data-is-active';
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
			if($('body').attr(bodyModifier) == 'true') {
				timer = setTimeout(function() {
					wr = $(window).width();
					hr = $(window).height();
					if(w != wr || h != hr) {
						toggle('false');
						winWidth = $(window).width();
					}
				}, 200);
			}
		});
		overlayLayer.click(function() {
			if($('body').attr(bodyModifier) == 'true') {
				toggle('false');
			}
		});
	};

	function toggle(boolean) {
		tar.attr(toggleData, boolean);
		trg.attr(toggleData, boolean);
		$('body').attr(bodyModifier, boolean);
		overlay(boolean);
	}
}