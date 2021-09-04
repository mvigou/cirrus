"use strict";

/* ### CLASSES ### */

class Model {

	static ajaxPost = query => {
		return new Promise(
			(resolve, reject) => {
				let formData = new FormData();
				if(query.args !== undefined) {
					for(const arg of query.args) {
						formData.append(arg.name, arg.value);
					}
				}
				fetch(query.script, {
					method: 'POST',
					body: formData
				})
				.then(data => {					
					if(data.ok) {
						data.text()
						.then(data => {
							try {
								resolve(JSON.parse(data));
							}
							catch(e) {
								reject(data);
							}	
						});
					}
					else {
						reject(data);
					}
				});
			}
		);
	};

}

class View {

	static setRecycleTheme = () => document.body.classList.add('--in-recycle');

	static unsetRecycleTheme = () => document.body.classList.remove('--in-recycle');

	static setDarkTheme = () => {
		document.body.classList.add('--dark-mode');
		localStorage.setItem('theme', 'dark');			
	};
	static unsetDarkTheme = () => {
		document.body.classList.remove('--dark-mode');
		localStorage.removeItem('theme');
	};

	static toggleDarkTheme = () => document.body.classList.contains('--dark-mode') ? 
		View.unsetDarkTheme(): 
		View.setDarkTheme();

	static setPopup = type => {
		switch(type) {
			case 'confirm':
				ui.popup.content.textContent = 'Relâchez sur l\'option pour valider, relâchez ailleurs pour annuler';
				break;
			case 'uploading':
				ui.popup.content.textContent = 'Téléchargement en cours, veuillez patienter';
				break;
			case 'purchase':
				ui.popup.content.innerHTML = `
				Vous appréciez cirrus ?<br/>Enregistrez-le.<br/><br/>
				<a href="https://getcirrus.awebsome.fr/enregistrer?cirrusId=${cirrusId}">Enregistrer ce cirrus</a><br/>
				<a href="https://getcirrus.awebsome.fr/documentation/pourquoi-faut-il-enregistrer-son-cirrus/">En savoir plus</a><br/>
				<a href="#" onclick="View.unsetPopup()">Plus tard</a>`;
				break;
		}
		ui.popup.classList.add('--visible');
	};

	static unsetPopup = () => ui.popup.classList.remove('--visible');
	
	static setPreviewPan = item => {

		ui.panelNav.openBt = document.createElement('button');
		ui.panelNav.openBt.setAttribute('title', 'Ouvrir dans un nouvel onglet');
		ui.panelNav.openBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>';
		ui.panelNav.openBt.onclick = () => View.openItemInNewTab(document.querySelector('.panel').getAttribute('data-item-path'));
		ui.panelNav.appendChild(ui.panelNav.openBt);

		ui.panelNav.downloadBt = document.createElement('button');
		ui.panelNav.downloadBt.setAttribute('title', 'Télécharger');
		ui.panelNav.downloadBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>';
		ui.panelNav.downloadBt.onclick = () => View.downloadItem(ui.panel.getAttribute('data-item-path'));
		ui.panelNav.appendChild(ui.panelNav.downloadBt);

		ui.panelNav.closeBt = document.createElement('button');
		ui.panelNav.closeBt.setAttribute('title', 'Fermer');
		ui.panelNav.closeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>';
		ui.panelNav.closeBt.onclick = () => View.unsetPan();
		ui.panelNav.appendChild(ui.panelNav.closeBt);

		if(item.itemType === 'img') {
			ui.panelCont.itemContent = document.createElement('img');
		}
		else if(item.itemType === 'pdf') {
			ui.panelCont.itemContent = document.createElement('iframe');
		}
		ui.panelCont.itemContent.src = item.itemTempPath;
		ui.panelCont.item.appendChild(ui.panelCont.itemContent);

		ui.panel.setAttribute('data-item-path', item.itemTempPath);
		ui.panel.classList.add('--visible');

	};

	static unsetPan = () => {
		ui.panelNav.innerHTML = '';
		ui.panelCont.item.innerHTML = '';
		ui.panel.classList.remove('--visible');
	};

