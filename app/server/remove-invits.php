<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['role'])) {
		$role = $_POST['role'];
		if($role === 'publisher') {
			$authsDir = SIGN_UP_PUBLISHER_AUTH_DIR;
		}
		else if($role === 'viewer') {
			$authsDir = SIGN_UP_VIEWER_AUTH_DIR;
		}
		if(isset($authsDir)) {
			$auths = array_diff(scandir($authsDir), array('.', '..'));
			foreach($auths as $auth) {
				unlink($authsDir . '/' . $auth);
			}
			echo json_encode(array('success' => true));
		}
	}
}