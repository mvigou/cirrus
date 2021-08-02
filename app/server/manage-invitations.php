<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['role'], $_POST['action'])) {
		if($_POST['role'] === 'publisher') {
			$authsDir = '../../datas/auth/sign-up-as-publisher';
		}
		else if($_POST['role'] === 'viewer') {
			$authsDir = '../../datas/auth/sign-up-as-viewer';
		}
        if(isset($authsDir)) {
            switch($_POST['action']) {
                case 'browse':
                case 'create':
                    if($_POST['action'] === 'create') {
                        $newAuth = hash('sha512', random_bytes(24));
                        touch($authsDir . '/' . $newAuth);                        
                    }
                    $auths = array_diff(scandir($authsDir), array('.', '..'));
                    $content;
                    if(count($auths) > 0) {
                        $content = array();
                        foreach($auths as $auth) {
                            array_push(
                                $content, '../../pages/sign-up/?role=' . $_POST['role'] . '&auth=' . $auth
                            );
                        }
                    }
                    if(error_get_last() === null) {
                        echo json_encode (
                            array(
                                'success' => true,
                                'content' => $content
                            )
                        );
                    }
                    break;
                case 'remove':
                    $auths = array_diff(scandir($authsDir), array('.', '..'));
                    foreach($auths as $auth) {
                        unlink($authsDir . '/' . $auth);
                    }
                    if(error_get_last() === null) {
                        echo json_encode(array('success' => true));
                    }
                    break;
            }
        }
    }
}