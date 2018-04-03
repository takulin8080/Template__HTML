// ==============================================================================================
// component/maxlength
// ==============================================================================================
class Maxlength {
	constructor() {
		this.element = document.querySelectorAll('[data-maxlength]');
		this.element.forEach(e => {
			const maxlength = e.getAttribute('data-maxlength');
			e.innerHTML = e.innerHTML.substr(0, maxlength);
			if(maxlength > e.innerHTML.length) {
				e.classList.add('maxlength-endtext-none')
			}
		});
	}
}
/* ======================================== */
new Maxlength();