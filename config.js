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
		bt: {
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
		createNewdir: 'Veuillez saisir le nom du dossier :',
		error: 'Une erreur est survenue.',
		latestMod: 'Dernière modification le',
		toRecycleMove: 'Déplacer vers la corbeille ?',
		toRecycleOverwrite: 'Attention : il y a déjà un fichier avec ce nom dans la corbeille. Si vous confirmez, il sera écrasé.',
		toRecycleRemove: 'Supprimer définitivement le fichier ?',
	};
	
}

else if(LANG === 'en') {
	
	lab = {
		bt: {
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
		createNewdir: 'Please type the name of the directory :',
		error: 'An error has occurred.',
		latestMod: 'Latest modification at',
		toRecycleMove: 'Move to the recycle bin ?',
		toRecycleOverwrite: 'Warning : there is already a file with the same name in the recycle bin. If you confirm, it will be overwritten.',
		toRecycleRemove: 'Permanently remove the file ?'
	};
	
}