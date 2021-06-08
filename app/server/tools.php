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
function hasWritingRights() {
	return $_SESSION['role'] === 'owner' || $_SESSION['role'] === 'publisher' ? true : false;
}
function inScopeDirectory($elm) {
	return inDatasDirectory($elm) || inRecycleDirectory($elm) ? true : false;
}
function inDatasDirectory($elm) {
	global $env;
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', $env->contentDir), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function inRecycleDirectory($elm) {
	global $env;
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', $env->recycleDir), -1)[0];
	$regex .= '/';
	return preg_match($regex, $elm) ? true : false;
}
function buildTempDir() {
	global $env;
	if(count(scandir($env->tempDir)) - 2 === 10) {
		require_once('./remove-item.php');
		removeDir($env->tempDir);
	}
	return $env->tempDir . '/' . hash('sha512', random_bytes(18));
}