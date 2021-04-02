<?php 

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

/* 
Job : copy the request file in a random, temporary and unprotected directory.
Return : a JSON with the redirection to the accessible file. 
To : accessFile
*/

require_once('./config.php');
require_once('./security.php');

if(verifyAccess()) {

	if(isset($_POST['filename'])) {
		
		$filename = array_slice(explode( '/', $_POST['filename']), -1)[0];
		$origPath = $_POST['filename']; // Permanent path (protected by .htaccess, inaccessible for all).
		$readableDir = TEMP_DIR_PATH . '/' . session_id();
		$destPath = $readableDir . '/' . $filename; // Random and temporary path (accessible to users only).

		if(!is_dir($readableDir)) {
			mkdir($readableDir);
		}

		copy($origPath, $destPath);

		echo json_encode(relPathFromClient($destPath));

	}
	
}