<?php function browseDirectory($dir) {
	
	define('DATAS_FOLDER_BASE', './datas');

	// Check if the user is in his data directory.
	function inScopeDir($dir) {
		return preg_match('/\.\/datas/', urldecode($dir)) ? true : false;
	}
	
	// Check if the user is in the root directory.
	function inRootDir($dir) {
		return urldecode($dir) === DATAS_FOLDER_BASE ? true : false;
	}

	// Only if the user is in an existing folder of the authorized scop.
	if(isset($dir) && inScopeDir($dir) && $tree = dir($dir)) {

		$response = [];

		while($item = $tree->read()) {
		
			if($item !== '.') {
				
				// To parent folder.
				if($item === '..') {
				
					if(!inRootDir($dir)) {
						array_push($response,
							array(
								'type' => 'parent',
								'label' => $item,
								'directory' => $dir
							)
						);
					}
				
				}
				
				// To children.
				else {
					
					if(is_file($dir . '/' . $item)) {
						array_push($response,
							array(
								'type' => 'file',
								'label' => $item,
								'directory' => $dir,
								'lastMod' => date('Y-m-d / H:i', filemtime($dir . '/' . $item))
							)
						);
					}
					else {
						array_push($response,
							array(
								'type' => 'subfolder',
								'label' => $item,
								'directory' => $dir
							)
						);
					}
		
				}
			}

		}

		$tree->close();

		echo json_encode($response);
	}

	else {		
		header('Location: ./');
	}

}

browseDirectory($_GET['dir']);