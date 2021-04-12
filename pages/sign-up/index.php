<?php

if(isset($_GET['role']) && isset($_GET['auth'])) { 

	if($_GET['role'] === 'owner' || $_GET['role'] === 'publisher' || $_GET['role'] === 'viewer') {
		
		if(is_file('../../datas/auth/sign-up-as-' . $_GET['role'] . '/' . $_GET['auth'])) { ?>

			<!DOCTYPE html>
				<html lang="fr">
				<head>
					<link rel="icon" href="../../app/client/cirrus-favicon.png" />
					<link rel="stylesheet" href="./sign-up.css" />
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>cirrus | créer un compte</title>
				</head>
				<body>
					<header>
						<h1>cirrus | <span>créer un compte</span></h1>
					</header>
					<form action="../../app/server/sign-up.php" method="POST">
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
						<button title="valider" type="submit"><svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg></button>
					</form>
					<script src="./sign-up.js"></script>
				</body>
			</html>
			
		<?php 

		}

	}

}