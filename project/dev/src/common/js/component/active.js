// ==============================================================================================
// component/active
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var trg = $('[data-active-trg]');
var tar = $('[data-active-tar]');
var parentName = '[data-parent]';
// -----------------------------------------------
// function
// -----------------------------------------------
trg.click(function() {
	var id = $(this).attr('data-active-trg');
	if($(this).parents(parentName).length == 1) {
		var parent = $(this).parents(parentName);
		parent.find('[data-active-trg]').attr('data-is-active', 'false');
		parent.find('[data-active-tar]').attr('data-is-active', 'false');
	}
	if($(this).attr('data-is-active') == 'true') {
		$(this).attr('data-is-active', 'false');
		$('[data-active-tar~="' + id + '"]').attr('data-is-active', 'false');
	} else {
		$(this).attr('data-is-active', 'true');
		$('[data-active-tar~="' + id + '"]').attr('data-is-active', 'true');
	}
});
