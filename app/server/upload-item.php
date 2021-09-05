<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['parentDir']) && inDatasDirectory($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$fileName = getValidName($_FILES['file']['name']);
			$filePath = getFreePath($_POST['parentDir'] . '/' . $fileName); 
			$fileLabel = str_replace($_POST['parentDir'] . '/', '', $filePath);
			if(move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
				echo json_encode(
					array(
						'success' => true,
						'items' => array(
							array(
								'label' => $fileLabel,
								'path' => $filePath,
								'type' => 'file'
							)
						)
					)
				);
			}
		}
	}
}