<?php require_once('./config.php');

if(isAuthenticated() && hasWritingRights()) {
	if(isset($_POST['item'])) {
		if($_POST['item'] === 'RECYCLE') {
			$_POST['item'] = RECYCLE_DIR;	
		}
		if(inDatasDirectory($_POST['item'])) {
			moveToRecycle($_POST['item']);
		}
		else if(inRecycleDirectory($_POST['item'])) {	
			if(is_file($_POST['item'])) {
				unlink($_POST['item']);
			}
			else {
				removeDir($_POST['item']);
			}
		}
		echo json_encode(array('success' => true));
	}
}

function moveToRecycle($elm) {
	$fileName = array_slice(explode('/', $elm), -1)[0];
	$fromPath = $elm;
	$toPath = RECYCLE_DIR . '/' . $fileName;
	if(is_file($toPath) || is_dir($toPath)) {
		$basePath = $toPath; 
		$i = 1;
		while(is_file($toPath) || is_dir($toPath)) {
			$toPath = $basePath;
			$toPath .= '(' . $i . ')';
			$i++;
		}
	}
	rename($fromPath, $toPath);
}

function removeDir($dir) {
	foreach(array_diff(scandir($dir), array('..', '.')) as $item) {
		$itemPath = $dir . '/' . $item;
		if(is_file($itemPath)) {
			unlink($itemPath);
		}
		else {
			removeDir($itemPath);	
		}
	}
	if($dir !== RECYCLE_DIR && $dir !== TEMP_DIR) {
		rmdir($dir);
	}
}