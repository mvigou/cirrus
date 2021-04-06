"use strict";

const browseDirectory = dir => {

	ajaxPost(
		{
			script: 'ct-browse.php',
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
				buildItems(datas[1], datas[0]);
				buildTree(datas[0]);
			}
			catch(e) {
				throw new Error('A JSON object was expected but the server sent something else.')
			}
		}
	)
	.catch(error => ajaxLog('browseDirectory', error));

};

const createDirectory = dirs => {

	if(dirs !== '' ) {

		ajaxPost(
			{
				script: 'ct-create.php',
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
			response => {
				if(response === 'success') {
					browseDirectory(localStorage.getItem('currentDir'));
					document.querySelector('.add-dir-form').reset();
				}
				else {
					throw new Error(response);
				}
			}
		)
		.catch(error => ajaxLog('createDirectory', error));	
	
	}	

}

const uploadFiles = () => {

	// 1. Configure an input element.
	let inputElm = document.createElement('input');
	inputElm.setAttribute('type', 'file');
	inputElm.setAttribute('multiple', 'true');
	
	// 3. Proceed when submitted, one element at once.
	inputElm.onchange = (e) => {
			
		let i = 0;
		toogleProgressBar();
		send(inputElm.files[i]);
		
		function send(file) {
			
			UI.progressBar.querySelector('div').style.width = '0';
			UI.progressBar.querySelector('p').textContent = (i + 1) + '/' + inputElm.files.length + ' - ' + file.name;

			let formData = new FormData();
			formData.append('parentDir', localStorage.getItem('currentDir'));
			formData.append("file", file);

			let req = new XMLHttpRequest();
			req.open('POST', './app/server/ct-upload.php', true);

			req.upload.onprogress = (e) => {
				UI.progressBar.querySelector('div').style.width = (Math.round((e.loaded / e.total) * 100)) + '%';
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
						() => toogleProgressBar(),
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

const openFile = filename => {

	ajaxPost(
		{
			script: 'ct-open.php',
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
	.catch(error => ajaxLog('openFile', error));

};

const renameElm = (oldName, newName, elm) => {

	if(newName.length >= 1) {

		if(oldName !== newName) {
			
			ajaxPost(
				{
					script: 'ct-rename.php',
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
				response => {
					if(response === 'success') {
						browseDirectory(localStorage.getItem('currentDir'));
					}
					else if(response === 'duplicate') {
						setPop('warning', lab.pop.duplicateContent);
						elm.value = oldName;
					}
					else {
						throw new Error(response);
					}
				}
			)
			.catch(error => ajaxLog('renameElm', error));

		}

	}

	else {
		elm.value = oldName;
	}

};

const downloadElm = elm => {

	ajaxPost(
		{
			script: 'ct-download.php',
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

const removeElm = elm => {

	if(validConfirmClick() || validConfirmTouch()) {

		ajaxPost(
			{
				script: 'ct-remove.php',
				args: [
					{ 
						name: 'elm', 
						value: elm 
					}
				]
			}
		)
		.then(
			response => {
				if(response === 'success') {
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