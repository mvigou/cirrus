<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isPublisher()) {
	if(isset($_POST['oldItemName'], $_POST['newItemName'], $_POST['parentDir'])) {
		if(inDataDir($_POST['parentDir'])) {
			$fromPath = $_POST['parentDir'] . '/' . $_POST['oldItemName'];			
			$toPath = getFreePath($_POST['parentDir'] . '/' . getValidFileName($_POST['newItemName']));			
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}	
}