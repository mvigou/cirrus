<?php 

require_once('../../app/server/config.php');

if(verifyAccess() && $_SESSION['userRole'] === 'owner') { ?>

	<!DOCTYPE html>
		<html lang="fr">
		<head>
			<meta charset="UTF-8">
			<link rel="stylesheet" href="./admin.css">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
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