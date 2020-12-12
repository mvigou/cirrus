const LANG = 'fr';

const DATAS_DIR_PATH = './datas'; // Where the user datas live.
const RECYCLE_DIR_PATH = './recycle'; // Where the deleted datas live.
const TEMP_DIR_PATH = './temp'; // Where the zips are temporarily stored.

const browserElm = {
	tree: document.querySelector('.browser__tree'),
	content: document.querySelector('.browser__content'),
	dial: document.querySelector('.browser__dial')
};

let lab;

if(LANG === 'fr') {
	
	lab = {
		button: {
			cancel: 'Annuler',
			close: 'Fermer',
			confirm: 'Confirmer',
			delete: 'Supprimer',
			download: 'Télécharger'
		},	
		error: 'Une erreur est survenue.',
		latestMod: 'Dernière modification le',
		toRecycleWarning: 'Déplacer vers la corbeille ?',
		toRecycleNormal: 'Déplacer vers la corbeille ? Attention : un fichier avec un nom identique est déjà présent dans la corbeille. Si vous confirmez, il sera écrasé.'
	};
	
}

else if(LANG === 'en') {
	
	lab = {
		button: {
			cancel: 'Cancel',
			close: 'Close',
			confirm: 'Confirm',
			delete: 'Delete',
			download: 'Download'
		},
		error: 'An error has occurred.',
		latestMod: 'Latest modification at',
		toRecycleWarning: 'Move to the recycle bin ?',
		toRecycleNormal: 'Move to the recycle bin ? Warning : a file with the same name is already in the recycle bin. If you confirm, it will be overwritten.'
	};
	
}

browseDirectory();