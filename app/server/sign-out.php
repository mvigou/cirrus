<?php require_once('./config.php');

if(isAuthenticated()) {
    $_SESSION = array();
    if(empty($_SESSION)) {
        echo json_encode(array("success" => true));
    }
}