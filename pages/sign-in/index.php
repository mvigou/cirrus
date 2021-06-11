<?php 

if(isset($_GET['auth'])) {
	header('Location: ../../app/server/sign-in.php?auth=' . $_GET['auth']);
	exit();
}
$env = json_decode(file_get_contents('../../datas/env.json'));
$lab = json_decode(file_get_contents('./i18n-' . $env->lang . '.json'));
require('../../app/server/tools.php'); ?>
<!DOCTYPE html>
	<html lang="<?php echo $env->lang; ?>">
	<head>
		<link rel="icon" href="../../app/client/cirrus-favicon.png" />
		<link rel="manifest" href="../../manifest.json">
		<link rel="apple-touch-icon" href="../../app/client/cirrus-logo-192.png">
		<link rel="stylesheet" href="./style.css" />
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>cirrus | <?php echo $lab->page->title; ?></title>
	</head>
	<body>
		<main>		
			<h1>cirrus | <span><?php echo $lab->page->title; ?></span></h1>
			<form action="../../app/server/sign-in.php" method="POST">
				<?php if(isset($_GET['error'])) {
					$mess = '';
					switch($_GET['error']) {
						case 'wrong-link':
							$mess = $lab->error->wrongLink;
							break;
						
						case 'wrong-user':
							$mess = $lab->error->wrongUser;
							break;
						
						case 'wrong-password':
							$mess = $lab->error->wrongPassword;
							break;
					}
					echo '<p style="color:#f44;">' . $mess . '</p>';
				} ?>
				<label>
					<?php echo $lab->label->userName; ?>
					<input 
						id="user-name" 
						minlength="8"
						maxlength="24"
						name="user-name" 
						pattern="[a-zA-Z0-9]{8,16}" 
						required
					/>
				</label>
				<label>
					<?php echo $lab->label->userPass; ?>
					<input type="password" 
						id="user-pass" 
						minlength="8"
						maxlength="24"
						name="user-pass" 
						pattern="[a-zA-Z0-9.?!\-_*+=/|\\()[\]#$@%]{8,24}" 
						required
					/>
				</label>
				<button title="Valider" type="submit"><svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg></button>
			</form>
			<img 
				alt="Logo cirrus"
				src="../../app/client/cirrus-logo-alt.svg"
			/>
		</main>
		<script>
			if('serviceWorker' in navigator) {
				navigator.serviceWorker.register('../../service-worker.js');
			};
	</script>
    </body>
</html>