<?php

require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {

	if(isset($_POST['role'])) {

		$role = null;

		if($_POST['role'] === 'publisher') {
			$role = SIGN_UP_PUBLISHER_AUTH_DIR;
		}

		else if($_POST['role'] === 'viewer') {
			$role = SIGN_UP_VIEWER_AUTH_DIR;
		}

		if($role !== null) {

			$auths = array_diff(scandir($role), array('.', '..'));
			$response = array();
		
			foreach($auths as $auth) {
				array_push($response, '../../pages/sign-up/?role=' . $_POST['role'] . '&auth=' . $auth);
			}
			
			echo json_encode($response);

		}

	}

}