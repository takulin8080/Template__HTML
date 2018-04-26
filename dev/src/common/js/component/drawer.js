// ==============================================================================================
// component/drawer
// ==============================================================================================
var overlay = require('../component/overlay');
/* ======================================== */
module.exports = class Drawer {
	constructor(target, trigger, bodyModifier, toggleData) {
		toggleData ? this.toggleData = toggleData : this.toggleData = 'data-is-active';
		this.tar = document.querySelector(target);
		this.trg = document.querySelectorAll(trigger);
		this.overlay = document.querySelector('[data-overlay-layer]');
		this.bodyModifier = bodyModifier;
		this.resizeTimer;
		this.interval = Math.floor(1000 / 60 * 10);
		if(!this.trg) return;
		this.event();
	}
	event() {
		this.trg.forEach(e => {
			e.addEventListener('click', this.activeCheck(), false);
		});
		this.overlay.addEventListener('click', this.passive(), false);
		window.addEventListener('resize', this.passive(), false);
	}
	activeCheck() {
		return((e) => {
			if(e.target.getAttribute(this.toggleData) == 'true') {
				this.toggle('false');
			} else {
				this.toggle('true');
			}
		});
	}
	toggle(boolean) {
		this.tar.setAttribute(this.toggleData, boolean);
		this.trg.forEach(e => {
			e.setAttribute(this.toggleData, boolean);
		});
		overlay(boolean);
	}
	passive() {
		return((e) => {
			this.toggle('false');
		});
	}
}