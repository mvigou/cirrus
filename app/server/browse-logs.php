<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	if($logs = file_get_contents(LOGS_DIR . '/app.txt')) {
		echo json_encode (
			array(
				'success' => true,
				'content' => $logs
			)
		);
	}
}