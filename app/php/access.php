<?php session_start();

/* 
Server side job : if the user is authenticated, copy the resquest file in a random, temporary and unprotected directory.
Return : a redirection to the accessible file. 
Called by : /app/js/functions.js.
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {

	if(isset($_POST['filename'])) {
		
		$filename = array_slice(explode( '/', $_POST['filename']), -1)[0];
		$origPath = $_POST['filename']; // Permanent path (protected by .htaccess, inaccessible to users).
		$readableDir = TEMP_DIR_PATH . '/' . session_id();
		$destPath = $readableDir . '/' . $filename; // Random and temporary path (accessible to users).

		if(!is_dir($readableDir)) {
			mkdir($readableDir);
		}

		copy($origPath, $destPath);
		echo $destPath;

	}
	
}