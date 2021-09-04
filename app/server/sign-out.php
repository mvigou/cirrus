<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
    $_SESSION = array();
    if(empty($_SESSION)) {    
        echo json_encode(array('success' => true));
    }
}