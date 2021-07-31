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
				$i = 1;
				while(is_file($toPath) || is_dir($toPath)) {
					$toPath = $basePath;
					$toPath .= '(' . $i . ')';
					$i++;
				}
			}
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}	
}