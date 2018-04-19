// ==============================================================================================
// component/drawer
// ==============================================================================================
// require ========================================
$ = require('jquery');
var overlay = require('../component/overlay');
// variable ========================================
var trg = 'data-drawer-trg';
var tar = 'data-drawer-tar';
var active = 'data-is-active';
// function ========================================
$('[' + trg + ']').click(function() {
	var id = $(this).attr(trg).replace(/left/g, '').replace(/right/g, '').replace(/top/g, '').replace(/bottom/g, '').replace(/\s+/g, '');
	if($(this).attr(active) == 'true') {
		$('[' + trg + '~=' + id + ']').attr(active, 'false');
		$('[' + tar + '~=' + id + ']').attr(active, 'false');
		overlay(false);
	} else {
		$(this).attr(active, 'true');
		$('[' + trg + '~=' + id + ']').attr(active, 'true');
		$('[' + tar + '~=' + id + ']').attr(active, 'true');
		overlay(true);
	}
});
$(window).resize(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
$('[data-overlay-layer]').click(function() {
	$('[' + trg + ']').attr(active, 'false');
	$('[' + tar + ']').attr(active, 'false');
	overlay(false);
});
// ver2
// class drawer {
// 	constructor(name_value) {
// 		this.elmName = name_value;
// 		this.elmToggle = 'data-is-active';
// 		this.elmTar = document.querySelectorAll('[' + this.elmName + ']');
// 		this.elmTrg = document.querySelectorAll('[' + this.elmName + '-trg]');
// 		if(!this.elmTar) return;
// 		this.event();
// 	}
// 	event() {
// 		this.elmTrg.forEach(e => {
// 			e.addEventListener('click', this.click(), false);
// 		});
// 	}
// 	click() {
// 		return((e) => {
// 			this.name = e.target.attributes[this.elmName + '-trg'].value;
// 			this.tar = document.querySelectorAll('[data-drawer="global-nav"]');
// 			this.trg = document.querySelectorAll('[data-drawer-trg="global-nav"]');
// 			if(e.target.getAttribute(this.elmToggle) == 'true') {
// 				this.passive();
// 			} else {
// 				this.active();
// 			}
// 		});
// 	}
// 	active() {
// 		document.body.setAttribute('data-' + this.name, 'true');
// 		this.tar.forEach(e => {
// 			e.setAttribute(this.elmToggle, 'true');
// 		});
// 		this.trg.forEach(e => {
// 			e.setAttribute(this.elmToggle, 'true');
// 		});
// 	}
// 	passive() {
// 		document.body.setAttribute('data-' + this.name, 'false');
// 		this.tar.forEach(e => {
// 			e.setAttribute(this.elmToggle, 'false');
// 		});
// 		this.trg.forEach(e => {
// 			e.setAttribute(this.elmToggle, 'false');
// 		});
// 	}
// }
// /* ======================================== */
// new drawer('data-drawer');