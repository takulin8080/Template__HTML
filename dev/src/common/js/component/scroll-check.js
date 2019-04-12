// ==============================================================================================
// component/scroll-check
// ==============================================================================================
// variable ========================================
var bodyModifier = 'data-scroll-check';
var pos = 0;
var scroll;
// setup ========================================
$('body').attr(bodyModifier, false);
// function ========================================
$(function() {
	$(window).on('scroll', function() {
		scroll = $(this).scrollTop();
		if(scroll >= pos) {
			$('body').attr(bodyModifier, 'down');
		} else {
			$('body').attr(bodyModifier, 'up');
			console.log('up');
		}
		pos = scroll;
	});
});