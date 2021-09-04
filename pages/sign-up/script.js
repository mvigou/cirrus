/* --- PREVALIDATING FORM --- */

const userInputs = {
	name: document.getElementById('user-name'),
	pass: document.getElementById('user-pass'),
	passConf: document.getElementById('user-pass-conf'),
};
const validation = {
	name: false,
	pass: false,
	passConf: false	
};
for(const input in userInputs) {
	userInputs[input].oninput = () => {
		validation.name = /^[a-zA-Z0-9]{8,16}$/.test(userInputs.name.value) ? true : false;
		validation.pass = /^[a-zA-Z0-9.?!\-_*+=/|\\()[\]#$@%]{8,24}$/.test(userInputs.pass.value) ? true : false;
		validation.passConf = userInputs.pass.value === userInputs.passConf.value ? true : false;
	}
}
document.querySelector('form').onsubmit = e => {
	if(validation.name === false || validation.pass === false || validation.passConf === false) {
		e.preventDefault();
	}
};

/* --- TOGGLING PASSWORD ON DEMAND --- */

const ui = {
	passBts: document.querySelectorAll('label button'),
	passInputs: document.querySelectorAll('input[type="password"]') 
};

for(let i = 0, l = 1; i <= l; i++) {
	ui.passBts[i].onclick = e => {
		ui.passInputs[i].setAttribute(
			'type', 
			ui.passInputs[i].getAttribute('type') === 'password' ? 'text' : 'password'
		); 
		e.preventDefault();
	};
}