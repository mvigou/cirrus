"use strict";

/* ### enhance UI ### */

	/* nav */

		ui.navLeftCont = document.querySelector('.nav__left-ct');
		ui.navLeftCont.appendChild(
			chess(
				{
					type: 'button',
					attr: {
						class: 'datas-ft non-editable',
						title: 'Envoyer des fichiers'
					},
					events: [
						{
							type: 'click',
							fn: () => uploadItems()
						}
					],
					html: '<svg viewBox="3 3 18 18"><path d="M10.4971 12.9823L10 12.4853L12.4853 10L14.9706 12.4853L14.4735 12.9823L12.8368 11.3456V16H12.1338V11.3456L10.4971 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/></svg>'
				}
			)
		);
		ui.navLeftCont.appendChild(
			chess(
				{
					type: 'button',
					attr: {
						class: 'datas-ft',
						title: 'Activer / désactiver le mode d\'édition des fichiers et des dossiers'
					},
					events: [
						{
							type: 'click',
							fn: () => toggleEdition()
						}
					],
					html: '<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>'
				}
			)
		);
		ui.navLeftCont.appendChild(
			chess(
				{
					type: 'div',
					attr: {
						class: 'bar datas-ft non-editable'
					},
					children: [
						{
							type: 'form',
							attr: {
								class: 'bar__form'
							},
							events: [
								{
									type: 'submit',
									fn: e => barSubmit(e)
								}
							],
							children: [
								{
									type: 'label',
									attr: {
										for: 'bar__input'
									},
									txt: 'Saisir pour rechercher, commencer par + pour créer un dossier.'
								},
								{
									type: 'input',
									attr: {
										id: 'bar__input',
										placeholder: 'chercher / créer dossier avec +',
										title: 'Rechercher ou créer un dossier en commençant par +'
									},
									events: [
										{
											type: 'input',
											fn: () => barInput()
										}
									]
								},
								{
									type: 'button',
									attr: {
										class: '--hidden',
										title: 'Créer le dossier'
									},
									html: '<svg viewBox="3 3 18 18"><path d="M12.75 16H11.25V13.75H9V12.25H11.25V10H12.75V12.25H15V13.75H12.75V16Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>'
								}
							]
						}
					]
				}
			)
		);

/* ### Client side functions ### */

	/* manage theme */

		function toggleEdition() {
			ui.body.classList.contains('--edit-mode') ?
				ui.body.classList.remove('--edit-mode'):
				ui.body.classList.add('--edit-mode');
		}

	/* manage bar */

		function barInput() {
			if(ui.barInput.value.indexOf('+') === 0) {
				ui.barButton.classList.remove('--hidden');
			}
			else {
				ui.barButton.classList.add('--hidden');
				const items = document.getElementsByTagName('li');
				for(const item of items) {
					item.classList.remove('--visible');	
					if(item.textContent.toLowerCase().indexOf(ui.barInput.value.substr(1).toLowerCase()) >= 0) {
						item.classList.add('--visible');
					}
				}
				setCounters();
			}
		}
		function barSubmit(e) {
			if(ui.barInput.value.indexOf('+') === 0) {
				if(ui.barInput.value.length > 1) {
					createDirectory(ui.barInput.value.substr(1));
					ui.barButton.classList.add('--hidden');
					ui.barInput.value = '';
				}
			}
			e.preventDefault();
		}

/* ### Server side functions ### */

	function uploadItems() {
		let inputElm = document.createElement('input');
		inputElm.setAttribute('type', 'file');
		inputElm.setAttribute('multiple', 'true');
		inputElm.click();
		inputElm.onchange = (e) => {
			let i = 0;
			togglePopup(true, '--download');
			send(inputElm.files[i]);
			function send(file) {
				let formData = new FormData();
				formData.append('parentDir', localStorage.getItem('currentDir'));
				formData.append('file', file);
				let req = new XMLHttpRequest();
				req.open('POST', './app/server/upload-item.php', true);		
				req.onload = () => {
					const resp = JSON.parse(req.responseText);
					if(resp.success) {
						setItems(resp.content.items, resp.content.dir, true);
						i++;
						if(inputElm.files.length > i) {
							send(inputElm.files[i]);
						}
						else {
							setTimeout(
								togglePopup(false, '--download'),
								1000
							);	
						}
					}
					else {
						console.log('Une erreur est survenue pendant le traitement de cette action.');
						togglePopup(false, '--download');
					}
				};
				req.send(formData);
			}
		};
	}
	function renameItem(oldName, newName, item) {
		if(newName.length >= 1) {
			if(oldName !== newName) {
				ajaxPost(
					{
						script: './app/server/rename-item.php',
						args: [
							{ 
								name: 'oldName', 
								value: oldName
							},
							{ 
								name: 'newName', 
								value: newName 
							},
							{
								name: 'parentDir',
								value: localStorage.getItem('currentDir')
							}
						]
					}
				)
				.then(
					resp => {
						if(resp.success) {
							browseDirectory(localStorage.getItem('currentDir'));
						}
					}
				)
				.catch((e) => console.log(e));
			}
		}
		else {
			item.value = oldName;
		}
	}
	function moveItem(fromPath, toPath) {
		if(fromPath !== toPath.substring(0, toPath.lastIndexOf('/'))) {
			ajaxPost(
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
				resp => {
					if(resp.success) {
						browseDirectory(localStorage.getItem('currentDir'));
					}
				}
			)
			.catch((e) => console.log(e));
		}
	}
	function copyItem(fromPath, toPath) {
		ajaxPost(
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
		.then(
			resp => {
				if(resp.success) {
					browseDirectory(localStorage.getItem('currentDir'));
				}
			}
		)
		.catch((e) => console.log(e));
	}
	function removeItem(item, force) {
		if(validConfirm() || force === true) {
			ajaxPost(
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
			.then(
				resp => {
					if(resp.success) {
						if(item === 'RECYCLE') {
							// Prevent browsing error if the recycle is emptied with user inside a removed directory.
							localStorage.setItem('currentDir', '../../datas/recyle');
							browseDirectory(localStorage.getItem('currentDir'));
						}
						else {
							document.querySelector('li[data-path="' + item + '"]').remove();
						}
					}
				}
			)
			.catch((e) => console.log(e));
		}
	}
	function createDirectory(dirs) {
		if(dirs !== '' ) {
			ajaxPost(
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
			.then(
				resp => {
					if(resp.success) {
						setItems(resp.content.items, resp.content.dir, true);
					}
				}
			)
			.catch((e) => console.log(e));	
		}
	}

/* ### Ending procedural ### */

	ui.body.classList.add('--publisher');
	ui.barButton = document.querySelector('.bar button');
	ui.barInput = document.querySelector('.bar input');