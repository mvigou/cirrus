<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isPublisher()) {
	if(isset($_POST['parentDir'], $_POST['dirToCreate'])) {	
		if(inDataDir($_POST['parentDir'])) {
			$dirName = getValidName($_POST['dirToCreate']);
			$dirPath = getFreePath($_POST['parentDir'] . '/' . $dirName); 
			$dirLabel = str_replace($_POST['parentDir'] . '/', '', $dirPath);
			// Only if the string is like "parent/child/..." 
			$dirLabel = array_filter(explode('/', $dirLabel));
			$dirLabel = $dirLabel[0];
			if(mkdir($dirPath, 0777, true)) {
				echo json_encode(
					array(
						'items' => array(
							array(
								'label' => $dirLabel,
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