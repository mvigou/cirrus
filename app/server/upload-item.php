<?php 

require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {

	if(isset($_POST['parentDir']) && isset($_FILES)) {
		
		if(inDatasDirectory($_POST['parentDir'])) {
			
			$fileName = $_POST['parentDir'] . '/' . buildValidName($_FILES['file']['name']);
			$itemRenamed = false;

			while(is_file($fileName)) {
				$fileName .= '-copy';
				$itemRenamed = true;
			}
			
			move_uploaded_file(
				$_FILES['file']['tmp_name'], 
				$fileName
			);

			echo json_encode(
				array(
					'state' => 'success',
					'content' => array (
						'itemRenamed' => $itemRenamed
					)
				)
			);
			
		}
		
	}

}