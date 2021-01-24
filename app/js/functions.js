"use strict";

/*--- --- --- --- --- --- --- --- --- ---
			Data correction
--- --- --- --- --- --- --- --- --- ---*/


const escapeApostrophe = (string) => string.replace(/\'/g, '\\\'');


/*--- --- --- --- --- --- --- --- --- ---
		Handling user confirmation
--- --- --- --- --- --- --- --- --- ---*/


	/* Process.
	
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
		setPop('holding', lab.confirmPress);
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
			setPop('holding', lab.confirmPress);
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
		

/*--- --- --- --- --- --- --- --- --- ---
		Work with the server (AJAX)
--- --- --- --- --- --- --- --- --- ---*/


	const ajaxManager = (target, args, callback) => {
		
		let req = new XMLHttpRequest();

		req.open('POST', target, true);
		req.onload = () => callback(req.responseText);

		let formData = new FormData();
		for(let arg of args) {
			formData.append(arg.name, arg.value);
		}
		
		req.send(formData);

	};

	/* 
		Job : log somes errors in a log file (and propose to explore it).
		Expected response : absolutely nothing if it's done. 
		From : /app/php/log.php
	*/
	
		const ajaxErrorLog = (serverLog, clientLog) => {

			ajaxManager(
				'./app/php/log.php',
				[{ name: 'serverLog', value: serverLog }, { name: 'clientLog', value: clientLog }],
				(response) => {
					setPop('watching', response === '' ?
						// Error logged.
						`${lab.logErrorTrue} <a href="error-logs.html" target="_blank">error-logs.html</a> (en).` :
						// Error not logged.
						lab.logErrorFalse
					);
					setTimeout(
						() => unsetPop(),
						3000
					);
				}
			);

		}

	/* 
		Job : browse content of the selected directory.
		Expected response : a JSON representing the content of the directory.
		From : /app/php/browse.php
	*/
	
		const browseDirectory = (dir) => {
			
			ajaxManager(
				'./app/php/browse.php',
				[{ name: 'dir', value: dir }],
				(resp) => {
					try {
						let datas = JSON.parse(resp);
						localStorage.setItem('currentDir', datas[0]);
						buildItems(datas[1]);
						buildTree(datas[0]);
					}
					catch(e) {
						ajaxErrorLog(resp, 'A JSON object was expected but the server sent something else.');
					}		
				}
			);

		};

	/* 
		Job : copy the request file in a random, temporary and unprotected directory.
		Expected response : a JSON with the redirection to the accessible file. 
		From : /app/php/access.php
	*/

		const accessFile = (filename) => {

			ajaxManager(
				'./app/php/access.php',
				[{ name: 'filename', value: filename }],
				(resp) => {
					try {
						window.location.href = JSON.parse(resp);
					}
					catch(e) {
						ajaxErrorLog(resp, 'A JSON object was expected but the server sent something else.');
					}
				}
			);

		}

	/* 
		Job : upload one or many files in parentDir.
		Return : absolutely nothing if it's done.
		To : /app/js/functions.js | uploadFiles
	*/

		const uploadFiles = () => {

			// 1. Configure an input element.
			let inputElm = document.createElement('input');
			inputElm.setAttribute('type', 'file');
			inputElm.setAttribute('multiple', 'true');
			
			// 3. Proceed when submitted, one element at once.
			inputElm.onchange = (e) => {
					
				let i = 0;
				toggleActive(UI.progressUpload);
				send(inputElm.files[i]);
				
				function send(file) {
					
					UI.progressUpload.querySelector('div').style.width = '0';
					UI.progressUpload.querySelector('p').textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;

					let formData = new FormData();
					formData.append('parentDir', localStorage.getItem('currentDir'));
					formData.append("file", file);

					let req = new XMLHttpRequest();
					req.open('POST', './app/php/upload.php', true);

					req.upload.onprogress = (e) => {
						UI.progressUpload.querySelector('div').style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
					};			
						
					req.onload = () => {

						i++;
						
						// Are they others files to upload ? Recursive.
						if(inputElm.files.length > i) {
							send(inputElm.files[i]);
						}
						
						// Else, end.
						else {
							browseDirectory(localStorage.getItem('currentDir'));
							setTimeout(
								() => toggleActive(UI.progressUpload),
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
	
	/* 
		Job : create a new directory in the current directory.
		Expected response : absolutely nothing if it's done (empty string).
		From : /app/php/create.php
	*/

		const createDirectory = (dir = null) => {

			// No name typed yet ? Ask for it first.
			if(dir === null) {
				UI.createDirForm.classList.add('create-dir-form--active');
			}
			
			// Name provided ? Proceed.
			else {
			
				ajaxManager(
					'./app/php/create.php',
					[{ name: 'parent', value: localStorage.getItem('currentDir') },{ name: 'dir', value: dir }],
					(resp) => {
						try { 
							if(resp !== '') {
								throw new Error('An empty string was expected but the server sent something else.');
							}
							browseDirectory(localStorage.getItem('currentDir'));
							UI.createDirForm.reset();
							toggleActive(UI.createDirForm);
						}
						catch(error) {
							ajaxErrorLog(resp, error);
						}
					}
				);

			}

		};


	/* 
		Job : move to the recycle directory / remove permanently a file or a directory and its content.
		Expected response : absolutely nothing if it's done (empty string).
		From : /app/php/remove.php
	*/
	
		const removeElm = (elm) => {

			if(validConfirmClick() || validConfirmTouch()) {
			
				ajaxManager(
					'./app/php/remove.php',
					[{ name: 'elm', value: elm }],
					(resp) => {
						try { 
							if(resp !== '') {
								throw new Error('An empty string was expected but the server sent something else.');
							}
							browseDirectory(localStorage.getItem('currentDir')); 
						}
						catch(error) {
							ajaxErrorLog(resp, error);
						}
					}
				);
			
			}

		};

	/* 
		Job : copy the request file in a random, temporary and unprotected directory.
		Expected response : a JSON containing the path to the accessible file or directory (as a zip). 
		From : /app/php/download.php
	*/

		const downloadElm = (elm) => {

			ajaxManager(
				'./app/php/download.php',
				[{ name: 'elm', value: elm }],
				(resp) => {
					try {
						let pathToElm = JSON.parse(resp);
						try {
							if(pathToElm === '') {
								throw new Error();
							}
							let aElm = document.createElement('a');
							aElm.setAttribute('download', '');
							aElm.href = pathToElm;
							aElm.click();
						}
						catch(error) {
							ajaxErrorLog(resp, 'A path was expected but the server sent an empty string.');
						}
					}
					catch(error) {
						ajaxErrorLog(resp, 'A JSON object was expected but the server sent something else or nothing.');
					}
				}
			);

		};


/*--- --- --- --- --- --- --- --- --- ---
	Update user interface (appearence)
--- --- --- --- --- --- --- --- --- ---*/


	const toRecycleDirTheme = () => {
		document.body.classList.add('--in-recycle');
		localStorage.setItem('mainDir', 'RECYCLE');
	}

	const toDataDirTheme = () => {
		document.body.classList.remove('--in-recycle');
		localStorage.setItem('mainDir', 'DATAS');
	}

	const switchMainDir = (dir) => {
		dir === 'RECYCLE' ?
			toRecycleDirTheme():
			toDataDirTheme();
	}
	
	const toDarkTheme = () => {	
		document.body.classList.add('--darkmode');
		localStorage.setItem('mode', 'dark');
	}

	const toLightTheme = () => {
		document.body.classList.remove('--darkmode');
		localStorage.setItem('mode', 'light');
	}

	const switchTheme = () => {
		document.body.classList.contains('--darkmode') ?
			toLightTheme():
			toDarkTheme();
	}

	const toggleActive = (elm) => elm.classList.toggle('--active');

	const setPop = (action, htmlContent) => {
		UI.pop.querySelector('.pop__mess').innerHTML = htmlContent;
		UI.pop.classList.add('pop--' + action);
	}

	const unsetPop = () => UI.pop.setAttribute('class', 'pop');


/*--- --- --- --- --- --- --- --- --- ---
	Update user interface (structure)
--- --- --- --- --- --- --- --- --- ---*/


	const buildTree = (dir) => {

		UI.browserNavTree.innerHTML = '';
		let tree = '../..';
		
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
						text: subDirs, 
						attributes: {
							href: '#',
							onclick: 'browseDirectory(\'' + escapeApostrophe(tree) + '\')'
						}
					}
				)
			);


		}
		
	};

	const buildItems = (items) => {

		UI.browserList.innerHTML = '';
		
		for(let item of items) {

			switch(item.type) {
				case 'file':
					item.path = item.directory + '/' + item.label;
					break;
				case 'subfolder':
					item.path = item.directory + '/' + item.label;
					break;
				case 'parent':
					item.path = item.directory.substr(0, item.directory.lastIndexOf('/'));
					break;
			}

			let escapedPath = escapeApostrophe(item.path);

			let itemElm = chess(
				{ // Item container
					type: 'li',
					attributes: { 
						class: 'bwr__item'
					},
					children: [
						{ // Hyperlink
							type: 'a', 
							attributes: { 
								class: 'bwr__item__link', 
								href: '#',
								onclick: item.type === 'file' ?
									"accessFile(\'" + escapedPath + "'\)" : // Files only.
									"browseDirectory(\'" + escapedPath + "'\)" // Parent and subfolders only.
							},
							children: [
								{ // SVG icon
									type: 'div',
									html: item.type === 'file' ?
										'<svg class="bwr__item__svg" viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>' :
										'<svg class="bwr__item__svg" viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>'
								},
								{ 
									type: 'div',
									children: [
										{ // Filename
											type: 'h3', 
											attributes: {
												class: 'bwr__item__title'
											},
											text: item.label
										},
										{
											type: 'p',
											attributes: {
												class: 'bwr__item__mess'
											},
											html: item.type === 'file' ?
												lab.latestMod + ' ' + item.lastMod + '<br/>' + lab.file:
												lab.directory
										}
									]
								}
							]
						}
					]
				}
			);
			
			if(item.type === 'file' || item.type === 'subfolder') {
			
				itemElm.appendChild(
					chess(
						{ 
							type: 'div',
							children: [
								{ // Download item button.
									type: 'button', 
									attributes: { 
										class: 'bwr__item__bt',
										onclick: 'downloadElm(\'' + escapedPath + '\')',
										title: lab.bt.download
									},
									html: '<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>'
								},
								{ // Remove item button.
									type: 'button',
									attributes: {
										class: 'bwr__item__bt dangerous',
										onmousedown: 'watchConfirmClick(\'start\', \'remove-' + escapedPath + '\')',
										onmouseup: 'watchConfirmClick(\'end\', \'remove-' + escapedPath + '\'), removeElm(\'' + escapedPath + '\')',
										onmouseleave: 'cancelConfirm()',
										ontouchmove: 'cancelConfirm()',
										title: lab.bt.delete
									},
									html: '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>',
									events: [
										{
											type: 'touchstart',
											function: (e) => watchConfirmTouch('start', e)
										},
										{
										type: 'touchend',
										function: (e) => { 
											watchConfirmTouch('end', e);
											removeElm(item.path);
										}}
									]
								}
							]
						}
					)
				);
			
			}
			
			UI.browserList.appendChild(itemElm);

		}

	};