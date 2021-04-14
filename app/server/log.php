<?php 

/* 
Job : log somes errors in a log file.
Return : Return : absolutely nothing if it's done. 
To : ajaxLog
*/

require_once('./config.php');

if(isset($_POST['origin']) && isset($_POST['log'])) {

	$logsFile = LOGS_DIR . '/index.php';

	if(!file_exists($logsFile)) {

		touch($logsFile);

		file_put_contents($logsFile, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>cirrus | error logs</title><style>@font-face{font-display:swap;font-family:"Josefin";src:url("../../app/client/josefin.woff2") format("woff2")}body{margin:0}main{--bg-color: #fff;--border-color: #eee;--danger-color: #f33;--fill-color: #ccc;--font-color-hight: #333;--font-color-low: #666;--main-color: #a00c3d;color:var(--font-color-hight);display:flex;flex-direction:column-reverse;font-family:Josefin,sans-serif}p{border-bottom:solid 1px var(--fill-color);margin:0 15px;padding:15px}b{color:var(--main-color)}</style></head><body><main>');
		
	}

	file_put_contents(
		
		$logsFile,

		'<p>' .
			'<b>Log: </b>' . $_POST['log'] .'<br/>' .
			'<b>Origin: </b>' . $_POST['origin'] . '<br/>' .
			'<b>Occured on: </b>' . date('Y-m-d') . ' <b>at</b> ' . date('H:i:s') . '.' .
		'</p>',

		FILE_APPEND
	
	);

}