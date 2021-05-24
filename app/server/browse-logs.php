<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if($logs = file_get_contents($env->logsDir . '/app-errors.txt')) {
		echo json_encode (
			array(
				'success' => true,
				'content' => $logs
			)
		);
	}
}