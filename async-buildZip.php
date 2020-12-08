<?php


$_GET['dir'] = $_SERVER['SERVER_NAME'];

function buildZip($dirPath, $targetZip) {

	// Browse selected directory. 
	foreach(array_diff(scandir($dirPath), array('..', '.')) as $dirEntry) {
		
		// File ? Add to zip.
		if(is_file($dirPath . '/' . $dirEntry)) {
			$targetZip->addFile($dirPath . '/' . $dirEntry);
		}
		// Folder ? Recursive call.
		else {
			buildZip($dirPath . '/' . $dirEntry, $targetZip);
		}

	}
	
}

$targetZip = new ZipArchive();
$targetZip->open('../../temp/output.zip', ZipArchive::CREATE);
buildZip($_GET['dir'], $targetZip);
$targetZip->close();