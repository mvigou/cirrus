<?php function readCurrentDir() {

	define('DIR_PATH', isset($_GET['dir']) ?
		urldecode($_GET['dir']):
		'./datas'
	);
	
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
			buildFolder(
				$item, 
				substr(DIR_PATH, 0, strrpos(DIR_PATH, '/'))
			);
		}

	}

	$dir->close();

}