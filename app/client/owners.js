"use strict";

/* ### CLASSES ### */

class OwnView {

	static setPanPerms = (dirPath, content) => {

		/* pan nav */

		ui.panelNav.closeBt = document.createElement('button');
		ui.panelNav.closeBt.setAttribute('title', 'Fermer');
		ui.panelNav.closeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>';
		ui.panelNav.closeBt.onclick = () => View.unsetPan();
		ui.panelNav.appendChild(ui.panelNav.closeBt);

		/* pan form */

		ui.panelCont.form = document.createElement('form');
		ui.panelCont.form.onsubmit = (e) => {
			OwnController.updatePerms(ui.panel.getAttribute('data-item-path'));
			e.preventDefault();
		};

		/* pan form content */

		ui.panelCont.panTitle = document.createElement('h2');
		ui.panelCont.panTitle.textContent = 'Règles d\'accès au dossier';
		ui.panelCont.form.appendChild(ui.panelCont.panTitle);

		ui.panelCont.pubLab = document.createElement('label');
		ui.panelCont.pubRadio = document.createElement('input');
		ui.panelCont.pubRadio.setAttribute('class', 'perms-radio');
		ui.panelCont.pubRadio.setAttribute('name', 'isRestricted');
		ui.panelCont.pubRadio.setAttribute('type', 'radio');
		ui.panelCont.pubRadio.setAttribute('value', 'false');
		ui.panelCont.pubSpan = document.createElement('span');
		ui.panelCont.pubSpan.textContent = 'Dossier public : toute personne ayant accès à ce cirrus (via un lien d\'accès public / un compte visualiseur, éditeur ou propriétaire) peut accéder au dossier et à son contenu avec les droits qui sont les siens.';
		ui.panelCont.pubLab.appendChild(ui.panelCont.pubRadio);
		ui.panelCont.pubLab.appendChild(ui.panelCont.pubSpan);
		ui.panelCont.form.appendChild(ui.panelCont.pubLab);

		ui.panelCont.privLab = document.createElement('label');
		ui.panelCont.privRadio = document.createElement('input');
		ui.panelCont.privRadio.setAttribute('class', 'perms-radio');
		ui.panelCont.privRadio.setAttribute('name', 'isRestricted');
		ui.panelCont.privRadio.setAttribute('type', 'radio');
		ui.panelCont.privRadio.setAttribute('value', 'true');		
		ui.panelCont.privSpan = document.createElement('span');
		ui.panelCont.privSpan.textContent = 'Dossier privé : par défaut, seul un compte propriétaire (vous) peut accéder au dossier et à son contenu. Certains visualiseurs et éditeurs peuvent toutefois y êtes autorisés, à condition d\'inscrire leur nom d\'utilisateur dans la liste ci-dessous.';
		ui.panelCont.privLab.appendChild(ui.panelCont.privRadio);
		ui.panelCont.privLab.appendChild(ui.panelCont.privSpan);
		ui.panelCont.form.appendChild(ui.panelCont.privLab);

		ui.panelCont.textAreaLab = document.createElement('label');
		ui.panelCont.textAreaLab.textContent = 'Si dossier privé, membres autorisés à y accéder (un nom d\'utilisateur par ligne) :';
		ui.panelCont.textArea = document.createElement('textarea');
		ui.panelCont.textArea.setAttribute('name', 'accreditedMembers');
		ui.panelCont.textAreaLab.appendChild(ui.panelCont.textArea);
		ui.panelCont.form.appendChild(ui.panelCont.textAreaLab);

		ui.panelCont.confirmBt = document.createElement('button');
		ui.panelCont.confirmBt.setAttribute('title', 'Enregistrer les changements');
		ui.panelCont.confirmBt.setAttribute('type', 'submit');
		ui.panelCont.confirmBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg>';
		ui.panelCont.form.appendChild(ui.panelCont.confirmBt);

		ui.panelCont.item.appendChild(ui.panelCont.form);

		ui.panelCont.item.querySelector('.perms-radio[value=' + content.isRestricted + '').checked = true;
		const textAreaElm = ui.panelCont.item.querySelector('textarea');
		textAreaElm.value = '';
		if(content.accreditedMembers !== null) {
			for(let member of content.accreditedMembers) {
				textAreaElm.value += member + '\n';
			}
		}
		ui.panel.setAttribute('data-item-path', dirPath);
		ui.panel.classList.add('--visible');

	};

	static setUnregisteredCirrus() {
		ui.banner.classList.add('--visible');
		View.setPopup('purchase');
	}

}

class OwnController {

	static browsePerms = dirPath => {
		Model.ajaxPost(
			{ 
				script: './app/server/browse-permissions.php',
				args: [
					{
						name: 'dirPath',
						value: dirPath
					}
				]
			}
		)
		.then(data => {
			if(data.success) {	
				OwnView.setPanPerms(dirPath, data.content);
			}
		})
		.catch(err => Controller.handleError(err));
	};

	static updatePerms = dirPath => {
		Model.ajaxPost(
			{ 
				script: './app/server/manage-permissions.php',
				args: [
					{
						name: 'dirPath',
						value: dirPath
					},
					{
						name: 'isRestricted',
						value: document.getElementsByName('isRestricted')[0].checked ? false : true
					},
					{
						name: 'accreditedMembers',
						value: document.getElementsByName('accreditedMembers')[0].value.trim()
					}
				]
			}
		)
		.then(data => {
			if(data.success) {
				View.unsetPan();
			}
		})
		.catch(err => Controller.handleError(err));
	};

