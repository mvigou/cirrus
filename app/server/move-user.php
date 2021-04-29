<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['user-name']) && isset($_POST['from-role']) && isset($_POST['to-role'])) {
		if($_POST['from-role'] === 'viewer' && $_POST['to-role'] === 'publisher') {
			$fromPath = VIEWERS_DIR . '/' . $_POST['user-name'];
			$toPath = PUBLISHERS_DIR . '/' . $_POST['user-name'];
		}
		else if($_POST['from-role'] === 'publisher' && $_POST['to-role'] === 'viewer') {
			$fromPath = PUBLISHERS_DIR . '/' . $_POST['user-name'];
			$toPath = VIEWERS_DIR . '/' . $_POST['user-name'];
		}
		if(isset($fromPath) && isset($toPath)) {
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}