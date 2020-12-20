<?php session_start();

/* 
Server side job : if the user is authenticated, copy the resquest file in a random, temporary and unprotected directory.
Return : a path to the accessible file or directory (as a zip). 
Called by : /app/js/functions.js.
*/

if(isset($_SESSION['token'])) {
	
	require_once('./config.php');
	require_once('./functions.php');

	if(isset($_GET['elm']) && inScopeDirectory($_GET['elm'])) {
	
		$filename = array_slice(explode( '/', urldecode($_GET['elm'])), -1)[0];
		$origPath = urldecode($_GET['elm']); // Permanent path (protected by .htaccess, inaccessible to users).
		$destPath = ''; // Random and temporary path (accessible to users).
		$destDir = TEMP_DIR_PATH . '/' . session_id();
		
		if(!is_dir($destDir)) {
			mkdir($destDir);
		}
		
		// Request for a file ? Duplicate it in the temporary directory. 
		if(is_file($origPath)) {
			$destPath = $destDir . '/' . $filename;
			copy($origPath, $destPath);
		}

		// Request for a directory ? Build a zip to put it in the temporary directory. 
		else if(is_dir($origPath)) {

			$destPath = $destDir . '/' . $filename . '.zip';

			$zip = new ZipArchive();
			$zip->open($destPath, ZipArchive::CREATE);
		
			buildZip($zip, $filename, $_GET['elm']);
			
			// If the selected directory was empty, add the directory itself to the zip.
			if($zip->count() === 0) {
				$zip->addEmptyDir($filename);
			}
			
			$zip->close();
					
		}
		
		// Return the complete path to the file or the zip as an AJAX response.
		echo $destPath;

	}

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