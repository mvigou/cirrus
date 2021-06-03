<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['parent']) && isset($_POST['dirs'])) {		
		if(inScopeDirectory($_POST['parent'])) {
			$dirName = $_POST['parent'] . '/' . str_replace(["<", ">", ":", "\\", "|", "?", "*", "\""], '-', $_POST['dirs']);
			if(is_dir($dirName)) {
				$baseName = $dirName; 
				$i = 1;
				while(is_dir($dirName)) {
					$dirName = $baseName;
					$dirName .= '(' . $i . ')';
					$i++;
				}
			}
			if(mkdir($dirName, 0777, true)) {
				if(touch($dirName . '/' . $env->PermsFileName)) {
					if(file_put_contents(
						$dirName . '/' . $env->PermsFileName, 
						'{"isRestricted": false, "areAccredited": []}'
					)) {
						echo json_encode(array('success' => true));
					} 
				}
			}
		}
	}
}