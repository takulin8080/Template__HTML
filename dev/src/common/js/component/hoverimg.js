// ==============================================================================================
// component/hoverimg
// ==============================================================================================
// variable ========================================
var tarData = 'data-hoverimg';
// function ========================================
$(function() {
	if($('[' + tarData + ']').length) {
		$('[' + tarData + ']').each(function() {
			var defImg = $(this).attr('src');
			var defHoverImg = $(this).attr(tarData);
			$(this).hover(function() {
				$(this).attr('src', defHoverImg);
			}, function() {
				$(this).attr('src', defImg);
			});
		});
	} else {
		return;
	};
});