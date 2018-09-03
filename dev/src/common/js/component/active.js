// ==============================================================================================
// component/active
// ==============================================================================================
// variable ========================================
var tarData = 'data-active-tar';
var trgData = 'data-active-trg';
var parentData = 'data-active-parent';
var booleanData = 'data-is-active';
// function ========================================
$('[' + trgData + ']').click(function() {
	var id = $(this).attr(trgData).replace(/toggle/g, '').replace(/add/g, '').replace(/remove/g, '').replace(/\s+/g, '');
	if(~$(this).attr(trgData).indexOf('add')) {
		falseGroup($(this));
		$('[' + tarData + '~=' + id + ']').attr(booleanData, true);
	} else if(~$(this).attr(trgData).indexOf('remove')) {
		falseGroup($(this));
		$('[' + tarData + '~=' + id + ']').attr(booleanData, false);
	} else {
		if($(this).attr(booleanData) == 'true') {
			$(this).attr(booleanData, false);
			$('[' + tarData + '~=' + id + ']').attr(booleanData, false);
		} else {
			falseGroup($(this));
			$(this).attr(booleanData, true);
			$('[' + tarData + '~=' + id + ']').attr(booleanData, true);
		}
	}
});
/* common ---------------------------------------- */
function toggle(e) {
	if(e.closest('[' + parentData + ']').length) {
		var parent = e.closest('[' + parentData + ']');
		parent.find('[' + tarData + ']').attr(booleanData, false);
		parent.find('[' + trgData + ']').attr(booleanData, false);
	}
}

function falseGroup(e) {
	if(e.closest('[' + parentData + ']').length) {
		var parent = e.closest('[' + parentData + ']');
		parent.find('[' + tarData + ']').attr(booleanData, false);
		parent.find('[' + trgData + ']').attr(booleanData, false);
	}
}