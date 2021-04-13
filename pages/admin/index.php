<?php 

require('../../app/server/config.php');

if(isAuthenticated() && $_SESSION['role'] === 'owner') { 

	$i18n = './admin-i18n-' . LANG . '.json';
	$lab = json_decode(file_get_contents($i18n));

?>

	<!DOCTYPE html>

		<html lang="<?php echo LANG; ?>">
		
		<head>
			<link rel="icon" href="../../app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./admin.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | <?php echo $lab->page->role; ?></title>
		</head>
		
		<body>

			<header>
				<h1>cirrus | <span><?php echo $lab->page->role; ?></span></h1>
			</header>
		
			<section class="admin">

				<button onclick="emptyMessBox()">
					<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
					<?php echo $lab->bt->emptyMessBox; ?>
				</button>
				
				<div 
					class="admin__mess-box"
					data-mess-error="<?php echo $lab->server->error; ?>"
					data-mess-invit-empty="<?php echo $lab->server->invitEmpty; ?>"
					data-mess-invit-removed="<?php echo $lab->server->invitRemoved; ?>">
				</div>
				
				<h2><?php echo $lab->page->invitTitle; ?></h2>
				<p><?php echo $lab->page->invitDesc; ?></p>

				<div>
					<h3><?php echo $lab->page->invitPubRole; ?></h3>
					<button 
						onclick="createInvit('publisher')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->invitCreate; ?>
					</button>
					<button 
						onclick="browseInvit('publisher')">
						<svg viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
						<?php echo $lab->bt->invitBrowse; ?>
					</button>
					<button 
						onclick="removeInvit('publisher')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->invitRemove; ?>
					</button>
				</div>

				<div>
					<h3><?php echo $lab->page->invitViewRole; ?></h3>
					<button 
						onclick="createInvit('viewer')">
						<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
						<?php echo $lab->bt->invitCreate; ?>
					</button>
					<button 
						onclick="browseInvit('viewer')">
						<svg viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
						<?php echo $lab->bt->invitBrowse; ?>
					</button>
					<button 
						onclick="removeInvit('viewer')">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
						<?php echo $lab->bt->invitRemove; ?>
					</button>
				</div>
				
			</section>

			<script src="./admin-func.js"></script>
			
		</body>
	</html>
	
<?php }

else {
	header('Location: ../..');
}