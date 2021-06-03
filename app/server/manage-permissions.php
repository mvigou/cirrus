<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['dirPath'], $_POST['isRestricted'], $_POST['areAccredited'])) {
		if(inScopeDirectory($_POST['dirPath']) && ($_POST['isRestricted'] === 'true' || $_POST['isRestricted'] === 'false')) {
			$permsPath = $_POST['dirPath'] . '/.perms';	
			$perms = json_decode(file_get_contents($permsPath)); 
			$areAccredited = preg_split('/\r\n|[\r\n]/', $_POST['areAccredited']);
			
		

			// If the access to the directory is restricted, add a .lock file ; else remove it.
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
			
			
			file_put_contents(
				$permsPath,
				json_encode(
					array (
						'areAccredited' => $areAccredited
					)
				)
			);
			if(error_get_last() === null) {
				echo json_encode (array('success' => true));
			}
		}
	}
}