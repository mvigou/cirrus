<?php session_start();

/* 
Server side job : create a new directory in the current directory.
Return : 'success' if done.
Called by : /app/js/functions.js.
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {

	if(isset($_POST['parent']) && inScopeDirectory($_POST['parent'])) {

		if(isset($_POST['dir'])) {
			
			echo mkdir($_POST['parent'] . '/' . buildValidName($_POST['dir'])) ? 'success' : error_get_last()['message'];

		}

	}
}