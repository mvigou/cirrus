<?php require_once('./config.php');

if(isset($_POST['origin']) && isset($_POST['log'])) {
	$file = LOGS_DIR . '/app-logs.json';
	if(!file_exists($file)) {
		touch($file);
	}
	if(filesize($file) === 0 || filesize($file) > 50000) {
		file_put_contents($file, '[]');
	}
	$json = json_decode(file_get_contents($file));
	array_push($json, array(
		"date" => date('Y-m-d') . ' / ' . date('H:i:s'),
		"source" => $_POST['origin'],
		"user" => $_SESSION['username'],
		"log" => trim($_POST['log'])
	));
	file_put_contents($file, json_encode($json));
	echo json_encode(array('success' => true));
}