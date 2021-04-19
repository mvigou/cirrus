<?php 

require_once('./config.php');

if(isset($_POST['origin']) && isset($_POST['log'])) {

	$logsFile = LOGS_DIR . '/errors.html';

	if(!file_exists($logsFile)) {

		touch($logsFile);

		file_put_contents($logsFile, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>cirrus | error logs</title></head><body><main>');
		
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

	echo json_encode(array('state' => 'success'));

}