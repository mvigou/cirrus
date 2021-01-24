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
			delete: 'Delete (hold to validate)',
			download: 'Download',
			sendFiles: 'Upload files',
			emptyRecycle: 'Empty the recycle (hold to validate)',
			toDataDir: 'Display the datas',
			toRecycleDir: 'Display the recycle bin',
			switchTheme: 'Switch between light / dark theme'
		},
		file: 'File',
		directory: 'Directory',
		logErrorTrue: '<h4>Error</h4>You can learn more about it by reading the file ',
		logErrorFalse: '<h4>Error</h4>And cirrus was unable to log it, sorry.',
		error: 'An error has occurred. The following message has been returned',
		latestMod: 'Modified at',
		confirmPress: '<h4>Dangerous Action</h4> Release on the option to confirm. Release elsewhere to cancel.',
		nameNewdir: 'Please type the name of the directory. For the sake of portability, some characters may be replaced.'
	};
	
}

else {
	
	lab = {
		bt: {
			cancel: 'Annuler',
			confirm: 'Confirmer',
			createDir: 'Créer un dossier',
			delete: 'Supprimer (maintenir pour valider)',
			download: 'Télécharger',
			sendFiles: 'Envoyer des fichiers',
			emptyRecycle: 'Vider la corbeille (maintenir pour valider)',
			toDataDir: 'Afficher les données',
			toRecycleDir: 'Afficher la corbeille',
			switchTheme: 'Basculer entre thème clair / thème sombre'
		},
		file: 'Fichier',
		directory: 'Dossier',
		logErrorTrue: '<h4>Erreur</h4> Vous pouvez en apprendre plus en lisant le fichier ',
		logErrorFalse: '<h4>Erreur</h4>Et cirrus n\'a pas pu la consigner, désolé.',
		error: 'Une erreur est survenue. Le message suivant a été renvoyé',
		latestMod: 'Modifié le',
		confirmPress: '<h4>Action dangereuse</h4> Relâchez sur l\'option pour valider. Relâchez ailleurs pour annuler.',
		nameNewdir: 'Veuillez saisir le nom du dossier. Dans un souci de portabilité, certains caractères peuvent être remplacés.'
	};
	
}