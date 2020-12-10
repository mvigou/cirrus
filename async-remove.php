<?php 

require_once('./commons.php');

// Basic checks.
if(isset($_GET['file']) && inScopeDir($_GET['file'])) {
	removeFile($_GET['file']);
}
else {
	echo 'failure';
}

// Move a file to the trash.
function removeFile($file) {

	// From, to.
	$origPath = $_GET['file'];
	$destPath = str_replace(DATAS_FOLDER_BASE, TRASH_FOLDER_BASE, $origPath);

	// If needed, recreate the folder structure first (parent folders).
	$parentDirs = explode('/', $destPath);
	array_diff($parentDirs, ['.']); // Exclude '.'
	array_pop($parentDirs); // Exclude the file to delete.

	$tree = '.';

	foreach($parentDirs as $parentDir) {

		$tree .= '/' . $parentDir;
		
		if(!is_dir($tree)) {
			mkdir($tree);
		}
	
	}

	// Move the file.
	echo rename($origPath, $destPath) ? 'success' : 'failure';

}