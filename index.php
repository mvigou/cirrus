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
			<main>
				<div 
					class="preview" 
					data-item-path="" >
					<div>
						<nav class="preview__nav">
							<button 
								class="start-trap" 
								onclick="openPreviewedItem()"
								title="Ouvrir dans un nouvel onglet">
								<svg viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>
							</button>
							<button 
								onclick="downloadPreviewedItem()"
								title="Télécharger">
								<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>
							</button>
							<button 
								class="end-trap" 
								onclick="unsetPreview()" 
								title="Fermer">
								<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
							</button>
						</nav>
						<div class="preview__item"></div>
					</div>
				</div>
			</main>
			<script src="./app/client/viewers.js"></script>
			<?php if(hasPublisherRights()) { ?>
				<script src="./app/client/publishers.js"></script>
			<?php } if(hasOwnerRights()) { ?>
				<script>const cirrusId = "<?php echo $env->cirrusId; ?>";</script>
				<script src="./app/client/owners.js"></script>
			<?php } ?>
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