<?php

function createAccess() {

	$_SESSION['token'] = session_id();
	$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];

}

function destroyAccess() {

	$_SESSION = array();
	session_destroy();
	header('Location: /');
	
}

function verifyAccess() {

	if(isset($_SESSION['token']) && isset($_SESSION['browser'])) {
		if($_SESSION['token'] === session_id() && $_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT']) {
			return true;
		}	
	}
	return false;
	
}

function inRootDirectory($dir) {
	return $dir === DATAS_DIR_PATH || $dir === RECYCLE_DIR_PATH ? true : false;
}

function inScopeDirectory($elm) {
	return inDatasDirectory($elm) || inRecycleDirectory($elm) ? true : false;
}

function inDatasDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', DATAS_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

function inRecycleDirectory($elm) {
	
	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', RECYCLE_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

function buildValidName($rawName) {
	return str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $rawName);
}

function relPathFromClient($relPathFromServer) {
	return str_replace('../../', './', $relPathFromServer);
}