	static setTree = dirPath => {
		ui.dirTree.innerHTML = '';
		const dirs = dirPath.slice(3).split('/').slice(2);
		let currentPath = '';
		for(const dir of dirs) {
			currentPath += '/' + dir;
			const separatorElm = document.createElement('span');
			separatorElm.textContent = ' / ';
			ui.dirTree.appendChild(separatorElm);
			const anchorElm = document.createElement('a');
			anchorElm.href = currentPath;
			anchorElm.textContent = dir;
			anchorElm.onclick = e => {
				Controller.browseDirectory('../../datas' + e.target.getAttribute('href'));
				e.preventDefault();
			};
			ui.dirTree.appendChild(anchorElm);
		}
	};

	static setCounters = () => {
		ui.counters.innerHTML = '<span><svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg> x ' + document.getElementsByClassName('subdir').length + '</span><span><svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg> x ' + document.getElementsByClassName('file').length + '</span>';
	};

	static setItems = (items = [], append = false) => {		
		if(append !== true) {
			ui.list.innerHTML = '';
		}
		for(const item of items) {
			ui.list.item = document.createElement('li');	
			ui.list.item.setAttribute('data-path', item.path);
			ui.list.item.setAttribute('data-label', item.label);
			ui.list.item.setAttribute('data-type', item.type);
			ui.list.item.setAttribute('class', item.type);
			// Move and copy item with drag & drop (mouse).
			if(item.type === 'file') {
				ui.list.item.ondragstart = e => {		
					e.dataTransfer.setData('label', item.label);
					e.dataTransfer.setData('path', item.path);
				};
			}
			else {
				if(item.type === 'parent') {
					ui.list.item.setAttribute('draggable', false);
				}
				if(item.type === 'subdir') {
					ui.list.item.ondragstart = e => {
						e.dataTransfer.setData('label', item.label);
						e.dataTransfer.setData('path', item.path);
					};
				}
				ui.list.item.ondragover = e => {
					e.target.closest('li').classList.add('--hovered');
					e.preventDefault();
				};
				ui.list.item.ondragleave = e => document.querySelector('li[data-path="' + item.path + '"]').classList.remove('--hovered');
				ui.list.item.ondrop = e => {
					const fromPath = e.dataTransfer.getData('path');
					const toPath = item.path + '/' + e.dataTransfer.getData('label');
					e.ctrlKey ?
						PubController.copyItem(fromPath, toPath):
						PubController.moveItem(fromPath, toPath);
					e.preventDefault();
				};
			}
			// Open item (replace the next sibling in normal mode).
			let aItemElm = document.createElement('a');
			aItemElm.classList.add('non-editable');
			aItemElm.setAttribute('href', '#');
			aItemElm.title = 'Ouvrir';
			aItemElm.onclick = () => item.type === 'file' ? Controller.openItem(item.path) : Controller.browseDirectory(item.path);
			let titleItemElm = document.createElement('p');
			if(item.type === 'file') {
				titleItemElm.innerHTML = `<svg viewBox="3 3 18 18"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.63636 3H15.1571L19.7273 7.57019V19.3636C19.7273 20.2674 18.9946 21 18.0909 21H6.63636C5.73262 21 5 20.2674 5 19.3636V4.63636C5 3.73262 5.73262 3 6.63636 3ZM13.1818 4.63636H6.63636V19.3636H18.0909V9.54545H14.8182C13.9144 9.54545 13.1818 8.81283 13.1818 7.90909V4.63636ZM14.8182 4.97527V7.90909H17.752L14.8182 4.97527Z" /></svg><span>${item.label}</span>`;
			}
			else if(item.type === 'subdir') {
				titleItemElm.innerHTML = `<svg viewBox="3 3 18 18"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42594 11.7922 6.33548 11.7305 6.25591C11.6867 6.19952 11.6472 6.14861 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273ZM19.3636 8.27273V18.0909H4.63636V6.63636H9.54545C9.85984 6.63636 10.0421 6.75792 10.3486 7.14458C10.3582 7.15674 10.3858 7.19234 10.4202 7.2367C10.486 7.32147 10.5766 7.43823 10.6139 7.48444C11.0253 7.99447 11.408 8.26957 11.9956 8.27272L19.3636 8.27273Z" /></svg><span>${item.label}</span>`;
			}
			else {
				titleItemElm.innerHTML = '<svg viewBox="3 3 18 18"><path d="M9.49706 12.9823L9 12.4853L11.4853 10L13.9706 12.4853L13.4735 12.9823L11.8368 11.3456V16H11.1338V11.3456L9.49706 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>..';
			}
			aItemElm.appendChild(titleItemElm);
			ui.list.item.appendChild(aItemElm);
			// Rename item (replace the previous sibling in edit mode).
			if(item.type !== 'parent') {
				let edItemInputElm = document.createElement('input');
				edItemInputElm.classList.add('editable');
				edItemInputElm.value = item.label;
				edItemInputElm.textContent = item.label;
				ui.list.item.appendChild(edItemInputElm);
				ui.list.item.submitBt = document.createElement('button');
				ui.list.item.submitBt.classList.add('editable');
				ui.list.item.submitBt.setAttribute('title', 'Enregistrer les changements');
				ui.list.item.submitBt.setAttribute('type', 'submit');
				ui.list.item.submitBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg>';
				ui.list.item.submitBt.onclick = e => {
					const itemElm = e.target.closest('li');
					const oldItemName = itemElm.getAttribute('data-label');
					const newItemName = edItemInputElm.value;

					PubController.renameItem(itemElm, oldItemName, newItemName);
				} 
				ui.list.item.appendChild(ui.list.item.submitBt);
			}
			if(item.type === 'subdir') {	
				// Set perms item.
				let restItemBtElm = document.createElement('button');
				restItemBtElm.classList.add('owner-ft', 'data-ft', 'non-editable');
				restItemBtElm.title = 'Définir les règles d\'accès au dossier';
				restItemBtElm.innerHTML = '<svg viewBox="3 3 18 18"><path d="m21 19.5h-18v-15h5.25c1.2713 1.4565 1.7783 2.25 3 2.25h9.75zm-13.438-13.5h-3.0622v12h15v-9.75h-8.25c-1.7542 0-2.6528-1.041-3.6878-2.25zm7.4378 10.5h-6v-3.75h0.75v-0.75c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25v0.75h0.75zm-3.75-4.5v0.75h1.5v-0.75c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75z" stroke-width=".75"/></svg>';
				restItemBtElm.onclick = () => OwnController.browsePerms(item.path);
				ui.list.item.appendChild(restItemBtElm);
			}
			if(item.type === 'file' || item.type === 'subdir') {
				// Download item.
				let dlItemBtElm = document.createElement('button');
				dlItemBtElm.classList.add('non-editable');
				dlItemBtElm.title = 'Télécharger';
				dlItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>';
				dlItemBtElm.onclick = () => Controller.downloadItem(item.path);
				ui.list.item.appendChild(dlItemBtElm);
				// Rename item.
				let renameItemBt = document.createElement('button');
				renameItemBt.classList.add('publisher-ft', 'data-ft', 'non-editable');
				renameItemBt.setAttribute('title', 'Renommer');
				renameItemBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>';
				renameItemBt.onclick = e => PubView.setEditionMode(e.target.closest('li'));
				ui.list.item.appendChild(renameItemBt);
				// Remove item.
				let rmItemBtElm = document.createElement('button');
				rmItemBtElm.classList.add('publisher-ft', 'non-editable');
				rmItemBtElm.title = 'Supprimer (maintenir pour enclencher)';
				rmItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>';
				rmItemBtElm.onkeypress = () => { if(confirm('Supprimer cet élément ?')) { PubController.removeItem(item.path, true); }};
				rmItemBtElm.onmousedown = () => Controller.watchConfirm('start', item.path);
				rmItemBtElm.onmouseup = () => {
					Controller.watchConfirm('end', item.path);
					PubController.removeItem(item.path);
				};
				rmItemBtElm.onmouseleave = () => Controller.cancelConfirm();
				rmItemBtElm.ontouchstart = e => Controller.watchConfirm('start', item.path, e);
				rmItemBtElm.ontouchend = () => {
					Controller.watchConfirm('end', item.path);
					PubController.removeItem(item.path);
				};
				rmItemBtElm.ontouchmove = () => Controller.cancelConfirm();
				ui.list.item.appendChild(rmItemBtElm);
			}
			ui.list.appendChild(ui.list.item);
		}
		View.setCounters();
	};

