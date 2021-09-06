<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {	
	if(isset($_POST['dir'])) {
		if(inDataDir($_POST['dir']) || (inRecycleDir($_POST['dir']) && isOwner())) {		
			$items = [];
			$arrFiles = [];
			$arrLinks = [];
			$arrDirs = [];
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
						if(isOwner() || isAllowed($_POST['dir'] . '/' . $item, $_SESSION['username'])) {
							array_push($arrDirs, $item);
						}
					}
					// Link.
					else if(is_link($_POST['dir'] . '/' . $item)) {
						array_push($arrLinks, $item);
					}
					// File.
					else {
						array_push($arrFiles, $item);
					}
				}
			}
			foreach($arrDirs as $item) {
				array_push($items,
					array(
						'label' => $item,
						'path' => $_POST['dir'] . '/' . $item,
						'type' => 'subdir'
					)
				);
			}
			foreach($arrLinks as $item) {
				array_push($items,
					array(
						'label' => urldecode($item),
						'href' => readlink($_POST['dir'] . '/' . $item),
						'path' => $_POST['dir'] . '/' . $item,
						'type' => 'link'
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