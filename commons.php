<?php

define('DATAS_FOLDER_BASE', './datas');
define('TRASH_FOLDER_BASE', './trash');

// Check if the user is in his data directory.
function inScopeDir($elm) {
    return preg_match('/^\.\/datas/', urldecode($elm)) ? true : false;
}

// Check if the user is in the root directory.
function inRootDir($dir) {
    return urldecode($dir) === DATAS_FOLDER_BASE ? true : false;
}