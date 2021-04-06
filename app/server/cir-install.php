<?php 

require_once('./cir-config.php');

if(!is_dir(USERS_DIR_PATH)) {

	define('AUTH', hash('sha512', 'install-start-auth'));
	
	if(!is_dir(SIGN_UP_AUTH_DIR_PATH)) {
		if(mkdir(SIGN_UP_AUTH_DIR_PATH, 0777, true)) {
			touch(SIGN_UP_AUTH_DIR_PATH . '/' . AUTH);
		}
	}
	
	header('Location: /app/sign-up/?auth=' . AUTH);
	exit();
	
}

header('Location: /');
exit();