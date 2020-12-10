// Check if the user is in his data directory.
function inScopeDir(file) { 
	return file.match(/^\.\/datas/) ? true : false;
}

function removeFile(file) {

	if(!file == undefined || inScopeDir(file)) {      
		
		if(confirm('Déplacer vers la corbeille ?')) {

			let req = new XMLHttpRequest();
			req.open('GET', './remove.php?file=' + encodeURIComponent(file), true);
			
			req.onload = () => {

				if(req.responseText === 'success') {

					browseDirectory(file.slice(0, file.lastIndexOf('/')));

				}				
				
			};
			
			req.send(null);

		}
		
		
	}

}