// ==============================================================================================
// component/hoverimg
// ==============================================================================================
class hoverimg {
	constructor() {
		this.element = document.querySelectorAll('[data-hoverimg]');
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
new hoverimg();