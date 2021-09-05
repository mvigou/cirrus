<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['oldItemName'], $_POST['newItemName'], $_POST['parentDir'])) {
		if(inDatasDirectory($_POST['parentDir'])) {
			$fromPath = $_POST['parentDir'] . '/' . $_POST['oldItemName'];
			$toPath = $_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $_POST['newItemName']);
			if(is_file($toPath) || is_dir($toPath)) {
				$basePath = $toPath; 
				$extension = pathinfo($toPath, PATHINFO_EXTENSION);
				$i = 1;
				// File without extension or directory (rename at the end).
				if($extension === '' || is_dir($toPath)) {
					while(is_file($toPath) || is_dir($toPath)) {
						$toPath = $basePath;
						$toPath .= '(' . $i . ')';
						$i++;
					}
				}
				// File with extension (rename before latest dot).
				else {
					$baseWithoutExt = substr($basePath, 0, strrpos($basePath, '.'));
					while(is_file($toPath)) {
						$toPath = $baseWithoutExt;
						$toPath .= '(' . $i . ').';
						$toPath .= $extension;
						$i++;
					}
				}
			}
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}	
}