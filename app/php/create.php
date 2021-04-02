<?php 

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

/* 
Job : create a new directory in the current directory.
Return : absolutely nothing if it's done.
To : createDirectory
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {
	if(isset($_POST['parent']) && inScopeDirectory($_POST['parent'])) {
		if(isset($_POST['dir'])) {
			mkdir($_POST['parent'] . '/' . buildValidName($_POST['dir']));
		}
	}
}