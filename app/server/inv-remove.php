<?php

require_once('./config.php');

if(verifyAccess()) {

	if(isset($_POST['role'])) {

		$role = null;

		if($_POST['role'] === 'owner') {
			$role = SIGN_UP_OWNER_AUTH_DIR;
		}

		if($_POST['role'] === 'viewer') {
			$role = SIGN_UP_VIEWER_AUTH_DIR;
		}

		if($role !== null) {

			$auths = array_diff(scandir($role), array('.', '..'));
			$response = array();
		
			foreach($auths as $auth) {
				unlink($role . '/' . $auth);
			}
			
		}

	}

}