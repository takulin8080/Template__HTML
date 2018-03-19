// ==============================================================================================
// module/global-nav
// ==============================================================================================
// require ========================================
var overlay = require('../component/overlay');
// variable ========================================
var trg = $('.global-nav-trg');
var tar = $('.global-nav');
var catTrg = $('.global-nav-cat__title');
var catTar = $('.global-nav-cat__items');
var header = $('.header');
var hdrOffset = header.offset().top;
var hdrHeight = header.height();
var winWidth = $(window).width();
var winWidthResized;
// function ========================================
trg.attr('data-is-active', 'false');
var gnavVisibleTimer;
$(window).scroll(function() {
	if(trg.attr('data-is-active') != 'true') {
		clearTimeout(gnavVisibleTimer);
		if($(window).scrollTop() > hdrOffset + hdrHeight) {
			trg.attr('data-modifier', 'hide');
			gnavVisibleTimer = setTimeout(function() {
				trg.attr('data-modifier', 'visible');
			}, 800);
		} else {
			trg.attr('data-modifier', 'visible');
		}
	}
});
trg.click(function() {
	catTrg.attr('data-is-active', 'false');
	catTar.attr('data-is-active', 'false');
	if($(this).attr('data-is-active') == 'true') {
		trg.attr('data-is-active', 'false');
		tar.attr('data-is-active', 'false');
		overlay(false);
	} else {
		trg.attr('data-is-active', 'true');
		tar.attr('data-is-active', 'true');
		overlay(true);
	}
});
$(window).resize(function() {
	winWidthResized = $(window).width();
	if(winWidth != winWidthResized) {
		trg.attr('data-is-active', 'false');
		tar.attr('data-is-active', 'false');
		catTrg.attr('data-is-active', 'false');
		catTar.attr('data-is-active', 'false');
		overlay(false);
		winWidth = $(window).width();
	}
});
$('[data-overlay-layer]').click(function() {
	catTrg.attr('data-is-active', 'false');
	catTar.attr('data-is-active', 'false');
	trg.attr('data-is-active', 'false');
	tar.attr('data-is-active', 'false');
	overlay(false);
});