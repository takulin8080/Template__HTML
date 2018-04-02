// ==============================================================================================
// component/hoverimg
// ==============================================================================================
class hoverimg {
	constructor(e) {
		this.element = document.querySelectorAll(e);
		this.func();
	}
	func() {
		this.element.forEach(e => {
			e.addEventListener('mouseover', this.mouseover);
			e.addEventListener('mouseout', this.mouseout);
		});
	}
	mouseover() {
		this.defImg = this.src;
		this.hoverImg = this.getAttribute('data-hoverimg');
		this.src = this.hoverImg;
	}
	mouseout() {
		this.src = this.defImg;
	}
}
/* ======================================== */
new hoverimg('[data-hoverimg]');