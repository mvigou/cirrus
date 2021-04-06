<?php

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

define('DATAS_DIR_PATH', '../../datas');
define('RECYCLE_DIR_PATH', '../../recycle');
define('TEMP_DIR_PATH', '../../temp');
define('USERS_DIR_PATH', '../users/');
define('SIGN_UP_AUTH_DIR_PATH', '../auth/sign-up');
define('ERROR_LOGS_FILENAME', '../../logs.html');