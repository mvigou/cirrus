<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isPublisher()) {
	if(isset($_POST['parentDir']) && inDataDir($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$fileName = getValidFileName($_FILES['file']['name']);
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