<?php
ini_set('log_errors', 1);
ini_set('error_log', '../../datas/logs/app-errors.txt');
if(!isset($env)) {
	$env = json_decode(file_get_contents('../../datas/env.json'));
}
function isAuthenticated() {
	global $env;
	if(
		$_SESSION['token'] === session_id() && 
		$_SESSION['cirrusId'] === $env->cirrusId && 
		$_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT']
	) {
		return true;
	}
	return false;
}
function hasOwnerRights() {
	return $_SESSION['role'] === 'owner' ? true : false;
}
function hasPublisherRights() {
	return $_SESSION['role'] === 'owner' || $_SESSION['role'] === 'publisher' ? true : false;
}
function inScopeDirectory($elm) {
	return inDatasDirectory($elm) || inRecycleDirectory($elm) ? true : false;
}
function inDatasDirectory($elm) {
	global $env;
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', '../../datas/content'), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function inRecycleDirectory($elm) {
	global $env;
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', '../../datas/recyle'), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function buildTempDir() {
	global $env;
	if(count(scandir('../../datas/temp')) - 2 === 10) {
		removeThisDir('../../datas/temp');
	}
	return '../../datas/temp' . '/' . hash('sha512', random_bytes(18));
}
function removeThisDir($dir) {
	global $env;
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