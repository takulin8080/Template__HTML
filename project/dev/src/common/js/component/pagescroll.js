// ==============================================================================================
// component/pagescroll
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var offsetY = -10;
var time = 500;
// -----------------------------------------------
// function
// -----------------------------------------------
$('a[href^="#"]').click(function() {
	var target = $(this.hash);
	if(!target.length) return;
	var targetY = target.offset().top + offsetY;
	$('html,body').animate({
		scrollTop: targetY
	}, time, 'swing');
	window.history.pushState(null, null, this.hash);
	return false;
});
