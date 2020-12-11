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

}

// Ask the server to move a file from the ./datas directory to the ./trash directory.
function removeFile(file) {

	if(!file == undefined || inScopeDirectory(file)) {      
		
		if(confirm(labels.confirmDel)) {

			let req = new XMLHttpRequest();
			req.open('GET', './async-remove-file.php?file=' + encodeURIComponent(file), true);
			
			req.onload = () => {

				if(req.responseText === 'success') {

					browseDirectory(file.slice(0, file.lastIndexOf('/')));

				}				
				
			};
			
			req.send(null);

		}
				
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