<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	file_put_contents(LOGS_DIR . '/app.json', '[]');
    echo json_encode (array('success' => true ));
}