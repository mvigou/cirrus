<?php 

if(isset($_GET['auth'])) {
	header('Location: ../../app/server/sign-in.php?auth=' . $_GET['auth']);
	exit();
}

require('../../app/server/tools.php'); ?>
<!DOCTYPE html>
	<html lang="fr">
	<head>
		<link rel="icon" href="../../app/client/cirrus-favicon.png" />
		<link rel="manifest" href="../../manifest.json">
		<link rel="apple-touch-icon" href="../../app/client/cirrus-logo-192.png">
		<link rel="stylesheet" href="./style.min.css" />
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>cirrus | se connecter</title>
	</head>
	<body>
		<main>		
			<h1>cirrus | <span>se connecter</span></h1>
			<form action="../../app/server/sign-in.php" method="POST">
				<?php if(isset($_GET['error'])) {
					$mess = '';
					switch($_GET['error']) {
						case 'wrong-link':
							$mess = 'Lien d\'accès public invalide.';
							break;
						
						case 'wrong-user':
							$mess = 'Aucun utilisateur de ce nom.';
							break;
						
						case 'wrong-password':
							$mess = 'Mot de passe invalide.';
							break;
					}
					echo '<p style="color:#f44;">' . $mess . '</p>';
				} ?>
				<label>
					Nom d'utilisateur
					<input 
						id="user-name" 
						minlength="8"
						maxlength="24"
						name="user-name" 
						pattern="[a-zA-Z0-9]{8,16}" 
						required
					/>
				</label>
				<label class="password">
					Mot de passe
					<input type="password" 
						id="user-pass" 
						minlength="8"
						maxlength="24"
						name="user-pass" 
						pattern="[a-zA-Z0-9.?!\-_*+=/|\\()[\]#$@%]{8,24}" 
						required
					/>
					<button title="Afficher / Masquer la saisie" type="button">
						<svg viewBox="0 0 512 512"><path d="M255.66,112c-77.94,0-157.89,45.11-220.83,135.33a16,16,0,0,0-.27,17.77C82.92,340.8,161.8,400,255.66,400,348.5,400,429,340.62,477.45,264.75a16.14,16.14,0,0,0,0-17.47C428.89,172.28,347.8,112,255.66,112Z" /><circle cx="256" cy="256" r="80" style="stroke:#000;stroke-width:32px"/></svg>
					</button>
				</label>
				<button title="Se connecter" type="submit"><svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg></button>
			</form>
			<img 
				alt="Logo cirrus"
				src="../../app/client/cirrus-logo-alt.svg"
			/>
		</main>
		<script src="./script.js"></script>
    </body>
</html>