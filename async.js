// Ask the server to browse the contents of the selected directory, then build it.
function browseDirectory(dir) {
	
	if(dir == undefined || !inScopeDirectory(dir)) {
		dir = DATAS_DIR_PATH;    
	}
		
	let req = new XMLHttpRequest();
	req.open('GET', './async-browse-dir.php?dir=' + encodeURIComponent(dir), true);

	req.onload = () => {
		buildItems(JSON.parse(req.responseText));
		buildTree (dir);
	};

	req.send(null);




	
	
	
	// Global
	currentDir = dir;
	switchParentDir();
	
}

function createDirectory(dirName = null) {

// nom valide ou pas ?

	if(dirName === null) {
		
		dial(
			'<label for="input">' + lab.createNewdir + '</label>' +
			'<input type="text" id="input"/>' +
			'<button class="dial__button" onclick="createDirectory(this.previousSibling.value)">' + lab.button.confirm + '</button>' +
			'<button class="dial__button" onclick="dial()">' + lab.button.cancel + '</button>'
		);	
		
	}
	
	else {
		
		let req = new XMLHttpRequest();
		req.open('GET', './async-create-dir.php?dir=' + encodeURIComponent(currentDir) + '&newDir=' + dirName, true);

		req.onload = () => {
			
			let state = req.responseText; 

			switch(state) {

				case 'success':
					browseDirectory(currentDir.slice(0, currentDir.lastIndexOf('/')));
					dial();
					break;
				default:
					dial(
						'<p>' + lab.error + '</p>' +
						'<button onclick="dial()">' + lab.button.close + '</button>'			
					);
					break;

			}
		
		};

		req.send(null);

	}

}

// Ask the server to move a file from the ./datas directory to the ./recycle directory.
function removeFile(file, confirm = false) {

	if(!file == undefined || inScopeDirectory(file)) {      
		
		let req = new XMLHttpRequest();
		req.open('GET', './async-remove-file.php?file=' + encodeURIComponent(file) + '&confirm=' + confirm, true);

		req.onload = () => {
			
			let state = req.responseText;

			switch(state) {
			
				case 'move':
					dial(
						'<p>' + lab.toRecycleMove + '</p>' +
						'<button class="dial__button dial__button--danger" onclick="removeFile(this.value, true)" value="' + file + '">' + lab.button.confirm + '</button>' +
						'<button class="dial__button" onclick="dial()">' + lab.button.cancel + '</button>'
					);		
					break;
				case 'remove':
					dial(
						'<p>' + lab.toRecycleRemove + '</p>' +
						'<button class="dial__button dial__button--danger" onclick="removeFile(this.value, true)" value="' + file + '">' + lab.button.confirm + '</button>' +
						'<button class="dial__button" onclick="dial()">' + lab.button.cancel + '</button>'
					);	
				
				break;
				case 'overwrite':
					dial(
						'<p>' + lab.toRecycleOverwrite + '</p>' +
						'<button class="dial__button dial__button--danger" onclick="removeFile(this.value, true)" value="' + file + '">' + lab.button.confirm + '</button>' +
						'<button class="dial__button" onclick="dial()">' + lab.button.cancel + '</button>'
					);
				break;
				case 'success':
					browseDirectory(file.slice(0, file.lastIndexOf('/')));
					dial();
					break;
				case 'failure':
					dial(
						'<p>' + lab.error + '</p>' +
						'<button onclick="dial()">' + lab.button.close + '</button>'			
					);
					break;

			}			
			
		};

		req.send(null);

	}

}

// Ask the server to create a zip to download from the selected directory.
function downloadDirectory(dir) {

	if(!dir == undefined || inScopeDirectory(dir)) {   

		let req = new XMLHttpRequest();
		req.open('GET', './async-build-zip.php?dir=' + encodeURIComponent(dir), true);
	
		req.onload = () => {

			if(req.responseText !== 'failure') {

				let pathToZip = req.responseText;

				// Offers the download of the generated zip.
				let aElm = document.createElement('a');
				aElm.href = pathToZip;
				aElm.click();

			}				
			
		};
		
		req.send(null);

	}

}