<?php

define('DATAS_DIR_PATH', './datas');
define('TRASH_DIR_PATH', './trash');
define('TEMP_DIR_PATH', './temp');

// Check if the user is in his data directory.
function inScopeDirectory($elm) {
    return preg_match('/^\.\/datas/', urldecode($elm)) ? true : false;
}

// Check if the user is in the root directory.
function inRootDirectory($dir) {
    return urldecode($dir) === DATAS_DIR_PATH ? true : false;
}