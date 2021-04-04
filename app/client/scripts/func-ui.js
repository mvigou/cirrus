"use strict";

/* --- Change UI Appearance --- */

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
		if(addFormElm.classList.contains('--enabled') || open === false) {
			addFormElm.classList.remove('--enabled');
		}
		else {
			addFormElm.classList.add('--enabled');
			addFormElm.querySelector('input').focus();
		}
	}

	const toggleEdition = () => {
		document.body.classList.contains('--edition') ?
			document.body.classList.remove('--edition'):
			document.body.classList.add('--edition');
	};

	const toDarkTheme = () => {	
		document.body.classList.add('--darkmode');
		localStorage.setItem('mode', 'dark');
	};

	const toLightTheme = () => {
		document.body.classList.remove('--darkmode');
		localStorage.setItem('mode', 'light');
	};

	const switchTheme = () => {
		document.body.classList.contains('--darkmode') ?
			toLightTheme():
			toDarkTheme();
	};

	const setPop = (type, content) => {
		
		UI.pop.querySelector('.pop__content').innerHTML = content;
		UI.pop.classList.add('pop--' + type);

		if(type === 'warning') {
			setTimeout(
				() => unsetPop(),
				3000
			);
		}

	};

	const unsetPop = () => UI.pop.setAttribute('class', 'pop');

	const toogleProgressBar = () => UI.progressBar.classList.toggle('--enabled');

/* --- Handling user confirmation --- */

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
		setPop('confirm', lab.pop.confirmPress);
	};

	const validConfirmClick = () => {
		unsetPop();
		return ACTION.click.start.name === ACTION.click.end.name && (ACTION.click.end.time - ACTION.click.start.time) >= 600 ?
			true : false;
	};

	const watchConfirmTouch = (step, event) => {;
		if(step === 'start') {
			ACTION.touch.start.x = event.touches[0].clientX;
			ACTION.touch.start.y = event.touches[0].clientY;
			ACTION.touch.start.time = performance.now();
			setPop('confirm', lab.pop.confirmPress);
			event.preventDefault();	
		}
		
		else {
			ACTION.touch.end.x = event.changedTouches[0].clientX;
			ACTION.touch.end.y = event.changedTouches[0].clientY;
			ACTION.touch.end.time = performance.now();
			unsetPop();
		}
		
	};

	const validConfirmTouch = () => {
		
		unsetPop();	
		
		if(ACTION.touch.start.x === ACTION.touch.end.x && ACTION.touch.start.y === ACTION.touch.end.y && (ACTION.touch.end.time - ACTION.touch.start.time) >= 600) {
			return true;
		}
		return false;
			
	};
		
	const cancelConfirm = () => unsetPop();

/* --- Change UI Structure --- */

	const buildTree = dir => {

		UI.browserNavTree.innerHTML = '';
		let tree = '';
		
		for(let subDirs of dir.slice(2).split('/').slice(2)) {
					
			tree += '/';
			tree += subDirs;
			
			UI.browserNavTree.appendChild(
				chess(
					{
						type: 'pre',
						text: ' / '
					}
				)
			);

			UI.browserNavTree.appendChild(
				chess(
					{
						type: 'a',
						attributes: {
							href: tree,
						},
						events: [
							{
								type: 'click',
								function: e => {
									browseDirectory('../..' + e.target.pathname);
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

		UI.browserList.innerHTML = '';
		
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
						class: 'bwr__item'
					},
					children: [
						{ // Replace the next sibling in normal mode.
							type: 'a',
							attributes: { 
								class: 'bwr__item__a non-editable',
								title: lab.bt.open 
							},
							events: [
								{
									type: 'click',
									function: () => {
										if(item.type === 'file') {
											accessFile(item.path);
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
										class: 'bwr__item__title'
									},
									html: item.type === 'file' ? 
										`<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>${item.label}` :
										`<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>${item.label}`
								}
							]
						},
						{ // Replace the precedent sibling in edit mode.
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
										renameElm(item.label, e.target.value, e.target);
									}		
								}
							],
							text: item.label
						}	
					]
				}
			);
			
			if(item.type === 'file' || item.type === 'subfolder') {
			
				itemElm.appendChild(
					chess(
						{
							type: 'div',
							attributes: {
								class: 'non-editable'
							},
							children: [

								{ // Download elm.
									type: 'button', 
									attributes: { 
										class: 'bwr__item__button',
										title: lab.bt.download
									},
									events: [
										{
											type: 'click',
											function: () => downloadElm(item.path)
										}
									],
									html: '<svg class="bwr__item__button-svg" viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>'
								},

								{ // Remove elm.
									type: 'button',
									attributes: {
										class: 'bwr__item__button',
										title: lab.bt.delete
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
												removeElm(item.path)
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
												removeElm(item.path);
											}
										},
										{
											type: 'touchmove',
											function: () => cancelConfirm()
										}
									],
									html: '<svg class="bwr__item__button-svg" viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>',
								}

							]
						}
					)
				);
				
			}
			
			UI.browserList.appendChild(itemElm);

		}

	};