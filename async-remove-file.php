<?php 

/* 
Server side job : // Move the selected file to the trash.
Return : 'success' if done, 'failure' if undone.
Called by : async.js.
*/

require_once('./common.php');

if(isset($_GET['file']) && inScopeDirectory($_GET['file'])) {
	removeFile($_GET['file']);
}
else {
	echo 'failure';
}

function removeFile($file) {

	// From, to.
	$origPath = $_GET['file'];
	$destPath = str_replace(DATAS_DIR_PATH, TRASH_DIR_PATH, $origPath);

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