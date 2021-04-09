<?php

function verifyAccess() {

	if(isset($_SESSION['token']) && isset($_SESSION['browser'])) {
		if($_SESSION['token'] === session_id() && $_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT']) {
			return true;
		}	
	}
	return false;
	
}

function inRootDirectory($dir) {
	return $dir === CONTENT_DIR || $dir === RECYCLE_DIR ? true : false;
}

function inScopeDirectory($elm) {
	return inDatasDirectory($elm) || inRecycleDirectory($elm) ? true : false;
}

function inDatasDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', CONTENT_DIR), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

function inRecycleDirectory($elm) {
	
	$regex = '/^\.\.\/\.\.\/datas\/';
	$regex .= array_slice(explode('/', RECYCLE_DIR), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

function buildValidName($rawName) {
	return str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $rawName);
}

function relPathFromClient($relPathFromServer) {
	return str_replace('../../', './', $relPathFromServer);
}