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