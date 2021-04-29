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
				<!-- Admin messages. -->
				<aside>
					<button onclick="emptyMessBox()">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->emptyMessBox; ?>
					</button>
					<div 
						class="admin__mess__box"
						data-mess-empty="<?php echo $lab->mess->empty; ?>"
						data-mess-notAJSON="<?php echo $lab->mess->notAJSON; ?>"
						data-mess-success="<?php echo $lab->mess->success; ?>">
					</div>
				</aside>
				<!-- Manage invitations. -->
				<section>
					<h2><?php echo $lab->title->invitations; ?></h2>
					<details>
						<summary><?php echo $lab->title->publishers; ?></summary>
						<!-- Create a registration link (publisher). -->
						<button 
							onclick="createInvit('publisher')">
							<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
							<?php echo $lab->bt->createInvits; ?>
						</button>
						<!-- See all registration links (publisher). -->
						<button 
							onclick="browseInvits('publisher')">
							<svg viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
							<?php echo $lab->bt->browseInvits; ?>
						</button>
						<!-- Remove all registration links (publisher). -->
						<button 
							onclick="removeInvits('publisher')">
							<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
							<?php echo $lab->bt->removeInvits; ?>
						</button>
					</details>

					<details>
						<summary><?php echo $lab->title->viewers; ?></summary>
						<!-- Create a registration link (viewer). -->
						<button 
							onclick="createInvit('viewer')">
							<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
							<?php echo $lab->bt->createInvits; ?>
						</button>
						<!-- See all registration links (viewer). -->
						<button 
							onclick="browseInvits('viewer')">
							<svg viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
							<?php echo $lab->bt->browseInvits; ?>
						</button>
						<!-- Remove all registration links (viewer). -->
						<button 
							onclick="removeInvits('viewer')">
							<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
							<?php echo $lab->bt->removeInvits; ?>
						</button>
					</details>
				</section>
				<!-- Manage accounts. -->
				<section>
					<h2><?php echo $lab->title->users; ?></h2>
					<!-- See all existing accounts. -->
					<button 
						onclick="browseUsers()">
						<svg viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
						<?php echo $lab->bt->browseUsers; ?>
					</button>
				</section>
			</main>
			<script src="./script.js"></script>
			<script>
				const lab = {
					mess: {
						empty: "<?php echo $lab->mess->empty; ?>",
						success: "<?php echo $lab->mess->success; ?>"
					}
				};
			</script>
		</body>
	</html>
	
<?php }

else {
	header('Location: ../..');
}