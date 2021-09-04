<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {	
	if(isset($_POST['dir'])) {
		if(inDatasDirectory($_POST['dir']) || (inRecycleDirectory($_POST['dir']) && hasOwnerRights())) {		
			$items = [];
			$arrFiles = [];
			$arrDir = [];
			foreach(array_diff(scandir($_POST['dir']), array('.', '.lock', '.perms')) as $item) {
				// Parent directory.
				if($item === '..') {
					if($_POST['dir'] !== '../../datas/content' && $_POST['dir'] !== '../../datas/recyle') {
						array_push($items,
							array(
								'label' => $item,
								'path' => substr($_POST['dir'], 0, strrpos($_POST['dir'], '/')),
								'type' => 'parent'
							)
						);
					}
				}
				else {
					// Sub directory.
					if(is_dir($_POST['dir'] . '/' . $item)) {
						if(isDirReadableBy($_POST['dir'] . '/' . $item, $_SESSION['username'])) {
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
						'path' => $_POST['dir'] . '/' . $item,
						'type' => 'subdir'
					)
				);
			}
			foreach($arrFiles as $item) {
				array_push($items,
					array(
						'label' => $item,
						'path' => $_POST['dir'] . '/' . $item,
						'type' => 'file'
					)
				);
			}
			if(error_get_last() === null) {
				echo json_encode (
					array(
						'items' => $items
					)
				);
			}
		}
	}
}