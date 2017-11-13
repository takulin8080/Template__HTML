// ==============================================================================================
// module/float-menu
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var menu = $('.float-menu');
var header = $('.header');
var hdrOffset = header.offset().top;
var hdrHeight = header.height();
// -----------------------------------------------
// function
// -----------------------------------------------
var fmenuVisibleTimer;
$(window).scroll(function() {
	clearTimeout(fmenuVisibleTimer);
	if($(window).scrollTop() > hdrOffset + hdrHeight) {
		menu.attr('data-modifier', 'hide');
		fmenuVisibleTimer = setTimeout(function() {
			menu.attr('data-modifier', 'visible');
		}, 800);
	} else {
		menu.attr('data-modifier', 'visible');
	}
});
