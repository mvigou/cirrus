"use strict";

/* ### AJAX functions ### */

	const ajaxPostNew = req => {

		return new Promise(
		
			(resolve, reject) => {

				let formData = new FormData();
				if(req.args !== undefined) {
					for(const arg of req.args) {
						formData.append(arg.name, arg.value);
					}
				}
		
				fetch(
					'./app/server/' + req.script, {
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
									
										// TO ADD HERE !

										reject('...' + resp);
									
									
									}	
								}
							)
						}
						else {
							reject(new Error(resp.status + ': ' + resp.statusText));
						}
					}
				);

			}

		);

	};

	const ajaxPost = req => {

		return new Promise(
		
			(resolve, reject) => {

				let formData = new FormData();
				for(const arg of req.args) {
					formData.append(arg.name, arg.value);
				}
		
				fetch(
					'./app/server/' + req.script, {
						method: 'POST',
						body: formData
					}
				).
				then(
					response => {					
						if(response.ok) {
							response.text().then(
								response => resolve(response)
							)
						}
						else {
							reject(new Error(response.status + ': ' + response.statusText));
						}
					}
				);

			}

		);

	};

	const ajaxLog = (origin, log) => {

		ajaxPost(
			{
				script: 'log.php',
				args: [
					{ 
						name: 'origin', 
						value: origin
					},
					{ 
						name: 'log',
						value: log
					}
				]
			},
		)
		.then(response => setPopup('warning', UI.popup.getAttribute('data-mess-error')));

	};

