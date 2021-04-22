<?php require_once('./config.php');

if(isset($_POST['role'])) {
	if(isAuthenticated() && hasOwnerRights()) {
		$role = $_POST['role'];
		if($role === 'publisher') {
			$authsDir = SIGN_UP_PUBLISHER_AUTH_DIR;
		}
		else if($role === 'viewer') {
			$authsDir = SIGN_UP_VIEWER_AUTH_DIR;
		}
		if(isset($authsDir)) {
			$auths = array_diff(scandir($authsDir), array('.', '..'));
			$state = '';
			if(count($auths) > 0) {
				foreach($auths as $auth) {
					unlink($authsDir . '/' . $auth);
				}
				$state = "success";
			}
			else {
				$state = "empty";
			}
			echo json_encode(array('state' => $state));
		}
	}
}