<?php 

require('../../app/server/config.php');
	
$i18n = './i18n-' . LANG . '.json';
$lab = json_decode(file_get_contents($i18n));

?>

<!DOCTYPE html>
	<html lang="<?php echo LANG; ?>">
	<head>
		<link rel="icon" href="../../app/client/cirrus-favicon.png" />
		<link rel="stylesheet" href="./style.css" />
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>cirrus | <?php echo $lab->page->role; ?></title>
	</head>
	<body>
		<header>
			<h1>cirrus | <span><?php echo $lab->page->role; ?></span></h1>
		</header>
		<form action="../../app/server/sign-in.php" method="POST">
			<label>
				<?php echo $lab->label->userName; ?>
				<input 
					id="user-name" 
					minlength="8"
					maxlength="24"
					name="user-name" 
					pattern="[a-zA-Z0-9]{8,16}" 
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
				/>
			</label>
			<button title="<?php echo $lab->bt->valid; ?>" type="submit"><svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg></button>
		</form>
    </body>
</html>