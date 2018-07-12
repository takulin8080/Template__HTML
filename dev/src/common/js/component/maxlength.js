// ==============================================================================================
// component/maxlength
// ==============================================================================================
// require ========================================
$ = require('jquery');
// variable ========================================
var tar = 'data-maxlength';
$(function() {
	if($('[' + tar + ']').length == false) {
		return;
	} else {
		$('[' + tar + ']').each(function() {
			var maxlength = $(this).attr(tar);
			var textLength = $(this).text().length;
			var textTrim = $(this).text().substr(0, maxlength);
			$(this).html(textTrim);
			if(maxlength > textLength) {
				e.attr(tar, 'inrange');
			}
			$(this).css('visibility', 'visible');
		});
	};
});