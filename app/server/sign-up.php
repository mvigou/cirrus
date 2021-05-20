<?php if(
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
			$authFilePath = '../../datas/auth/sign-up-as-owner/' . $_POST['auth'];
			$userDirPath = OWNERS_DIR;
		}
		else if($_POST['role'] === 'publisher') {
			$authFilePath = '../../datas/auth/sign-up-as-publisher/' . $_POST['auth'];
			$userDirPath = PUBLISHERS_DIR;
		}
		else if($_POST['role'] === 'viewer') {
			$authFilePath = '../../datas/auth/sign-up-as-viewer/' . $_POST['auth'];
			$userDirPath = VIEWERS_DIR;
		}
		if($authFilePath !== null){
			if(is_file($authFilePath)) {
				$userName = $_POST['user-name'];
				if(
					!is_file(OWNERS_DIR . '/' . $userName) &&
					!is_file(PUBLISHERS_DIR . '/' . $userName) &&
					!is_file(VIEWERS_DIR . '/' . $userName)
				) {
					$hashPassword = password_hash($_POST['user-pass'], PASSWORD_BCRYPT);
					$userFileName = $userDirPath . '/' . $userName;
					touch($userFileName);
					file_put_contents($userFileName, $hashPassword);
					unlink($authFilePath);
					header('Location: ../../');
					exit();
				}
				else {
					header('Location: ../../pages/sign-up/?role=' . $_POST['role'] . '&auth=' . $_POST['auth'] . '&error=user-exists');
					exit();
				}
			}
		}
	}
}
header('Location: ../../');
exit();