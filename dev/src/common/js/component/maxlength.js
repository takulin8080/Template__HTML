// ==============================================================================================
// component/maxlength
// ==============================================================================================
class maxlength {
	constructor(e) {
		this.element = document.querySelectorAll(e);
		this.func();
	}
	func() {
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
new maxlength('[data-maxlength]');