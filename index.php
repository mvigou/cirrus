<?php require_once('./app/server/config.php'); ?>

<!DOCTYPE html>
	<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="./app/client/app.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cirrus | Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces</title>
	</head>
	<body>
	
	<?php
	
	if(isAuthenticated()) { ?>

		<script src="./app/client/app-i18n.js"></script>
		<script src="./app/client/app-func.js"></script>
		<script src="./app/client/app-ui.js"></script>
		<script src="./app/client/app-pref.js"></script>

		<?php if(hasWritingRights()) { 
			echo "<script>document.body.classList.add('--publisher');</script>";
		}
	
	}

	else {

		if(is_dir('./datas')) {
			header('Location: ./pages/sign-in');
			exit();
		}

		header('Location: ./app/server/install.php');
		exit();

	} ?>

</body>
</html>