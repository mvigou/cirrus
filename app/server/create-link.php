<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isPublisher()) {
	if(isset($_POST['parentDir'], $_POST['linkToCreate'])) {	
		if(inDataDir($_POST['parentDir'])) {
			$filePath = $_POST['parentDir'] . '/' . urlencode($_POST['linkToCreate']); 
			if(symlink($_POST['linkToCreate'], $filePath)) {
				echo json_encode(
					array(
						'items' => array(
							array(
								'label' => $_POST['linkToCreate'],
								'path' => $filePath,
								'href' => $_POST['linkToCreate'],
								'type' => 'link'
							)
						)
					)
				);
			}
		}
	}
}