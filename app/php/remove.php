<?php

/* 
Server side job : move to the recycle directory / remove permanently a file or a directory and its content.
Return : 'success' if done.
Called by : async.js.
*/

require_once('./config.php');
require_once('./functions.php');

if(isset($_GET['elm'])) {

	// Empty request ? Empty recycle bin.
	if($_GET['elm'] === '') {
		$_GET['elm'] = RECYCLE_DIR_PATH;	
	}

	// Request made from the datas directory ? MOVE to recycle.
	if(inDatasDirectory($_GET['elm'])) {
		moveToRecycle($_GET['elm']);
		echo 'success';
	}
	
	// Request made from the recycle directory ? REMOVE permanently.
	else if(inRecycleDirectory($_GET['elm'])) {
		
		if(is_file($_GET['elm'])) {
			removeFile($_GET['elm']);
		}
		else {
			removeDir($_GET['elm']);
		}
		echo 'success';
	
	}

}

function moveToRecycle ($elm) {

	$filename = array_slice(explode('/', $elm), -1)[0];
	
	// From, to.
	$origPath = $elm;
	$destPath = RECYCLE_DIR_PATH . '/' . $filename;

	// Delete possibly identical files and directories before continuing.
	if(is_file($destPath)) {
		removeFile($destPath);
	}
	else if(is_dir($destPath)) {
		removeDir($destPath);
	}

	// Proceed
	rename($origPath, $destPath) ? 'success' : 'failure';

}

function removeFile($file) {
	unlink($file);
}

function removeDir($dir) {
	
	foreach(array_diff(scandir($dir), array('..', '.')) as $item) {

		// File ? Remove it.
		if(is_file($dir . '/' . $item)) {
			removeFile($dir . '/' . $item);
		}

		// Directory ? Browse content to remove its content then remove it.
		else {
			removeDir($dir . '/' . $item);	
		}

	}

	// If not corresponding to the recycle directory, remove also this parent directory.
	if($dir !== RECYCLE_DIR_PATH) {
		rmdir($dir);
	}
	
}