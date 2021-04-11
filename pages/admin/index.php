<?php 

require_once('../../app/server/config.php');

if(isAuthenticated() && $_SESSION['role'] === 'owner') { ?>

	<!DOCTYPE html>
		<html lang="fr">
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./admin.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | admin</title>
		</head>
		<body>
			<script src="./admin-i18n.js"></script>
			<script src="./admin-ui.js"></script>
			<script src="./admin-func.js"></script>
		</body>
	</html>
	
<?php }

else {
	header('Location: ../..');
}