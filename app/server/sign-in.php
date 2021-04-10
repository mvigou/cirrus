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
		$isOwner = false;
		$userFilePath = null;

		if(file_exists(OWNERS_DIR . '/' . $hashUserName)) {
			$userFilePath = OWNERS_DIR . '/' . $hashUserName;
			$isOwner = true;
		}
		else if(file_exists(PUBLISHERS_DIR . '/' . $hashUserName)) {
			$userFilePath = PUBLISHERS_DIR . '/' . $hashUserName;
		}
		else if(file_exists(VIEWERS_DIR . '/' . $hashUserName)) {
			$userFilePath = VIEWERS_DIR . '/' . $hashUserName;
		}
		
		if($userFilePath !== null) {				
			if(password_verify($_POST['user-pass'], file_get_contents($userFilePath))) {	
				$_SESSION['token'] = session_id();
				$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];
				if($isOwner) {
					$_SESSION['isOwner'] = true;
				}
			}	
		}
		
	}
	
}

clearTempDir();
header('Location: ../../');
exit();