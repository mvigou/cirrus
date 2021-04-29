<?php require_once('./config.php');

if(isset($_POST['origin']) && isset($_POST['log'])) {
	$file = LOGS_DIR . '/app.json';
	if(filesize($file) > 50000) {
		file_put_contents($file, '[]');
	}
	$json = json_decode(file_get_contents($file));
	array_push($json, array(
		"in" => $_POST['origin'],
		"on" => date('Y-m-d') . ' / ' . date('H:i:s'),
		"by" => $_SESSION['username'],
		"log" => trim($_POST['log'])
	));
	file_put_contents($file, json_encode($json));
	echo json_encode(array('success' => true));
}