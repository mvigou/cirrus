"use strict";

/* ### CLASSES ### */

class PubView {

	static setEditionMode = item => item.classList.add('--editing');

	static unsetEditionMode = item => item.classList.remove('--editing');

	static removeItem = itemPath => document.querySelector('li[data-path="' + itemPath + '"]').remove();

}

class PubController {

	static barInput = () => {
		if(ui.leftNav.barInput.value.indexOf('+') === 0) {
			ui.leftNav.barBt.classList.remove('--hidden');
		}
		else {
			ui.leftNav.barBt.classList.add('--hidden');
			const items = document.getElementsByTagName('li');
			for(const item of items) {
				item.classList.remove('--visible');	
				if(item.textContent.toLowerCase().indexOf(ui.leftNav.barInput.value.substr(1).toLowerCase()) >= 0) {
					item.classList.add('--visible');
				}
			}
			View.setCounters();
		}
	};

	static barSubmit = e => {
		if(ui.leftNav.barInput.value.indexOf('+') === 0) {
			if(ui.leftNav.barInput.value.length > 1) {
				PubController.createDirectory(ui.leftNav.barInput.value.substr(1));
				ui.leftNav.barBt.classList.add('--hidden');
				ui.leftNav.barInput.value = '';
			}
		}
		e.preventDefault();
	};

	static uploadItems = () => {
		let inputElm = document.createElement('input');
		inputElm.setAttribute('type', 'file');
		inputElm.setAttribute('multiple', 'true');
		inputElm.click();
		inputElm.onchange = (e) => {
			let i = 0;
			View.setPopup('uploading');
			send(inputElm.files[i]);
			function send(file) {
				let formData = new FormData();
				formData.append('parentDir', localStorage.getItem('currentDir'));
				formData.append('file', file);
				let req = new XMLHttpRequest();
				req.open('POST', './app/server/upload-item.php', true);		
				req.onload = () => {
					const data = JSON.parse(req.responseText);
					if(data.success) {
						View.setItems(data.content.items, data.content.dir, true);
						i++;
						if(inputElm.files.length > i) {
							send(inputElm.files[i]);
						}
						else {
							setTimeout(
								View.unsetPopup(),
								1000
							);	
						}
					}
					else {
						View.unsetPopup();
					}
				};
				req.send(formData);
			}
		};
	};

	static createDirectory = dirs => {
		if(dirs !== '' ) {
			Model.ajaxPost(
				{
					script: './app/server/create-directory.php',
					args: [
						{
							name: 'parentDir',
							value: localStorage.getItem('currentDir')
						},
						{ 
							name: 'dirs', 
							value: dirs 
						}
					]
				}
			)
			.then(data => {
				if(data.success) {
					View.setItems(data.content.items, data.content.dir, true);
				}
			})
			.catch(err => Controller.handleError(err));
		}
	};

	static renameItem = (item, oldItemName, newItemName) => {
		if(oldItemName !== newItemName && newItemName.length >= 1) {
			Model.ajaxPost(
				{
					script: './app/server/rename-item.php',
					args: [
						{ 
							name: 'oldItemName', 
							value: oldItemName
						},
						{ 
							name: 'newItemName', 
							value: newItemName 
						},
						{
							name: 'parentDir',
							value: localStorage.getItem('currentDir')
						}
					]
				}
			)
			.then(data => {
				if(data.success) {
					Controller.browseDirectory(localStorage.getItem('currentDir'));
				}
			})
			.catch(err => Controller.handleError(err));
		}
		else {
			PubView.unsetEditionMode(item);
		}
	};

	static copyItem = (oldItemPath, newItemPath) => {
		Model.ajaxPost(
			{
				script: './app/server/copy-item.php',
				args: [
					{ 
						name: 'oldItemPath', 
						value: oldItemPath
					},
					{ 
						name: 'newItemPath', 
						value: newItemPath 
					},
				]
			}
		)
		.catch(err => Controller.handleError(err));
	};

	static moveItem = (oldItemPath, newItemPath) => {
		if(oldItemPath !== newItemPath.substring(0, newItemPath.lastIndexOf('/'))) {
			Model.ajaxPost(
				{
					script: './app/server/move-item.php',
					args: [
						{ 
							name: 'oldItemPath', 
							value: oldItemPath
						},
						{ 
							name: 'newItemPath', 
							value: newItemPath 
						},
					]
				}
			)
			.then(
				data => {
					if(data.success) {
						PubView.removeItem(oldItemPath);
						View.setCounters();
					}
				}
			)
			.catch(err => Controller.handleError(err));
		}
	};

	static removeItem = (item, force) => {
		if(Controller.validConfirm() || force === true) {
			Model.ajaxPost(
				{
					script: './app/server/remove-item.php',
					args: [
						{ 
							name: 'item', 
							value: item 
						}
					]
				}
			)
			.then(data => {
				if(data.success) {
					if(item === 'RECYCLE') {
						// Prevent browsing error if the recycle is emptied with user inside a removed directory.
						localStorage.setItem('currentDir', '../../datas/recyle');
						Controller.browseDirectory(localStorage.getItem('currentDir'));
					}
					else {
						PubView.removeItem(item);
						View.setCounters();
					}
				}
			})
			.catch(err => Controller.handleError(err));
		}
	};

}

/* ### BUILDING USER INTERFACE ### */

/* main nav */

ui.leftNav.uploadBt = document.createElement('button');
ui.leftNav.uploadBt.setAttribute('class', 'datas-ft');
ui.leftNav.uploadBt.setAttribute('title', 'Envoyer des fichiers');
ui.leftNav.uploadBt.innerHTML = '<svg viewBox="3 3 18 18"><path d="M10.4971 12.9823L10 12.4853L12.4853 10L14.9706 12.4853L14.4735 12.9823L12.8368 11.3456V16H12.1338V11.3456L10.4971 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/></svg>';
ui.leftNav.uploadBt.onclick = () => PubController.uploadItems();
ui.leftNav.appendChild(ui.leftNav.uploadBt);

ui.leftNav.bar = document.createElement('form');
ui.leftNav.bar.setAttribute('class', 'bar datas-ft');
ui.leftNav.bar.onsubmit = e => PubController.barSubmit(e);

ui.leftNav.barLabel = document.createElement('label');
ui.leftNav.barLabel.setAttribute('for', 'bar__input');
ui.leftNav.barLabel.textContent = 'Rechercher ou créer un dossier en commençant par +';
ui.leftNav.bar.appendChild(ui.leftNav.barLabel);

ui.leftNav.barInput = document.createElement('input');
ui.leftNav.barInput.setAttribute('for', 'bar__input');
ui.leftNav.barInput.setAttribute('placeholder', 'chercher / créer dossier avec +');
ui.leftNav.barInput.textContent = 'Rechercher ou créer un dossier en commençant par +.';
ui.leftNav.barInput.oninput = () => PubController.barInput();
ui.leftNav.bar.appendChild(ui.leftNav.barInput);

ui.leftNav.barBt = document.createElement('button');
ui.leftNav.barBt.setAttribute('class', '--hidden');
ui.leftNav.barBt.setAttribute('title', 'Créer le dossier');
ui.leftNav.barBt.innerHTML = '<svg viewBox="3 3 18 18"><path d="M12.75 16H11.25V13.75H9V12.25H11.25V10H12.75V12.25H15V13.75H12.75V16Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>';
ui.leftNav.bar.appendChild(ui.leftNav.barBt);

ui.leftNav.appendChild(ui.leftNav.bar);

/* ### ENDING PROCEDURAL ### */

document.body.classList.add('--is-publisher');