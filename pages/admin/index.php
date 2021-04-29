<?php 

require('../../app/server/config.php');

$i18n = './i18n-' . LANG . '.json';
$lab = json_decode(file_get_contents($i18n));

if(isAuthenticated() && $_SESSION['role'] === 'owner') { ?>
	<!DOCTYPE html>
		<html lang="<?php echo LANG; ?>">
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./style.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | <?php echo $lab->title->page; ?></title>
		</head>
		<body>
			<header>
				<h1>cirrus | <span><?php echo $lab->title->page; ?></span></h1>
			</header>
			<main class="admin">
				<!-- list, create and remove publisher invitations -->
				<details ontoggle="browseInvits('publisher')">
					<summary><?php echo $lab->title->manPubInvit; ?></summary>
					<ul class="publisher__list"></ul>
					<button onclick="createInvit('publisher')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->addInvit; ?>
					</button>
					<button onclick="removeInvits('publisher')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmInvits; ?>
					</button>
				</details>
				<!-- list, create and remove viewer invitations -->
				<details ontoggle="browseInvits('viewer')">
					<summary><?php echo $lab->title->manViewInvit; ?></summary>
					<ul class="viewer__list"></ul>
					<button onclick="createInvit('viewer')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->addInvit; ?>
					</button>
					<button onclick="removeInvits('viewer')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->rmInvits; ?>
					</button>
				</details>
				<!-- list, change and remove accounts -->
				<details ontoggle="browseUsers()">
					<summary><?php echo $lab->title->manUsers; ?></summary>
					<ul class="users__list"></ul>
				</details>
				<!-- list and clear logs -->
				<details ontoggle="browseLogs()">
					<summary><?php echo $lab->title->manLogs; ?></summary>
					<ul class="logs__list"></ul>
					<button 
						onclick="removeLogs()">
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
			</script>
		</body>
	</html>
	
<?php }

else {
	header('Location: ../..');
}