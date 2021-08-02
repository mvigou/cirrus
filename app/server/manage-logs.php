<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['action'])) {
		if($_POST['action'] === 'browse') {
			$logs = explode('[', file_get_contents('../../datas/logs/app-errors.txt'));
			$content;
			if(count($logs) > 0) {
				$content = array();
				foreach($logs as $log) {
					array_push(
						$content, $log
					);
				}
			}
			if(error_get_last() === null) {
				echo json_encode (
					array(
						'success' => true,
						'content' => $logs
					)
				);
			}
		}
		else if($_POST['action'] === 'remove') {
			file_put_contents('../../datas/logs/app-errors.txt', ''); 
			if(error_get_last() === null) {
				echo json_encode (array('success' => true ));
			}
		}
	}
}