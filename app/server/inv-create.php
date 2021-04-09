<?php

require_once('./cir-config.php');
require_once('./cir-security.php');

if(verifyAccess()) {

	$auth = hash('sha512', random_bytes(24));

	if(touch(SIGN_UP_VIEWER_AUTH_DIR . '/' . $auth)) {
		echo '../../pages/sign-up/?role=viewer&auth=' . $auth;
		
	}

}