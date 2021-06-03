<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['dirPath'], $_POST['isRestricted'], $_POST['areAccredited'])) {
		if(inScopeDirectory($_POST['dirPath']) && ($_POST['isRestricted'] === 'true' || $_POST['isRestricted'] === 'false')) {
			$permsPath = $_POST['dirPath'] . '/' . $env->PermsFileName;	
			$perms = json_decode(file_get_contents($permsPath)); 
			$areAccredited = preg_split('/\r\n|[\r\n]/', $_POST['areAccredited']);
			file_put_contents(
				$permsPath,
				json_encode(
					array (
						'isRestricted' => $_POST['isRestricted'],
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