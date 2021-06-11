"use strict";

const ui = {
	addButton: document.getElementById('bar__addButton'),
	body: document.body,
	canButton: document.getElementById('bar__cancelButton'),
	cmdButton: document.getElementById('bar__cmdButton'),
	dirCounter: document.getElementById('dir-counter'),
	fileCounter: document.getElementById('fil-counter'),
	popup: document.querySelector('.popup'),
	prevBox: document.querySelector('.preview'),
	prevItem: document.querySelector('.preview__item'),
	uploadIcon: document.getElementById('upload-icon'),
};

/* ### Manage theme ### */

	function toRecycleTheme() {
		ui.body.classList.add('--in-recycle');
		localStorage.setItem('mainDir', 'RECYCLE');
	}
	function toDataTheme() {
		ui.body.classList.remove('--in-recycle');
		localStorage.setItem('mainDir', 'DATAS');
	}
	function switchMainDir(dir) {
		dir === 'RECYCLE' ?
			toRecycleTheme():
			toDataTheme();
	}
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
	function toogleUpload() {
		ui.uploadIcon.classList.contains('--active') ?
			ui.uploadIcon.classList.remove('--active'):
			ui.uploadIcon.classList.add('--active');
	}
	function toggleEdition() {
		ui.body.classList.contains('--edit-mode') ?
			ui.body.classList.remove('--edit-mode'):
			ui.body.classList.add('--edit-mode');
	}
	function togglePopup(visible, className) {
		if(visible) {
			ui.popup.setAttribute('class', 'popup ' + className);
		}
		else {
			ui.popup.setAttribute('class', 'popup');		
		}
	}

/* ### Manage preview */

	function setPreview(sourcePath, tempPath) {
		ui.prevBox.setAttribute('data-item-path', tempPath);
		ui.prevBox.classList.add('--visible');
		document.querySelector('.start-trap').focus();
	}
	function unsetPreview() {
		ui.prevItem.innerHTML = '';
		ui.prevBox.classList.remove('--visible');
	}
	function setPreviewImg(sourcePath, tempPath) {
		const imgElm = document.createElement('img');
		imgElm.src = tempPath;
		ui.prevItem.appendChild(imgElm);
		setPreview(sourcePath, tempPath);
	}
	function setPreviewPdf(sourcePath, tempPath) {
		const iframeElm = document.createElement('iframe');
		iframeElm.src = tempPath;
		ui.prevItem.appendChild(iframeElm);
		setPreview(sourcePath, tempPath);
	}
	document.onkeydown = e => {
		if(e.code === 'Escape') {
			unsetPreview();
		}
		if(e.code === 'Tab') {
			if(e.shiftKey) {		
				if(e.target.classList.contains('start-trap')) {
					document.querySelector('.end-trap').focus();
					e.preventDefault();
				}
			}
			else {
				if(e.target.classList.contains('end-trap')) {
					document.querySelector('.start-trap').focus();
					e.preventDefault();
				}
			}
		}
	};

/* ### Manage popup ### */

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

/* ### Manage bar ### */

	function isPerformingSearch(value) {
		return value.indexOf('?') === 0 ? true : false;
	}
	function isPerformingCreate(value) {
		return value.indexOf('+') === 0 ? true : false;
	}
	function isPerformingCommand(value) {
		return value.indexOf('*') === 0 ? true : false;
	}
	function setBarButton(button) {
		ui.addButton.classList.add('--hidden');
		ui.cmdButton.classList.add('--hidden');
		ui.canButton.classList.add('--hidden');
		if(button) {
			ui[button].classList.remove('--hidden');
		}
	}
	function barLive(value) {
		const items = document.getElementsByClassName('list__item');
		if(isPerformingSearch(value)) {
			setBarButton('canButton');
			for(const item of items) {
				item.classList.remove('--visible');	
				if(item.textContent.toLowerCase().indexOf(value.substr(1).toLowerCase()) >= 0) {
					item.classList.add('--visible');
				}
			}
			setCounters();
		}
		else {
			for(const item of items) {
				item.classList.add('--visible');
			}
			setCounters();
			if(isPerformingCreate(value)) {
				setBarButton('addButton');
			}
			else if(isPerformingCommand(value)) {
				setBarButton('cmdButton');
			}
			else {
				setBarButton();
			}
		}
	}
	function barSubmit(e) {
		const value = e.target.elements[0].value;
		if(isPerformingSearch(value)) {
			const items = document.getElementsByClassName('list__item');
			for(const item of items) {
				item.classList.add('--visible');
			}
			ui.canButton.classList.add('--hidden');
		}
		else if(isPerformingCreate(value)) {
			createDirectory(value.substr(1));
			ui.addButton.classList.add('--hidden');
		}
		else if(isPerformingCommand(value)) {
			// Do something...
			ui.cmdButton.classList.add('--hidden');
		}
		e.target.reset();
		e.preventDefault();
	}
	document.querySelector('.bar__form').onsubmit = e => barSubmit(e);

/* ### Manage structure ### */

	function setCounters() {
		ui.dirCounter.textContent = document.getElementsByClassName('subdir --visible').length;
		ui.fileCounter.textContent = document.getElementsByClassName('file --visible').length;
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
	function setItems(items, dir) {
		const itemListElm = document.querySelector('.list');
		itemListElm.innerHTML = '';
		for(const item of items) {
			let itemElm = document.createElement('li');	
			// Set item path.
			switch(item.type) {
				case 'file':
					item.path = dir + '/' + item.label;	
					break;
				case 'subdir':
					item.path = dir + '/' + item.label;
					break;
				case 'parent':
					item.path = dir.substr(0, dir.lastIndexOf('/'));
					break;
			}
			itemElm.setAttribute('class', 'list__item ' + item.type + ' --visible');
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
			aItemElm.classList.add('list__item__a', 'non-editable');
			aItemElm.setAttribute('href', '#');
			aItemElm.title = 'Ouvrir';
			aItemElm.onclick = () => item.type === 'file' ? openFile(item.path) : browseDirectory(item.path);
			let titleItemElm = document.createElement('p');
			if(item.type === 'file') {
				titleItemElm.innerHTML = `<svg class="list__item__svg" viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>${item.label}`;
			}
			else if(item.type === 'subdir') {
				titleItemElm.innerHTML = `<svg class="list__item__svg" viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>${item.label}`;
			}
			else {
				titleItemElm.innerHTML = '<svg class="list__item__svg" viewBox="3 3 18 18"><path fill-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6471 6.14854 11.6864 6.19918 11.73 6.25534C11.7917 6.33486 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM9.49706 12.9823L9 12.4853L11.4853 10L13.9706 12.4853L13.4735 12.9823L11.8368 11.3456V16H11.1338V11.3456L9.49706 12.9823Z"/></svg>..';
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
				restItemBtElm.title = 'Permissions';
				restItemBtElm.innerHTML = '<svg fill-rule="evenodd" clip-rule="evenodd"><path d="M24 22h-24v-20h7c1.695 1.942 2.371 3 4 3h13v17zm-17.917-18h-4.083v16h20v-13h-11c-2.339 0-3.537-1.388-4.917-3zm9.917 14h-8v-5h1v-1c0-1.656 1.344-3 3-3s3 1.344 3 3v1h1v5zm-5-6v1h2v-1c0-.552-.448-1-1-1s-1 .448-1 1z"/></svg>';
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
			itemListElm.appendChild(itemElm);
		}
		setCounters();
	}