// ==============================================================================================
// component/toggle
// ==============================================================================================
// -----------------------------------------------
// variable
// -----------------------------------------------
var trg = $('[data-toggle-trg]');
var tar = $('[data-toggle-tar]');
var parentName = '[data-parent]';
// -----------------------------------------------
// function
// -----------------------------------------------
trg.click(function() {
	var id = $(this).attr('data-toggle-trg');
	if($(this).parents(parentName).length == 1) {
		var parent = $(this).parents(parentName);
		parent.find('[data-toggle-trg]').attr('data-is-active', 'false');
		parent.find('[data-toggle-tar]').attr('data-is-active', 'false');
	}
	if($(this).attr('data-is-active') == 'true') {
		$(this).attr('data-is-active', 'false');
		$('[data-toggle-tar~="' + id + '"]').attr('data-is-active', 'false');
	} else {
		$(this).attr('data-is-active', 'true');
		$('[data-toggle-tar~="' + id + '"]').attr('data-is-active', 'true');
	}
});
