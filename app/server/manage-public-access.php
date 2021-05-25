<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['action'])) {
		$auths = scandir($env->signUpVisitorAuthDir);
		switch($_POST['action']) {
			case 'browse':
			case 'create':
				// Only if there is no public access link yet (content directory : '.' and '..').
				if($_POST['action'] === 'create' && count($auths) === 2) {
					$newAuth = hash('sha512', random_bytes(24));
					touch($env->signUpVisitorAuthDir . '/' . $newAuth);
					$auths = scandir($env->signUpVisitorAuthDir);
				}
				// Return the existing link OR the new link OR an empty string.
				$content;
				if(strlen($auths[2]) === 128) {
					$content = array(
						'../../pages/sign-in/?&auth=' . $auths[2]
					);
				}
				if(error_get_last() === null) {
					echo json_encode (
						array(
							'success' => true,
							'content' => $content
						)
					);
					return;
				}
				break;
			case 'remove':
				if(count($auths) === 3) {
					unlink($env->signUpVisitorAuthDir . '/' . $auths[2]);
					if(error_get_last() === null) {
						echo json_encode(array('success' => true));
					}
					return;
				}
				break;
		}
		echo json_encode (array('success' => true));
	}
}