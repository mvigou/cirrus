"use strict";

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
}
function ajaxLog(origin, log) {
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
	.then(
		resp => {
			if(resp.success) {
				setPopup('warning', lab.mess.error);
			}
		} 
	);
}
function browseDirectory(dir) {
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
			if(resp.success) {
				localStorage.setItem('currentDir', resp.content.dir);
				setItems(resp.content.items, resp.content.dir);
				setTree(resp.content.dir);
			}
		}
	)
	.catch(error => ajaxLog('browseDirectory', error));
}
function createDirectory(dirs) {
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
				if(resp.success) {
					browseDirectory(localStorage.getItem('currentDir'));
				}
			}
		)
		.catch(error => ajaxLog('createDirectory', error));	
	}
}
function uploadItems() {
	let inputElm = document.createElement('input');
	inputElm.setAttribute('type', 'file');
	inputElm.setAttribute('multiple', 'true');
	inputElm.click();
	inputElm.onchange = (e) => {
		let i = 0;
		document.querySelector('.upload-bar').classList.remove('--hidden');
		send(inputElm.files[i]);
		function send(file) {
			document.querySelector('.upload-bar div').style.width = '0';
			document.querySelector('.upload-bar p').textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;
			let formData = new FormData();
			formData.append('parentDir', localStorage.getItem('currentDir'));
			formData.append('file', file);
			let req = new XMLHttpRequest();
			req.open('POST', './app/server/upload-item.php', true);
			req.upload.onprogress = (e) => {
				document.querySelector('.upload-bar div').style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
			};			
			req.onload = () => {
				const resp = JSON.parse(req.responseText);
				if(resp.success) {
					if(resp.content.itemRenamed == true) {
						setPopup('warning', file.name + lab.mess.itemRenamed);
					}
					i++;
					if(inputElm.files.length > i) {
						send(inputElm.files[i]);
					}
					else {
						browseDirectory(localStorage.getItem('currentDir'));
						setTimeout(
							() => document.querySelector('.upload-bar').classList.add('--hidden'),
							1000
						);	
					}
				}
				else {
					ajaxLog('uploadItems', resp.responseText);
					document.querySelector('.upload-bar').classList.add('--hidden');
				}
			};
			req.send(formData);
		}
	};
}
function openFile(filePath) {
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
	.catch(error => ajaxLog('openFile', error));
}
function openPreviewedItem() {
	window.open(document.querySelector('.preview').getAttribute('data-item-tempPath'));
}
function renameItem(oldName, newName, item) {
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
					if(resp.success) {
						browseDirectory(localStorage.getItem('currentDir'));
					}
				}
			)
			.catch(error => ajaxLog('renameItem', error));
		}
	}
	else {
		item.value = oldName;
	}
}
function downloadUnpreviewedItem(item) {
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
			if(resp.success) {
				downloadItem(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('downloadUnpreviewedItem', error));
}
function downloadPreviewedItem() {
	downloadItem(document.querySelector('.preview').getAttribute('data-item-tempPath'));
}
function downloadItem(src) {
	let aElm = document.createElement('a');
	aElm.setAttribute('download', '');
	aElm.href = src;
	aElm.click();
	aElm.remove();
}
function removeItem(item) {
	if(validConfClick() || validConfTouch()) {
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
				if(resp.success) {
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
}
function removePreviewedItem() {
	removeItem(document.querySelector('.preview').getAttribute('data-item-sourcePath'));
	unsetPreview();
}