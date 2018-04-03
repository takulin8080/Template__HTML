// ==============================================================================================
// component/hoverimg
// ==============================================================================================
class Hoverimg {
	constructor(name) {
		this.name = name;
		this.elm = document.querySelectorAll('[' + this.name + ']');
		this.event();
	}
	event() {
		this.elm.forEach(e => {
			e.addEventListener('mouseover', this.mouseover(), false);
			e.addEventListener('mouseout', this.mouseout(), false);
		});
	}
	mouseover() {
		return((e) => {
			this.defimg = e.target.src;
			this.hoverimg = e.target.getAttribute(this.name);
			e.target.src = this.hoverimg;
		});
	}
	mouseout() {
		return((e) => {
			e.target.src = this.defimg;
		});
	}
}
/* ======================================== */
new Hoverimg('data-hoverimg');