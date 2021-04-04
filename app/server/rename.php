<?php

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

/* 
Job : rename a file or a directory.
Return : success if it's done.
To : renameElm
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {

	if(isset($_POST['oldName']) && isset($_POST['newName']) && isset($_POST['parentDir'])) {

        define('OLD_PATH', $_POST['parentDir'] . '/' . $_POST['oldName']);
        define('NEW_PATH', $_POST['parentDir'] . '/' . buildValidName($_POST['newName']));

        if(!is_file(NEW_PATH) && !is_dir(NEW_PATH)) {
            if(rename(OLD_PATH, NEW_PATH)) {
                echo 'success';
            }
        }

        else {
            echo 'duplicate';
        }

    }

}