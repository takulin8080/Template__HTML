// ==============================================================================================
// component/maxlength
// ==============================================================================================
$ = require('jquery');
// data-maxlength ========================================
$(function() {
	var tar = 'data-maxlength';
	var e = $('[' + tar + ']');
	e.each(function() {
		var maxlength = $(this).attr(tar);
		var textLength = $(this).text().length;
		var textTrim = $(this).text().substr(0, maxlength);
		$(this).html(textTrim);
		if(maxlength > textLength) {
			e.attr(tar, 'inrange');
		}
	});
});