<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="./style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<main>
		<section id="explorer">

			<?php

				require_once('./func-browse.php');
				require_once('./func-build.php');	

				define('DATAS_FOLDER_BASE', './datas');

				buildTree($_GET['dir']);
				browseDir($_GET['dir']);
				
			?>

		</section>
		
	</main>
	<script src="./script.js"></script>
</body>    
</html>