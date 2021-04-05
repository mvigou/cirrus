<?php 

	// Allow to create an user. Will only work if there is no user yet.
	if(!is_dir('./app/users')) {

		define('AUTH_DIR_PATH', './app/auth/createUser');
		define('AUTH_FILENAME', hash('sha512', 'install-start-auth'));
		
		if(!is_dir(AUTH_DIR_PATH)) {
			if(mkdir(AUTH_DIR_PATH, 0777, true)) {
				touch(AUTH_DIR_PATH . '/' . AUTH_FILENAME);
			}
		}
	
		header('Location: /app/client/sign-in/?auth=' . AUTH_FILENAME);	

	}

	// Will automatically delete installation files and redirect to the login page.
	else {

		rename('./index.php', './install.php');
		rename('./app.php', './index.php');
		unlink('./install.php');
		header('Location: /app/client/log-in');	

	}