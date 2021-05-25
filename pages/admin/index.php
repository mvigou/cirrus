<?php 
session_start();
$env = json_decode(file_get_contents('../../datas/env.json'));
$lab = json_decode(file_get_contents('./i18n-' . $env->lang . '.json'));
require('../../app/server/tools.php');
if(isAuthenticated() && hasOwnerRights()) { ?>
	<!DOCTYPE html>
		<html lang="<?php echo $env->lang; ?>">
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./style.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | <?php echo $lab->title->page; ?></title>
		</head>
		<body>
			<main class="admin">
				<header>
					<img 
						alt="Logo cirrus"
						src="../../app/client/cirrus-logo-alt.svg"
					/>
					<h1>cirrus | <span><?php echo $lab->title->page; ?></span></h1>
				</header>
				<!-- Toggle between light and dark theme. -->
				<button 
					onclick="switchTheme()"
					title="<?php echo $lab->bt->switchTheme; ?>">
					<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
				</button>
				<!-- Create, remove a public access. -->
				<details ontoggle="managePublicAccess('browse')">
					<summary><?php echo $lab->title->manPublicAccess; ?></summary>
					<ul id="public-access__list"></ul>
					<button onclick="managePublicAccess('create')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->addPublicAccess; ?>
					</button>
					<button onclick="managePublicAccess('remove')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmPublicAccess; ?>
					</button>
				</details>
				<!-- list, create and remove publisher invitations -->
				<details ontoggle="manageInvitations('browse', 'publisher')">
					<summary><?php echo $lab->title->manPubInvitations; ?></summary>
					<ul id="publisher__list"></ul>
					<button onclick="manageInvitations('create', 'publisher')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->addInvitations; ?>
					</button>
					<button onclick="manageInvitations('remove', 'publisher')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmInvitations; ?>
					</button>
				</details>
				<!-- list, create and remove viewer invitations -->
				<details ontoggle="manageInvitations('browse', 'viewer')">
					<summary><?php echo $lab->title->manViewInvitations; ?></summary>
					<ul id="viewer__list"></ul>
					<button onclick="manageInvitations('create', 'viewer')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->addInvitations; ?>
					</button>
					<button onclick="manageInvitations('remove', 'viewer')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmInvitations; ?>
					</button>
				</details>
				<!-- list, change and remove accounts -->
				<details ontoggle="browseUsers()">
					<summary><?php echo $lab->title->manUsers; ?></summary>
					<ul id="users__list"></ul>
				</details>
				<!-- list and clear logs -->
				<details ontoggle="manageLogs('browse')">
					<summary><?php echo $lab->title->manLogs; ?></summary>
					<ul id="logs__list"></ul>
					<button 
						onclick="manageLogs('remove')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmLogs; ?>
					</button>
				</details>
			</main>
			<script src="./ajax.js"></script>
			<script src="./ui.js"></script>
			<script>
				const lab = {
					bt: {
						removeUser: "<?php echo $lab->bt->rmUser; ?>",
						setPublisher: "<?php echo $lab->bt->setPublisher; ?>",
						setViewer: "<?php echo $lab->bt->setViewer; ?>"
					},
					mess: {
						confirm: "<?php echo $lab->mess->confRemoveUser; ?>",
					}
				};
				if(localStorage.getItem('mode') === 'dark') {
					toDarkTheme();
				}
			</script>
		</body>
	</html>
<?php }
else {
	header('Location: ../..');
}