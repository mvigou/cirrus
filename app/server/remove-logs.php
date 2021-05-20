<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
    file_put_contents(LOGS_DIR . '/app.txt', ''); 
    if(error_get_last() === null) {
        echo json_encode (array('success' => true ));
    }
}