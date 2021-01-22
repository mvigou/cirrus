<?php 

session_start();
ini_set('display_errors', true);
ini_set('html_errors', false);
error_reporting(E_ALL);

/* 
Job : log somes errors in a log file.
Return : Return : absolutely nothing if it's done. 
To : /app/js/functions.js | ajaxErrorLog
*/

define('ERROR_LOGS_FILENAME', '../../error-logs.html');

if(!file_exists(ERROR_LOGS_FILENAME)) {
	file_put_contents(ERROR_LOGS_FILENAME, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>cirrus | error logs</title><link rel="stylesheet" href="./app/css/log.css"></head><body><main>');
}

logError($_POST['serverLog'], $_POST['clientLog']);

function logError($serverLog, $clientLog) {

	if($serverLog === '') {
		$serverLog = PHP_EOL . '(nothing)' . PHP_EOL;
	}

	if($clientLog === '') {
		$clientLog = '(nothing)';
	}

	file_put_contents(
		
		ERROR_LOGS_FILENAME,

		"<p>
			<b>Error occured on </b> " . date('Y-m-d') . " <b>at</b> " . date('H:i:s') . ".<br/>
			<b>Log PHP</b> ${serverLog}<br/>
			<b>Log JS</b> ${clientLog}
		</p>",

		FILE_APPEND
	
	);

}