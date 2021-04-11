<?php

if(
	isset($_POST['user-name']) && 
	isset($_POST['user-pass'])
){
	
	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass'])		
	){

		require('./config.php');
		$hashUserName = hash('sha512', $_POST['user-name']);
		$userFilePath = null;
		$userRole = null;

		if(file_exists(OWNERS_DIR . '/' . $hashUserName)) {
			$userFilePath = OWNERS_DIR . '/' . $hashUserName;
			$userRole = 'owner';
		}
		else if(file_exists(PUBLISHERS_DIR . '/' . $hashUserName)) {
			$userFilePath = PUBLISHERS_DIR . '/' . $hashUserName;
			$userRole = 'publisher';
		}
		else if(file_exists(VIEWERS_DIR . '/' . $hashUserName)) {
			$userFilePath = VIEWERS_DIR . '/' . $hashUserName;
			$userRole = 'viewer';
		}
		
		if($userFilePath !== null) {				
			if(password_verify($_POST['user-pass'], file_get_contents($userFilePath))) {	
				$_SESSION['token'] = session_id();
				$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];
				$_SESSION['role'] = $userRole;
			}	
		}
		
	}
	
}

clearTempDir();
header('Location: ../../');
exit();