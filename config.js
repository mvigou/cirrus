const LANG = 'fr';
const DATAS_FOLDER_BASE = './datas'

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