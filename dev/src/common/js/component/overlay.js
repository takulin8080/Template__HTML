// ==============================================================================================
// component/overlay
// ==============================================================================================
document.body.setAttribute('data-overlay', 'false');
document.body.insertAdjacentHTML('beforeend', '<div data-overlay-layer></div>');
/* ======================================== */
module.exports = function(boolean) {
	document.body.setAttribute('data-overlay', boolean);
}