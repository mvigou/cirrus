<?php if(
	isset($_POST['user-name']) && 
	isset($_POST['user-pass']) && 
	isset($_POST['user-pass-conf'])
){

	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass']) &&
		$_POST['user-pass'] === $_POST['user-pass-conf']
			
	){
		
		require('./config.php');
	
		mkdir(DATAS_DIR_PATH);
		mkdir(RECYCLE_DIR_PATH);
		mkdir(USERS_DIR_PATH);
		
		define('USERNAME', hash('md5', $_POST['user-name']));
		define('PASSWORD', password_hash($_POST['user-pass'], PASSWORD_BCRYPT));
		define('FILENAME', USERS_DIR_PATH . '/' . USERNAME);

		// Save user.
		touch(FILENAME);
		file_put_contents(FILENAME, PASSWORD);

		// Delete installation files.
		unlink('../../index.html');
		unlink('./install.php');
		rename('./app.php', '../../index.php');
	
	}

}

header('Location: /');