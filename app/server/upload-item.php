<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	$itemRenamed = false; 
	$success = false;
	if(isset($_POST['parentDir']) && inDatasDirectory($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$fileName = $_POST['parentDir'] . '/' . buildValidName($_FILES['file']['name']);
			while(is_file($fileName)) {
				$fileName .= '-copy';
				$itemRenamed = true;
			}
			if(move_uploaded_file($_FILES['file']['tmp_name'], $fileName)) {
				$success = true;
			}
		}
	}
	echo json_encode(
		array(
			'success' => $success,
			'content' => array (
				'itemRenamed' => $itemRenamed
			)
		)
	);	
}