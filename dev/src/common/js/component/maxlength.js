// ==============================================================================================
// component/maxlength
// ==============================================================================================
// variable ========================================
var tarData = 'data-maxlength';
var endText = 'data-maxlength-endText';
// function ========================================
$(function() {
	if($('[' + tarData + ']').length) {
		$('[' + tarData + ']').each(function() {
			var maxlength = $(this).attr(tarData);
			var textLength = $(this).text().length;
			var textTrim = $(this).text().substr(0, maxlength);
			$(this).html(textTrim);
			if(maxlength > textLength) {
				e.attr(tarData, 'inrange');
			}
			$(this).css('visibility', 'visible');
		});
	} else {
		return;
	};
});
/* plugin ---------------------------------------- */
$.fn.maxlength = function(num, text) {
	$(this).attr(tarData, num);
	var maxlength = $(this).attr(tarData);
	var textLength = num;
	var textTrim = $(this).text().substr(0, maxlength);
	$(this).attr(endText, text);
	$(this).html(textTrim);
	if(maxlength > textLength) {
		e.attr(tarData, 'inrange');
	}
	$(this).css('visibility', 'visible');
};