/* ### cirrus core functions ### */

	const browseDirectory = dir => {
		ajaxPost(
			{
				script: 'ct-browse.php',
				args: [
					{ 
						name: 'dir', 
						value: dir 
					}
				]
			}
		)
		.then( // Expected response : a JSON representing the content of the directory.
			response => {
				try {
					const datas = JSON.parse(response);
					localStorage.setItem('currentDir', datas[0]);
					buildItems(datas[1], datas[0]);
					buildTree(datas[0]);
				}
				catch(e) {
					throw new Error('A JSON object was expected but the server sent something else.')
				}
			}
		)
		.catch(error => ajaxLog('browseDirectory', error));

	};

	const createDirectory = dirs => {

		if(dirs !== '' ) {

			ajaxPost(
				{
					script: 'ct-create.php',
					args: [
						{
							name: 'parent',
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
				response => {
					if(response === 'success') {
						browseDirectory(localStorage.getItem('currentDir'));
						document.querySelector('.add-dir-form').reset();
					}
					else {
						throw new Error(response);
					}
				}
			)
			.catch(error => ajaxLog('createDirectory', error));	
		
		}	

	}

	const uploadItems = () => {

		// 1. Configure an input element.
		let inputElm = document.createElement('input');
		inputElm.setAttribute('type', 'file');
		inputElm.setAttribute('multiple', 'true');
		
		// 3. Proceed when submitted, one element at once.
		inputElm.onchange = (e) => {
				
			let i = 0;
			toogleProgressBar();
			send(inputElm.files[i]);
			
			function send(file) {
				
				UI.progressBar.querySelector('div').style.width = '0';
				UI.progressBar.querySelector('p').textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;

				let formData = new FormData();
				formData.append('parentDir', localStorage.getItem('currentDir'));
				formData.append("file", file);

				let req = new XMLHttpRequest();
				req.open('POST', './app/server/ct-upload.php', true);

				req.upload.onprogress = (e) => {
					UI.progressBar.querySelector('div').style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
				};			
					
				req.onload = () => { // Expected response : absolutely nothing if it's done.

					i++;
					
					// Are they others files to upload ? Recursive.
					if(inputElm.files.length > i) {
						send(inputElm.files[i]);
					}
					
					// Else, end.
					else {
						browseDirectory(localStorage.getItem('currentDir'));
						setTimeout(
							() => toogleProgressBar(),
							1000
						);

					}
					
				};
				
				req.send(formData);
			
			}
			
		};
		
		// 2. Automatically active the input element.
		inputElm.click();

	};

	const openFile = filePath => {

		ajaxPostNew(
			{
				script: 'open-file.php',
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
				if(resp.state === 'success') {
					
					switch(resp.content.type) {
						case 'img':
							setPreviewImg(filePath, resp.content.path);
							break;
						case 'pdf':
							setPreviewPdf(filePath, resp.content.path);
							break;
						default:
							downloadUnpreviewedItem(filePath);
							break;

					}
				}
			}
		)
		.catch(error => ajaxLog('openFile', error));

	};

	const openPreviewedItem = () => window.open(UI.preview.getAttribute('data-item-tempPath'));

	const renameItem = (oldName, newName, elm) => {

		if(newName.length >= 1) {

			if(oldName !== newName) {
				
				ajaxPost(
					{
						script: 'ct-rename.php',
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
					response => {
						if(response === 'success') {
							browseDirectory(localStorage.getItem('currentDir'));
						}
						else if(response === 'duplicate') {
							setPopup('warning', UI.popup.getAttribute('data-mess-duplicateContent'));
							elm.value = oldName;
						}
						else {
							throw new Error(response);
						}
					}
				)
				.catch(error => ajaxLog('renameItem', error));

			}

		}

		else {
			elm.value = oldName;
		}

	};

	const downloadUnpreviewedItem = elm => {

		ajaxPost(
			{
				script: 'ct-download.php',
				args: [
					{ 
						name: 'elm', 
						value: elm 
					}
				]
			}
		)
		.then(
			response => {
				if(response !== '') {
					downloadItem(response);
				}
				else {
					throw new Error('A path was expected but the server sent an empty string.');
				}
			}
		)
		.catch(error => ajaxLog('downloadUnpreviewedItem', error));
		
	};

	const downloadPreviewedItem = () => downloadItem(UI.preview.getAttribute('data-item-tempPath'));

	const downloadItem = src => {
		let aElm = document.createElement('a');
		aElm.setAttribute('download', '');
		aElm.href = src;
		aElm.click();
		aElm.remove();
	};

	const removeItem = elm => {

		if(validConfirmClick() || validConfirmTouch()) {

			ajaxPost(
				{
					script: 'ct-remove.php',
					args: [
						{ 
							name: 'elm', 
							value: elm 
						}
					]
				}
			)
			.then(
				response => {
					if(response === 'success') {
						if(elm === 'RECYCLE') {
							localStorage.setItem('currentDir', '../../datas/recyle');
						}
						browseDirectory(localStorage.getItem('currentDir')); 
					}
					else {
						throw new Error(response);
					}
				}
			)
			.catch(error => ajaxLog('removeItem', error));

		}

	};

	const removePreviewedItem = () => {
		removeItem(UI.preview.getAttribute('data-item-sourcePath'));
		unsetPreview();	
	}

/* ### cirrus UI functions ### */

	// https://github.com/AwebsomeFr/chess
	const chess=t=>{let e=document.createElement(t.type);if(t.text?e.textContent=t.text:t.html&&(e.innerHTML=t.html),t.attributes)for(let n in t.attributes)e.setAttribute(n,t.attributes[n]);if(t.events)for(let n of t.events)e.addEventListener(n.type,n.function);if(t.children)for(let n of t.children)e.appendChild(chess(n));return e}

	const toRecycleDirTheme = () => {
		document.body.classList.add('--in-recycle');
		toggleAddDirForm(false);
		localStorage.setItem('mainDir', 'RECYCLE');
	};

	const toDataDirTheme = () => {
		document.body.classList.remove('--in-recycle');
		localStorage.setItem('mainDir', 'DATAS');
	};

	const switchMainDir = dir => {
		dir === 'RECYCLE' ?
			toRecycleDirTheme():
			toDataDirTheme();
	};

	const toggleAddDirForm = (open) => {
		const addFormElm = document.querySelector('.add-dir-form');
		if(addFormElm.classList.contains('--visible') || open === false) {
			addFormElm.classList.remove('--visible');
		}
		else {
			addFormElm.classList.add('--visible');
			addFormElm.querySelector('input').focus();
		}
	}

	const toggleEdition = () => {
		document.body.classList.contains('--edit-mode') ?
			document.body.classList.remove('--edit-mode'):
			document.body.classList.add('--edit-mode');
	};

	const toDarkTheme = () => {	
		document.body.classList.add('--dark-mode');
		localStorage.setItem('mode', 'dark');
	};

	const toLightTheme = () => {
		document.body.classList.remove('--dark-mode');
		localStorage.setItem('mode', 'light');
	};

	const switchTheme = () => {
		document.body.classList.contains('--dark-mode') ?
			toLightTheme():
			toDarkTheme();
	};

	// Preview files.

	const setPreview =  (sourcePath, tempPath) => {
		UI.preview.setAttribute('data-item-tempPath', tempPath);
		UI.preview.setAttribute('data-item-sourcePath', sourcePath);
		UI.preview.classList.add('--visible');
	}

	const unsetPreview = () => {
		UI.previewItem.innerHTML = '';
		UI.preview.classList.remove('--visible');
	};

	const setPreviewImg = (sourcePath, tempPath) => {

		UI.previewItem.appendChild(
			chess(
				{
					type: 'img',
					attributes: {
						'class': 'preview__item__img',
						'src': tempPath
					}
				}
			)
		);

		setPreview(sourcePath, tempPath);

	};

	const setPreviewPdf = (sourcePath, tempPath) => {

		UI.previewItem.appendChild(
			chess(
				{
					type: 'iframe',
					attributes: {
						'class': 'preview__item__iframe',
						'src': tempPath
					}
				}
			)
		);

		setPreview(sourcePath, tempPath);

	};





	

	const setPopup = (type, content) => {
		
		UI.popup.querySelector('.popup__content').innerHTML = content;
		UI.popup.classList.add('popup--' + type);

		if(type === 'warning') {
			setTimeout(
				() => unsetPopup(),
				3000
			);
		}

	};

	const unsetPopup = () => UI.popup.setAttribute('class', 'popup');

	const toogleProgressBar = () => UI.progressBar.classList.toggle('--visible');

/* ### handling user confirmation ### */

	/* 

	The origin and time of the mousedown/touchstart event are recorded (watchConfirmClick / watchConfirmTouch); the same information is recorded for the mouseup/touchend event (watchConfirmClick / watchConfirmTouch). The time between the two events is then compared (validConfirmClick / validConfirmTouch) : if it is greater than a given value, the action is validated, otherwise, it is canceled. If the user moves out of the origin during the mousedown/touchstart event, a mouseleave/touchmove event is triggered and the action will be canceled when the click/touch is released elsewhere (cancelConfirm). Caution: if the user returns to release the click on the origin AFTER a mouseleave event has occurred, the action may be considered valid.

	*/

	const ACTION = {
		click: {
			start: {
				name: '',
				time: 0
			},
			end: {
				name: '',
				time: 0
			}
		},
		touch: {
			start: {
				x: 0,
				y: 0,
				time: 0
			},
			end: {
				x: 0,
				y: 0,
				time: 0
			}
		}
	}

	const watchConfirmClick = (step, action) => {
		ACTION.click[step].name = action;
		ACTION.click[step].time = performance.now();
		setPopup('confirm', UI.popup.getAttribute('data-mess-confirmPress'));
	};

	const validConfirmClick = () => {
		unsetPopup();
		return ACTION.click.start.name === ACTION.click.end.name && (ACTION.click.end.time - ACTION.click.start.time) >= 600 ?
			true : false;
	};

	const watchConfirmTouch = (step, event) => {;
		if(step === 'start') {
			ACTION.touch.start.x = event.touches[0].clientX;
			ACTION.touch.start.y = event.touches[0].clientY;
			ACTION.touch.start.time = performance.now();
			setPopup('confirm', UI.popup.getAttribute('data-mess-confirmPress'));
			event.preventDefault();	
		}
		
		else {
			ACTION.touch.end.x = event.changedTouches[0].clientX;
			ACTION.touch.end.y = event.changedTouches[0].clientY;
			ACTION.touch.end.time = performance.now();
			unsetPopup();
		}
		
	};

	const validConfirmTouch = () => {
		
		unsetPopup();	
		
		if(ACTION.touch.start.x === ACTION.touch.end.x && ACTION.touch.start.y === ACTION.touch.end.y && (ACTION.touch.end.time - ACTION.touch.start.time) >= 600) {
			return true;
		}
		return false;
			
	};
		
	const cancelConfirm = () => unsetPopup();

/* ### change UI structure ### */

	const buildTree = dir => {

		UI.tree.innerHTML = '';
		let tree = '';
		
		for(let subDirs of dir.slice(3).split('/').slice(2)) {
					
			tree += '/';
			tree += subDirs;
			UI.tree.appendChild(
				chess(
					{
						type: 'pre',
						text: ' / '
					}
				)
			);

			UI.tree.appendChild(
				chess(
					{
						type: 'a',
						attributes: {
							'href': tree
						},
						events: [
							{
								type: 'click',
								function: e => {
									browseDirectory('../../datas' + e.target.getAttribute('href'));
									e.preventDefault();
								} 
							}
						],
						text: subDirs 
					}
				)
			);

		}
		
	};

	const buildItems = (items, dir) => {

		UI.list.innerHTML = '';
		
		for(let item of items) {

			switch(item.type) {
				case 'file':
					item.path = dir + '/' + item.label;
					break;
				case 'subfolder':
					item.path = dir + '/' + item.label;
					break;
				case 'parent':
					item.path = dir.substr(0, dir.lastIndexOf('/'));
					break;
			}

			let itemElm = chess(
				{
					type: 'li',
					attributes: { 
						class: 'list__item'
					},
				}
			);

			// ANCHOR | Allow to open the file or a directory (replace the next sibling in normal mode).
			itemElm.appendChild(
				chess(
					{ 
						type: 'a',
						attributes: { 
							class: 'list__item__a non-editable',
							title: UI.list.getAttribute('data-bt-openItem') 
						},
						events: [
							{
								type: 'click',
								function: () => {
									if(item.type === 'file') {
										openFile(item.path);
									}
									else {
										browseDirectory(item.path);
									}
								}
							},
						],
						children : [
							{
								type: 'p',
								attributes: {
									class: 'list__item__title'
								},
								html: item.type === 'file' ? 
									`<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>${item.label}` :
									`<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>${item.label}`
							}
						]
					}
				)
			);

			// INPUT | Allow to rename the file or the directory (replace the precedent sibling in edit mode).
			if(item.type !== 'parent') {
				itemElm.appendChild(
					chess(
						{
							type: 'input',
							attributes: { 
								class: 'editable',
								value: item.label
							},
							events: [
								{
									type: 'keydown',
									function: e => {
										if(e.code === 'Enter') {
											e.target.blur();
										}
									},
								},
								{
									type: 'blur',
									function: e => {
										renameItem(item.label, e.target.value, e.target);
									}		
								}
							],
							text: item.label
						}	
					)
				);
			}
		
			if(item.type === 'file' || item.type === 'subfolder') {
			
				// BUTTON | Allow to download the file or the directory as a zip.
				itemElm.appendChild(
					chess(
						{
							type: 'button', 
							attributes: { 
								class: 'non-editable',
								title: UI.list.getAttribute('data-bt-downloadItem')
							},
							events: [
								{
									type: 'click',
									function: () => downloadUnpreviewedItem(item.path)
								}
							],
							html: '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>'
						}
					)
				);

				// BUTTON | Allow to remove the file or the directory.
				itemElm.appendChild(
					chess(
						{
							type: 'button',
							attributes: {
								class: 'publisher-ft non-editable',
								title: UI.list.getAttribute('data-bt-removeItem')
							},
							events: [
								{
									type: 'mousedown',
									function: () => watchConfirmClick('start', item.path)
								},
								{
									type: 'mouseup',
									function: () => {
										watchConfirmClick('end', item.path),
										removeItem(item.path)
									}
								},
								{
									type: 'mouseleave',
									function: () => cancelConfirm()
								},
								{
									type: 'touchstart',
									function: e => watchConfirmTouch('start', e)
								},
								{
									type: 'touchend',
									function: e => { 
										watchConfirmTouch('end', e);
										removeItem(item.path);
									}
								},
								{
									type: 'touchmove',
									function: () => cancelConfirm()
								}
							],
							html: '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>',
						}
					)
				);

			}
			
			UI.list.appendChild(itemElm);

		}

	};

/* ### UI variables ### */

	const UI = {
		list: document.querySelector('.list'),
		tree: document.querySelector('.nav__tree'),
		popup: document.querySelector('.popup'),
		progressBar: document.querySelector('.upload-bar'),
		preview: document.querySelector('.preview'),
		previewItem: document.querySelector('.preview__item')
	};

	const emptyRecycleBt = document.getElementById('empty-recycle');

/* ### attach latest events ### */

	document.querySelector('.add-dir-form').onsubmit = (e) => {		
		createDirectory(e.target.elements[0].value);
		e.preventDefault();
	};

	emptyRecycleBt.ontouchstart = e => watchConfirmTouch('start', e);

	emptyRecycleBt.ontouchend = e => {
		watchConfirmTouch('end', e); 
		removeItem('RECYCLE');
	}

	emptyRecycleBt.ontouchmove = () => cancelConfirm();

/* ### reload user preferences ### */

	if(localStorage.getItem('mode') === 'dark') {
		toDarkTheme();
	}

	if(localStorage.getItem('currentDir')) {
		browseDirectory(localStorage.getItem('currentDir'));
		if(localStorage.getItem('mainDir') === 'RECYCLE') {
			toRecycleDirTheme();
		}
	}

	else {
		browseDirectory('DATAS');
	}