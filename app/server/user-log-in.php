<?php session_start();

if(
	isset($_POST['user-name']) && 
	isset($_POST['user-pass'])
){
	
	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass'])		
	){

		require_once('./config.php');

		define('USERNAME', hash('sha512', $_POST['user-name']));
		define('FILENAME', USERS_DIR_PATH . '/' . USERNAME);
		
		if(file_exists(FILENAME)) {
					
			if(password_verify($_POST['user-pass'], file_get_contents(FILENAME))) {
				
				require_once('./remove.php');
				
				if(!is_dir(TEMP_DIR_PATH)) {
					mkdir(TEMP_DIR_PATH);
				}
				else {
					removeDir(TEMP_DIR_PATH);
				}
				
				createAccess();
			
			}
		}
	}
}

header('Location: /');
exit();