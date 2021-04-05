"use strict";

const LANG = 'fr'; // Supported: fr, en.
let lab;

document.documentElement.lang = LANG;

if(LANG === 'en') {
	
	lab = {
		bt: {
			createDir: 'Create a directory',
			delete: 'Delete (hold to validate)',
			download: 'Download',
			emptyRecycle: 'Empty the recycle (hold to validate)',
			rename: 'Rename files and directories',
			open: 'Open',
			sendFiles: 'Upload files',
			switchTheme: 'Switch between light / dark theme',
			toDataDir: 'Display the datas',
			toRecycleDir: 'Display the recycle bin',
			confirm: 'Confirm'
		},
		pop: {
			confirmPress: 'Release on the option to confirm. Release elsewhere to cancel.',
			duplicateContent: 'This name is already taken.',
			loggedError: 'An error occurred during the processing of this action (<a href="logs.html" target="_blank">learn more</a>).'
		},
		file: 'File',
		directory: 'Directory',
		latestMod: 'Modified at'
	};
	
}

else {
	
	lab = {
		bt: {
			createDir: 'Créer un dossier',
			delete: 'Supprimer (maintenir pour valider)',
			download: 'Télécharger',
			emptyRecycle: 'Vider la corbeille (maintenir pour valider)',
			rename: 'Renommer des fichiers et des dossiers',
			open: 'Ouvrir',
			sendFiles: 'Envoyer des fichiers',
			switchTheme: 'Basculer entre thème clair / thème sombre',
			toDataDir: 'Afficher les données',
			toRecycleDir: 'Afficher la corbeille',
			confirm: 'Valider'
		},
		pop: {
			confirmPress: 'Relâchez sur l\'option pour supprimer. Relâchez ailleurs pour annuler.',
			duplicateContent: 'Ce nom est déjà pris.',
			loggedError: 'Une erreur est survenue pendant le traitement de cette action (<a href="logs.html" target="_blank">en savoir plus</a>).'
		},
		file: 'Fichier',
		directory: 'Dossier',
		latestMod: 'Modifié le',
	};
	
}