<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['oldName']) && isset($_POST['newName']) && isset($_POST['parentDir'])) {
		$fromPath = $_POST['parentDir'] . '/' . $_POST['oldName'];
		$toPath = $_POST['parentDir'] . '/' . buildValidName($_POST['newName']);
		if(is_file($toPath) || is_dir($toPath)) {
			$basePath = $toPath; 
			$i = 1;
			while(is_file($toPath) || is_dir($toPath)) {
				$toPath = $basePath;
				$toPath .= '(' . $i . ')';
				$i++;
			}
		}
		if(rename($fromPath, $toPath)) {
			echo json_encode(array('success' => true));
		}
	}
}