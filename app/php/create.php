<?php 

/* 
Server side job : create a new directory in the current directory.
Return : 'success' if done.
Called by : async.js.
*/

require_once('./config.php');
require_once('./functions.php');

if(isset($_GET['parent']) && inScopeDirectory($_GET['parent'])) {
	if(isset($_GET['dir'])) {
		echo mkdir($_GET['parent'] . '/' . $_GET['dir']) ? 'success' : error_get_last()['message'];
	}
}