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

		<nav class="main-nav">
			<button class="main-nav__button" onclick="browseDirectory('./datas')">
				<svg class="main-nav__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092z"/></svg>
			</button>
			<button class="main-nav__button" onclick="browseDirectory('./recycle')">
				<svg class="main-nav__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/></svg>
			</button>
		</nav>

		<section class="browser">
			<nav class="browser__tree"></nav>
			<ul class="browser__list"></ul>
		</section>

		<div class="dial">
			<div class="dial__content"></div>
		</div>

	</main>
	<script src="./common.js"></script>
	<script src="./async.js"></script>
	<script src="./config.js"></script>
</body>    
</html>