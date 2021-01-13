<?php // session_start() is not required : this script is always called an other.

// Create an authorized access.
function createAccess() {

	$_SESSION['token'] = session_id();
	$_SESSION['browser'] = $_SERVER['HTTP_USER_AGENT'];

}

// Verify an access.
function verifyAccess() {

	if(isset($_SESSION['token']) && isset($_SESSION['browser'])) {
		if($_SESSION['token'] === session_id() && $_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT']) {
			return true;
		}	
	}
	return false;
	
}

// Destroy a session.
function destroyAccess() {

	$_SESSION = array();
	session_destroy();
	header('Location: ../../');
	
}

// Check if the user is in the root directory.
function inRootDirectory($dir) {
	return $dir === DATAS_DIR_PATH || $dir === RECYCLE_DIR_PATH ? true : false;
}

// Check if the user is within the authorized perimeter (data or recycle directory).
function inScopeDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', DATAS_DIR_PATH), -1)[0];
	$regex .= '|';
	$regex .= array_slice(explode('/', RECYCLE_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

// Check if the user is within the datas directory.
function inDatasDirectory($elm) {

	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', DATAS_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

// Check if the user is within the recycle directory.
function inRecycleDirectory($elm) {
	
	$regex = '/^\.\.\/\.\.\/';
	$regex .= array_slice(explode('/', RECYCLE_DIR_PATH), -1)[0];
	$regex .= '/';

	return preg_match($regex, $elm) ? true : false;

}

function buildValidName($rawName) {

	return str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $rawName);

}