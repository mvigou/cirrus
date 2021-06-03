<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {	
	if(isset($_POST['dir'])) {
		switch($_POST['dir']) {
			case 'DATAS':
				$dir = $env->contentDir;
				break;
			case 'RECYCLE':
				$dir = $env->recycleDir;
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
					if($dir !== $env->contentDir && $dir !== $env->recycleDir) {
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
						if(!is_file($dir . '/' . $item . '/.lock') || hasOwnerRights()) {
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
}