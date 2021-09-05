<?php
ini_set('log_errors', 1);
ini_set('error_log', '../../datas/logs/app-errors.txt');
if(!isset($env)) {
	$env = json_decode(file_get_contents('../../datas/env.json'));
}
function isAuthenticated() {
	global $env;
	return 
		$_SESSION['token'] === session_id() && 
		$_SESSION['cirrusId'] === $env->cirrusId && 
		$_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT'] ? 
		true : false;
}
function isOwner() { return $_SESSION['role'] === 'owner' ? true : false; }
function isPublisher() { return $_SESSION['role'] === 'owner' || $_SESSION['role'] === 'publisher' ? true : false; }
function inDataDir($elm) {
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', '../../datas/content'), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function inRecycleDir($elm) {
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', '../../datas/recyle'), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function getFreePath($path) {
	if(is_file($path) || is_dir($path)) {
		$basePath = $path; 
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$i = 1;
		// File without extension or directory (rename at the end).
		if($ext === '' || is_dir($path)) {
			while(is_file($path) || is_dir($path)) {
				$path = $basePath;
				$path .= '(' . $i . ')';
				$i++;
			}
		}
		// File with extension (rename before the latest dot).
		else {
			$baseNoExt = substr($basePath, 0, strrpos($basePath, '.'));
			while(is_file($path)) {
				$path = $baseNoExt;
				$path .= '(' . $i . ').';
				$path .= $ext;
				$i++;
			}
		}
	}
	return $path;
}
function getValidName($filename) { return str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $filename); }
function isDirReadableBy($dir, $user) {
	// Protected directory.
	if(is_file($dir . '/.lock')) {
		if(isOwner()) {
			return true;
		}
		else if(is_file($dir . '/.perms')) {
			if(in_array($user, json_decode(file_get_contents($dir . '/.perms')))) {
				return true;
			}
		}
	}
	// Public directory.
	else {
		return true;
	}
	return false;
}
function buildTempDir() {
	if(count(scandir('../../datas/temp')) - 2 === 10) {
		removeThisDir('../../datas/temp');
	}
	return '../../datas/temp' . '/' . hash('sha512', random_bytes(18));
}
function removeThisDir($dir) {
	foreach(array_diff(scandir($dir), array('..', '.')) as $item) {
		$itemPath = $dir . '/' . $item;
		if(is_file($itemPath)) {
			unlink($itemPath);
		}
		else {
			removeThisDir($itemPath);	
		}
	}
	if($dir !== '../../datas/temp') {
		rmdir($dir);
	}
}