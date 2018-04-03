// ==============================================================================================
// component/maxlength
// ==============================================================================================
class Maxlength {
	constructor(name) {
		this.name = name;
		this.elm = document.querySelectorAll('[' + this.name + ']');
		if(!this.elm) return;
		this.set();
	}
	set() {
		this.elm.forEach(e => {
			const maxlength = e.getAttribute(this.name);
			e.innerHTML = e.innerHTML.substr(0, maxlength);
			if(maxlength > e.innerHTML.length) {
				e.setAttribute(this.name, 'inrange');
			}
		});
	}
}
/* ======================================== */
new Maxlength('data-maxlength');