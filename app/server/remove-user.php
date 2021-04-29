<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['user-name']) && isset($_POST['user-role'])) {
		if($_POST['user-role'] === 'viewer') {
			$path = VIEWERS_DIR . '/' . $_POST['user-name'];
		}
		else if($_POST['user-role'] === 'publisher') {
			$path = PUBLISHERS_DIR . '/' . $_POST['user-name'];
		}
		if(isset($path)) {
			if(unlink($path)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}