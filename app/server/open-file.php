<?php
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['itemPath'])) {
		if(inDatasDirectory($_POST['itemPath']) || (hasOwnerRights() && inScopeDirectory($_POST['itemPath']))) {
			$itemName = array_slice(explode( '/', $_POST['itemPath']), -1)[0];
			$itemPath = $_POST['itemPath'];
			switch(mime_content_type($itemPath)) {
				case 'application/pdf':
					$itemType = 'pdf';
					break;
				case 'image/gif':
				case 'image/jpeg':
				case 'image/jpg':
				case 'image/png':
				case 'image/svg+xml':
				case 'image/webp':
					$itemType = 'img';
					break;
			}
			if(isset($itemType)) {
				$tempDirectory = buildTempDir();
				$itemTempPath = $tempDirectory . '/' . $itemName;
				if(mkdir($tempDirectory)) {
					if(copy($itemPath, $itemTempPath)) {
						echo json_encode (
							array(
								'item' => array(
									'isOpenable' => true,
									'tempPath' => str_replace('../../', './', $itemTempPath),
									'type' => $itemType,
								)
							)
						);
					}
				}
			}
			else {
				echo json_encode (
					array(
						'item' => array(
							'isOpenable' => false
						)
					)
				);
			}
		}
	}
}