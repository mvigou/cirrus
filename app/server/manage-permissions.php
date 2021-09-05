<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isOwner()) {
	if(isset($_POST['dirPath'], $_POST['isRestricted'], $_POST['accreditedMembers'])) {
		if(inDataDir($_POST['dirPath']) && ($_POST['isRestricted'] === 'true' || $_POST['isRestricted'] === 'false')) {
			// Create or remove a .lock file to restrict access directory.
			$isRestricted = $_POST['isRestricted'] === 'true' ? true : false;
			$lockFilePath = $_POST['dirPath'] . '/.lock';
			if($isRestricted) {
				if(!is_file($lockFilePath)) {
					touch($lockFilePath);
				}
			}
			else {
				if(is_file($lockFilePath)) {
					unlink($lockFilePath);
				}	
			}
			// Create, modify or remove a .perms file to allow some users to access directory.
			$permsPath = $_POST['dirPath'] . '/.perms';
			if($isRestricted) {
				if($_POST['accreditedMembers'] !== '') {
					$accreditedMembers = preg_split('/\r\n|[\r\n]/', $_POST['accreditedMembers']);
					file_put_contents($permsPath, json_encode($accreditedMembers));
				}
				else {
					if(file_exists($permsPath)) {
						unlink($permsPath);
					}
				}
			}
			else {
				if(file_exists($permsPath)) {
					unlink($permsPath);
				}
			}
			if(error_get_last() === null) {
				echo json_encode (array('success' => true));
			}
		}
	}
}