	static openItemInNewTab = itemPath => window.open(itemPath);

	static downloadItem = itemPath => {
		let downloadLink = document.createElement('a');
		downloadLink.setAttribute('download', '');
		downloadLink.setAttribute('href', itemPath);
		downloadLink.click();
		downloadLink.remove();
	};

}

class Controller {

	static handleError = err => console.log(err);

	static browseDirectory = dir => {
		Model.ajaxPost(
			{
				script: './app/server/browse-directory.php',
				args: [
					{ 
						name: 'dir', 
						value: dir 
					}
				]
			}
		)
		.then(data => {
			if(dir === 'DATAS') {
				View.unsetRecycleTheme();
			}
			else if(dir === 'RECYCLE') {
				View.setRecycleTheme();
			}
			localStorage.setItem('currentDir', data.dir);
			View.setItems(data.items);
			View.setTree(data.dir);
		})
		.catch(err => Controller.handleError(err));
	};

	static openItem = itemPath => {
		Model.ajaxPost(
			{
				script: './app/server/open-file.php',
				args: [
					{ 
						name: 'itemPath', 
						value: itemPath 
					}
				]
			}
		)
		.then(
			data => {
				if(data.isOpenable) {
					View.setPreviewPan(data);
				}
				else {
					Controller.downloadItem(itemPath);
				}
			}
		)
		.catch(err => Controller.handleError(err));
	}

