<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['fromPath'], $_POST['toPath'])) {
		if(
			(inDataDir($_POST['fromPath']) && inDataDir($_POST['toPath']) && isPublisher()) ||
			(inRecycleDir($_POST['fromPath']) && inRecycleDir($_POST['toPath']) && isOwner())
		) {
			if(copy($_POST['fromPath'], getFreePath($_POST['toPath']))) {
				echo json_encode(array('success' => true));
			}
		}
	}
}