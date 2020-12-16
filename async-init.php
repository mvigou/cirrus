<?php

/* 
Server side job : if necessary, create user folders.
Return : 'success' if done.
Called by : start.js.
*/

require_once('./common.php');

if(!is_dir(DATAS_DIR_PATH)) {
	if(!mkdir(DATAS_DIR_PATH)) {
		echo error_get_last()['message'];
	}
}
if(!is_dir(RECYCLE_DIR_PATH)) {
	if(!mkdir(RECYCLE_DIR_PATH)) {
		echo error_get_last()['message'];
	}
}
if(!is_dir(TEMP_DIR_PATH)) {
	if(!mkdir(TEMP_DIR_PATH)) {
		echo error_get_last()['message'];
	}
}

echo 'success';