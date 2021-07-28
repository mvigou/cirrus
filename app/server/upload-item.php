<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['parentDir']) && inDatasDirectory($_POST['parentDir'])) {
		if(isset($_FILES) && $_FILES['file']['error'] === 0) {
			$fileName = $_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $_FILES['file']['name']);
			if(is_file($fileName)) {
				$baseName = $fileName; 
				$i = 1;
				while(is_file($fileName)) {
					$fileName = $baseName;
					$fileName .= '(' . $i . ')';
					$i++;
				}
			}
			$label = str_replace($_POST['parentDir'] . '/', '', $fileName);
			if(move_uploaded_file($_FILES['file']['tmp_name'], $fileName)) {
				echo json_encode(
					array(
						'success' => true,
						'content' => array(
							'dir' => $_POST['parentDir'],
							'items' => array(
								array(
									'type' => 'file',
									'label' => $label
								)
							)
						)
					)
				);
			}
		}
	}
}