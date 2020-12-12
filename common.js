// Add a dial when some HTML is provided.
function dial(html) {
	browserElm.dial.innerHTML = html != undefined ? html : '';
}

// Check if the user is in his data directory.
function inScopeDirectory(elm) { 
	return elm.match(/^\.\/datas/) ? true : false;
}

// Build a navigable tree.
function buildTree(dir) {

	browserElm.tree.innerHTML = '';
	let tree = '.';
	
	for(let subDirs of dir.slice(2).split('/')) {
				
		tree += '/';
		tree += subDirs;
		
		browserElm.tree.innerHTML += 
		'<pre> / </pre>' +
		'<a href="#" onclick="browseDirectory(\'' + tree + '\')">' + subDirs + '</a>';
	
	}

	browserElm.tree.classList.remove('browser__tree--updated');
	void browserElm.tree.offsetWidth;
	browserElm.tree.classList.add('browser__tree--updated');
	
}

// Build a file or a folder element.
function buildItems(items) {

	browserElm.content.innerHTML = '';
	
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
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63636 3H15.1571L19.7273 7.57019V19.3636C19.7273 20.2674 18.9946 21 18.0909 21H6.63636C5.73262 21 5 20.2674 5 19.3636V4.63636C5 3.73262 5.73262 3 6.63636 3ZM13.1818 4.63636H6.63636V19.3636H18.0909V9.54545H14.8182C13.9144 9.54545 13.1818 8.81283 13.1818 7.90909V4.63636ZM14.8182 4.97527V7.90909H17.752L14.8182 4.97527Z"/>':
					// Parent and subfolders only.
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M21 8.27273C21 7.36899 20.2674 6.63636 19.3636 6.63636H12.0015C12.0343 6.63619 12.0239 6.6235 11.9519 6.53598C11.9342 6.51449 11.9129 6.48848 11.8875 6.45703C11.8624 6.42594 11.7922 6.33548 11.7305 6.25591C11.6867 6.19952 11.6472 6.14861 11.631 6.12815C11.0451 5.38901 10.4618 5 9.54545 5H4.63636C3.73262 5 3 5.73262 3 6.63636V18.0909C3 18.9946 3.73262 19.7273 4.63636 19.7273H19.3636C20.2674 19.7273 21 18.9946 21 18.0909V8.27273ZM19.3636 8.27273V18.0909H4.63636V6.63636H9.54545C9.85984 6.63636 10.0421 6.75792 10.3486 7.14458C10.3582 7.15674 10.3858 7.19234 10.4202 7.2367C10.486 7.32147 10.5766 7.43823 10.6139 7.48444C11.0253 7.99447 11.408 8.26957 11.9956 8.27272L19.3636 8.27273Z"/>';
		
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
					'<a class="browser__item__actions_a" href="' + item.path + '" title="' + lab.button.download + '" download>' :
					// Subfolders only.
					'<a class="browser__item__actions_a" href="#" onclick="downloadDirectory(\'' + item.path + '\')" title="' + lab.button.download + '">';

						// Common parts for files and subfolders.
						template +=
						'<svg class="browser__item__actions__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">';
		
							template +=  item.type === 'file' ?
							// Files only.
							'<path d="M14.4735 13.0177L14.9706 13.5147L12.4853 16L10 13.5147L10.4971 13.0177L12.1338 14.6544V10H12.8367V14.6544L14.4735 13.0177Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/>':
							// Subfolders only.
							'<path d="M13.4735 13.0177L13.9706 13.5147L11.4853 16L9 13.5147L9.49706 13.0177L11.1338 14.6544V10H11.8368V14.6544L13.4735 13.0177Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z"/>';
						
						template += // Common parts for files and subfolders. 
						'</svg>' +
					'</a>';

					template += item.type === 'file' ?
					// Files only.
					'<a class="browser__item__actions_a" href="#" onclick="removeFile(\'' + item.path + '\')" title="' + lab.button.delete + '">' :
					// Parent and subfolders only.
					'<a class="browser__item__actions_a" href="#" title="' + lab.button.delete + '">';
					
						template += 
						'<svg class="browser__item__actions__svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">';
							
							template +=  item.type === 'file' ?
							// Files only.
							'<path d="M14.6517 14.591L13.591 15.6517L12 14.0607L10.409 15.6517L9.34835 14.591L10.9393 13L9.34835 11.409L10.409 10.3483L12 11.9393L13.591 10.3483L14.6517 11.409L13.0607 13L14.6517 14.591Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/>':
							// Subfolders only.
							'<path d="M14.6517 14.591L13.591 15.6517L12 14.0607L10.409 15.6517L9.34835 14.591L10.9393 13L9.34835 11.409L10.409 10.3483L12 11.9393L13.591 10.3483L14.6517 11.409L13.0607 13L14.6517 14.591Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z"/>';
		
						template += // Common parts for files and subfolders. 
						'</svg>' +
					'</a>' +
				'</div>' ;
				
			}
		
		// Common parts for parent, files and subfolders.
		template +=  '</li>';

		browserElm.content.innerHTML += template;

	}

}