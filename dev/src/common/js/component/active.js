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
	var id = $(this).attr(trgData).replace(/toggle/g, '').replace(/true/g, '').replace(/false/g, '').replace(/\s+/g, '');
	var tar = $('[' + tarData + '~=' + id + ']');
	var trg = $('[' + trgData + '~=' + id + ']');
	if(~$(this).attr(trgData).indexOf('true')) {
		toggle(tar, trg, true);
	} else if(~$(this).attr(trgData).indexOf('false')) {
		toggle(tar, trg, false);
	} else {
		if($(this).attr(booleanData) == 'true') {
			toggle(tar, trg, false);
		} else {
			toggle(tar, trg, true);
		}
	}
});
/* common ---------------------------------------- */
function toggle(tar, trg, boolean) {
	falseGroup(tar);
	tar.attr(booleanData, boolean);
	trg.attr(booleanData, boolean);
}

function falseGroup(e) {
	if(e.closest('[' + parentData + ']').length) {
		var parent = e.closest('[' + parentData + ']');
		parent.find('[' + tarData + ']').attr(booleanData, false);
		parent.find('[' + trgData + ']').attr(booleanData, false);
	}
}