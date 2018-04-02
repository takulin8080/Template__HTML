// ==============================================================================================
// component/maxlength
// ==============================================================================================
// variable ========================================
const element = document.querySelectorAll('[data-maxlength]');
// function ========================================
element.forEach(function(e) {
	const maxlength = e.getAttribute('data-maxlength');
	e.innerHTML = e.innerHTML.substr(0, maxlength);
	if(maxlength > e.innerHTML.length) {
		e.classList.add('maxlength-endtext-none')
	}
});