	static downloadItem = item => {
		Model.ajaxPost(
			{
				script: './app/server/download-item.php',
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
				View.downloadItem(data.content);
			}
		})
		.catch(err => Controller.handleError(err));
	};

	static searchItem = chunckToSearch => {
		if(chunckToSearch !== null && chunckToSearch !== '') {
			Model.ajaxPost(
				{
					script: './app/server/search-item.php',
					args: [
						{ 
							name: 'chunckToSearch', 
							value: chunckToSearch 
						}
					]
				}
			)
			.then(data => {
				View.setItems(data.items);
			})
			.catch(err => Controller.handleError(err));
		}
	};

	static action = {
			start: { name: '', time: 0 }, 
			end: { name: '', time: 0 } 
	};

	static watchConfirm = (step, item, event) => {
		Controller.action[step].name = item;
		Controller.action[step].time = performance.now();
		View.setPopup('confirm');
		if(event){
			event.preventDefault();
		}	
	}

	static validConfirm = () => {
		View.unsetPopup();
		return Controller.action.start.name === Controller.action.end.name && (Controller.action.end.time - Controller.action.start.time) >= 600 ?
			true : false;
	}
	
	static cancelConfirm = () => {
		Controller.action['start'].name = null;
		Controller.action['end'].name = null;
		View.unsetPopup();
	}

	static signOut = () => {
		Model.ajaxPost({ script: './app/server/sign-out.php' })
		.then(data => {
			if(data.success) {	
				window.location.reload();
			}
		})
		.catch(err => Controller.handleError(err));
	};

}

/* ### BUILDING USER INTERFACE ### */

const ui = {};
ui.main = document.createElement('main');

/* main nav */

ui.nav = document.createElement('nav');
ui.nav.setAttribute('class', 'nav');

ui.lNav = document.createElement('div');
ui.lNav.setAttribute('class', 'nav__left-ct');

ui.lNav.searchBt = document.createElement('button');
ui.lNav.searchBt.setAttribute('title', 'Rechercher un dossier ou un document');
ui.lNav.searchBt.setAttribute('class', 'data-ft');
ui.lNav.searchBt.innerHTML = '<svg viewBox="3 3 18 18"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0515 14.3208H15.8645L21 19.4666L19.4666 21L14.3208 15.8645V15.0515L14.0429 14.7633C12.8696 15.7719 11.3465 16.3791 9.68954 16.3791C5.99485 16.3791 3 13.3842 3 9.68954C3 5.99485 5.99485 3 9.68954 3C13.3842 3 16.3791 5.99485 16.3791 9.68954C16.3791 11.3465 15.7719 12.8696 14.7633 14.0429L15.0515 14.3208ZM5.05832 9.68954C5.05832 12.2521 7.12693 14.3208 9.68954 14.3208C12.2521 14.3208 14.3208 12.2521 14.3208 9.68954C14.3208 7.12693 12.2521 5.05832 9.68954 5.05832C7.12693 5.05832 5.05832 7.12693 5.05832 9.68954Z" /></svg>';
ui.lNav.searchBt.onclick = () => Controller.searchItem(prompt('Que recherchez-vous ?'));
ui.lNav.appendChild(ui.lNav.searchBt);

