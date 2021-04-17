<?php

/* 
Job : rename a file or a directory.
Return : success if it's done.
To : renameItem
*/

require_once('./config.php');

if(isAuthenticated()) {

	if(hasWritingRights()) {

		if(isset($_POST['oldName']) && isset($_POST['newName']) && isset($_POST['parentDir'])) {

			$oldPath = $_POST['parentDir'] . '/' . $_POST['oldName'];
			$newPath = $_POST['parentDir'] . '/' . buildValidName($_POST['newName']);

			if(!is_file($newPath) && !is_dir($newPath)) {
				if(rename($oldPath, $newPath)) {
					echo 'success';
				}
			}

			else {
				echo 'duplicate';
			}

		}

	}

}