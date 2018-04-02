// ==============================================================================================
// component/maxlength
// ==============================================================================================
class maxlength {
	constructor(e) {
		this.element = document.querySelectorAll(e);
		this.substr();
	}
	substr() {
		this.element.forEach(function(e) {
			const maxlength = e.getAttribute('data-maxlength');
			e.innerHTML = e.innerHTML.substr(0, maxlength);
			if(maxlength > e.innerHTML.length) {
				e.classList.add('maxlength-endtext-none')
			}
		});
	}
}
/* ======================================== */
const dataMaxLength = new maxlength('[data-maxlength]');