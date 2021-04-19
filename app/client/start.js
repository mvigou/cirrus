"use strict";

/* ### attach latest events ### */

	document.querySelector('.add-dir-form').onsubmit = (e) => {		
		createDirectory(e.target.elements[0].value);
		e.preventDefault();
	};

	const emptyRecycleBt = document.getElementById('empty-recycle');

	emptyRecycleBt.ontouchstart = e => watchConfirmTouch('start', e);

	emptyRecycleBt.ontouchend = e => {
		watchConfirmTouch('end', e); 
		removeItem('RECYCLE');
	};

	emptyRecycleBt.ontouchmove = () => cancelConfirm();

/* ### reload user preferences ### */

	if(localStorage.getItem('mode') === 'dark') {
		toDarkTheme();
	}

	if(localStorage.getItem('currentDir')) {
		browseDirectory(localStorage.getItem('currentDir'));
		if(localStorage.getItem('mainDir') === 'RECYCLE') {
			toRecycleDirTheme();
		}
	}

	else {
		browseDirectory('DATAS');
	}