<?php 
session_start();
require_once('./tools.php');

if(isAuthenticated() && hasWritingRights()) {
	global $env;
	if(isset($_POST['item'])) {
		if($_POST['item'] === 'RECYCLE') {
			$_POST['item'] = $env->recycleDir;	
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
		if(error_get_last() === null) {
			echo json_encode(array('success' => true));
		}
	}
}

function moveToRecycle($elm) {
	global $env;
	$fileName = array_slice(explode('/', $elm), -1)[0];
	$fromPath = $elm;
	$toPath = $env->recycleDir . '/' . $fileName;
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
	global $env;
	foreach(array_diff(scandir($dir), array('..', '.')) as $item) {
		$itemPath = $dir . '/' . $item;
		if(is_file($itemPath)) {
			unlink($itemPath);
		}
		else {
			removeDir($itemPath);	
		}
	}
	if($dir !== $env->recycleDir && $dir !== $env->tempDir) {
		rmdir($dir);
	}
}