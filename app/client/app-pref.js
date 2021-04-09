"use strict";

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