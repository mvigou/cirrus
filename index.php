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
				<!-- Start actions menu -->
				<nav class="nav">	
					<div class="nav__left-ct"></div>
					<div class="nav__right-ct">
						<button 
							id="switchThemeBt"
							onclick="switchTheme()"
							title="Basculer entre thème clair / thème sombre">
							<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
						</button>
						<button 
							onclick="signOut()"
							title="Se déconnecter">
							<svg viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z"/></svg>
						</button>
					</div>
				</nav>
				<aside class="infos">
					<div class="tree"></div>
					<div class="counters">
						<!-- Display the number of visible directories -->
						<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>
						x <span id="dir-counter"></span>
						<!-- Display the number of visible files -->
						<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>
						x <span id="fil-counter"></span>
					</div>
				</aside>
				<!-- User content -->
				<ul class="list"></ul>
				<!-- Box for previewing content -->
				<div 
					class="preview" 
					data-item-path="" >
					<div>
						<nav class="preview__nav">
							<!-- Allow to open the previewed item in another tab -->
							<button 
								class="start-trap" 
								onclick="openPreviewedItem()"
								title="Ouvrir dans un nouvel onglet">
								<svg viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>
							</button>
							<!-- Allow to download the previewed item -->
							<button 
								onclick="downloadPreviewedItem()"
								title="Télécharger">
								<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>
							</button>
							<!-- Close the preview -->
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
				<!-- Popup -->
				<div class="popup">	
					<object
						alt="logo cirrus"
						class="popup__object"
						data="/app/client/cirrus-logo.svg"
						type="image/svg+xml" >
					</object>
					<p class="popup-confirm">Relâchez sur l'option pour valider, relâchez ailleurs pour annuler</p>
					<p class="popup-download">Téléchargement en cours, veuillez patienter</p>
				</div>
			</main>
			<script src="./app/client/viewers.js"></script>
			<?php if(hasPublisherRights()) { ?>
				<script src="./app/client/publishers.js"></script>
			<?php } if(hasOwnerRights()) { ?>
				<script>const cirrusId = "<?php echo $env->cirrusId; ?>";</script>
				<script src="./app/client/owners.js"></script>
			<?php } ?>
			<script src="./app/client/start.js"></script>
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