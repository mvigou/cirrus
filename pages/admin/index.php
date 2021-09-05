<?php 
session_start();
require('../../app/server/tools.php');
if(isAuthenticated() && isOwner()) { ?>
	<!DOCTYPE html>
		<html lang="fr">
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./style.min.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | administration</title>
		</head>
		<body>
			<script src="./owners.min.js"></script>
		</body>
	</html>
<?php }
else {
	header('Location: ../..');
}