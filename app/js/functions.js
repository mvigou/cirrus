"use strict";

// Handling user confirmation

	// Save when mousedown/touchstart and mouseup/touchend start.
	const watchClic = (watchedClic) => CLICK[watchedClic] = performance.now();

	// Compare the time spent between mousedown and the corresponding mouseup.
	const confirmClic = () => CLICK[1] - CLICK[0] > 1000 ? true : false;

// Data correction

	const escapeApostrophe = (string) => string.replace(/\'/g, '\\\'');

// Work with the server (AJAX)

	// Create an AJAX request using POST.
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

	// Browse the content of the current directory.
	const browseDirectory = (dir) => {
		
		ajaxManager(
			'./app/php/browse.php',
			[{ name: 'dir', value: dir }],
			(response) => {
				response = JSON.parse(response);
				localStorage.setItem('currentDir', response[0]);
				buildItems(response[1]);
				buildTree(response[0]);
			}
		);

	};

	// Copy the selected file to a temporary directory where it will be available.
	const accessFile = (filename) => {

		ajaxManager(
			'./app/php/access.php',
			[{ name: 'filename', value: filename }],
			(response) => {
				if(response != 'failure') {
					window.location.href = response;
				}
				else {
					ajaxErrorHandler(response);
				}
			}
		);

	}

	// Upload selected files in the current directory.
	const uploadFiles = () => {

		// 1. Configure an input element.
		let inputElm = document.createElement('input');
		inputElm.setAttribute('type', 'file');
		inputElm.setAttribute('multiple', 'true');
		
		// 3. Proceed when submitted, one element at once.
		inputElm.onchange = (e) => {
				
			let i = 0;
			UI.loader.container.classList.add('loader--visible');
			send(inputElm.files[i]);
			
			function send(file) {
				
				UI.loader.progress.style.width = '0';
				UI.loader.info.textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;

				let formData = new FormData();
				formData.append('parentDir', localStorage.getItem('currentDir'));
				formData.append("file", file);

				let req = new XMLHttpRequest();
				req.open('POST', './app/php/upload.php', true);

				req.upload.onprogress = (e) => {
					UI.loader.progress.style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
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
							() => UI.loader.container.classList.remove('loader--visible'),
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
	
	// Create a new empty directory.
	const createDirectory = (dir = null) => {

		// No name typed yet ? Ask for it first.
		if(dir === null) {
			
			dial(
				`<label>
					${lab.action.nameNewdir}
					<input type="text" id="input" />
				</label>
				<button 
					class="dial__bt" 
					onclick="createDirectory(this.parentNode.querySelector('input').value)">
					${lab.button.confirm}
				</button>
				<button class="dial__bt" onclick="dial(null)">${lab.button.cancel}</button>`
			);
			
		}
		
		// Name provided ? Proceed.
		else {
		
			ajaxManager(
				'./app/php/create.php',
				[{ name: 'parent', value: localStorage.getItem('currentDir') },{ name: 'dir', value: dir }],
				(response) => {
					if(response === 'success') {
						browseDirectory(localStorage.getItem('currentDir'));
						dial(null);
					}
					else {
						ajaxErrorHandler(response);
					}
				}
			);

		}

	};

	// Remove a file, a directory.
	const removeElm = (elm) => {

		if(confirmClic()) {
		
			ajaxManager(
				'./app/php/remove.php',
				[{ name: 'elm', value: elm }],
				(response) => {
					if(response === 'success') {
						browseDirectory(localStorage.getItem('currentDir'));
						dial(null);
					}
					else {
						ajaxErrorHandler(response);
					}		
				}
			);
		
		}

	};

	// Copy the selected file or directory to a temporary directory where it will be available for download.
	const downloadElm = (elm) => {

		ajaxManager(
			'./app/php/download.php',
			[{ name: 'elm', value: elm }],
			(pathToElm) => {
				if(pathToElm !== '') {
					// Automatically offers the download the elm.
					let aElm = document.createElement('a');
					aElm.setAttribute('download', '');
					aElm.href = pathToElm;
					aElm.click();
				}
			}
		);

	};

// Work with the user interface (appearence)

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

// Work with the user interface (structure)

	// Add a dial when some HTML is provided.
	const dial = (html) => {

		if(html != null) {
			UI.dial.querySelector('div').innerHTML = html;
			UI.dial.classList.add('dial--visible');
		}
		else {
			UI.dial.querySelector('div').innerHTML = '';
			UI.dial.classList.remove('dial--visible');
		}

	};

	// Displays some error messages.
	const ajaxErrorHandler = (error) => {

		dial(
			`<p> 
				${lab.error}
				<i>${error}</i>
			</p>
			<button onclick="dial(null)"> ${ lab.button.close } </button>`
		);

	};

	// Build a navigable tree.
	const buildTree = (dir) => {

		UI.browserTree.innerHTML = '';
		let tree = '../..';
		
		for(let subDirs of dir.slice(2).split('/').slice(2)) {
					
			tree += '/';
			tree += subDirs;
			
			UI.browserTree.innerHTML += 
			`<pre> / </pre><a href="#" onclick="browseDirectory('${escapeApostrophe(tree)}')">${subDirs}</a>`;

		}
		
	};

	// Build a file or a folder element.
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

			// Prevent issue between apostrophe and template. 
			item.path = escapeApostrophe(item.path);
	
			let template = '';

			template += // Common parts for parent, files and subfolders.
			'<li class="bwr__item">';
			
				template += item.type === 'file' ?
				// Files only.
				`<a class="bwr__item__link" href="#" onclick="accessFile('${item.path}')">` :
				// Parent and subfolders only.
				`<a class="bwr__item__link" href="#" onclick="browseDirectory('${item.path}')">`;
				
					template += // Common parts for parent, files and subfolders.
					'<svg class="bwr__item__svg" viewBox="3 3 18 18" xmlns="http://www.w3.org/2000/svg">';
				
						template += item.type === 'file' ?
						// Files only.
						'<path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" clip-rule="evenodd" fill-rule="evenodd"/>':
						// Parent and subfolders only.
						'<path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" />';
			
					template += // Common parts for parent, files and subfolders.
					`</svg>
					<div>
						<h3 class="bwr__item__title">${item.label}</h3>`;
						// Files only.
						if(item.type === 'file') {
							template += `<p class="bwr__item__info">${lab.latestMod} ${item.lastMod}</p>`;
						}
					template +=
					`</div>
				</a>`;

				// Common parts for files and subfolders.
				if(item.type === 'file' || item.type === 'subfolder') {
					template += 
					`<div>
						<button class="bwr__item__bt" onclick="downloadElm('${item.path}')" title="${lab.button.download}">
							<svg viewBox="-3 -3 30 30" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/>
							</svg>
						</button>
						<button 
							class="bwr__item__bt" 	
							ontouchstart="watchClic(0)"
							ontouchend="watchClic(1), removeElm('${item.path}')"
							onmousedown="watchClic(0)"
							onmouseup="watchClic(1), removeElm('${item.path}')"
							title="${lab.button.delete}">
							<svg viewBox="-3 -3 30 30" xmlns="http://www.w3.org/2000/svg">			
								<path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>						
							</svg>
						</button>
					</div>`;
						
				}
			
			// Common parts for parent, files and subfolders.
			template +=  '</li>';

			UI.browserList.innerHTML += template;

		}

	};