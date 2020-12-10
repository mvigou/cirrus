<?php 

// Move a file to the trash.
if(isset($_GET['file'])) {

	// From, to.
	$origPath = $_GET['file'];
	$destPath = str_replace('./datas', './trash', $origPath);

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
	if(rename($origPath, $destPath)) {
		echo 'success';
	};

}