<?php 

/* 
Server side job : upload one or many files in parentDir.
Return : 'success' if done.
Called by : /app/js/functions.js.
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {

	if(isset($_POST['parentDir']) && isset($_FILES)) {

		if(inDatasDirectory($_POST['parentDir'])) {

			foreach($_FILES as $file) {
		
				move_uploaded_file($file['tmp_name'], $_POST['parentDir'] . '/' . $file['name']);
		
			}

		}

	}

}