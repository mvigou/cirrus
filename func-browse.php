<?php 

// Check if the user is in his data directory.
function inScopeDir($dir) {
	return preg_match('/\.\/datas/', urldecode($dir)) ? true : false;
}

// Check if the user is in the root directory.
function inRootDir($dir) {
	return urldecode($dir) === DATAS_FOLDER_BASE ? true : false;
}

function toRootDir() {
	header('Location: .?dir=' . urlencode(DATAS_FOLDER_BASE));
}

function browseDir($dir) {

	// Only if the user is in an existing folder of the authorized scop.
	if(isset($dir) && inScopeDir($dir) && $tree = dir($dir)) {

		while($item = $tree->read()) {
		
			if($item !== '.') {
				
				// To parent folder.
				if($item === '..') {
				
					if(!inRootDir($dir)) {
						buildFolder(
							$item,
							$dir,
							substr($dir, 0, strrpos($dir, '/')) // !!! trouver comment retirer cette ligne sans perdre en lisibilité.
						);
					}
				
				}
				
				// To children.
				else {
					
					if(is_file($dir . '/' . $item)) {
						buildFile(
							$item,
							$dir,
							$dir . '/' . $item
						);
					}
					else {
						buildFolder(
							$item,
							$dir,
							$dir . '/' . $item
						);
					}
		
				}
			}
	
		}

	}

	else {
		toRootDir();
	}

	$tree->close();

}