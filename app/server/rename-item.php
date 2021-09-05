<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['oldItemName'], $_POST['newItemName'], $_POST['parentDir'])) {
		if(inDatasDirectory($_POST['parentDir'])) {
			$fromPath = $_POST['parentDir'] . '/' . $_POST['oldItemName'];
			$toPath = getFreePath($_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $_POST['newItemName']));
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}	
}