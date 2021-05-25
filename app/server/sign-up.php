<?php if(
	isset(
		$_POST['user-name'], 
		$_POST['user-pass'], 
		$_POST['user-pass-conf'], 
		$_POST['role'], 
		$_POST['auth']
	)
){
	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass']) &&
		$_POST['user-pass'] === $_POST['user-pass-conf'] &&
		strlen($_POST['auth']) === 128	
	){
		$env = json_decode(file_get_contents('../../datas/env.json'));
		$authFilePath = null;
		$userDirPath;		
		switch($_POST['role']) {
			case 'owner';
				$authFilePath = $env->signUpOwnerAuthDir . '/' . $_POST['auth'];
				$userDirPath = $env->ownersDir;
				break;
			case 'publisher';
				$authFilePath = $env->signUpPublisherAuthDir . '/' . $_POST['auth'];
				$userDirPath = $env->publishersDir;
				break;
			case 'viewer';
				$authFilePath = $env->signUpViewerAuthDir . '/' . $_POST['auth'];
				$userDirPath = $env->viewersDir;
				break;	
		}
		if($authFilePath !== null){
			if(is_file($authFilePath)) {
				$userName = $_POST['user-name'];
				if(
					!is_file($env->ownersDir . '/' . $userName) &&
					!is_file($env->publishersDir . '/' . $userName) &&
					!is_file($env->viewersDir . '/' . $userName)
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