<?php 

/* 
Job : copy the request file in a random, temporary and unprotected directory.
Return : a JSON with the redirection to the accessible file. 
To : openFile
*/

require_once('./cir-config.php');
require_once('./cir-security.php');

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