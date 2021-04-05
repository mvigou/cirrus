<?php if(
	isset($_POST['user-name']) && 
	isset($_POST['user-pass']) && 
	isset($_POST['user-pass-conf']) &&
	isset($_POST['auth'])
){

	define('PATH_AUTH', '../auth/createUser/' . $_POST['auth']);

	if(is_file(PATH_AUTH)) {

		if(
			preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
			preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass']) &&
			$_POST['user-pass'] === $_POST['user-pass-conf']
				
		){

			// TODO Check if there is not user with the same name yet !
			
			require('./config.php');
		
			if(!is_dir(DATAS_DIR_PATH)) {
				mkdir(DATAS_DIR_PATH);
			}
			if(!is_dir(RECYCLE_DIR_PATH)) {
				mkdir(RECYCLE_DIR_PATH);
			}
			if(!is_dir(USERS_DIR_PATH)) {
				mkdir(USERS_DIR_PATH);
			}
			
			define('USERNAME', hash('sha512', $_POST['user-name']));
			define('PASSWORD', password_hash($_POST['user-pass'], PASSWORD_BCRYPT));
			define('FILENAME', USERS_DIR_PATH . '/' . USERNAME);

			// Save user.
			touch(FILENAME);
			file_put_contents(FILENAME, PASSWORD);

			// Delete authorization
			unlink(PATH_AUTH);

		}

	}

}

header('Location: /');
exit();