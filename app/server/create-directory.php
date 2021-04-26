<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['parent']) && isset($_POST['dirs'])) {		
		if(inScopeDirectory($_POST['parent'])) {
			$dirName = $_POST['parent'] . '/' . str_replace(["<", ">", ":", "\\", "|", "?", "*", "\""], '-', $_POST['dirs']);
			mkdir($dirName, 0777, true);
			echo json_encode(array('success' => true));
		}
	}
}