// Check if the user is within .datas or ./recycle.
function inScopeDirectory(elm) { 
	return inDataDirectory(elm) || inRecycleDirectory(elm) ? true : false
}

// Check if the user is within ./datas.
function inDataDirectory(elm) {
	return elm.match(/^\.\/datas/) ? true : false;
}

// Check if the user is within ./recycle.
function inRecycleDirectory(elm) {
	return elm.match(/^\.\/recycle/) ? true : false;
}

// Switch some properties between ./datas and ./recycle.
function switchToDir(dir) {
	document.body.setAttribute('class', '--in-' + dir);
}

// Add a dial when some HTML is provided.
function dial(html) {

	if(html != undefined) {
		UI.dial.querySelector('div').innerHTML = html;
		UI.dial.classList.add('dial--visible');
	}
	else {
		UI.dial.querySelector('div').innerHTML = '';
		UI.dial.classList.remove('dial--visible');
	}

}

// Build a navigable tree.
function buildTree(dir) {

	UI.browserTree.innerHTML = '';
	let tree = '.';
	
	for(let subDirs of dir.slice(2).split('/')) {
				
		tree += '/';
		tree += subDirs;
		
		UI.browserTree.innerHTML += 
		'<pre> / </pre>' +
		'<a href="#" onclick="browseDirectory(\'' + tree + '\')">' + subDirs + '</a>';
	
	}

	UI.browserTree.classList.remove('browser__tree-nav--updated');
	void UI.browserTree.offsetWidth;
	UI.browserTree.classList.add('browser__tree-nav--updated');
	
}

// Build a file or a folder element.
function buildItems(items) {

	items = JSON.parse(items);

	UI.browserList.innerHTML = '';
	
	for(let item of items) {

		switch(item.type) {
			case 'file':
				item.path = item.directory + '/' + item.label;
				break;
			case 'subfolder':
				item.path = item.directory + '/' + item.label;
				break;
			case 'parent':
				item.path = item.directory.substr(0, item.directory.lastIndexOf('/'));
				break;
		};
		
		let template = '';

		template += // Common parts for parent, files and subfolders.
		'<li class="browser__item">';
		
			template += item.type === 'file' ?
			// Files only.
			'<a class="browser__item__link" href="' + item.path + '">':
			// Parent and subfolders only.
			'<a class="browser__item__link" href="#" onclick="browseDirectory(\'' + item.path + '\')">';
			
				template += // Common parts for parent, files and subfolders.
				'<svg class="browser__item__link__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">';
			
					template += item.type === 'file' ?
					// Files only.
					'<path d="m15.157 3h-8.5207c-0.90374 0-1.6364 0.73262-1.6364 1.6364v14.727c0 0.9038 0.73262 1.6364 1.6364 1.6364h11.455c0.9037 0 1.6364-0.7326 1.6364-1.6364v-11.793zm-0.3389 4.9091v-2.9338l2.9338 2.9338z" clip-rule="evenodd" fill-rule="evenodd"/>':
					// Parent and subfolders only.
					'<path d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42596 11.7923 6.33563 11.7306 6.2561C11.6869 6.1998 11.6472 6.14858 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273Z" />';
		
				template += // Common parts for parent, files and subfolders.
				'</svg>' +
				'<div>' +
					'<h3 class="browser__item__link__title">' + item.label + '</h3>';
					// Files only.
					if(item.type === 'file') {
						template += '<p class="browser__item__link__info">' + lab.latestMod + ' ' + item.lastMod + '</p>';
					}
				template +=
				'</div>' +
			'</a>';

			// Common parts for files and subfolders.
			if(item.type === 'file' || item.type === 'subfolder') {
				template += 
				'<div class="browser__item__actions">';

					template += item.type === 'file' ?
					// Files only.
					'<a class="browser__item__actions__a" href="' + item.path + '" title="' + lab.button.download + '" download>' :
					// Subfolders only.
					'<a class="browser__item__actions__a" href="#" onclick="downloadDirectory(\'' + item.path + '\')" title="' + lab.button.download + '">';

						// Common parts for files and subfolders.
						template +=
						'<svg class="browser__item__actions__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z"/>' +
						'</svg>' +

					'</a>';

					template += item.type === 'file' ?
					// Files only.
					'<a class="browser__item__actions__a" href="#" onclick="removeElm(\'' + item.path + '\')" title="' + lab.button.delete + '">' :
					// Parent and subfolders only.
					'<a class="browser__item__actions__a" href="#" onclick="removeElm(\'' + item.path + '\')" title="' + lab.button.delete + '">';
					
						template += 
						'<svg class="browser__item__actions__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +			
							'<path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>' +							
						'</svg>' +
					'</a>' +
				'</div>' ;
				
			}
		
		// Common parts for parent, files and subfolders.
		template +=  '</li>';

		UI.browserList.innerHTML += template;

	}

}