ui.nav.append(ui.lNav);

ui.rNav = document.createElement('div');
ui.rNav.setAttribute('class', 'nav__right-ct');

ui.rNav.toggleDarkThemeBt = document.createElement('button');
ui.rNav.toggleDarkThemeBt.setAttribute('id', 'toggleDarkThemeBt');
ui.rNav.toggleDarkThemeBt.setAttribute('title', 'Basculer entre thème clair / thème sombre');
ui.rNav.toggleDarkThemeBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>';
ui.rNav.toggleDarkThemeBt.onclick = () => View.toggleDarkTheme();
ui.rNav.appendChild(ui.rNav.toggleDarkThemeBt);

ui.rNav.logOutBt = document.createElement('button');
ui.rNav.logOutBt.setAttribute('title', 'Se déconnecter');
ui.rNav.logOutBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z"/></svg>';
ui.rNav.logOutBt.onclick = () => Controller.signOut();
ui.rNav.appendChild(ui.rNav.logOutBt);

ui.nav.append(ui.rNav);
ui.main.appendChild(ui.nav);

/* aside (directory infos) */

ui.infos = document.createElement('div');
ui.infos.setAttribute('class', 'infos');

ui.dirTree = document.createElement('div');
ui.infos.appendChild(ui.dirTree);

ui.counters = document.createElement('div');			
ui.infos.appendChild(ui.counters);

ui.main.appendChild(ui.infos);

/* pan (preview & perms) */

ui.panel = document.createElement('div');
ui.panel.setAttribute('class', 'panel');

ui.panelCont = document.createElement('div');

ui.panelNav = document.createElement('nav');
ui.panelCont.appendChild(ui.panelNav);

ui.panelCont.item = document.createElement('div');
ui.panelCont.appendChild(ui.panelCont.item);

ui.panel.appendChild(ui.panelCont);
ui.main.appendChild(ui.panel);

/* popup */

ui.popup = document.createElement('div');
ui.popup.setAttribute('class', 'popup');

ui.popup.logo = document.createElement('object');
ui.popup.logo.setAttribute('alt', 'Logo cirrus');
ui.popup.logo.setAttribute('data', './app/client/cirrus-logo.svg');
ui.popup.logo.setAttribute('type', 'image/svg+xml');
ui.popup.appendChild(ui.popup.logo);

ui.popup.content = document.createElement('p');
ui.popup.appendChild(ui.popup.content);

ui.main.appendChild(ui.popup);

/* user content */

ui.list = document.createElement('ul');
ui.list.setAttribute('class', 'content');
ui.main.appendChild(ui.list);

/* footer */

ui.footer = document.createElement('footer');

ui.footer.docLink = document.createElement('a');
ui.footer.docLink.setAttribute('href', 'https://getcirrus.awebsome.fr/');
ui.footer.docLink.setAttribute('target', '_blank');
ui.footer.docLink.textContent = 'documentation';
ui.footer.appendChild(ui.footer.docLink);

ui.footer.logo = document.createElement('img');
ui.footer.logo.setAttribute('src', './app/client/cirrus-logo.svg');
ui.footer.logo.setAttribute('alt', 'Logo cirrus');
ui.footer.appendChild(ui.footer.logo);

ui.footer.cirrusVersion = document.createElement('p');
ui.footer.cirrusVersion.textContent = 'version 1.1.4';
ui.footer.appendChild(ui.footer.cirrusVersion);

ui.main.appendChild(ui.footer);

document.body.insertAdjacentElement('afterbegin', ui.main);

/* ### ENDING PROCEDURAL ### */

document.onkeydown = e => {
	if(e.code === 'Escape') {
		View.unsetPan();
	}
};