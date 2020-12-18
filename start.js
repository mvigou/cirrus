// Set the language of the interface.

	// Supported: fr / en. Switch to one or another to translate the application.
	const LANG = 'fr';

	const UI = {
		dial: document.querySelector('.dial'),
		browserTree: document.querySelector('.browser__tree-nav'),
		browserList: document.querySelector('.browser__list')
	};

	let lab;

	if(LANG === 'fr') {
		
		lab = {
			button: {
				cancel: 'Annuler',
				close: 'Fermer',
				confirm: 'Confirmer',
				createDir: 'Créer un dossier',
				delete: 'Supprimer',
				download: 'Télécharger',
				send: 'Envoyer des fichiers',
				emptyRecycle: 'Vider la corbeille',
				toData: 'Afficher les données',
				toRecycle: 'Afficher la corbeille'
			},
			action: {
				remove: 'Supprimer la sélection ?',
				emptyRecycle: 'La corbeille sera vidée : tous les éléments seront définitivement supprimés.',
				nameNewdir: 'Veuillez saisir le nom du dossier :'
			},
			error: 'Une erreur est survenue. Le message suivant a été renvoyé : ',
			latestMod: 'Dernière modification le'
		};
		
	}

	else if(LANG === 'en') {
		
		lab = {
			button: {
				cancel: 'Cancel',
				close: 'Close',
				confirm: 'Confirm',
				createDir: 'Create directory',
				delete: 'Delete',
				download: 'Download',
				send: 'Upload files',
				emptyRecycle: 'Empty recycle bin',
				toData: 'Display the datas',
				toRecycle: 'Display the recycle bin'
			},
			action: {
				remove: 'Remove the selection ?',
				emptyRecycle: 'The recycle bin will be emptied: all items will be permanently deleted.',
				nameNewdir: 'Please type the name of the directory :'
			},
			error: 'An error has occurred. The following message has been returned : ',
			latestMod: 'Latest modification at'
		};
		
	}

	document.getElementById('to-datas-bt').textContent = lab.button.toData;
	document.getElementById('to-recycle-bt').textContent = lab.button.toRecycle;
	document.getElementById('create-directory-bt').textContent = lab.button.createDir;
	document.getElementById('empty-recycle-bt').textContent = lab.button.emptyRecycle;
	document.getElementById('send-content-bt').textContent = lab.button.send;

// Start the application.

	ajaxManager(
		'GET',
		'./async-init.php',
		[],
		(response) => {
			if(response === 'success') {
				browseDirectory('datas');
			}
			else {
				ajaxErrorHandler(response);
			}
		}
	);

	let currentDir = '';