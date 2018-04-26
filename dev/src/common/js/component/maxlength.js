// ==============================================================================================
// component/maxlength
// ==============================================================================================
$ = require('jquery');
module.exports = function(tar) {
	var e = $('[' + tar + ']');
	e.each(function() {
		var maxlength = e.attr(tar);
		var textLength = $(this).text().length;
		var textTrim = $(this).text().substr(0, maxlength);
		$(this).html(textTrim);
		if(maxlength > textLength) {
			e.attr(tar, 'inrange');
		}
	});
};