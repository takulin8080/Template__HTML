// ==============================================================================================
// module/float-menu
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var fmenu = $('.float-menu');
var header = $('.header');
var hdrOffset = header.offset().top;
var hdrHeight = header.height();
// -----------------------------------------------
// function
// -----------------------------------------------
$(window).on('load resize scroll', function() {
	var winWidth = $(window).width();
	if(winWidth > lg) {
		if($(window).scrollTop() > hdrOffset + hdrHeight) {
			fmenu.attr('data-modifier', 'true');
		} else {
			fmenu.attr('data-modifier', 'false');
		}
	} else {
		fmenu.attr('data-modifier', 'true');
	}
});
