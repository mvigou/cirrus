<?php function readCurrentDir() {

	// Redirect to the base if the top parent directory is reached.
	if(!isset($_GET['dir']) || !inScopeDir($_GET['dir'])) {
		header('Location: .?dir=' . urlencode('./datas'));
	}
	
	define('DIR_PATH', $_GET['dir']);
	$dir = dir(DIR_PATH);
	
	while($item = $dir->read()) {
	
		// To children.
		if($item !== '.' && $item !== '..') {

			if(is_file(DIR_PATH . '/' . $item)) {
				buildFile(
					$item, 
					DIR_PATH . '/' . $item
				);
			}
			else {
				buildFolder(
					$item,
					DIR_PATH . '/' . $item
				);
			}
			
		}
		
		// To parent folder.
		else if($item == '..') {
			
			if(!inRootDir()) {

				buildFolder(
					$item, 
					substr(DIR_PATH, 0, strrpos(DIR_PATH, '/'))
				);

			}
					
		}

	}

	$dir->close();

}

// Check if the user is at least in the folder "./datas".
function inScopeDir() {
	return preg_match('/\.\/datas/', urldecode($_GET['dir'])) ? true : false;
}

// Check if the user is in the root folder.
function inRootDir() {
	return urldecode($_GET['dir']) === './datas' ? true : false;
}