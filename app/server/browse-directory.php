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
								'type' => 'parent',
								'label' => $item
							)
						);
					}
				}
				else {
					// Sub directory.
					if(is_dir($dir . '/' . $item)) {
						if(is_file($dir . '/' . $item . '/.lock')) {
							if(hasOwnerRights()) {
								array_push($arrDir, $item);
							}
							else if(is_file($dir . '/' . $item . '/.perms')) {
								if(in_array($_SESSION['username'], json_decode(file_get_contents($dir . '/' . $item . '/.perms')))) {
									array_push($arrDir, $item);
								}
							}
						}
						else {
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