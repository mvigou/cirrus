"use strict";

const ajaxPost = req => {

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
								/*
								JSON expected in all cases.
								PHP will be produce some string if an error has occurred.
								*/
								try {
									const parsedResp = JSON.parse(resp);
									resolve(parsedResp);
								}
								catch(e) {
									reject("The application was expecting JSON, but the server returned this: " + resp);
								}	
							}
						);
					}
					else {
						reject(new Error(resp.status + ': ' + resp.statusText));
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
		}
	)
	.then(resp => setPopup('warning', lab.mess.error));

};

const browseDirectory = dir => {
	
	ajaxPost(
		{
			script: 'browse-directory.php',
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
			if(resp.state === 'success') {
				localStorage.setItem('currentDir', resp.content.dir);
				buildItems(resp.content.items, resp.content.dir);
				buildTree(resp.content.dir);
			}
		}
	)
	.catch(error => ajaxLog('browseDirectory', error));

};

const createDirectory = dirs => {

	if(dirs !== '' ) {

		ajaxPost(
			{
				script: 'create-directory.php',
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
			resp => {
				if(resp.state === 'success') {
					browseDirectory(localStorage.getItem('currentDir'));
					document.querySelector('.add-dir-form').reset();
				}
			}
		)
		.catch(error => ajaxLog('createDirectory', error));	
	
	}	

};

const uploadItems = () => {

	let inputElm = document.createElement('input');
	inputElm.setAttribute('type', 'file');
	inputElm.setAttribute('multiple', 'true');
	inputElm.click();
	
	inputElm.onchange = (e) => {
			
		let i = 0;
		toogleProgressBar();
		send(inputElm.files[i]);
		
		function send(file) {
			
			ui.progressBar.querySelector('div').style.width = '0';
			ui.progressBar.querySelector('p').textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;

			let formData = new FormData();
			formData.append('parentDir', localStorage.getItem('currentDir'));
			formData.append('file', file);

			let req = new XMLHttpRequest();
			req.open('POST', './app/server/upload-item.php', true);

			req.upload.onprogress = (e) => {
				ui.progressBar.querySelector('div').style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
			};			
				
			req.onload = () => {

				const resp = JSON.parse(req.responseText);

				if(resp.success == true) {

					if(resp.content.itemRenamed == true) {
						setPopup('warning', file.name + lab.mess.itemRenamed);
					}
	
					i++;
					
					// Are they others files to upload ? Recursive.
					if(inputElm.files.length > i) {
						send(inputElm.files[i]);
					}

					else {
						browseDirectory(localStorage.getItem('currentDir'));
						setTimeout(
							() => toogleProgressBar(),
							1000
						);	
					}

				}

				else {
					ajaxLog('uploadItems', resp.responseText);
					toogleProgressBar();
				}

			};
			
			req.send(formData);
		
		}
		
	};

};

const openFile = filePath => {

	ajaxPost(
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
				}
			}
		}
	)
	.catch(error => ajaxLog('openFile', error));

};

const openPreviewedItem = () => window.open(ui.preview.getAttribute('data-item-tempPath'));

const renameItem = (oldName, newName, item) => {

	if(newName.length >= 1) {

		if(oldName !== newName) {
			
			ajaxPost(
				{
					script: 'rename-item.php',
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
					if(resp.state === 'success') {
						browseDirectory(localStorage.getItem('currentDir'));
					}
					else if(resp.state === 'duplicate') {
						setPopup('warning', lab.mess.duplicateItem);
						item.value = oldName;
					}
				}
			)
			.catch(error => ajaxLog('renameItem', error));

		}

	}

	else {
		item.value = oldName;
	}

};

const downloadUnpreviewedItem = item => {

	ajaxPost(
		{
			script: 'download-item.php',
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
			if(resp.state === 'success') {
				downloadItem(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('downloadUnpreviewedItem', error));
	
};

const downloadPreviewedItem = () => downloadItem(ui.preview.getAttribute('data-item-tempPath'));

const downloadItem = src => {
	let aElm = document.createElement('a');
	aElm.setAttribute('download', '');
	aElm.href = src;
	aElm.click();
	aElm.remove();
};

const removeItem = item => {

	if(validConfirmClick() || validConfirmTouch()) {

		ajaxPost(
			{
				script: 'remove-item.php',
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
				if(resp.state === 'success') {
					if(item === 'RECYCLE') {
						// Prevent browsing error if the recycle is emptied with user inside a removed directory.
						localStorage.setItem('currentDir', '../../datas/recyle');
					}
					browseDirectory(localStorage.getItem('currentDir')); 
				}
			}
		)
		.catch(error => ajaxLog('removeItem', error));

	}

};

const removePreviewedItem = () => {
	removeItem(ui.preview.getAttribute('data-item-sourcePath'));
	unsetPreview();
};