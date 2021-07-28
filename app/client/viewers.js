"use strict";

function chess(t){let e=document.createElement(t.type);if(t.txt?e.textContent=t.txt:t.html&&(e.innerHTML=t.html),t.attr)for(const n in t.attr)e.setAttribute(n,t.attr[n]);if(t.events)for(const n of t.events)e.addEventListener(n.type,n.fn);if(t.children)for(const n of t.children)e.appendChild(chess(n));return e}

/* ### enhance UI ### */

	const ui = {
		body: document.body
	};

	/* main */

		ui.main = chess({type:'main'}); 
		
	/* nav */
	
		ui.nav = chess(
			{
				type: 'nav',
				attr: {
					class: 'main-nav'
				},
				children: [
					{
						type: 'div',
						attr: {
							class: 'nav__left-ct'
						}
					},
					{
						type: 'div',
						attr: {
							class: 'nav__right-ct'
						},
						children: [
							{
								type: 'button',
								attr: {
									id: 'switchThemeBt',
									title: 'Basculer entre thème clair / thème sombre'
								},
								html: '<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>',
								events: [
									{
										type: 'click',
										fn: () => switchTheme()
									}
								]
							},
							{
								type: 'button',
								attr: {
									title: 'Se déconnecter'
								},
								html: '<svg viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z"/></svg>',
								events: [
									{
										type: 'click',
										fn: () => signOut()
									}
								]
							}
						]
					}
				]
			}
		);
		ui.main.appendChild(ui.nav);

	/* tree and counters */

		ui.aside = chess({type:'aside'});
		ui.tree = chess({type:'div', attr:{class:'tree'}});
		ui.counters = chess({type: 'div',attr:{class:'counters'}});			
		ui.dirCounter = chess({type:'span'});
		ui.filCounter = chess({type:'span'});
		ui.aside.appendChild(ui.tree);
		ui.counters.appendChild(ui.dirCounter);
		ui.counters.appendChild(ui.filCounter);
		ui.aside.appendChild(ui.counters);
		ui.main.appendChild(ui.aside);

	/* user content */

		ui.list = chess({type: 'ul'});
		ui.main.appendChild(ui.list);

	/* pan (preview & perms) */
	
		ui.pan = chess(
			{
				type: 'div',
				attr: {
					class: 'pan'
				},
			}
		);
		ui.panContainer = chess({type: 'div'});
		ui.panNav = chess({type:'nav'});
		ui.panItem = chess({type:'div'});
		ui.panContainer.appendChild(ui.panNav);
		ui.panContainer.appendChild(ui.panItem);
		ui.pan.appendChild(ui.panContainer)
		ui.main.appendChild(ui.pan);

	/* popup */

		ui.popup = chess(
			{
				type: 'div',
				attr: {
					class: 'popup'
				},
				children: [
					{
						type: 'object',
						attr: {
							alt: 'Logo cirrus',
							class: 'popup__object',
							data: './app/client/cirrus-logo.svg',
							type: 'image/svg+xml'
						}
					},
					{
						type: 'p',
						attr: {
							class: 'popup-confirm'
						},
						txt: 'Relâchez sur l\'option pour valider, relâchez ailleurs pour annuler'
					},
					{
						type: 'p',
						attr: {
							class: 'popup-download'
						},
						txt: 'Téléchargement en cours, veuillez patienter'
					}
				]
			}
		);
		ui.main.appendChild(ui.popup);

	/* footer */
	
		ui.main.appendChild(
			chess(
				{
					type: 'footer',
					children: [
						
						{
							type: 'a',
							attr: {
								href: 'https://getcirrus.awebsome.fr/',
								target: '_blank' 
							},
							txt: 'documentation'
						},
						{
							type: 'p',
							html: '<img src="./app/client/cirrus-logo.svg" alt="Logo cirrus" />1.1.0'
						}
					]			
				}
			)
		);

	/* main */

		ui.body.insertAdjacentElement('afterbegin', ui.main);

