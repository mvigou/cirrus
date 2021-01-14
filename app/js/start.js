"use strict";

// Set the language of the user interface of cirrus.

	const LANG = 'fr'; // Supported: fr, en.
	let lab;
	
	document.documentElement.lang = LANG;

	if(LANG === 'en') {
		
		lab = {
			button: {
				cancel: 'Cancel',
				close: 'Close',
				confirm: 'Confirm',
				createDir: 'Create directory',
				delete: 'Delete',
				download: 'Download',
				send: 'Upload files',
				emptyRecycle: 'Empty the recycle',
				toData: 'Display the datas',
				toRecycle: 'Display the recycle bin',
				theme: 'Switch between light / dark theme'
			},
			action: {
				nameNewdir: 'Please type the name of the directory. For the sake of portability, some characters may be replaced.'
			},
			error: 'An error has occurred. The following message has been returned : ',
			latestMod: 'Latest modification at'
		};
		
	}

	else {
		
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
				toRecycle: 'Afficher la corbeille',
				theme: 'Basculer entre thème clair / thème sombre'
			},
			action: {
				nameNewdir: 'Veuillez saisir le nom du dossier. Dans un souci de portabilité, certains caractères peuvent être remplacés.'
			},
			error: 'Une erreur est survenue. Le message suivant a été renvoyé : ',
			latestMod: 'Dernière modification le'
		};
		
	}

// Add corresponding tooltips to buttons.

	document.getElementById('to-datas-bt').title = lab.button.toData;
	document.getElementById('to-recycle-bt').title = lab.button.toRecycle;
	document.getElementById('create-directory-bt').title = lab.button.createDir;
	document.getElementById('send-files-bt').title = lab.button.send;
	document.getElementById('switch-theme-bt').title = lab.button.theme;
	document.getElementById('empty-recycle-bt').title = lab.button.emptyRecycle;

// Target certain elements of the user interface.

	const UI = {
		dial: document.querySelector('.dial'),
		loader:
			{
				container: document.querySelector('.loader'),
				info: document.querySelector('.loader__info'),
				progress: document.querySelector('.loader__progress')
			},
		browserTree: document.querySelector('.bwr__nav__tree'),
		browserList: document.querySelector('.bwr__list')
	};

	
// Start cirrus.
	
	const CLICK = [0, 0];
		
	// If known, restore theme preference.
	if(localStorage.getItem('mode') === 'dark') {
		toDarkTheme();
	}

	// If known, restore latest visited directory.
	if(localStorage.getItem('currentDir')) {
		browseDirectory(localStorage.getItem('currentDir'));
		if(localStorage.getItem('mainDir') === 'RECYCLE') {
			toRecycleDirTheme();
		}
	}
	// Else, browse from root directory.
	else {
		browseDirectory('DATAS');
	}