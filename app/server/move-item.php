<?php
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['fromPath'], $_POST['toPath'])) {
		if(
			(hasPublisherRights() && inDatasDirectory($_POST['fromPath']) && inDatasDirectory($_POST['toPath'])) ||
			(hasOwnerRights() && inScopeDirectory($_POST['fromPath']) && inScopeDirectory($_POST['toPath']))
		) {
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