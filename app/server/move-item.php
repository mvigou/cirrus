<?php
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['oldItemPath'], $_POST['newItemPath'])) {
		if(
			(hasPublisherRights() && inDatasDirectory($_POST['oldItemPath']) && inDatasDirectory($_POST['newItemPath'])) ||
			(hasOwnerRights() && inScopeDirectory($_POST['oldItemPath']) && inScopeDirectory($_POST['newItemPath']))
		) {
			if(is_file($_POST['newItemPath'])) {
				$basePath = $_POST['newItemPath']; 
				$i = 1;
				while(is_file($_POST['newItemPath'])) {
					$_POST['newItemPath'] = $basePath;
					$_POST['newItemPath'] .= '(' . $i . ')';
					$i++;
				}
			}
			if(rename($_POST['oldItemPath'], $_POST['newItemPath'])) {
				echo json_encode(array('success' => true));
			}
		}
	}
}