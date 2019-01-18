// ==============================================================================================
// component/drawer
// ==============================================================================================
// require ========================================
overlay = require('../component/overlay');
// variable ========================================
var bodyModifier = 'data-drawer-is-active';
var overlayClose = true;
var resizeClose = true;
// setup ========================================
$('body').attr(bodyModifier, false);
/* function ======================================== */
module.exports = function(target, trigger) {
	var tar = $(target);
	var trg = $(trigger);
	var booleanData = 'data-is-active';
	if(trg) {
		var timer = false;
		var w = $(window).width();
		var h = $(window).height();
		var wr;
		var hr;
		trg.click(function() {
			if($(this).attr(booleanData) == 'true') {
				toggle(false);
			} else {
				toggle(true);
			}
		});
		if(overlayClose) {
			overlayLayer.click(function() {
				if($('body').attr(bodyModifier) == 'true') {
					toggle(false);
				}
			});
		}
		if(resizeClose) {
			$(window).resize(function() {;
				if($('body').attr(bodyModifier) == 'true' && $(window).width() > breakpointMd) {
					timer = setTimeout(function() {
						wr = $(window).width();
						hr = $(window).height();
						if(w != wr || h != hr) {
							toggle(false);
							winWidth = $(window).width();
						}
					}, 200);
				}
			});
		}
	} else {
		return;
	};

	function toggle(boolean) {
		tar.attr(booleanData, boolean);
		trg.attr(booleanData, boolean);
		$('body').attr(bodyModifier, boolean);
		overlay(boolean);
	}
}