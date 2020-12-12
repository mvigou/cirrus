<?php 

/* 
Server side job : // Move the selected file to the recycle bin.
Return : 'warning' or 'no-warning' on the first request, success' if done, 'failure' if undone when proceed.
Called by : async.js.
*/

require_once('./common.php');

if(isset($_GET['file']) && inScopeDirectory($_GET['file']) && isset($_GET['confirm'])) {
	removeFile($_GET['file'], $_GET['confirm']);
}
else {
	echo 'failure';
}

function removeFile($file, $confirm = false) {
	
	define('FILENAME', array_slice(explode('/', $_GET['file']), -1)[0]);
	
	// From, to.
	$origPath = $_GET['file'];
	$destPath = RECYCLE_DIR_PATH . '/' . FILENAME;
	
	if($confirm == "true") {
		// Proceed.
		echo rename($origPath, $destPath) ? 'success' : 'failure';		
	}
	
	else {
		// Else, check is there already a file with the same name in the recycle bin (ask for user confirmation in all cases).
		echo is_file($destPath) ? 'warning' : 'no-warning';
	}

}