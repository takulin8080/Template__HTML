// ==============================================================================================
// component/hoverimg
// ==============================================================================================
// require ========================================
$ = require('jquery');
// variable ========================================
var trgName = 'data-hoverimg';
var nowimg;
var hoverimg;
// function ========================================
$('[' + trgName + ']').hover(function() {
	nowimg = $(this).attr('src');
	hoverimg = $(this).attr(trgName);
	$(this).attr('src', hoverimg);
}, function() {
	$(this).attr('src', nowimg);
});