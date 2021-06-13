if(localStorage.getItem('theme') === 'dark') {
    toDarkTheme();
}
if(localStorage.getItem('currentDir')) {
    browseDirectory(localStorage.getItem('currentDir'));
    if(localStorage.getItem('mainDir') === 'RECYCLE') {
        toRecycleTheme();
    }
}
else {
    browseDirectory('DATAS');
}