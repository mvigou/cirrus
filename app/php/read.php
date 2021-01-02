<?php session_start();

/* 
Server side job : if the user is authenticated, copy the resquest file in a random, temporary and unprotected directory.
Return : a redirection to the accessible file. 
Called by : .htaccess by handling the request URI.
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {
	
	$filename = array_slice(explode( '/', urldecode($_SERVER['REQUEST_URI'])), -1)[0];
	$origPath = '../../' . urldecode($_SERVER['REQUEST_URI']); // Permanent path (protected by .htaccess, inaccessible to users).
	$readableDir = TEMP_DIR_PATH . '/' . session_id();
	$destPath = $readableDir . '/' . $filename; // Random and temporary path (accessible to users).

	if(!is_dir($readableDir)) {
		mkdir($readableDir);
	}

	copy($origPath, $destPath);
	header('Location: ../../' . $destPath);
	
}