<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['item'])) {
		if(
			inDatasDirectory($_POST['item']) ||
			(hasOwnerRights() && inScopeDirectory($_POST['item']))
		) {
			$fileName = array_slice(explode( '/', $_POST['item']), -1)[0];
			$tempDirectory = buildTempDir();
			$fromPath = $_POST['item'];
			$toPath = '';
			if(mkdir($tempDirectory)) {		
				// Request for a file ? Simple copy. 
				if(is_file($fromPath)) {
					$toPath = $tempDirectory . '/' . $fileName;
					copy($fromPath, $toPath);
				}
				// Request for a directory ? Build a zip. 
				else if(is_dir($fromPath)) {
					$toPath = $tempDirectory . '/' . $fileName . '.zip';
					$zip = new ZipArchive();
					$zip->open($toPath, ZipArchive::CREATE);
					buildZip($zip, $fileName, $_POST['item']);
					// If the selected directory was empty, add the directory itself to the zip.
					if($zip->count() === 0) {
						$zip->addEmptyDir($fileName);
					}
					$zip->close();
				}
				if(error_get_last() === null) {
					echo json_encode(
						array (
							'success' => true,
							'content' => str_replace('../../', './', $toPath)
						)
					);
				}
			}
		}
	}
}

function buildZip($zip, $zipName, $dirPath) {
	foreach(array_diff(scandir($dirPath), array('..', '.')) as $dirEntry) {
		$fromPath = $dirPath . '/' . $dirEntry;
		$toPath = substr($dirPath, strpos($dirPath, $zipName)) . '/' . $dirEntry;
		if(is_file($fromPath)) {
			$zip->addFile($fromPath, $toPath);
		}
		else {
			$zip->addEmptyDir($toPath);
			buildZip($zip, $zipName, $fromPath);
		}		
	}
}