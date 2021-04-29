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
			$newAuth = hash('sha512', random_bytes(24));
			$state = 'failure';
			if(touch($authsDir . '/' . $newAuth)) {
				$state = 'success';
				$url = '../../pages/sign-up/?role=' . $_POST['role'] . '&auth=' . $newAuth;
				echo json_encode (
					array(
						'success' => true,
						'content' => '<a href="' . $url . '">' . $url . '</a>'
					)
				);
			}
		}
	}
}