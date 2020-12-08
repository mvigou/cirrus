function saveFolder(dir) {

	let req = new XMLHttpRequest();
	req.open('GET', '/static/php/async-buildZip.php?dir=' + dir, true);
	req.onload = () => {



	};
	req.send(null);

}
