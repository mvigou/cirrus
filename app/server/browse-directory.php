<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {	
	if(isset($_POST['dir'])) {
		if($_POST['dir'] === 'DATAS') {
			$dir = '../../datas/content';
		}
		else if($_POST['dir'] === 'RECYCLE' && hasOwnerRights()) {
			$dir = '../../datas/recyle';
		}
		else {
			if(inDatasDirectory($_POST['dir']) || (inRecycleDirectory($_POST['dir']) && hasOwnerRights())) {
				$dir = $_POST['dir'];	
			}
		}
		if(isset($dir)) {
			$items = [];
			$arrFiles = [];
			$arrDir = [];
			foreach(array_diff(scandir($dir), array('.', '.lock', '.perms')) as $item) {
				// Parent directory.
				if($item === '..') {
					if($dir !== '../../datas/content' && $dir !== '../../datas/recyle') {
						array_push($items,
							array(
								'label' => $item,
								'path' => substr($dir, 0, strrpos($dir, '/')),
								'type' => 'parent'
							)
						);
					}
				}
				else {
					// Sub directory.
					if(is_dir($dir . '/' . $item)) {
						if(isDirReadableBy($dir . '/' . $item, $_SESSION['username'])) {
							array_push($arrDir, $item);
						}
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
						'label' => $item,
						'path' => $dir . '/' . $item,
						'type' => 'subdir'
					)
				);
			}
			foreach($arrFiles as $item) {
				array_push($items,
					array(
						'label' => $item,
						'path' => $dir . '/' . $item,
						'type' => 'file'
					)
				);
			}
			if(error_get_last() === null) {
				echo json_encode (
					array(
						'dir' => $dir,
						'items' => $items
					)
				);
			}
		}
	}
}