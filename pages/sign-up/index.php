<?php

if(isset($_GET['role']) && isset($_GET['auth'])) { 

	if($_GET['role'] === 'owner' || $_GET['role'] === 'publisher' || $_GET['role'] === 'viewer') {
		
		if(is_file('../../datas/auth/sign-up-as-' . $_GET['role'] . '/' . $_GET['auth'])) { ?>

			<!DOCTYPE html>
				<html lang="fr">
				<head>
					<meta charset="UTF-8">
					<link rel="stylesheet" href="./sign-up.css">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>cirrus | création de compte</title>
				</head>
				<body>
					<header>
						<h1>cirrus</h1>
					</header>
					<form action="../../app/server/sign-up.php" method="POST">
						<h2>Créer un compte</h2>
						<label>
							Nom d'utilisateur
							<span>8 à 16 lettres et/ou chiffres</span>
							<input 
								id="user-name" 
								minlength="8"
								maxlength="24"
								name="user-name" 
								pattern="[a-zA-Z0-9]{8,16}" 
							/>
						</label>
						<label>
							Mot de passe
							<span>8 à 24 lettres, chiffres et/ou . ? ! - _ * + = / | \ ( ) [ ] # $ @ %</span>
							<input type="password" 
								id="user-pass" 
								minlength="8"
								maxlength="24"
								name="user-pass" 
								pattern="[a-zA-Z0-9.?!\-_*+=/|\\()[\]#$@%]{8,24}" 
							/>
						</label>
						<label>
							Confirmation mot de passe
							<input type="password" 
								id="user-pass-conf" 
								minlength="8"
								maxlength="24"
								name="user-pass-conf"
							/>
						</label>
						<input
							type="hidden"
							name="role"
							value="<?php echo $_GET['role'] ?>"
						/>
						<input
							type="hidden"
							name="auth"
							value="<?php echo $_GET['auth'] ?>"
						/>
						<button type="submit">Valider</button>
					</form>
					<script src="./sign-up.js"></script>
				</body>
			</html>
			
		<?php 

		}

	}

}