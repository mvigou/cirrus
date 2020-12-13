<?php 

/* 
Server side job : // Move the selected file to the recycle bin or permanently remove it.
Return : 'move', 'overwrite' or 'remove' on the first request, then success' if done, 'failure' if undone.
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
	
	// Case 1 : user is in ./recycle.
	if(preg_match('/^\.\/(recycle)/', $_GET['file'])) {

		// With confirmation : PERMANENTLY REMOVE the selected file.
		if($confirm == "true") {
			echo unlink($origPath) ? 'success' : 'failure';		
		}
		// Without confirmation : ask for it first.
		else {
			echo 'remove';
		}
	
	}

	// Case 2 : User is in ./datas.
	else {

		// With confirmation : MOVE the selected file to ./recycle.
		if($confirm == "true") {
			echo rename($origPath, $destPath) ? 'success' : 'failure';		
		}		
		// Without confirmation : ask for it first (and inform if there is already a file with the same name in the recycle bin.)
		else {
			echo is_file($destPath) ? 'overwrite' : 'move';
		}

	}

}