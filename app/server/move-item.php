<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['fromPath']) && isset($_POST['toPath'])) {
		if(inScopeDirectory($_POST['fromPath']) && inScopeDirectory($_POST['toPath'])) {
			while(is_file($_POST['toPath'])) {
				$_POST['toPath'] .= '-copy';
			}
			if(rename($_POST['fromPath'], $_POST['toPath'])) {
				echo json_encode(
					array(
						'success' => true
					)
				);
			}
		}
	}
}