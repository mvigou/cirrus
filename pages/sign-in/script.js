if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../../service-worker.js');
};

/* --- TOGGLING PASSWORD ON DEMAND --- */

const ui = {
	passBt: document.querySelector('label button'),
	passInput: document.querySelector('input[type="password"]') 
};
ui.passBt.onclick = e => {
	ui.passInput.setAttribute(
		'type', 
		ui.passInput.getAttribute('type') === 'password' ? 'text' : 'password'
	); 
	e.preventDefault();
};