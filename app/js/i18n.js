"use strict";

const LANG = 'fr'; // Supported: fr, en.
let lab;

document.documentElement.lang = LANG;

if(LANG === 'en') {
	
	lab = {
		bt: {
			cancel: 'Cancel',
			confirm: 'Confirm',
			createDir: 'Create directory',
			delete: 'Delete',
			download: 'Download',
			sendFiles: 'Upload files',
			emptyRecycle: 'Empty the recycle',
			toDataDir: 'Display the datas',
			toRecycleDir: 'Display the recycle bin',
			switchTheme: 'Switch between light / dark theme'
		},
		file: 'File',
		directory: 'Directory',
		error: 'An error has occurred. The following message has been returned',
		latestMod: 'Modified at',
		confirmPress: 'Release the pressure on the option to confirm. Release elsewhere to cancel.',
		nameNewdir: 'Please type the name of the directory. For the sake of portability, some characters may be replaced.'
	};
	
}

else {
	
	lab = {
		bt: {
			cancel: 'Annuler',
			confirm: 'Confirmer',
			createDir: 'Créer un dossier',
			delete: 'Supprimer',
			download: 'Télécharger',
			sendFiles: 'Envoyer des fichiers',
			emptyRecycle: 'Vider la corbeille',
			toDataDir: 'Afficher les données',
			toRecycleDir: 'Afficher la corbeille',
			switchTheme: 'Basculer entre thème clair / thème sombre'
		},
		file: 'Fichier',
		directory: 'Dossier',
		error: 'Une erreur est survenue. Le message suivant a été renvoyé',
		latestMod: 'Modifié le',
		confirmPress: 'Relâchez la pression sur l\'option pour confirmer. Relâchez ailleurs pour annuler.',
		nameNewdir: 'Veuillez saisir le nom du dossier. Dans un souci de portabilité, certains caractères peuvent être remplacés.'
	};
	
}