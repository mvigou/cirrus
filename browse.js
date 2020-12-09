// Check if the user is in his data directory.
function inScopeDir(dir) { 
	return dir.match(/^\.\/datas/) ? true : false;
}

function browseDirectory(dir) {

	if(dir == undefined || !inScopeDir(dir)) {      
		dir = './datas';    
	}
	
	let req = new XMLHttpRequest();
	req.open('GET', './browse.php?dir=' + encodeURIComponent(dir), true);

	req.onload = () => {
		buildItems(JSON.parse(req.responseText));
		buildTree (dir);
	};

	req.send(null);

}