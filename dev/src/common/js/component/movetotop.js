// ==============================================================================================
// module/movetotop
// ==============================================================================================
// setup ========================================
$('body').append('<div data-movetotop></div>');
$('[data-movetotop]').hide();
// function ========================================
$(window).scroll(function() {
	var pos = $(window).scrollTop();
	if(pos > durationTime1) {
		$('[data-movetotop]').fadeIn(durationTime1);
	} else {
		$('[data-movetotop]').fadeOut(durationTime1);
	}
});
$('[data-movetotop]').click(function() {
	$('body,html').animate({
		scrollTop: 0
	}, durationTime1);
});