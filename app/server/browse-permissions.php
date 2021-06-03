<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['dirPath'])) {
		$isRestricted = is_file($_POST['dirPath'] . '/.lock') ? true : false;
		$perms = json_decode(file_get_contents($_POST['dirPath'] . '/.perms')); 
		if(error_get_last() === null) {
			echo json_encode (
				array(
					'success' => true,
					'content' => array(
						"isRestricted" => $isRestricted,
						'areAccredited' => $perms->areAccredited
					)
				)
			);
		}
	}
}