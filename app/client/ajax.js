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
	.catch(
		() => {
			setPopup('warning', lab.mess.error);
			browseDirectory('DATAS');
		}
	);
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
		.catch(() => setPopup('warning', lab.mess.error));	
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
					setPopup('warning', lab.mess.error);
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
	.catch(() => setPopup('warning', lab.mess.error));
}
function openPreviewedItem() {
	window.open(document.querySelector('.preview').getAttribute('data-item-path'));
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
			.catch(() => setPopup('warning', lab.mess.error));
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
				script: 'move-item.php',
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
		.catch(() => setPopup('warning', lab.mess.error));
	}
}
function copyItem(fromPath, toPath) {
	ajaxPost(
		{
			script: 'copy-item.php',
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
	.catch(() => setPopup('warning', lab.mess.error));
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
	.catch(() => setPopup('warning', lab.mess.error));
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
		.catch(() => setPopup('warning', lab.mess.error));
	}
}
function signOut() {
	ajaxPost({ script: 'sign-out.php' })
	.then(
		resp => {
			if(resp.success) {	
				window.location.reload();
			}
		}
	)
	.catch(() => setPopup('warning', lab.mess.error));
}