<?php 

/* 
Job : log somes errors in a log file.
Return : Return : absolutely nothing if it's done. 
To : ajaxLog
*/

require_once('./cir-config.php');

if(!file_exists(ERROR_LOGS_FILENAME)) {
	file_put_contents(ERROR_LOGS_FILENAME, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>cirrus | error logs</title><link rel="stylesheet" href="./app/client/css/log.css"></head><body><main>');
}

logError($_POST['origin'], $_POST['log']);

function logError($origin, $log) {

	file_put_contents(
		
		ERROR_LOGS_FILENAME,

		"<p>
			<b>Log:</b> ${log} <br/>
			<b>Origin:</b> ${origin} <br/>
			<b>Occured on:</b> " . date('Y-m-d') . " <b>at</b> " . date('H:i:s') . ".
		</p>",

		FILE_APPEND
	
	);

}