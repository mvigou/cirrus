<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['role'])) {
		$role = $_POST['role'];
		if($role === 'publisher') {
			$authsDir = '../../datas/auth/sign-up-as-publisher';
		}
		else if($role === 'viewer') {
			$authsDir = '../../datas/auth/sign-up-as-viewer';
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