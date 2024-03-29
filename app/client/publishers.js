"use strict";

/* ### CLASSES ### */

class PubView {

	static setEditionMode = item => {	
		item.classList.add('--editing');
		item.querySelector('input').focus();
	};

	static unsetEditionMode = item => item.classList.remove('--editing');

	static removeItem = itemPath => document.querySelector('li[data-path="' + itemPath + '"]').remove();

}

class PubController {

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
						View.setItems(data.items, true);
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

	static createDirectory = dirToCreate => {
		if(dirToCreate !== null && dirToCreate !== '') {
			Model.ajaxPost(
				{
					script: './app/server/create-directory.php',
					args: [
						{
							name: 'parentDir',
							value: localStorage.getItem('currentDir')
						},
						{ 
							name: 'dirToCreate', 
							value: dirToCreate
						}
					]
				}
			)
			.then(data => View.setItems(data.items, true))
			.catch(err => Controller.handleError(err));
		}
	};

	static createLink = linkToCreate => {
		if(linkToCreate !== null && linkToCreate !== '') {
			Model.ajaxPost(
				{
					script: './app/server/create-link.php',
					args: [
						{
							name: 'parentDir',
							value: localStorage.getItem('currentDir')
						},
						{ 
							name: 'linkToCreate', 
							value: linkToCreate
						}
					]
				}
			)
			.then(data => View.setItems(data.items, true))
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

	static copyItem = (fromPath, toPath) => {
		Model.ajaxPost(
			{
				script: './app/server/copy-item.php',
				args: [
					{ 
						name: 'fromPath', 
						value: fromPath
					},
					{ 
						name: 'toPath', 
						value: toPath 
					},
				]
			}
		)
		.catch(err => Controller.handleError(err));
	};

	static moveItem = (fromPath, toPath) => {
		if(fromPath !== toPath.substring(0, toPath.lastIndexOf('/'))) {
			Model.ajaxPost(
				{
					script: './app/server/move-item.php',
					args: [
						{ 
							name: 'fromPath', 
							value: fromPath
						},
						{ 
							name: 'toPath', 
							value: toPath 
						},
					]
				}
			)
			.then(
				data => {
					if(data.success) {
						PubView.removeItem(fromPath);
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

ui.lNav.uploadBt = document.createElement('button');
ui.lNav.uploadBt.setAttribute('class', 'data-ft publisher-ft');
ui.lNav.uploadBt.setAttribute('title', 'Envoyer des fichiers');
ui.lNav.uploadBt.innerHTML = '<svg viewBox="3 3 18 18"><path d="M10.4971 12.9823L10 12.4853L12.4853 10L14.9706 12.4853L14.4735 12.9823L12.8368 11.3456V16H12.1338V11.3456L10.4971 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/></svg>';
ui.lNav.uploadBt.onclick = () => PubController.uploadItems();
ui.lNav.appendChild(ui.lNav.uploadBt);

ui.lNav.createDirBt = document.createElement('button');
ui.lNav.createDirBt.setAttribute('title', 'Créer un dossier');
ui.lNav.createDirBt.setAttribute('class', 'data-ft publisher-ft');
ui.lNav.createDirBt.innerHTML = '<svg viewBox="3 3 18 18"><path d="M12.75 16H11.25V13.75H9V12.25H11.25V10H12.75V12.25H15V13.75H12.75V16Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>';
ui.lNav.createDirBt.onclick = () => PubController.createDirectory(prompt('Nom du dossier à créer :'));
ui.lNav.appendChild(ui.lNav.createDirBt);

ui.lNav.createLinkBt = document.createElement('button');
ui.lNav.createLinkBt.setAttribute('title', 'Créer un lien hypertexte');
ui.lNav.createLinkBt.setAttribute('class', 'data-ft publisher-ft');
ui.lNav.createLinkBt.innerHTML = '<svg viewBox="-3 -3 24 24" ><path d="M3.19 9.345a.97.97 0 0 1 1.37 0 .966.966 0 0 1 0 1.367l-2.055 2.052a1.932 1.932 0 0 0 0 2.735 1.94 1.94 0 0 0 2.74 0l4.794-4.787a.966.966 0 0 0 0-1.367.966.966 0 0 1 0-1.368.97.97 0 0 1 1.37 0 2.898 2.898 0 0 1 0 4.103l-4.795 4.787a3.879 3.879 0 0 1-5.48 0 3.864 3.864 0 0 1 0-5.47L3.19 9.344zm11.62-.69a.97.97 0 0 1-1.37 0 .966.966 0 0 1 0-1.367l2.055-2.052a1.932 1.932 0 0 0 0-2.735 1.94 1.94 0 0 0-2.74 0L7.962 7.288a.966.966 0 0 0 0 1.367.966.966 0 0 1 0 1.368.97.97 0 0 1-1.37 0 2.898 2.898 0 0 1 0-4.103l4.795-4.787a3.879 3.879 0 0 1 5.48 0 3.864 3.864 0 0 1 0 5.47L14.81 8.656z"/></svg>';
ui.lNav.createLinkBt.onclick = () => PubController.createLink(prompt('Hyperlien à créer :'));
ui.lNav.appendChild(ui.lNav.createLinkBt);

/* ### ENDING PROCEDURAL ### */

document.body.classList.add('--is-publisher');