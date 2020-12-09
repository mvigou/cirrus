function saveFolder(dir) {

	let req = new XMLHttpRequest();
	req.open('GET', '/static/php/async-buildZip.php?dir=' + dir, true);
	req.onload = () => {



	};
	req.send(null);

}

function deleteFile(file, confirm = false) {

	let req = new XMLHttpRequest();
	req.open('GET', '/async-deleteFile.php?file=' + file);

	req.onload = () => {
		console.log(req.responseText);

	};
	req.send(null);

}