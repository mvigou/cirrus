<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['parentDir'], $_POST['dirs'])) {	
		if(inDatasDirectory($_POST['parentDir'])) {
			$dirPath = $_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "\\", "|", "?", "*", "\""], '-', $_POST['dirs']);
			if(is_dir($dirPath)) {
				$basePath = $dirPath; 
				$i = 1;
				while(is_dir($dirPath)) {
					$dirPath = $basePath;
					$dirPath .= '(' . $i . ')';
					$i++;
				}
			}
			$label = str_replace($_POST['parentDir'] . '/', '', $dirPath);
			$label = array_filter(explode('/', $label));
			$label = $label[0];
			if(mkdir($dirPath, 0777, true)) {
				echo json_encode(
					array(
						'success' => true,
						'items' => array(
							array(
								'label' => $label,
								'path' => $dirPath,
								'type' => 'subdir'
							)
						)
					)
				);
			}
		}
	}
}