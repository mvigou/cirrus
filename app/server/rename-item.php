<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['oldName']) && isset($_POST['newName']) && isset($_POST['parentDir'])) {
		$fromPath = $_POST['parentDir'] . '/' . $_POST['oldName'];
		$toPath = $_POST['parentDir'] . '/' . buildValidName($_POST['newName']);
		while(is_file($toPath) || is_dir($toPath)) {
			$toPath .= '-copy';
		}
		if(rename($fromPath, $toPath)) {
			echo json_encode(
				array(
					'success' => true
				)
			);
		}
	}
}