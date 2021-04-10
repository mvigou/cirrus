<?php 

if(
	isset($_POST['user-name']) && 
	isset($_POST['user-pass']) && 
	isset($_POST['user-pass-conf']) &&
	isset($_POST['role']) &&
	isset($_POST['auth'])
){

	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass']) &&
		$_POST['user-pass'] === $_POST['user-pass-conf']
			
	){

		require('./config.php');
		$authFilePath = null;
		$userDirPath;

		if($_POST['role'] === 'owner') {
			$authFilePath = SIGN_UP_OWNER_AUTH_DIR . '/' . $_POST['auth'];
			$userDirPath = OWNERS_DIR;
		}
		else if($_POST['role'] === 'viewer') {
			$authFilePath = SIGN_UP_VIEWER_AUTH_DIR . '/' . $_POST['auth'];
			$userDirPath = VIEWERS_DIR;
		}

		if($authFilePath !== null){

			if(is_file($authFilePath)) {

				// TODO Check if there is not user with the same name yet !
				
				$hashUserName = hash('sha512', $_POST['user-name']);
				$hashPassword = password_hash($_POST['user-pass'], PASSWORD_BCRYPT);
				$userFileName = $userDirPath . '/' . $hashUserName;

				touch($userFileName);
				file_put_contents($userFileName, $hashPassword);

				unlink($authFilePath);

			}

		}

	}
	
}

header('Location: ../../');
exit();