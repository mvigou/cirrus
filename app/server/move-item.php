<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['fromPath']) && isset($_POST['toPath'])) {
		if(inScopeDirectory($_POST['fromPath']) && inScopeDirectory($_POST['toPath'])) {
			if(is_file($_POST['toPath'])) {
				$basePath = $_POST['toPath']; 
				$i = 1;
				while(is_file($_POST['toPath'])) {
					$_POST['toPath'] = $basePath;
					$_POST['toPath'] .= '(' . $i . ')';
					$i++;
				}
			}
			if(rename($_POST['fromPath'], $_POST['toPath'])) {
				echo json_encode(array('success' => true));
			}
		}
	}
}