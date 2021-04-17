<?php 

/* 
Job : upload one or many files in parentDir.
Return : absolutely nothing if it's done.
To : uploadItems
*/

require_once('./config.php');

if(isAuthenticated()) {
	if(hasWritingRights()) {
		if(isset($_POST['parentDir']) && isset($_FILES)) {
			if(inDatasDirectory($_POST['parentDir'])) {
				move_uploaded_file(
					$_FILES['file']['tmp_name'], 
					$_POST['parentDir'] . '/' . buildValidName($_FILES['file']['name'])
				);
			}
		}
	}
}