<?php 
session_start();
$env = json_decode(file_get_contents('../../datas/env.json'));
require('../../app/server/tools.php');
if(isAuthenticated() && hasOwnerRights()) { ?>
	<!DOCTYPE html>
		<html lang="<?php echo $env->lang; ?>">
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./style.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | administration</title>
		</head>
		<body>
			<main class="admin">
				<header>
					<img 
						alt="Logo cirrus"
						src="../../app/client/cirrus-logo-alt.svg"
					/>
					<h1>cirrus | <span>administration</span></h1>
				</header>
				<button 
					onclick="switchTheme()"
					title="Basculer entre thème clair / thème sombre">
					<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
				</button>
				<a href="../../">Retour</a>
				<details ontoggle="managePublicAccess('browse')">
					<summary>Lien d'accès public</summary>
					<ul id="public-access__list"></ul>
					<button onclick="managePublicAccess('create')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						Activer le lien d'accès public
					</button>
					<button onclick="managePublicAccess('remove')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						Désactiver le lien d'accès public
					</button>
				</details>
				<details ontoggle="manageInvitations('browse', 'viewer')">
					<summary>Invitations "visualiseur"</summary>
					<ul id="viewer__list"></ul>
					<button onclick="manageInvitations('create', 'viewer')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						Générer un lien d'inscription
					</button>
					<button onclick="manageInvitations('remove', 'viewer')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						Supprimer les invitations
					</button>
				</details>
				<details ontoggle="manageInvitations('browse', 'publisher')">
					<summary>Invitations "éditeur"</summary>
					<ul id="publisher__list"></ul>
					<button onclick="manageInvitations('create', 'publisher')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						Générer un lien d'inscription
					</button>
					<button onclick="manageInvitations('remove', 'publisher')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						Supprimer les invitations
					</button>
				</details>
				<details ontoggle="browseUsers()">
					<summary>Gérer les utilisateurs</summary>
					<ul id="users__list"></ul>
				</details>
				<details ontoggle="manageLogs('browse')">
					<summary>Journaux</summary>
					<ul id="logs__list"></ul>
					<button 
						onclick="manageLogs('remove')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						Purger les journaux
					</button>
				</details>
			</main>
			<script src="./owners.js"></script>
		</body>
	</html>
<?php }
else {
	header('Location: ../..');
}