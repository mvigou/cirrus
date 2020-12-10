<?php 

require_once('./commons.php');

// Basic checks.
if(isset($_GET['dir']) && inScopeDirectory($_GET['dir'])) {
	browseDirectory($_GET['dir']);
}
else {
	echo 'failure';
}

// Browse content directory.
function browseDirectory($dir) {
	
	if($tree = dir($dir)) {

		$response = [];

		while($item = $tree->read()) {
		
			if($item !== '.') {
				
				// To parent folder.
				if($item === '..') {
				
					if(!inRootDirectory($dir)) {
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

}