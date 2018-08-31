// ==============================================================================================
// component/active
// ==============================================================================================
// variable ========================================
var tarData = 'data-active-tar';
var trgData = 'data-active-trg';
var parentData = 'data-active-parent';
var toggleData = 'data-is-active';
// function ========================================
$('[' + trgData + ']').click(function() {
	var id = $(this).attr(trgData).replace(/toggle/g, '').replace(/add/g, '').replace(/remove/g, '').replace(/\s+/g, '');
	var falseGroup = function(i) {
		if(i.closest('[' + parentData + ']').length) {
			var parent = i.closest('[' + parentData + ']');
			parent.find('[' + tarData + ']').attr(toggleData, 'false');
			parent.find('[' + trgData + ']').attr(toggleData, 'false');
		}
	}
	if(~$(this).attr(trgData).indexOf('add')) {
		falseGroup($(this));
		$('[' + tarData + '~=' + id + ']').attr(toggleData, 'true');
	} else if(~$(this).attr(trgData).indexOf('remove')) {
		falseGroup($(this));
		$('[' + tarData + '~=' + id + ']').attr(toggleData, 'false');
	} else {
		if($(this).attr(toggleData) == 'true') {
			$(this).attr(toggleData, 'false');
			$('[' + tarData + '~=' + id + ']').attr(toggleData, 'false');
		} else {
			falseGroup($(this));
			$(this).attr(toggleData, 'true');
			$('[' + tarData + '~=' + id + ']').attr(toggleData, 'true');
		}
	}
});