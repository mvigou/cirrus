<?php 

/* 
Server side job : browse content of the selected directory.
Return : a JSON object representing the content of the directory.
Called by : /app/js/functions.js.
*/

require_once('./config.php');
require_once('./functions.php');

if(verifyAccess()) {

	if(isset($_GET['dir'])) {
	
		// Keyword DATAS.
		if($_GET['dir'] === 'DATAS') {
			browseDirectory(DATAS_DIR_PATH);
		}
		// Keyword RECYCLE.
		else if($_GET['dir'] === 'RECYCLE') {
			browseDirectory(RECYCLE_DIR_PATH);
		}
		// Provided (and authorized) directory.
		else {
	
			if(inRecycleDirectory($_GET['dir']) || inDatasDirectory($_GET['dir'])) {
				browseDirectory($_GET['dir']);
			}
		}
	
	}

}
	
function browseDirectory($dir) {
	
	if($tree = dir($dir)) {

		$response = [];
		array_push($response, $dir); // Parent.
		array_push($response, array()); // Children.

		while($item = $tree->read()) {
		
			if($item !== '.') {
				
				// To parent folder.
				if($item === '..') {
				
					if(!inRootDirectory($dir)) {
						array_push($response[1],
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
						array_push($response[1],
							array(
								'type' => 'file',
								'label' => $item,
								'directory' => $dir,
								'lastMod' => date('Y-m-d / H:i', filemtime($dir . '/' . $item))
							)
						);
					}
					else {
						array_push($response[1],
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

}