	static checkLicence() {
		Model.ajaxPost (
			{
				script: 'https://getcirrus.awebsome.fr/enregistrer/verification/',
				args: [{
						name: 'cirrusId',
						value: cirrusId
					}
				]
			}
		).then(data => {
			if(data.success) {
				if(!data.isRegistered) {
					OwnView.setUnregisteredCirrus();
				}
			}
		})
		.catch(err => Controller.handleError(err));
	}

}

/* ### BUILDING USER INTERFACE ### */

/* main nav */

ui.lNav.toRecycleBt = document.createElement('button');
ui.lNav.toRecycleBt.setAttribute('class', 'data-ft');
ui.lNav.toRecycleBt.setAttribute('title', 'Afficher la corbeille');
ui.lNav.toRecycleBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>';
ui.lNav.toRecycleBt.onclick = () => Controller.browseDirectory('../../datas/recyle');
ui.lNav.insertAdjacentElement('afterbegin', ui.lNav.toRecycleBt);

ui.lNav.toDataBt = document.createElement('button');
ui.lNav.toDataBt.setAttribute('class', 'recycle-ft');
ui.lNav.toDataBt.setAttribute('title', 'Afficher les données');
ui.lNav.toDataBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5c3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-13c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78zm0-2c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092z"/></svg>';
ui.lNav.toDataBt.onclick = () => Controller.browseDirectory('../../datas/content');
ui.lNav.appendChild(ui.lNav.toDataBt);

ui.lNav.emptyRecycleBt = document.createElement('button');
ui.lNav.emptyRecycleBt.setAttribute('class', 'recycle-ft');
ui.lNav.emptyRecycleBt.setAttribute('title', 'Vider la corbeille (maintenir pour enclencher)');
ui.lNav.emptyRecycleBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.5 15c-2.486 0-4.5 2.015-4.5 4.5s2.014 4.5 4.5 4.5c2.484 0 4.5-2.015 4.5-4.5s-2.016-4.5-4.5-4.5zm-.469 6.484l-1.688-1.637.695-.697.992.94 2.115-2.169.697.696-2.811 2.867zm-2.031-12.484v4.501c-.748.313-1.424.765-2 1.319v-5.82c0-.552.447-1 1-1s1 .448 1 1zm-4 0v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1zm1.82 15h-11.82v-18h2v16h8.502c.312.749.765 1.424 1.318 2zm-6.82-16c.553 0 1 .448 1 1v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1zm14-4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-1 2v7.182c-.482-.115-.983-.182-1.5-.182l-.5.025v-7.025h2z"/></svg>';
ui.lNav.emptyRecycleBt.onkeypress = () => {
	if(confirm('Vider la corbeille ?')){
		PubController.removeItem('RECYCLE', true);
	}	
};
ui.lNav.emptyRecycleBt.onmousedown = () => Controller.watchConfirm('start', 'recycle');
ui.lNav.emptyRecycleBt.onmouseup = () => {
	Controller.watchConfirm('end', 'recycle');
	PubController.removeItem('RECYCLE');
};
ui.lNav.emptyRecycleBt.onmouseleave = () => Controller.cancelConfirm();
ui.lNav.emptyRecycleBt.ontouchstart = e => Controller.watchConfirm('start', 'recycle', e);
ui.lNav.emptyRecycleBt.ontouchend = () => {
	Controller.watchConfirm('end', 'recycle');
	PubController.removeItem('RECYCLE');
};
ui.lNav.emptyRecycleBt.ontouchmove = () => Controller.cancelConfirm();
ui.lNav.appendChild(ui.lNav.emptyRecycleBt);

ui.rNav.toAdminBt = document.createElement('button');
ui.rNav.toAdminBt.setAttribute('title', 'Accéder aux outils d\'administration');
ui.rNav.toAdminBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></svg>';
ui.rNav.toAdminBt.onclick = () => window.location.href = './pages/admin';
document.getElementById('toggleDarkThemeBt').insertAdjacentElement('afterend',(ui.rNav.toAdminBt));

/* ban */

ui.banner = document.createElement('div');
ui.banner.setAttribute('class', 'banner');
ui.banner.textContent = 'cirrus non enregistré';

ui.banner.buyLink = document.createElement('a');
ui.banner.buyLink.setAttribute('href', 'https://getcirrus.awebsome.fr/enregistrer?cirrusId=' + cirrusId);
ui.banner.buyLink.setAttribute('target', '_blank');
ui.banner.buyLink.setAttribute('title', 'Enregistrer ce cirrus');
ui.banner.buyLink.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 23.73l-3-2.122v-14.2l3 1.359v14.963zm2-14.855v15.125l13-1.954v-15.046l-13 1.875zm5.963-7.875c-2.097 0-3.958 2.005-3.962 4.266l-.001 1.683c0 .305.273.54.575.494.244-.037.425-.247.425-.494v-1.681c.003-1.71 1.416-3.268 2.963-3.268.537 0 1.016.195 1.384.564.422.423.654 1.035.653 1.727v1.747c0 .305.273.54.575.494.243-.037.423-.246.423-.492l.002-1.749c.002-1.904-1.32-3.291-3.037-3.291zm-6.39 5.995c.245-.037.427-.247.427-.495v-2.232c.002-1.71 1.416-3.268 2.963-3.268l.162.015c.366-.283.765-.513 1.188-.683-.405-.207-.858-.332-1.35-.332-2.096 0-3.958 2.005-3.962 4.266v2.235c0 .306.272.538.572.494z"/></svg>';
ui.banner.appendChild(ui.banner.buyLink);

ui.main.insertAdjacentElement('afterbegin', ui.banner);

/* ### ENDING PROCEDURAL ### */

document.body.classList.add('--is-owner');
OwnController.checkLicence();