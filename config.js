// Supported: fr / en. Switch to one or another to translate the application.
const LANG = 'fr';

// Don't change the following values. 
const DATAS_DIR_PATH = './datas'; // Where the user datas live.
const RECYCLE_DIR_PATH = './recycle'; // Where the deleted datas live.
const TEMP_DIR_PATH = './temp'; // Where the zips are temporarily stored.
const UI = {
	dial: document.querySelector('.dial'),
	browserTree: document.querySelector('.browser__tree-nav'),
	browserList: document.querySelector('.browser__list')
};
let currentDir = '';
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
			emptyRecycle: 'Vider la corbeille',
			toData: 'Afficher le dossier utilisateur',
			toRecycle: 'Afficher la corbeille'
		},
		action: {
			moveToRecycle: 'Déplacer l\'élément vers la corbeille ? Attention : s\'il en existe déjà avec le même nom, ce dernier sera remplacé.',
			removePermanently: 'Supprimer définitivement l\'élément ?',
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
			emptyRecycle: 'Empty recycle bin',
			toData: 'Display the user directory',
			toRecycle: 'Display the recycle bin'
		},
		action: {
			moveToRecycle: 'Move the element to the recycle bin ?',
			removePermanently: 'Permanently delete the item? Warning: if there is already one with the same name, it will be overwritten',
			emptyRecycle: 'The recycle bin will be emptied: all items will be permanently deleted.',
			nameNewdir: 'Please type the name of the directory :',
		},
		error: 'An error has occurred. The following message has been returned : ',
		latestMod: 'Latest modification at'
	};
	
}