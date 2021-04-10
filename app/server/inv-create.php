<?php

require_once('./config.php');

if(verifyAccess() && $_SESSION['isOwner'] === true) {

	if(isset($_POST['role'])) {

		$auth = hash('sha512', random_bytes(24));
		$role = null;

		if($_POST['role'] === 'publisher') {
			$role = SIGN_UP_PUBLISHER_AUTH_DIR . '/' . $auth;
		}

		if($_POST['role'] === 'viewer') {
			$role = SIGN_UP_VIEWER_AUTH_DIR . '/' . $auth;
		}

		if($role !== null) {

			if(touch($role)) {
				echo '../../pages/sign-up/?role=' . $_POST['role'] . '&auth=' . $auth;
			}

		}
	
	}

}