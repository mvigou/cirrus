<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasOwnerRights()) {
	$userProfiles = array(
		array(
			'role' => 'publisher',
			'dir' => $env->publishersDir
		), 
		array(
			'role' => 'viewer',
			'dir' => $env->viewersDir
		)
	);
	$users = array();
	foreach($userProfiles as $userProfile) {
		$usersIn = array_diff(scandir($userProfile['dir']), array('.', '..'));
		if(count($usersIn) > 0) {
			foreach($usersIn as $userIn) {
				array_push(
					$users, array(
						"role" => $userProfile['role'],
						"name" => $userIn
					)
				);
			}
		}
	}
	if(error_get_last() === null) {
		echo json_encode (
			array(
				'success' => true,
				'content' => $users
			)
		);
	}
}