/* ### client side functions ### */

	/* manage theme */

		function toDarkTheme() {	
			ui.body.classList.add('--dark-mode');
			localStorage.setItem('theme', 'dark');
		}
		function toLightTheme() {
			ui.body.classList.remove('--dark-mode');
			localStorage.setItem('theme', 'light');
		};
		function switchTheme() {
			ui.body.classList.contains('--dark-mode') ?
				toLightTheme():
				toDarkTheme();
		}
		function togglePopup(visible, className) {
			if(visible) {
				ui.popup.setAttribute('class', 'popup ' + className);
			}
			else {
				ui.popup.setAttribute('class', 'popup');		
			}
		}

	/* manage preview */

		function setPanPrev(tempPath) {
			ui.panNav.appendChild(
				chess(
					{
						type: 'button',
						attr: {
							title: 'Ouvrir dans un nouvel onglet'
						},
						html: '<svg viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>',
						events: [
							{
								type: 'click',
								fn: () => openPreviewedItem()
							}
						]
					}
				)
			);
			ui.panNav.appendChild(
				chess(
					{
						type: 'button',
						attr: {
							title: 'Télécharger'
						},
						html: '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>',
						events: [
							{
								type: 'click',
								fn: () => downloadPreviewedItem()
							}
						]
					}
				)
			);
			ui.panNav.appendChild(
				chess(
					{
						type: 'button',
						attr: {
							title: 'Fermer'
						},
						html: '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>',
						events: [
							{
								type: 'click',
								fn: () => unsetPan()
							}
						]
					}
				)
			);
			ui.pan.setAttribute('data-item-path', tempPath);
			ui.pan.classList.add('--visible');
		}
		function unsetPan() {
			ui.panNav.innerHTML = '';
			ui.panItem.innerHTML = '';
			ui.pan.classList.remove('--visible');
		}
		function setPreviewImg(sourcePath, tempPath) {
			const imgElm = document.createElement('img');
			imgElm.src = tempPath;
			ui.panItem.appendChild(imgElm);
			setPanPrev(tempPath);
		}
		function setPreviewPdf(sourcePath, tempPath) {
			const iframeElm = document.createElement('iframe');
			iframeElm.src = tempPath;
			ui.panItem.appendChild(iframeElm);
			setPanPrev(tempPath);
		}
		document.onkeydown = e => {
			if(e.code === 'Escape') {
				unsetPan();
			}
		};

	/* manage popup */

		const action = {
			click: { 
				start: { name: '', time: 0 }, 
				end: { name: '', time: 0 } 
			},
		};
		function watchConfirm(step, item, event) {
			action.click[step].name = item;
			action.click[step].time = performance.now();
			togglePopup(true, '--confirm');
			if(event){
				event.preventDefault();
			}	
		}
		function validConfirm() {
			togglePopup(false, '--confirm');
			return action.click.start.name === action.click.end.name && (action.click.end.time - action.click.start.time) >= 600 ?
				true : false;
		}
		function cancelConfirm() {
			action.click['start'].name = null;
			action.click['end'].name = null;
			togglePopup(false, '--confirm');
		}

	/* manage structure */

		function setCounters() {
			ui.dirCounter.innerHTML = '<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg> x ' + document.getElementsByClassName('subdir --visible').length;
			ui.filCounter.innerHTML = '<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg> x ' + document.getElementsByClassName('file --visible').length;
		}
		function setTree(dir) {
			const navTreeElm = document.querySelector('.tree');
			navTreeElm.innerHTML = '';
			let tree = '';
			for(let subDirs of dir.slice(3).split('/').slice(2)) {
				tree += '/';
				tree += subDirs;
				let spanElm = document.createElement('span');
				spanElm.textContent = ' / ';
				navTreeElm.appendChild(spanElm);
				let aElm = document.createElement('a');
				aElm.href = tree;
				aElm.textContent = subDirs;
				aElm.onclick = e => {
					browseDirectory('../../datas' + e.target.getAttribute('href'));
					e.preventDefault();
				};
				navTreeElm.appendChild(aElm);
			}
		}
		function setItems(items = [], parentDir = '', append = false) {
			if(append !== true) {
				ui.list.innerHTML = '';
			}		
			for(const item of items) {
				let itemElm = document.createElement('li');	
				// Set item path.
				switch(item.type) {
					case 'file':
						item.path = parentDir + '/' + item.label;	
						break;
					case 'subdir':
						item.path = parentDir + '/' + item.label;
						break;
					case 'parent':
						item.path = parentDir.substr(0, parentDir.lastIndexOf('/'));
						break;
				}
				itemElm.setAttribute('class', item.type + ' --visible');
				itemElm.setAttribute('data-path', item.path);
				itemElm.setAttribute('data-label', item.label);
				itemElm.setAttribute('data-type', item.type);
				// Move and copy item with drag & drop (mouse).
				if(item.type === 'file') {
					itemElm.ondragstart = e => {		
						e.dataTransfer.setData('label', item.label);
						e.dataTransfer.setData('path', item.path);
					};
				}
				else {
					if(item.type === 'parent') {
						itemElm.setAttribute('draggable', false);
					}
					if(item.type === 'subdir') {
						itemElm.ondragstart = e => {
							e.dataTransfer.setData('label', item.label);
							e.dataTransfer.setData('path', item.path);
						};
					}
					itemElm.ondragover = e => {
						itemElm.classList.add('--hovered');
						e.preventDefault();
					};
					itemElm.ondragleave = e => itemElm.classList.remove('--hovered');
					itemElm.ondrop = e => {
						const fromPath = e.dataTransfer.getData('path');
						const toPath = item.path + '/' + e.dataTransfer.getData('label');
						e.ctrlKey ?
							copyItem(fromPath, toPath):
							moveItem(fromPath, toPath);
						e.preventDefault();
					};
				}
				// Move item with drag & drop (touch).
				let draggedItem = {
					elm: null,
					label: '',
					moved: false,
					path: '',
				};
				let targetedItem = {
					coordX: 0,
					coordY: 0,
					elm: null,
					path: '',
					type: ''
				}
				itemElm.ontouchstart = e => {
					draggedItem.elm = document.elementFromPoint(
						e.touches[0].clientX,
						e.touches[0].clientY
					);
					if(draggedItem.elm.closest('li') !== null) {
						draggedItem.elm = draggedItem.elm.closest('li');
					}
					draggedItem.label = draggedItem.elm.getAttribute('data-label');
					draggedItem.path = draggedItem.elm.getAttribute('data-path');
				}
				itemElm.ontouchmove = e => {
					draggedItem.moved = true;			
					targetedItem.coordX = e.touches[0].clientX;
					targetedItem.coordY = e.touches[0].clientY;
				}
				itemElm.ontouchend = e => {
					if(draggedItem.moved) {
						targetedItem.elm = document.elementFromPoint(
							targetedItem.coordX,
							targetedItem.coordY
						);
						if(targetedItem.elm.closest('li') !== null) {
							targetedItem.elm = targetedItem.elm.closest('li');
						}
						targetedItem.path = targetedItem.elm.getAttribute('data-path');
						targetedItem.type = targetedItem.elm.getAttribute('data-type');
						if(draggedItem.path !== targetedItem.path) {
							if(targetedItem.type !== 'file') {
								moveItem(
									draggedItem.path, 
									targetedItem.path + '/' + draggedItem.label 
								);
							}
						}
						draggedItem.moved = false;
					}
				}
				// Open item (replace the next sibling in normal mode).
				let aItemElm = document.createElement('a');
				aItemElm.classList.add('non-editable');
				aItemElm.setAttribute('href', '#');
				aItemElm.title = 'Ouvrir';
				aItemElm.onclick = () => item.type === 'file' ? openFile(item.path) : browseDirectory(item.path);
				let titleItemElm = document.createElement('p');
				if(item.type === 'file') {
					titleItemElm.innerHTML = `<svg viewBox="3 3 18 18"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.63636 3H15.1571L19.7273 7.57019V19.3636C19.7273 20.2674 18.9946 21 18.0909 21H6.63636C5.73262 21 5 20.2674 5 19.3636V4.63636C5 3.73262 5.73262 3 6.63636 3ZM13.1818 4.63636H6.63636V19.3636H18.0909V9.54545H14.8182C13.9144 9.54545 13.1818 8.81283 13.1818 7.90909V4.63636ZM14.8182 4.97527V7.90909H17.752L14.8182 4.97527Z" /></svg>${item.label}`;
				}
				else if(item.type === 'subdir') {
					titleItemElm.innerHTML = `<svg viewBox="3 3 18 18"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42594 11.7922 6.33548 11.7305 6.25591C11.6867 6.19952 11.6472 6.14861 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273ZM19.3636 8.27273V18.0909H4.63636V6.63636H9.54545C9.85984 6.63636 10.0421 6.75792 10.3486 7.14458C10.3582 7.15674 10.3858 7.19234 10.4202 7.2367C10.486 7.32147 10.5766 7.43823 10.6139 7.48444C11.0253 7.99447 11.408 8.26957 11.9956 8.27272L19.3636 8.27273Z" /></svg>${item.label}`;
				}
				else {
					titleItemElm.innerHTML = '<svg viewBox="3 3 18 18"><path d="M9.49706 12.9823L9 12.4853L11.4853 10L13.9706 12.4853L13.4735 12.9823L11.8368 11.3456V16H11.1338V11.3456L9.49706 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>..';
				}
				aItemElm.appendChild(titleItemElm);
				itemElm.appendChild(aItemElm);
				// Rename item (replace the precedent sibling in edit mode).
				if(item.type !== 'parent') {
					let edItemInputElm = document.createElement('input');
					edItemInputElm.classList.add('editable');
					edItemInputElm.value = item.label;
					edItemInputElm.textContent = item.label;
					edItemInputElm.onkeydown = e => {
						if(e.code === 'Enter') {
							e.target.blur();
						}
					};
					edItemInputElm.onblur = e => renameItem(item.label, e.target.value, e.target);
					itemElm.appendChild(edItemInputElm);
				}
				if(item.type === 'subdir') {	
					// Restrict item.
					let restItemBtElm = document.createElement('button');
					restItemBtElm.classList.add('owner-ft', 'non-editable');
					restItemBtElm.title = 'Définir les règles d\'accès au dossier';
					restItemBtElm.innerHTML = '<svg viewBox="3 3 18 18"><path d="m21 19.5h-18v-15h5.25c1.2713 1.4565 1.7783 2.25 3 2.25h9.75zm-13.438-13.5h-3.0622v12h15v-9.75h-8.25c-1.7542 0-2.6528-1.041-3.6878-2.25zm7.4378 10.5h-6v-3.75h0.75v-0.75c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25v0.75h0.75zm-3.75-4.5v0.75h1.5v-0.75c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75z" stroke-width=".75"/></svg>';
					restItemBtElm.onclick = () => browsePerms(item.path);
					itemElm.appendChild(restItemBtElm);
				}
				if(item.type === 'file' || item.type === 'subdir') {
					// Download item.
					let dlItemBtElm = document.createElement('button');
					dlItemBtElm.classList.add('non-editable');
					dlItemBtElm.title = 'Télécharger';
					dlItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>';
					dlItemBtElm.onclick = () => downloadUnpreviewedItem(item.path);
					itemElm.appendChild(dlItemBtElm);
					// Remove item.
					let rmItemBtElm = document.createElement('button');
					rmItemBtElm.classList.add('publisher-ft', 'non-editable');
					rmItemBtElm.title = 'Supprimer (maintenir pour enclencher)';
					rmItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>';
					rmItemBtElm.onkeypress = () => { if(confirm('Supprimer cet élément ?')) { removeItem(item.path, true); }};
					rmItemBtElm.onmousedown = () => watchConfirm('start', item.path);
					rmItemBtElm.onmouseup = () => {
						watchConfirm('end', item.path);
						removeItem(item.path);
					};
					rmItemBtElm.onmouseleave = () => cancelConfirm();
					rmItemBtElm.ontouchstart = e => watchConfirm('start', item.path, e);
					rmItemBtElm.ontouchend = () => {
						watchConfirm('end', item.path);
						removeItem(item.path);
					};
					rmItemBtElm.ontouchmove = () => cancelConfirm();
					itemElm.appendChild(rmItemBtElm);
				}
				ui.list.appendChild(itemElm);
			}
			setCounters();
		}

