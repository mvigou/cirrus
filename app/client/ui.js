"use strict";

/* ### manage the appearance relative to the selected parent folder ### */

	const toRecycleDirTheme = () => {
		document.body.classList.add('--in-recycle');
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

/* ### manage the visibility of editing tools ### */

	const toggleEdition = () => {
		document.body.classList.contains('--edit-mode') ?
			document.body.classList.remove('--edit-mode'):
			document.body.classList.add('--edit-mode');
	};

/* ### switch color scheme ### */

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

/* ### manage the preview box ### */

	const previewBoxElm = document.querySelector('.preview');
	const previewItemElm = document.querySelector('.preview__item');

	const setPreview =  (sourcePath, tempPath) => {
		previewBoxElm.setAttribute('data-item-tempPath', tempPath);
		previewBoxElm.setAttribute('data-item-sourcePath', sourcePath);
		previewBoxElm.classList.add('--visible');
	};

	const unsetPreview = () => {
		previewItemElm.innerHTML = '';
		previewBoxElm.classList.remove('--visible');
	};

	const setPreviewImg = (sourcePath, tempPath) => {
		let imgElm = document.createElement('img');
		imgElm.classList.add('preview__item__img');
		imgElm.src = tempPath;
		previewItemElm.appendChild(imgElm);
		setPreview(sourcePath, tempPath);
	};

	const setPreviewPdf = (sourcePath, tempPath) => {
		let iframeElm = document.createElement('iframe');
		iframeElm.classList.add('preview__item__iframe');
		iframeElm.src = tempPath;
		previewItemElm.appendChild(iframeElm);
		setPreview(sourcePath, tempPath);
	};

/* ### manage the popup  ### */

	const setPopup = (type, content) => {
		
		document.querySelector('.popup__content').innerHTML = content;
		document.querySelector('.popup').classList.add('popup--' + type);

		if(type === 'warning') {
			setTimeout(
				() => unsetPopup(),
				3000
			);
		}

	};

	const unsetPopup = () => document.querySelector('.popup').setAttribute('class', 'popup');

/* ### manage user confirmation ### */

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
	};

	const watchConfirmClick = (step, action) => {
		ACTION.click[step].name = action;
		ACTION.click[step].time = performance.now();
		setPopup('confirm', lab.mess.confirmPress);
	};

	const validConfirmClick = () => {
		unsetPopup();
		return ACTION.click.start.name === ACTION.click.end.name && (ACTION.click.end.time - ACTION.click.start.time) >= 600 ?
			true : false;
	};

	const watchConfirmTouch = (step, event) => {
		if(step === 'start') {
			ACTION.touch.start.x = event.touches[0].clientX;
			ACTION.touch.start.y = event.touches[0].clientY;
			ACTION.touch.start.time = performance.now();
			setPopup('confirm', lab.mess.confirmPress);
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

		const navTreeElm = document.querySelector('.nav__tree');

		navTreeElm.innerHTML = '';
		let tree = '';
		
		for(let subDirs of dir.slice(3).split('/').slice(2)) {
					
			tree += '/';
			tree += subDirs;

			let preElm = document.createElement('pre');
			preElm.textContent = ' / ';
			navTreeElm.appendChild(preElm);

			let anchorElm = document.createElement('a');
			anchorElm.href = tree;
			anchorElm.textContent = subDirs;
			anchorElm.onclick = e => {
				browseDirectory('../../datas' + e.target.getAttribute('href'));
				e.preventDefault();
			};
			navTreeElm.appendChild(anchorElm);
			
		}
		
	};

	const buildItems = (items, dir) => {

		const itemListElm = document.querySelector('.list');
		itemListElm.innerHTML = '';
		
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

			// Item main container.
			
				let itemElm;
				itemElm = document.createElement('li');
				itemElm.classList.add('list__item');
				itemElm.setAttribute('data-name', item.label);

			// Allow to open the file or the directory (replace the next sibling in normal mode).
		
				let anchorItemElm = document.createElement('a');
				anchorItemElm.classList.add('list__item__a', 'non-editable');
				anchorItemElm.title = lab.bt.openItem;
				anchorItemElm.onclick = () => item.type === 'file' ? openFile(item.path) : browseDirectory(item.path);
				
				let titleItemElm = document.createElement('p');
				titleItemElm.classList.add('list__item__title');
				titleItemElm.innerHTML = item.type === 'file' ? 
					`<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>${item.label}` :
					`<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>${item.label}`;	
				
				anchorItemElm.appendChild(titleItemElm);
				itemElm.appendChild(anchorItemElm);

			// Allow to rename the file or the directory (replace the precedent sibling in edit mode).
			
				if(item.type !== 'parent') {

					let editItemInputElm = document.createElement('input');
					editItemInputElm.classList.add('editable');
					editItemInputElm.value = item.label;
					editItemInputElm.textContent = item.label;
					editItemInputElm.onkeydown = e => {
						if(e.code === 'Enter') {
							e.target.blur();
						}
					};
					editItemInputElm.onblur = e => renameItem(item.label, e.target.value, e.target);
					itemElm.appendChild(editItemInputElm);

				}
		
			if(item.type === 'file' || item.type === 'subfolder') {
			
				// Allow to download the file or the directory as a zip.
			
					let downloadItemBtElm = document.createElement('button');
					downloadItemBtElm.classList.add('non-editable');
					downloadItemBtElm.title = lab.bt.downloadItem;
					downloadItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>';
					downloadItemBtElm.onclick = () => {
						downloadUnpreviewedItem(item.path)
					};
					itemElm.appendChild(downloadItemBtElm);

				// Allow to remove the file or the directory.
				
					let removeItemBtElm = document.createElement('button');
					removeItemBtElm.classList.add('publisher-ft', 'non-editable');
					removeItemBtElm.title = lab.bt.removeItem;
					removeItemBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>';
					removeItemBtElm.onmousedown = () => watchConfirmClick('start', item.path);
					removeItemBtElm.onmouseleave = () => cancelConfirm();
					removeItemBtElm.ontouchstart = e => watchConfirmTouch('start', e);
					removeItemBtElm.ontouchmove = () => cancelConfirm();
					removeItemBtElm.onmouseup = () => {
						watchConfirmClick('end', item.path);
						removeItem(item.path);
					};
					removeItemBtElm.ontouchend = e => {
						watchConfirmTouch('end', e);
						removeItem(item.path);
					};
					itemElm.appendChild(removeItemBtElm);
	
			}

			itemListElm.appendChild(itemElm);

		}

	};

