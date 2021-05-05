<?php if(isset($_POST['user-name']) && isset($_POST['user-pass']) ){
	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass'])		
	){
		require('./config.php');
		$userName = $_POST['user-name'];
		$userFilePath = null;
		$userRole = null;
		if(file_exists(OWNERS_DIR . '/' . $userName)) {
			$userFilePath = OWNERS_DIR . '/' . $userName;
			$userRole = 'owner';
		}
		else if(file_exists(PUBLISHERS_DIR . '/' . $userName)) {
			$userFilePath = PUBLISHERS_DIR . '/' . $userName;
			$userRole = 'publisher';
		}
		else if(file_exists(VIEWERS_DIR . '/' . $userName)) {
			$userFilePath = VIEWERS_DIR . '/' . $userName;
			$userRole = 'viewer';
		}
		if($userFilePath !== null) {				
			if(password_verify($_POST['user-pass'], file_get_contents($userFilePath))) {	
				$_SESSION['username'] = $_POST['user-name'];
				$_SESSION['token'] = session_id();
				$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];
				$_SESSION['role'] = $userRole;
			}
			else {
				header('Location: ../../pages/sign-in/?&error=wrong-password');
				exit();
			}	
		}
		else {
			header('Location: ../../pages/sign-in/?&error=user-not-found');
			exit();
		}
		clearTempDir();
	}
}
header('Location: ../../');
exit();