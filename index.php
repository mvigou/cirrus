<?php session_start(); ?>

<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="./app/css/style.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cirrus | Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces</title>
	</head>
	<body>
	
	<?php require_once('./app/php/security.php');

	// Not authenticated ? Login first !
	if(!verifyAccess()) { ?>

		<script src="./app/js/login.js"></script>	
		<log-form>
			<?php if(isset($_GET['log-error'])) {
				echo '<em slot="log-error">' . $_GET['log-error'] . '</em>';
			} ?>
		</log-form>
	
	<?php }
	
	// Access granted. 
	else { ?>

		<script src="./app/js/chess.js"></script>
		<script src="./app/js/i18n.js"></script>
		<script src="./app/js/interface.js"></script>
		<script src="./app/js/functions.js"></script>
		<script src="./app/js/start.js"></script>
	
	<?php } ?>

</body>
</html>