<?php require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {
	$userProfiles = array(
		array(
			'role' => 'publisher',
			'dir' => PUBLISHERS_DIR
		), 
		array(
			'role' => 'viewer',
			'dir' => VIEWERS_DIR
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