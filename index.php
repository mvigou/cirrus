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
	
	// Identified user ? Start the app.
	if(isAuthenticated()) { ?>

		<script src="./app/client/app-i18n.js"></script>
		<script src="./app/client/app-func.js"></script>
		<script src="./app/client/app-ui.js"></script>
		<script src="./app/client/app-pref.js"></script>

		<?php if($_SESSION['role'] === 'owner' || $_SESSION['role'] === 'publisher') { ?>

			<script>
				document.body.classList.add('--publisher');
			</script>

		<?php }
	
	}

	// Unidentified user ?
	else {

		// Data folder exists ? Ask for log in.
		if(is_dir('./datas')) {
			header('Location: ./pages/sign-in');
			exit();
		}

		// Else, launch installation.
		header('Location: ./app/server/install.php');
		exit();
	} ?>

</body>
</html>