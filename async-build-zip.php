<?php 

/* 
Server side job : Build a zip of the selected directory.
Return : The path to the created zip.
Called by : async.js.
*/

require_once('./common.php');

if(isset($_GET['dir']) && inScopeDirectory($_GET['dir'])) {

	$zipName = array_slice(explode('/', $_GET['dir']), -1)[0];

	$zip = new ZipArchive();
	$zip->open(TEMP_DIR_PATH . '/' . $zipName . '.zip', ZipArchive::CREATE);
	buildZip($zip, $_GET['dir']);
	$zip->close();
	echo TEMP_DIR_PATH . '/' . $zipName . '.zip';

}

else {
	echo 'failure';
}

function buildZip($zip, $dirPath) {

	// Browse selected directory. 
	foreach(array_diff(scandir($dirPath), array('..', '.')) as $dirEntry) {
		
		// File ? Add to zip.
		if(is_file($dirPath . '/' . $dirEntry)) {
			$zip->addFile($dirPath . '/' . $dirEntry);
		}
		// Folder ? Recursive call.
		else {
			buildZip($zip, $dirPath . '/' . $dirEntry);
		}

	}
	
}