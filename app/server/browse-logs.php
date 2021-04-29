<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	echo json_encode (
		array(
		'success' => true,
		'content' => file_get_contents(LOGS_DIR . '/app.json')
		)
	);
}