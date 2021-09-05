<?php
session_start();
require_once('./tools.php');

if(isAuthenticated() && isOwner()) {
	if(isset($_POST['user-name'], $_POST['from-role'], $_POST['to-role'])) {
		if($_POST['from-role'] === 'viewer' && $_POST['to-role'] === 'publisher') {
			$fromPath = "../../datas/users/viewers/{$_POST['user-name']}";
			$toPath = "../../datas/users/publishers/{$_POST['user-name']}";
		}
		else if($_POST['from-role'] === 'publisher' && $_POST['to-role'] === 'viewer') {
			$fromPath = "../../datas/users/publishers/{$_POST['user-name']}";
			$toPath = "../../datas/users/viewers/{$_POST['user-name']}";
		}
		if(isset($fromPath, $toPath)) {
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}