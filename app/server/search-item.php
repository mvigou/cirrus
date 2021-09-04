<?php 
session_start();
require_once('./tools.php');

function searchRecursively($dir) {
	foreach(array_diff(scandir($dir), array('..', '.', '.lock', '.perms')) as $item) {
		$itemPath = $dir . '/' . $item;
		if(stripos($item, $_POST['chunckToSearch']) !== false) {
			array_push(
				$GLOBALS['matches'],
				array(
					'label' => $item,
					'path' => $itemPath,
					'type' => is_file($itemPath) ? 'file':'subdir'
				)
			);	
		}
		if(is_dir($itemPath)) {
			if(isDirReadableBy($itemPath, $_SESSION['username'])) {
				searchRecursively($itemPath);
			}
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
		if(inDatasDirectory($_POST['startLocation'])) {
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