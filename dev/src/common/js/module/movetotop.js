// ==============================================================================================
// module/movetotop
// ==============================================================================================
// setup ========================================
$('body').append('<div data-movetotop></div>');
// function ========================================
$(window).scroll(function() {
	var pos = $(window).scrollTop();
	if(pos > durationTime1) {
		$('[data-movetotop]').fadeIn(durationTime3);
	} else {
		$('[data-movetotop]').fadeOut(durationTime3);
	}
});
$('[data-movetotop]').click(function() {
	$('body,html').animate({
		scrollTop: 0
	}, durationTime1);
});