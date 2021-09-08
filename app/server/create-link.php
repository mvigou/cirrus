<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isPublisher()) {
	if(isset($_POST['parentDir'], $_POST['linkToCreate'])) {	
		if(inDataDir($_POST['parentDir'])) {
			$filePath = $_POST['parentDir'] . '/' . urlencode($_POST['linkToCreate']);
			$href = $_POST['linkToCreate'];
			if(is_link($filePath)) {
				unlink($filePath);
			}
			if(symlink($href, $filePath)) {
				echo json_encode(
					array(
						'items' => array(
							array(
								'href' => $href,
								'label' => $href,
								'path' => $filePath,
								'type' => 'link'
							)
						)
					)
				);
			}
		}
	}
}