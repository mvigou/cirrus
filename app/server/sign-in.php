<?php 
session_start();

if(isset($_POST['user-name']) && isset($_POST['user-pass']) ){
	if(
		preg_match('/^[a-zA-Z0-9]{8,16}$/', $_POST['user-name']) &&
		preg_match('/^[a-zA-Z0-9.?!\-_*+=\/|\\()[\]#$@%]{8,24}$/', $_POST['user-pass'])		
	){
		$env = json_decode(file_get_contents('../../datas/env.json'));
		$userName = $_POST['user-name'];
		$userFilePath = null;
		$userRole = null;
		if(file_exists($env->ownersDir . '/' . $userName)) {
			$userFilePath = $env->ownersDir . '/' . $userName;
			$userRole = 'owner';
		}
		else if(file_exists($env->publishersDir . '/' . $userName)) {
			$userFilePath = $env->publishersDir . '/' . $userName;
			$userRole = 'publisher';
		}
		else if(file_exists($env->viewersDir . '/' . $userName)) {
			$userFilePath = $env->viewersDir . '/' . $userName;
			$userRole = 'viewer';
		}
		if($userFilePath !== null) {				
			if(password_verify($_POST['user-pass'], file_get_contents($userFilePath))) {
				$_SESSION['token'] = session_id();
				$_SESSION['instanceId'] = $env->instanceId;
				$_SESSION['role'] = $userRole;
				$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];
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
		require_once('./remove-item.php');
		removeDir($env->tempDir);
	}
}
header('Location: ../../');
exit();