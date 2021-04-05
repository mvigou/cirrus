<?php 

// Allow to create an user. Will only work if there is no user yet.
if(!is_dir('../../users')) {
	define('AUTH_DIR_PATH', '../../auth/createUser');
	define('AUTH_FILENAME', hash('sha512', 'install-start-auth'));
	
	if(!is_dir(AUTH_DIR_PATH)) {
		if(mkdir(AUTH_DIR_PATH, 0777, true)) {
			touch(AUTH_DIR_PATH . '/' . AUTH_FILENAME);
		}
	}
	
	header('Location: /app/pages/sign-in/?auth=' . AUTH_FILENAME);
	exit();
	
}

header('Location: /');
exit();