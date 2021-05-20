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
			$content = array();
			if(count($auths) > 0) {
				foreach($auths as $auth) {
					array_push(
						$content, array(
							"url" => '../../pages/sign-up/?role=' . $role . '&auth=' . $auth
						)
					);
				}
			}
			if(error_get_last() === null) {
				echo json_encode (
					array(
						'success' => true,
						'content' => $content
					)
				);
			}
		}
	}
}