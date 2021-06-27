<?php 
session_start();
if(is_dir('./datas')) {
	$env = json_decode(file_get_contents('./datas/env.json'));
	require('./app/server/tools.php');
	if(isAuthenticated()) { ?>
		<!DOCTYPE html>
		<html lang="fr">
		<head>
			<link rel="icon" href="./app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./app/client/style.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces</title>
		</head>
		<body>
			<main></main>
			<script src="./app/client/viewers.js"></script>
			<?php if(hasPublisherRights()) { ?>
				<script src="./app/client/publishers.js"></script>
			<?php } if(hasOwnerRights()) { ?>
				<script>const cirrusId = "<?php echo $env->cirrusId; ?>";</script>
				<script src="./app/client/owners.js"></script>
			<?php } ?>
			<script>
				if(localStorage.getItem('theme') === 'dark') {
					toDarkTheme();
				}
				browseDirectory('DATAS');
			</script>
		</body>
	</html>
	<?php }
	else {
		header('Location: ./pages/sign-in');
		exit();
	}
}
else {
	header('Location: ./app/server/install.php');
	exit();
}