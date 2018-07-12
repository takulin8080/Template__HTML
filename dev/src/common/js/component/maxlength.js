// ==============================================================================================
// component/maxlength
// ==============================================================================================
// variable ========================================
var tar = 'data-maxlength';
var endtext = 'data-maxlength-endtext';
// function ========================================
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
/* ---------------------------------------- */
$.fn.maxlength = function(num, text) {
	$(this).attr(tar, num);
	var maxlength = $(this).attr(tar);
	var textLength = num;
	var textTrim = $(this).text().substr(0, maxlength);
	$(this).attr(endtext, text);
	$(this).html(textTrim);
	if(maxlength > textLength) {
		e.attr(tar, 'inrange');
	}
	$(this).css('visibility', 'visible');
};