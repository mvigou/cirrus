<?php
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	if(isset($_POST['user-name'], $_POST['from-role'], $_POST['to-role'])) {
		if($_POST['from-role'] === 'viewer' && $_POST['to-role'] === 'publisher') {
			$fromPath = $env->viewersDir . '/' . $_POST['user-name'];
			$toPath = $env->publishersDir . '/' . $_POST['user-name'];
		}
		else if($_POST['from-role'] === 'publisher' && $_POST['to-role'] === 'viewer') {
			$fromPath = $env->publishersDir . '/' . $_POST['user-name'];
			$toPath = $env->viewersDir . '/' . $_POST['user-name'];
		}
		if(isset($fromPath, $toPath)) {
			if(rename($fromPath, $toPath)) {
				echo json_encode(array('success' => true));
			}
		}
	}
}