<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['parentDir']) && inDatasDirectory($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$fileName = $_POST['parentDir'] . '/' . buildValidName($_FILES['file']['name']);
			if(is_file($fileName)) {
				$baseName = $fileName; 
				$i = 1;
				while(is_file($fileName)) {
					$fileName = $baseName;
					$fileName .= '(' . $i . ')';
					$i++;
				}
			}
			if(move_uploaded_file($_FILES['file']['tmp_name'], $fileName)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}