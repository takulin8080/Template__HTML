// ==============================================================================================
// component/active
// ==============================================================================================
// variable ========================================
var trgName = 'data-active-trg';
var tarName = 'data-active-tar';
var parentName = 'data-parent';
var active = 'data-is-active';
// function ========================================
$('[' + trgName + ']').click(function() {
	var id = $(this).attr(trgName).replace(/toggle/g, '').replace(/add/g, '').replace(/remove/g, '').replace(/\s+/g, '');
	var falseGroup = function(i) {
		if(i.closest('[' + parentName + ']').length) {
			var parent = i.closest('[' + parentName + ']');
			parent.find('[' + trgName + ']').attr(active, 'false');
			parent.find('[' + tarName + ']').attr(active, 'false');
		}
	}
	if(~$(this).attr(trgName).indexOf('add')) {
		falseGroup($(this));
		$('[' + tarName + '~=' + id + ']').attr(active, 'true');
	} else if(~$(this).attr(trgName).indexOf('remove')) {
		falseGroup($(this));
		$('[' + tarName + '~=' + id + ']').attr(active, 'false');
	} else {
		if($(this).attr(active) == 'true') {
			$(this).attr(active, 'false');
			$('[' + tarName + '~=' + id + ']').attr(active, 'false');
		} else {
			falseGroup($(this));
			$(this).attr(active, 'true');
			$('[' + tarName + '~=' + id + ']').attr(active, 'true');
		}
	}
});