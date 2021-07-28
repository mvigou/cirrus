<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasPublisherRights()) {
	if(isset($_POST['parentDir'], $_POST['dirs'])) {		
		if(inDatasDirectory($_POST['parentDir'])) {
			$dirName = $_POST['parentDir'] . '/' . str_replace(["<", ">", ":", "\\", "|", "?", "*", "\""], '-', $_POST['dirs']);
			if(is_dir($dirName)) {
				$baseName = $dirName; 
				$i = 1;
				while(is_dir($dirName)) {
					$dirName = $baseName;
					$dirName .= '(' . $i . ')';
					$i++;
				}
			}
			$label = str_replace($_POST['parentDir'] . '/', '', $dirName);
			$label = array_filter(explode('/', $label));
			$label = $label[0];
			if(mkdir($dirName, 0777, true)) {
				echo json_encode(
					array(
						'success' => true,
						'content' => array(
							'dir' => $_POST['parentDir'],
							'items' => array(
								array(
									'type' => 'subdir',
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