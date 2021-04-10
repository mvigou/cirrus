<?php 

/* 
Job : browse content of the selected directory.
Return : a JSON representing the content of the directory.
To : browseDirectory
*/

require_once('./config.php');

if(verifyAccess()) {
	
	if(isset($_POST['dir'])) {
		
		if($_POST['dir'] === 'DATAS') {
			browseDirectory(CONTENT_DIR);
		}
		else if($_POST['dir'] === 'RECYCLE') {
			browseDirectory(RECYCLE_DIR);
		}
		else {
			if(inRecycleDirectory($_POST['dir']) || inDatasDirectory($_POST['dir'])) {
				browseDirectory($_POST['dir']);
			}
		}
	
	}

}
	
function browseDirectory($dir) {
	
	$response = [];
	array_push($response, $dir); // Parent directory.
	array_push($response, array()); // Children.

	$arrFiles = [];
	$arrDir = [];

	foreach(array_diff(scandir($dir), array('.')) as $item) {

		// Parent directory.
		if($item === '..') {
			if($dir !== CONTENT_DIR && $dir !== RECYCLE_DIR) {
				array_push($response[1],
					array(
						'type' => 'parent',
						'label' => $item
					)
				);
			}
		}
		else {
			// Sub directory.
			if(is_dir($dir . '/' . $item)) {
				array_push($arrDir, $item);
			}
			// File.
			else {
				array_push($arrFiles, $item);
			}

		}

	}

	foreach($arrDir as $item) {
		array_push($response[1],
			array(
				'type' => 'subfolder',
				'label' => $item
			)
		);
	}

	foreach($arrFiles as $item) {
		array_push($response[1],
			array(
				'type' => 'file',
				'label' => $item,
			)
		);
	}
	
	echo json_encode($response);

}