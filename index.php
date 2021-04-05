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
	
	<?php require_once('./app/server/security.php');

	if(verifyAccess()) { ?>
		<script src="/app/client/js/i18n.js"></script>
		<script src="/app/client/js/func-ajax.js"></script>
		<script src="/app/client/js/func-core.js"></script>
		<script src="/app/client/js/func-ui.js"></script>	
		<script src="/app/client/js/interface.js"></script>
		<script src="/app/client/js/start.js"></script>
	<?php }
	else { 
		header('Location: /app/pages/log-in');
	} ?>

</body>
</html>