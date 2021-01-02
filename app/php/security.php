<?php session_start();

// Create an authorized access.
function createAccess() {

	$_SESSION['token'] = session_id();
	$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];

}

// Verify an access.
function verifyAccess() {

	return 
		$_SESSION['token'] === session_id() && 
		$_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT'] ? 
		true : false;

}

// Destroy a session.
function destroyAccess() {

	$_SESSION = array();
	session_destroy();
	header('Location: ../../');
	
}

// Check if the user is in the root directory.
function inRootDirectory($dir) {
	return urldecode($dir) === DATAS_DIR_PATH || urldecode($dir) === RECYCLE_DIR_PATH ? true : false;
}

// Check if the user is within the authorized perimeter (data or recycle directory).
function inScopeDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', DATAS_DIR_PATH), -1)[0];
	$regex .= '|';
	$regex .= array_slice(explode('/', RECYCLE_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, urldecode($elm)) ? true : false;

}

// Check if the user is within the datas directory.
function inDatasDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', DATAS_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, urldecode($elm)) ? true : false;

}

// Check if the user is within the recycle directory.
function inRecycleDirectory($elm) {
	
	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', RECYCLE_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, urldecode($elm)) ? true : false;

}