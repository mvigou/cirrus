<?php 
session_start();
require_once('./tools.php');

function searchRecursively($dir) {
	$items = array_diff(scandir($dir), array('..', '.', '.lock', '.perms'));
	foreach($items as $item) {
		$itemPath = $dir . '/' . $item;
		// Always save file match because directory access has been checked before.
		if(is_file($itemPath)) {	
			if(stripos($item, $_POST['chunckToSearch']) !== false) {
				array_push(
					$GLOBALS['matches'],
					array(
						'label' => $item,
						'path' => $itemPath,
						'type' => 'file'
					)
				);
			}
		}
		// Save directory match and search inside only if read is allowed.
		else if(is_dir($itemPath) && (isOwner() || isAllowed($itemPath, $_SESSION['username']))) {
			if(stripos($item, $_POST['chunckToSearch']) !== false) {
				array_push(
					$GLOBALS['matches'],
					array(
						'label' => $item,
						'path' => $itemPath,
						'type' => 'subdir'
					)
				);
			}
			searchRecursively($itemPath);
		}
	}
}

if(isAuthenticated()) {	
	if(isset($_POST['chunckToSearch'], $_POST['startLocation'])) {
		$matches = [];
		array_push(
			$matches,
			array(
				'label' => '..',
				'path' => $_POST['startLocation'],
				'type' => 'parent'
			)
		);
		if(inDataDir($_POST['startLocation'])) {
			searchRecursively($_POST['startLocation']);
			if(error_get_last() === null) {
				echo json_encode (
					array(
						'items' => $matches
					)
				);
			}
		}
	}
}