<?php 

/* 
Server side job : Create a new directory in the current directory.
Return : 'success' if done, 'failure' if undone.
Called by : async.js.
*/

require_once('./common.php');

if(isset($_GET['dir']) && inScopeDirectory($_GET['dir'])) {
	if(isset($_GET['newDir'])) {
		createDirectory($_GET['newDir'], $_GET['dir']);
	}
}
else {
	echo 'failure';
}

function createDirectory($newDir, $dir) {
	
	if(mkdir($dir . '/' . $newDir)) {
		echo 'success';
	}
	else {
		echo 'failure';
	}
	
}