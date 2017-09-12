// ==============================================================================================
// component/modal
// ==============================================================================================
// -----------------------------------------------
// require
// -----------------------------------------------
var overlay = require('../component/overlay');
// -----------------------------------------------
// variable
// -----------------------------------------------
var trg = 'data-modal-trg';
var tar = 'data-modal-tar';
var active = 'data-is-active';
// -----------------------------------------------
// function
// -----------------------------------------------
$('[' + trg + ']').click(function() {
	var id = $(this).attr(trg);
	if($(this).attr(active) == 'true') {
		$('[' + trg + '~=' + id + ']').attr(active, 'false');
		$('[' + tar + '~=' + id + ']').attr(active, 'false');
		overlay(false);
	} else {
		$(this).attr(active, 'true');
		$('[' + trg + '~=' + id + ']').attr(active, 'true');
		$('[' + tar + '~=' + id + ']').attr(active, 'true');
		overlay(true);
	}
});
$(window).resize(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
$('[data-overlay-layer]').click(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
