// ==============================================================================================
// component/pagescroll
// ==============================================================================================
// variable ========================================
var offsetY = -10;
var time = 400;
// function ========================================
$('a[href^="#"]').click(function() {
	var target = $(this.hash);
	if(!target.length) return;
	var targetY = target.offset().top + offsetY;
	$('html,body').animate({
		scrollTop: targetY
	}, durationTime1, 'swing');
	window.history.pushState(null, null, this.hash);
	return false;
});