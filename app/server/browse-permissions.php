<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isOwner()) {
	if(isset($_POST['dirPath'])) {
		$isRestricted = is_file($_POST['dirPath'] . '/.lock') ? true : false;
		$permsPath = $_POST['dirPath'] . '/.perms';
		$accreditedMembers = null;
		if(is_file($permsPath)) {
			$accreditedMembers = json_decode(file_get_contents($permsPath));
		}
		if(error_get_last() === null) {
			echo json_encode (
				array(
					'success' => true,
					'content' => array(
						'isRestricted' => $isRestricted,
						'accreditedMembers' => $accreditedMembers
					)
				)
			);
		}
	}
}