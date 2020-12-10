const LANG = 'fr';
const DATAS_DIR_PATH = './datas';
const TRASH_DIR_PATH = './trash';
const TEMP_DIR_PATH = './temp';

let labels;

if(LANG === 'fr') {

	labels = {
		deleteElm: 'Supprimer',
		downloadElm: 'Télécharger',
		latestMod: 'Dernière modification le',
		confirmDel: 'Déplacer vers la corbeille ?'
	};

}

else if(LANG === 'en') {
	
	labels = {
		deleteElm: 'Delete',
		downloadElm: 'Download',
		latestMod: 'Latest modification at',
		confirmDel: 'Move to the trash ?'
	};

}

const browserElm = {
	tree: document.querySelector('.browser__tree'),
	content: document.querySelector('.browser__content'),
};

browseDirectory();