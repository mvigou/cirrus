<?php 

/* 
Server side job : upload one or many files in parentDir.
Return : 'success' if done.
Called by : async.js.
*/

// TO DO : What about security ? Limitations ?

if(isset($_POST['parentDir']) && isset($_FILES)) {

	require_once('./config.php');
	require_once('./async-functions.php');

	if(inDatasDirectory($_POST['parentDir'])) {

		foreach($_FILES as $file) {
	
			move_uploaded_file($file['tmp_name'], $_POST['parentDir'] . '/' . $file['name']);
	
		}

	}

}