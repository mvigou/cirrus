<?php session_start(); ?>

<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="/app/client/css/app.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cirrus | Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces</title>
	</head>
	<body>
	
	<?php
	
	require_once('./app/server/cir-security.php');

	// Identified user ? Start the app.
	if(verifyAccess()) { ?>

		<script src="/app/client/js/i18n.js"></script>
		<script src="/app/client/js/func-ajax.js"></script>
		<script src="/app/client/js/func-core.js"></script>
		<script src="/app/client/js/func-ui.js"></script>	
		<script src="/app/client/js/interface.js"></script>
		<script src="/app/client/js/start.js"></script>
	
	<?php }

	// Unidentified user ?
	else {

		// Users exist ? Ask for log in.
		if(is_dir('./app/users')) {
			header('Location: /app/sign-in');
			exit();
		}

		// No user yet ? Ask for create the first.
		header('Location: /app/server/cir-install.php');
		exit();
	} ?>

</body>
</html>