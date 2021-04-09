<?php

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

define('TEMP_DIR', '../../temp');

define('DATAS', '../../datas');

define('CONTENT_DIR', DATAS . '/content');
define('RECYCLE_DIR', DATAS . '/recyle');

define('OWNERS_DIR', DATAS . '/users/owners');
define('VIEWERS_DIR', DATAS . '/users/viewers');

define('SIGN_UP_OWNER_AUTH_DIR', DATAS . '/auth/sign-up-as-owner');
define('SIGN_UP_VIEWER_AUTH_DIR', DATAS . '/auth/sign-up-as-viewer');

define('LOGS_FILE', '../../pages/logs/index.html');