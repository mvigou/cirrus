<?php 

/* 
Server side job : Build a zip of the selected directory.
Return : The path to the created zip.
Called by : async.js.
*/

require_once('./config.php');
require_once('./async-functions.php');

if(isset($_GET['dir']) && inScopeDirectory($_GET['dir'])) {

	// Corresponding to the parent directory name.
	$zipName = array_slice(explode('/', $_GET['dir']), -1)[0];

	// Settings.
	$zip = new ZipArchive();
	$zip->open(TEMP_DIR_PATH . '/' . $zipName . '.zip', ZipArchive::CREATE);

	// Building.
	buildZip($zip, $zipName, $_GET['dir']);
	
	// If the selected directory was empty, add the directory itself to the zip.
	if($zip->count() === 0) {
		$zip->addEmptyDir($zipName);
	}
	
	$zip->close();

	// Return the complete path to the zip as an AJAX response.
	echo TEMP_DIR_PATH . '/' . $zipName . '.zip';

}

else {
	echo 'failure';
}

function buildZip($zip, $zipName, $dirPath) {
	
	foreach(array_diff(scandir($dirPath), array('..', '.')) as $dirEntry) {

		$origPath = $dirPath . '/' . $dirEntry;
		$destPath = substr($dirPath, strpos($dirPath, $zipName)) . '/' . $dirEntry;

		// File ? Add to zip.
		if(is_file($origPath)) {
			$zip->addFile($origPath, $destPath);
		}
		// Folder ? Create it, then recursive call of this function.
		else {
			$zip->addEmptyDir($destPath);
			buildZip($zip, $zipName, $origPath);
		}
		
	}
	
}