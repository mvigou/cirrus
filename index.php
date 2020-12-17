<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="./style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MEEC | My Eco-responsible and Ethical Cloud</title>
</head>
<body class="--in-datas">
	<main>

		<section class="browser">
			
			<nav class="browser__nav">
				<svg class="browser__nav__svg datas-feature" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092z"/></svg>
				<svg class="browser__nav__svg recycle-feature" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.633 22.031c1.135 1.313 3.735 1.969 6.334 1.969 2.601 0 5.199-.656 6.335-1.969.081-.404 3.698-18.468 3.698-18.882 0-2.473-7.338-3.149-10-3.149-4.992 0-10 1.242-10 3.144 0 .406 3.556 18.488 3.633 18.887zm6.418-16.884c-4.211 0-7.625-.746-7.625-1.667s3.414-1.667 7.625-1.667 7.624.746 7.624 1.667-3.413 1.667-7.624 1.667z"/></svg>
			
				<button 
					id="to-datas-bt" 
					class="browser__nav__bt recycle-feature"
					onclick="browseDirectory('datas'), switchToDir('datas')">
					<!-- Label added by JS. -->
				</button>
				<button
					id="to-recycle-bt"
					class="browser__nav__bt datas-feature"
					onclick="browseDirectory('recycle'), switchToDir('recycle')">
					<!-- Label and title added by JS. -->
				</button>
				<button 
					id="create-directory-bt" 
					class="browser__nav__bt datas-feature"
					onclick="createDirectory()">
					<!-- Label added by JS. -->
				</button>
				<button 
					id="empty-recycle-bt" 
					class="browser__nav__bt recycle-feature"
					onclick="emptyRecycle()">
					<!-- Label added by JS. -->
				</button>
			</nav>

			<nav class="browser__tree-nav"></nav>
			<ul class="browser__list"></ul>
		
		</section>

		<div class="dial">
			<div class="dial__content"></div>
		</div>

	</main>

	<script src="./functions.js"></script>
	<script src="./start.js"></script>

</body>    
</html>