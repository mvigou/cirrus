<?php

/* 
Job : get all active invitations.
Return : a json array of all valid create account url.
To : browseInvit
*/

require_once('./cir-config.php');
require_once('./cir-security.php');

if(verifyAccess()) {

	$auths = array_diff(scandir(SIGN_UP_VIEWER_AUTH_DIR), array('.', '..'));
	$response = array();

	foreach($auths as $auth) {
		unlink(SIGN_UP_VIEWER_AUTH_DIR . '/' . $auth);
	}
	
}