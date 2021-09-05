<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && isOwner()) {
	if(isset($_POST['user-name'], $_POST['user-role'])) {
		if($_POST['user-role'] === 'viewer') {
			$path = "../../datas/users/viewers/{$_POST['user-name']}";
		}
		else if($_POST['user-role'] === 'publisher') {
			$path = "../../datas/users/publishers/{$_POST['user-name']}";
		}
		if(isset($path)) {
			if(unlink($path)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}