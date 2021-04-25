<?php require_once('./config.php');

if(isAuthenticated()) {	
	if(isset($_POST['dir'])) {
		switch($_POST['dir']) {
			case 'DATAS':
				$dir = CONTENT_DIR;
				break;
			case 'RECYCLE':
				$dir = RECYCLE_DIR;
				break;
			default:
				if(inRecycleDirectory($_POST['dir']) || inDatasDirectory($_POST['dir'])) {
					$dir = $_POST['dir'];
				}
		}
		if(isset($dir)) {
			$items = [];
			$arrFiles = [];
			$arrDir = [];
			foreach(array_diff(scandir($dir), array('.')) as $item) {
				// Parent directory.
				if($item === '..') {
					if($dir !== CONTENT_DIR && $dir !== RECYCLE_DIR) {
						array_push($items,
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
				array_push($items,
					array(
						'type' => 'subdir',
						'label' => $item
					)
				);
			}
			foreach($arrFiles as $item) {
				array_push($items,
					array(
						'type' => 'file',
						'label' => $item,
					)
				);
			}
			echo json_encode (
				array(
					'success' => true,
					'content' => array(
						'dir' => $dir,
						'items' => $items
					)
				)
			);
		}
	}
}