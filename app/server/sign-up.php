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
				$authFilePath = "../../datas/auth/sign-up-as-owner/{$_POST['auth']}";
				$userDirPath = '../../datas/users/owners';
				break;
			case 'publisher';
				$authFilePath = "../../datas/auth/sign-up-as-publisher/{$_POST['auth']}";
				$userDirPath = '../../datas/publishers/owners';
				break;
			case 'viewer';
				$authFilePath = "../../datas/auth/sign-up-as-viewer/{$_POST['auth']}";
				$userDirPath = '../../datas/users/viewers';
				break;	
		}
		if($authFilePath !== null){
			if(is_file($authFilePath)) {
				$userName = $_POST['user-name'];
				if(
					!is_file("../../datas/users/owners/{$userName}") &&
					!is_file("../../datas/users/publishers/{$userName}") &&
					!is_file("../../datas/users/viewers/{$userName}")
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