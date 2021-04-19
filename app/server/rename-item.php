<?php

require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {

	if(isset($_POST['oldName']) && isset($_POST['newName']) && isset($_POST['parentDir'])) {

		$oldPath = $_POST['parentDir'] . '/' . $_POST['oldName'];
		$newPath = $_POST['parentDir'] . '/' . buildValidName($_POST['newName']);

		if(!is_file($newPath) && !is_dir($newPath)) {
			if(rename($oldPath, $newPath)) {
				$state = 'success';
			}
		}

		else {
			$state = 'duplicate';
		}

		if(isset($state)) {
			echo json_encode(
				array(
					'state' => $state
				)
			);
		}

	}

}