<?php 

require_once('./config.php');

if(isset($_POST['filePath'])) {

	if(isAuthenticated()) {
		
		$fileName = array_slice(explode( '/', $_POST['filePath']), -1)[0];
		$fromPath = $_POST['filePath'];
		$tempDirectory = buildTempDir();
		$toPath = $tempDirectory . '/' . $fileName;
		
		if(mkdir($tempDirectory)) {

			if(copy($fromPath, $toPath)) {

				switch(mime_content_type($toPath)) {
			
					case 'application/pdf':
						$fileType = 'pdf';
						break;
					
					case 'image/gif':
					case 'image/jpeg':
					case 'image/jpg':
					case 'image/png':
					case 'image/svg+xml':
						$fileType = 'img';
						break;
		
					default:
						$fileType = '';
						break;

				}
				
				if(isset($fileType)) {
					
					echo json_encode (
						array(
							'state' => 'success',
							'content' => array(
								"type" => $fileType,
								"path" => $toPath
							)
						)
					);
		
				}

			}

		}

	}
	
}