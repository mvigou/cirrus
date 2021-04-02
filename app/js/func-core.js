"use strict";

const escapeApostrophe = string => string.replace(/\'/g, '\\\'');

const browseDirectory = dir => {
	
	ajaxPost(
		{
			script: 'browse.php',
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
				buildItems(datas[1]);
				buildTree(datas[0]);
			}
			catch(e) {
				throw new Error('A JSON object was expected but the server sent something else.')
			}
		}
	)
	.catch(error => ajaxLog('browseDirectory', error ));

};

const accessFile = filename => {

	ajaxPost(
		{
			script: 'access.php',
			args: [
				{ 
					name: 'filename', 
					value: filename 
				}
			]
		}
	)
	.then( // Expected response : a JSON with the redirection to the accessible file.
		response => {
			try {
				window.location.href = JSON.parse(response);
			}
			catch(e) {
				throw new Error('A JSON object was expected but the server sent something else.')
			}
		}
	)
	.catch(error => ajaxLog('accessFile', error ));

};

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

const removeElm = elm => {

	if(validConfirmClick() || validConfirmTouch()) {

		ajaxPost(
			{
				script: 'remove.php',
				args: [
					{ 
						name: 'elm', 
						value: elm 
					}
				]
			}
		)
		.then( // Expected response : absolutely nothing if it's done (empty string).
			response => {
				if(response === '') {
					browseDirectory(localStorage.getItem('currentDir')); 
				}
				else {
					throw new Error(response);
				}
			}
		)
		.catch(error => ajaxLog('removeElm', error));

	}

};

const downloadElm = elm => {

	ajaxPost(
		{
			script: 'download.php',
			args: [
				{ 
					name: 'elm', 
					value: elm 
				}
			]
		}
	)
	.then( // Expected response : a string containing the path to the accessible file or directory (as a zip).
		response => {
			if(response !== '') {
				let aElm = document.createElement('a');
				aElm.setAttribute('download', '');
				aElm.href = response;
				aElm.click();
			}
			else {
				throw new Error('A path was expected but the server sent an empty string.');
			}
		}
	)
	.catch(error => ajaxLog('downloadElm', error));

};	

const createDirectory = (dir = null, parent = null) => {
	
	/*
	Example : parent1>>child1&&child2||parent2>>child3>>child4||parent3
	1. Separate parents with ||
	2. Separate levels with >>
	2. Separate children with &&
	*/

	// No name typed yet ? Ask for it first.
	if(dir === null) {
		UI.createDirForm.classList.add('create-dir-form--active');
	}
	
	// Infos provided ? Analyze...
	else if(dir !== null && parent === null) {
		if(dir !== '' && parent !== '') {
			let parents = dir.split('||');
			for(let parent of parents) {
				let basePath = localStorage.getItem('currentDir');
				let levels = parent.split('>>');
				for(let level of levels) {
					let children = level.split('&&');
					if(children !== undefined && children.length > 1) {
						for(let child of children) {		
							child = child.trim();
							if(child.length >= 1) {
								createDirectory(child, basePath);
							}
						}	
					}
					else {
						level = level.trim();
						if(level.length >= 1) {
							createDirectory(level, basePath);		
						}
						basePath += '/' + level;	
					}	
				}
			}	
		}	
	}

	// Infos analyzed ? Proceed !
	else {
		ajaxPost(
			{
				script: 'create.php',
				args: [
					{ 
						name: 'parent', 
						value: parent 
					},
					{ 
						name: 'dir', 
						value: dir 
					}
				]
			}
		)
		.then( // Expected response : absolutely nothing if it's done (empty string).
			response => {
				if(response === '') {
					browseDirectory(localStorage.getItem('currentDir'));
					UI.createDirForm.reset();
					toggleActive(UI.createDirForm); 
				}
				else {
					throw new Error(response);
				}
			}
		)
		.catch(error => ajaxLog('createDirectory', error));	
	}

}