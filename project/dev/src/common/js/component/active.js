// ==============================================================================================
// component/active
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var trgName = 'data-active-trg';
var tarName = 'data-active-tar';
var parentName = 'data-parent';
var active = 'data-is-active';
// -----------------------------------------------
// function
// -----------------------------------------------
$('[' + trgName + ']').click(function() {
	var id = $(this).attr(trgName);
	if($(this).parents('[' + parentName + ']').length) {
		var parent = $(this).parents('[' + parentName + ']');
		parent.find('[' + trgName + ']').attr(active, 'false');
		parent.find('[' + tarName + ']').attr(active, 'false');
	}
	if(~$(this).attr(trgName).indexOf('add')) {
		$('[' + tarName + '~=' + id + ']').attr(active, 'true');
	} else if(~$(this).attr(trgName).indexOf('remove')) {
		$('[' + tarName + '~=' + id + ']').attr(active, 'false');
	} else {
		if($(this).attr(active) == 'true') {
			$(this).attr(active, 'false');
			$('[' + tarName + '~=' + id + ']').attr(active, 'false');
		} else {
			$(this).attr(active, 'true');
			$('[' + tarName + '~=' + id + ']').attr(active, 'true');
		}
	}
});
