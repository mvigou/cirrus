<?php 

require_once('./config.php');

if(isAuthenticated() && hasOwnerRights()) {

	$userProfiles = array(
		array(
			'role' => 'owner',
			'dir' => OWNERS_DIR
		), 
		array(
			'role' => 'publisher',
			'dir' => PUBLISHERS_DIR
		), 
		array(
			'role' => 'viewer',
			'dir' => VIEWERS_DIR
		)
	);

	$content = '';
	$state = '';

	foreach($userProfiles as $userProfile) {
		$usersIn = array_diff(scandir($userProfile['dir']), array('.', '..'));
		if(count($usersIn) > 0) {
			foreach($usersIn as $userIn) {
				$content .= '(' . $userProfile['role'] . ') ' . $userIn . '<br/>'; 
			}
		}
		$state = 'success';
	}
	
	echo json_encode (
		array(
			'state' => $state,
			'content' => $content
		)
	);

}