<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['parentDir']) && inDatasDirectory($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$filePath = $_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $_FILES['file']['name']);
			if(is_file($filePath)) {
				$basePath = $filePath; 
				$extension = pathinfo($filePath, PATHINFO_EXTENSION);
				$i = 1;
				// File without extension (rename at the end).
				if($extension === '') {
					while(is_file($filePath)) {
						$filePath = $basePath;
						$filePath .= '(' . $i . ')';
						$i++;
					}
				}
				// File with extension (rename before latest dot).
				else {
					$baseWithoutExt = substr($basePath, 0, strrpos($basePath, '.'));
					while(is_file($filePath)) {
						$filePath = $baseWithoutExt;
						$filePath .= '(' . $i . ').';
						$filePath .= $extension;
						$i++;
					}
				}
			}
			$label = str_replace($_POST['parentDir'] . '/', '', $filePath);
			if(move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
				echo json_encode(
					array(
						'success' => true,
						'items' => array(
							array(
								'label' => $label,
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