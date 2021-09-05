<?php
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['itemPath'])) {
		if(inDataDir($_POST['itemPath']) || (inRecycleDir($_POST['itemPath']) && isOwner())) {
			$itemName = array_slice(explode( '/', $_POST['itemPath']), -1)[0];
			$itemPath = $_POST['itemPath'];
			$mimeType = mime_content_type($itemPath);
			if(preg_match('/image\/.+/', $mimeType)) {
				$openItemAs = 'img';
			}
			else if($mimeType === 'application/pdf') {
				$openItemAs = 'pdf';
			}
			else {
				$openItemAs = 'download';
			}
			$tempDirectory = buildTempDir();
			$itemTempPath = $tempDirectory . '/' . $itemName;
			if(mkdir($tempDirectory)) {
				if(copy($itemPath, $itemTempPath)) {
					echo json_encode (
						array(
							'item' => array(
								'openAs' => $openItemAs,
								'tempPath' => str_replace('../../', './', $itemTempPath)
							)
						)
					);
				}
			}
		}
	}
}