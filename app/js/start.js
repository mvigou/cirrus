"use strict";

// If known, restore theme preference.
if(localStorage.getItem('mode') === 'dark') {
	toDarkTheme();
}

// If known, restore latest visited directory.
if(localStorage.getItem('currentDir')) {
	browseDirectory(localStorage.getItem('currentDir'));
	if(localStorage.getItem('mainDir') === 'RECYCLE') {
		toRecycleDirTheme();
	}
}
// Else, browse from root directory.
else {
	browseDirectory('DATAS');
}