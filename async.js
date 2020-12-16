function ajaxManager(script, args, callback) {

	let url = './' + script + '.php?';
	
	for(let arg of args) {
		url += arg.name + '=' + encodeURIComponent(arg.value) + '&';
	}
	
	let req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onload = () => callback(req.responseText);
	req.send(null);

}

function ajaxErrorHandler(error) {

	dial(
		'<p>' + lab.error + '<i>' + error + '</i></p>' +
		'<button onclick="dial()">' + lab.button.close + '</button>'			
	);

}

function browseDirectory(dir) {
	
	if(dir == undefined || !inScopeDirectory(dir)) {
		dir = DATAS_DIR_PATH;    
	}

	currentDir = dir;

	ajaxManager(
		// Script.
		'async-browse-dir',
		// Arguments.
		[{ name: 'dir', value: dir }],
		// Callback.
		(response) => {
			buildItems(response);
			buildTree(dir);
		}
	);

}

function createDirectory(dir = null) {

	// No name for directory ? Ask for it first.
	if(dir === null) {
		
		dial(
			'<label for="input">' + 
				lab.action.nameNewdir + 
			'</label>' +
			'<input type="text" id="input" />' +
			'<button class="dial__bt" onclick="createDirectory(this.previousSibling.value)">' + 
				lab.button.confirm + 
			'</button>' +
			'<button class="dial__bt" onclick="dial()">' +
				lab.button.cancel +
			'</button>'
		);	
		
	}
	
	// Name provided ? Proceed.
	else {

		ajaxManager(
			// Script.
			'async-create-dir',
			// Arguments.
			[{ name: 'parent', value: currentDir },{ name: 'dir', value: dir }],
			// Callback.
			(response) => {
				if(response === 'success') {
					browseDirectory(currentDir);
					dial();
				}
				else {
					ajaxErrorHandler(response);
				}
			}
		);

	}

}

function removeElm(elm, confirm = false) {

	// Confirm is false ? Ask for an user confirmation first.
	if(!confirm) {
		
		let label ='';

		if(inDataDirectory(elm)) {
			label = lab.action.moveToRecycle;
		}

		else if(inRecycleDirectory(elm)) {
			
			if(elm === RECYCLE_DIR_PATH) {
				label = lab.action.emptyRecycle;
			}

			else {
				label = lab.action.removePermanently;
			}

		}
		
		dial(
			'<p>' + label + '</p>' +
			'<button class="dial__bt dial__bt--danger" onclick="removeElm(\'' + elm + '\', true)">' + 
				lab.button.confirm + 
			'</button>' +
			'<button class="dial__bt" onclick="dial()">' + 
				lab.button.cancel + 
			'</button>'
		);	

	}

	// Confirm is true ? Proceed.
	else {

		ajaxManager(
			// Script.
			'async-remove',
			// Arguments.
			[{ name: 'elm', value: elm }],
			// Callback.
			(response) => {
				if(response === 'success') {
					browseDirectory(currentDir);
					dial();
				}
				else {
					ajaxErrorHandler(response);
				}		
			}
		);

	}

}

function downloadDirectory(dir) {

	if(!dir == undefined || inScopeDirectory(dir)) {   

		ajaxManager(
			// Script.
			'async-build-zip',
			// Arguments.
			[{ name: 'dir', value: dir }],
			// Callback.
			(pathToZip) => {
				if(pathToZip !== 'failure') {
					// Offers the download of the generated zip.
					let aElm = document.createElement('a');
					aElm.href = pathToZip;
					aElm.click();
				}	
			}
		);

	}

}