/* ### performing search and other actions ### */

	const bar = {
		addButtonElm: document.getElementById('bar__addButton'),
		cmdButtonElm: document.getElementById('bar__cmdButton'),
		canButtonElm: document.getElementById('bar__cancelButton')
	};

	const isPerformingSearch = (value) => value.indexOf('?') === 0 ? true : false;
	const isPerformingCreate = (value) => value.indexOf('+') === 0 ? true : false;
	const isPerformingCommand = (value) => value.indexOf('*') === 0 ? true : false;

	const setBarButton = (button) => {
		bar.addButtonElm.classList.add('--hidden');
		bar.cmdButtonElm.classList.add('--hidden');
		bar.canButtonElm.classList.add('--hidden');
		if(button) {
			bar[button].classList.remove('--hidden');
		}
	};

	const barLive = (value) => {
		if(isPerformingSearch(value)) {
			setBarButton('canButtonElm');
			const items = document.getElementsByClassName('list__item');
			for(const item of items) {
				const itemName = item.getAttribute('data-name');
				item.classList.add('--hidden');
				if(itemName.toLowerCase().indexOf(value.substr(1).toLowerCase()) >= 0) {
					item.classList.remove('--hidden');
				}
			}
		}
		else {
			const items = document.getElementsByClassName('list__item');
			for(const item of items) {
				item.classList.remove('--hidden');
			}
			if(isPerformingCreate(value)) {
				setBarButton('addButtonElm');
			}
			else if(isPerformingCommand(value)) {
				setBarButton('cmdButtonElm');
			}
			else {
				setBarButton();
			}
		}
	};

	const barSubmit = (e) => {
		const value = e.target.elements[0].value;
		if(isPerformingCreate(value)) {
			createDirectory(value.substr(1));
			bar.addButtonElm.classList.add('--hidden');
		}
		else if(isPerformingCommand(value)) {
			// Do something...
			bar.cmdButtonElm.classList.add('--hidden');
		}
		e.target.reset();
		e.preventDefault();
	};