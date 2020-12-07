<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="./static/css/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<?php 
		
		define('APP_ROOT_PATH', __DIR__);
		define('DATAS_FOLDER_PATH', __DIR__ . '/datas');

		require_once('./static/php/reading.php');
		require_once('./static/php/building.php');	
	
	?>
	<main>
		<section id="explorer">
			<?php readCurrentDir(); ?>
		</section>
	</main>
	<script src="./static/js/script.js"></script>
</body>    
</html>