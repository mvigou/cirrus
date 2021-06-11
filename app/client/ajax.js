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
function createDirectory(dirs) {
	if(dirs !== '' ) {
		ajaxPost(
			{
				script: './app/server/create-directory.php',
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
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));	
	}
}
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
					i++;
					if(inputElm.files.length > i) {
						send(inputElm.files[i]);
					}
					else {
						browseDirectory(localStorage.getItem('currentDir'));
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
	.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
}
function openPreviewedItem() {
	window.open(document.querySelector('.preview').getAttribute('data-item-path'));
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
			.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
		}
	}
	else {
		item.value = oldName;
	}
}
function moveItem(fromPath, toPath) {
	if(toPath.indexOf(fromPath) === -1) {
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
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
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
	.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
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
	.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
}
function downloadPreviewedItem() {
	downloadItem(document.querySelector('.preview').getAttribute('data-item-path'));
}
function downloadItem(src) {
	let aElm = document.createElement('a');
	aElm.setAttribute('download', '');
	aElm.href = src;
	aElm.click();
	aElm.remove();
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
					}
					browseDirectory(localStorage.getItem('currentDir')); 
				}
			}
		)
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
	}
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
	.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
}