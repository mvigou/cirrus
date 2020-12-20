<?php session_start();

/* 
Server side job : if the user is authenticated, copy the resquest file in a random, temporary and unprotected directory.
Return : the redirection to the accessible file. 
Called by : .htaccess by handling the request URI.
*/

// Is the user authenticated ?
if(isset($_SESSION['token'])) {
	
	require_once('./config.php');

	$filename = array_slice(explode( '/', urldecode($_SERVER['REQUEST_URI'])), -1)[0];
	$origPath = '../../' . urldecode($_SERVER['REQUEST_URI']); // Permanent path, but protected.
	$readableDir = TEMP_DIR_PATH . '/' . session_id();
	$destPath = $readableDir . '/' . $filename; // Random and temporary path, but accessible.
	

	if(!is_dir($readableDir)) {
		mkdir($readableDir);
	}

	echo $destPath;

	copy($origPath, $destPath);
	header('Location: ../../' . $destPath);
	
}

else {
	header('Location: /?log-error=not-connected');
}