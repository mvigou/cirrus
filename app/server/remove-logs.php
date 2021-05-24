<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
    file_put_contents($env->logsDir . '/app-errors.txt', ''); 
    if(error_get_last() === null) {
        echo json_encode (array('success' => true ));
    }
}