/* ### server side functions ### */

	function ajaxPost(req) {
		return new Promise(
			(resolve, reject) => {
				let formData = new FormData();
				if(req.args !== undefined) {
					for(const arg of req.args) {
						formData.append(arg.name, arg.value);
					}
				}
				fetch(
					req.script, {
						method: 'POST',
						body: formData
					}
				).
				then(
					resp => {					
						if(resp.ok) {
							resp.text().then(
								resp => {
									try {
										const parsedResp = JSON.parse(resp);
										resolve(parsedResp);
									}
									catch(e) {
										reject(resp);
									}	
								}
							);
						}
						else {
							reject(resp);
						}
					}
				);
			}
		);
	}
	function browseDirectory(dir) {
		ajaxPost(
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
		.then(
			resp => {
				if(resp.success) {
					localStorage.setItem('currentDir', resp.content.dir);
					setItems(resp.content.items, resp.content.dir);
					setTree(resp.content.dir);
					// ui.barInput.value = '';
				}
			}
		)
		.catch(
			() => {
				console.log('Une erreur est survenue pendant le traitement de cette action.');
				// browseDirectory('DATAS');
			}
		);
	}
	function openFile(filePath) {
		ajaxPost(
			{
				script: './app/server/open-file.php',
				args: [
					{ 
						name: 'filePath', 
						value: filePath 
					}
				]
			}
		)
		.then(
			resp => {
				if(resp.success) {
					switch(resp.content.type) {
						case 'img':
							setPreviewImg(filePath, resp.content.path);
							break;
						case 'pdf':
							setPreviewPdf(filePath, resp.content.path);
							break;
						default:
							downloadUnpreviewedItem(filePath);
					}
				}
			}
		)
		.catch((e) => console.log(e));
	}
	function openPreviewedItem() {
		window.open(document.querySelector('.pan').getAttribute('data-item-path'));
	}
	function downloadUnpreviewedItem(item) {
		ajaxPost(
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
		.then(
			resp => {
				if(resp.success) {
					downloadItem(resp.content);
				}
			}
		)
		.catch((e) => console.log(e));
	}
	function downloadPreviewedItem() {
		downloadItem(document.querySelector('.pan').getAttribute('data-item-path'));
	}
	function downloadItem(src) {
		let aElm = document.createElement('a');
		aElm.setAttribute('download', '');
		aElm.href = src;
		aElm.click();
		aElm.remove();
	}
	function signOut() {
		ajaxPost({ script: './app/server/sign-out.php' })
		.then(
			resp => {
				if(resp.success) {	
					window.location.reload();
				}
			}
		)
		.catch((e) => console.log(e));
	}