<?php

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

define('LANG', 'fr');
define('DATAS', '../../datas');

define('CONTENT_DIR', DATAS . '/content');
define('RECYCLE_DIR', DATAS . '/recyle');

define('OWNERS_DIR', DATAS . '/users/owners');
define('PUBLISHERS_DIR', DATAS . '/users/publishers');
define('VIEWERS_DIR', DATAS . '/users/viewers');

define('SIGN_UP_OWNER_AUTH_DIR', DATAS . '/auth/sign-up-as-owner');
define('SIGN_UP_PUBLISHER_AUTH_DIR', DATAS . '/auth/sign-up-as-publisher');
define('SIGN_UP_VIEWER_AUTH_DIR', DATAS . '/auth/sign-up-as-viewer');

define('TEMP_DIR', DATAS . '/temp');
define('LOGS_DIR', DATAS . '/logs');

function isAuthenticated() {
	if(isset($_SESSION['token']) && isset($_SESSION['browser'])) {
		if($_SESSION['token'] === session_id() && $_SESSION['browser'] === $_SERVER['HTTP_USER_AGENT']) {
			return true;
		}	
	}
	return false;
}

function hasOwnerRights() {
	if(isset($_SESSION['role'])) {
		if($_SESSION['role'] === 'owner') {
			return true;
		}
	}
	return false;
}

function hasWritingRights() {
	if(isset($_SESSION['role'])) {
		if($_SESSION['role'] === 'owner' || $_SESSION['role'] === 'publisher') {
			return true;
		}
	}
	return false;
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

function buildTempDir() {
	if(count(scandir(TEMP_DIR)) - 2 === 10) {
		clearTempDir();
	}
	return TEMP_DIR . '/' . hash('sha512', random_bytes(18));
}
function clearTempDir() {
	require_once('./ct-remove.php');
	removeDir(TEMP_DIR);
}

function buildValidName($name) {
	return str_replace(["<", ">", ":", "/", "\\", "|", "?", "*", "\""], '-', $name);
}