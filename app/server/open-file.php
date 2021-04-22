<?php require_once('./config.php');

if(isAuthenticated()) {
	if(isset($_POST['filePath'])) {
		$fileName = array_slice(explode( '/', $_POST['filePath']), -1)[0];
		$tempDirectory = buildTempDir();
		$fromPath = $_POST['filePath'];
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
				}
				if(isset($fileType)) {	
					echo json_encode (
						array(
							'success' => true,
							'content' => array(
								"type" => $fileType,
								"path" => str_replace('../../', './', $toPath)
							)
						)
					);
				}
			}
		}
	}
}