<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated()) {
	if(isset($_POST['oldItemPath'], $_POST['newItemPath'])) {
		if(
			(hasPublisherRights() && inDatasDirectory($_POST['oldItemPath']) && inDatasDirectory($_POST['newItemPath'])) ||
			(hasOwnerRights() && inScopeDirectory($_POST['oldItemPath']) && inScopeDirectory($_POST['newItemPath']))
		) {
			if(copy($_POST['oldItemPath'], getFreePath($_POST['newItemPath']))) {
				echo json_encode(array('success' => true));
			}
		}
	}
}