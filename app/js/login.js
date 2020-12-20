customElements.define('log-form', class extends HTMLElement {

	constructor() {
		
		super();

		let shadow = this.attachShadow({mode: 'open'});
	
		// HTML.
		shadow.innerHTML = 
		`<form action="./app/php/login.php" method="POST"><slot name="log-error"></slot> <label> <span>Adresse de connexion</span> <input autofocus="true" name="log-email" placeholder="example@domain.fr" required="true" type="email" /> </label> <label> <span>Mot de passe</span> <input maxlength="24" minlength="8" name="log-password" placeholder="Entre 8 et 24 caractères" required="true" type="password" /> </label> <button disabled="true">Connexion</button></form>`;
		
		// CSS.
		shadow.innerHTML +=
		`<style>:host{all:initial;font-family:inherit;margin:auto}label{align-items:center;display:grid;grid-template-columns:200px minmax(150px,300px);margin-bottom:15px;width:205px;cursor:pointer}input{background-color:transparent;border:none;border-left:solid 5px;color:transparent;font-family:sans-serif;font-size:0.85em;overflow:hidden;padding:10px;transition:transform 0.25s ease;width:0}input:focus{background-color:#fff;border:none;border-bottom:solid 1px;color:initial;margin-bottom:-1px;text-align:center;transform:translateX(-200px);width:185px}input:invalid,input:invalid{border-color:#c55 !important;box-shadow:none}input:valid{border-color:#5c5;box-shadow:none}button{width:100%;border-radius: 3px; padding: 8px 12px; border: solid 1px #ccc;background-color:transparent;font-weight:bold;}button:enabled{cursor:pointer}button:disabled{opacity: .5}</style>`;

		// JS.
		let logValids=[false,false];let logUI={email:shadow.querySelector('label:first-of-type input'),password:shadow.querySelector('label:last-of-type input'),submit:shadow.querySelector('button')};function managelogValids(prop,boolean){logValids[prop]=boolean;logValids.indexOf(false)===-1?logUI.submit.disabled=false:logUI.submit.disabled=true;} logUI.email.oninput=()=>{/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/.test(logUI.email.value)?managelogValids(0,true):managelogValids(0,false);};logUI.password.oninput=()=>{logUI.password.value.length>=8&&logUI.password.value.length<=24?managelogValids(1,true):managelogValids(1,false);};
		
	}

});