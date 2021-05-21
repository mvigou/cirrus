<?php 
session_start();
if(is_dir('./datas')) {
	$env = json_decode(file_get_contents('./datas/env.json'));	
	$lab = json_decode(file_get_contents('./app/client/i18n-' . $env->lang . '.json'));
	require('./app/server/tools.php');
	if(isAuthenticated()) { ?>
		<!DOCTYPE html>
		<html lang="<?php echo $env->lang; ?>">
		<head>
			<link rel="icon" href="./app/client/cirrus-favicon.png" />
			<link rel="stylesheet" href="./app/client/style.css" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>cirrus | <?php echo $lab->page->title; ?></title>
		</head>
		<body>
			<main>	
				<nav class="nav">
					<!-- Display the data directory. -->
					<button 
						class="recycle-ft"
						onclick="browseDirectory('DATAS'), switchMainDir('DATAS')"
						title="<?php echo $lab->bt->switchToData; ?>">
						<svg viewBox="0 0 24 24"><path d="M12 5c3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-13c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78zm0-2c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092z"/></svg>
					</button>
					<!-- Display the recycle directory. -->
					<button 
						class="datas-ft publisher-ft non-editable"
						onclick="browseDirectory('RECYCLE'), switchMainDir('RECYCLE')"
						title="<?php echo $lab->bt->switchToRecycle; ?>">
						<svg viewBox="0 0 24 24"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>
					</button>
					<!-- Open a window to upload files. -->
					<button 
						class="datas-ft publisher-ft non-editable"
						onclick="uploadItems()"
						title="<?php echo $lab->bt->uploadItem; ?>">
						<svg viewBox="3 3 18 18"><path d="M10.4971 12.9823L10 12.4853L12.4853 10L14.9706 12.4853L14.4735 12.9823L12.8368 11.3456V16H12.1338V11.3456L10.4971 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/></svg>
					</button>
					<!-- Toggle between normal and edition mode. -->
					<button 
						class="datas-ft publisher-ft"
						onclick="toggleEdition()"
						title="<?php echo $lab->bt->switchEdition; ?>">
						<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>
					</button>
					<!-- Empty the recycle bin. -->
					<button 
						class="recycle-ft"
						id="emptyRecycleBt"
						onkeypress="if(confirm(lab.mess.confEmptyRecycle)){removeItem('RECYCLE', true);}"
						onmousedown="watchConfirm('start', 'recycle')"
						onmouseup="watchConfirm('end', 'recycle'), removeItem('RECYCLE')"
						onmouseleave="cancelConfirm()" 
						ontouchend="watchConfirm('end', 'recycle'), removeItem('RECYCLE')"
						ontouchmove="cancelConfirm()" 
						title="<?php echo $lab->bt->emptyRecycle; ?>">
						<svg viewBox="0 0 24 24"><path d="M18.5 15c-2.486 0-4.5 2.015-4.5 4.5s2.014 4.5 4.5 4.5c2.484 0 4.5-2.015 4.5-4.5s-2.016-4.5-4.5-4.5zm-.469 6.484l-1.688-1.637.695-.697.992.94 2.115-2.169.697.696-2.811 2.867zm-2.031-12.484v4.501c-.748.313-1.424.765-2 1.319v-5.82c0-.552.447-1 1-1s1 .448 1 1zm-4 0v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1zm1.82 15h-11.82v-18h2v16h8.502c.312.749.765 1.424 1.318 2zm-6.82-16c.553 0 1 .448 1 1v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1zm14-4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-1 2v7.182c-.482-.115-.983-.182-1.5-.182l-.5.025v-7.025h2z"/></svg>
					</button>
					<!-- Allow to perform some actions (search, create directories...) -->
					<div class="bar datas-ft non-editable">
						<form class="bar__form" >
							<label for="bar__input"><?php echo $lab->label->bar; ?></label>
							<input 
								id="bar__input"
								class="publisher-ft"
								oninput="barLive(this.value)"
								title="<?php echo $lab->label->bar; ?>" />
							<button 
								id="bar__cancelButton"
								class="publisher-ft bar__bt --hidden"
								title="<?php echo $lab->bt->cancelSearch; ?>">
								<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
							</button>
							<button 
								id="bar__addButton"
								class="publisher-ft bar__bt --hidden"
								title="<?php echo $lab->bt->createDir; ?>">
								<svg viewBox="3 3 18 18"><path d="M12.75 16H11.25V13.75H9V12.25H11.25V10H12.75V12.25H15V13.75H12.75V16Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>
							</button>
							<button 
								id="bar__cmdButton"
								class="publisher-ft bar__bt --hidden"
								title="<?php echo $lab->bt->confirm; ?>">
								<svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg>
							</button>
						</form>
					</div>
					<!-- Toggle between light and dark theme. -->
					<button 
						onclick="switchTheme()"
						title="<?php echo $lab->bt->switchTheme; ?>">
						<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
					</button>
					<button 
						onclick="signOut()"
						title="<?php echo $lab->bt->signOut; ?>">
						<svg viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z"/></svg>
					</button>
				</nav>
				<aside class="infos">
					<div class="tree"></div>
					<div class="counters">
						<!-- Display the number of visible directories. -->
						<svg viewBox="3 3 18 18"><path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" /></svg>
						x <span class="dir-counter"></span>
						<!-- Display the number of visible files. -->
						<svg viewBox="3 3 18 18"><path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" /></svg>
						x <span class="fil-counter"></span>
					</div>
				</aside>
				<!-- User cloud content -->
				<ul class="list"></ul>
				<!-- Box for previewing content -->
				<div 
					class="preview" 
					data-item-path="">
					<div>
						<nav class="preview__nav">
							<!-- Allow to open the previewed item in another tab. -->
							<button 
								class="start-trap" 
								onclick="openPreviewedItem()"
								title="<?php echo $lab->bt->openItemElsewhere; ?>">
								<svg viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>
							</button>
							<!-- Allow to download the previewed item. -->
							<button 
								onclick="downloadPreviewedItem()"
								title="<?php echo $lab->bt->downloadItem; ?>">
								<svg viewBox="-3 -3 30 30"><path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/></svg>
							</button>
							<!-- Close the preview. -->
							<button 
								class="end-trap" 
								onclick="unsetPreview()" 
								title="<?php echo $lab->bt->close; ?>">
								<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
							</button>
						</nav>
						<div class="preview__item"></div>
					</div>
				</div>
				<!-- Popup -->
				<div class="popup">
					<div class="popup__tiles-ct">
						<div class="popup__tile"></div>
						<div class="popup__tile"></div>
						<div class="popup__tile"></div>
					</div>
					<div class="popup__content"></div>
				</div>
				<!-- Upload progression bar -->
				<div class="upload-bar --hidden">
					<p></p>
					<div></div>
				</div>
			</main>
			<script src="./app/client/ajax.js"></script>
			<script src="./app/client/ui.js"></script>
			<script>
				document.getElementById('emptyRecycleBt').ontouchstart = e => watchConfirm('start', 'recycle', e);
				// Required labels for JavaScript.
				const lab = {
					bt: {
						downloadItem: "<?php echo $lab->bt->downloadItem; ?>",
						openItem: "<?php echo $lab->bt->openItem; ?>",
						removeItem: "<?php echo $lab->bt->removeItem; ?>"
					},
					mess: {
						confirmPress: "<?php echo $lab->mess->confirmPress; ?>",
						confEmptyRecycle: "<?php echo $lab->mess->confEmptyRecycle; ?>",
						confRemove: "<?php echo $lab->mess->confRemove; ?>",
						error: "<?php echo $lab->mess->error; ?>",
					}
				};
				// Unhide publisher features.
				<?php if(hasWritingRights()) { ?>
					document.body.classList.add('--publisher');
				<?php } ?>
				// Reload user preferences.
				if(localStorage.getItem('mode') === 'dark') {
					toDarkTheme();
				}
				if(localStorage.getItem('currentDir')) {
					browseDirectory(localStorage.getItem('currentDir'));
					if(localStorage.getItem('mainDir') === 'RECYCLE') {
						toRecycleTheme();
					}
				}
				else {
					browseDirectory('DATAS');
				}
			</script>
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