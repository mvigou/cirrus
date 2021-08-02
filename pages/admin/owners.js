"use strict";

/* ### MVC classes ### */

	class Model {

		static ajaxPost = query => {
			return new Promise(
				(resolve, reject) => {
					let formData = new FormData();
					if(query.args !== undefined) {
						for(const arg of query.args) {
							formData.append(arg.name, arg.value);
						}
					}
					fetch(query.script, {
						method: 'POST',
						body: formData
					})
					.then(data => {					
						if(data.ok) {
							data.text()
							.then(data => {
								try {
									resolve(JSON.parse(data));
								}
								catch(e) {
									reject(data);
								}	
							});
						}
						else {
							reject(data);
						}
					});
				}
			);
		};

	};

	class View {

		static setDarkTheme = () => {
			document.body.classList.add('--dark-mode');
			localStorage.setItem('theme', 'dark');			
		};

		static setLightTheme = () => {
			document.body.classList.remove('--dark-mode');
			localStorage.setItem('theme', 'light');
		};

		static switchThemeColor = () => document.body.classList.contains('--dark-mode') ? View.setLightTheme(): View.setDarkTheme();

		static setList = (listId, content = null) => {
			const listElm = document.getElementById(listId);
			if(content !== null) {
				listElm.innerHTML = '';
				if(listId === 'logs__list') {
					for(const log of content) {
						if(log !== '') {
							let itemElm = document.createElement('li');
							itemElm.textContent = '[' + log;
							listElm.appendChild(itemElm);
						}
					}
				}
				else {
					for(let a of content) {
						let itemElm = document.createElement('li');
						let aElm = document.createElement('a');
						aElm.setAttribute('href', a);
						aElm.setAttribute('target', '_blank');
						aElm.textContent = a.substring(0, 48) + '...';
						itemElm.appendChild(aElm);
						listElm.appendChild(itemElm);
					}
				}
			}
			else {
				listElm.innerHTML = '...';
			}
		};

		static setUserList = users => {
			const listElm = document.getElementById('users__list');
			if(users.length > 0) {
				listElm.innerHTML = '';
				for(let user of users) {
					let itemElm = document.createElement('li');
					itemElm.textContent = user.name;
					let setUserBtElm = document.createElement('button');
					if(user.role === 'viewer') {
						setUserBtElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>Changer en éditeur';
						setUserBtElm.onclick = () => Controller.moveUser(user.name, 'viewer', 'publisher');
					}
					else if(user.role === 'publisher') {
						setUserBtElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>Changer en visualiseur';
						setUserBtElm.onclick = () => Controller.moveUser(user.name, 'publisher', 'viewer');
					}
					itemElm.appendChild(setUserBtElm);
					let removeBtElm = document.createElement('button');
					removeBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>Supprimer';
					removeBtElm.onclick = () => Controller.removeUser(user.name, user.role);
					itemElm.appendChild(removeBtElm);
					listElm.appendChild(itemElm);
				}
			}
			else {
				listElm.innerHTML = '...';
			}
		};

	};

	class Controller {

		static browseUsers = () => {
			Model.ajaxPost( { script: '../../app/server/browse-users.php' } )
			.then(data => {
				if(data.success) {
					View.setUserList(data.content);
				}
			})
		};

		static moveUser = (userName, fromRole, toRole) => {
			Model.ajaxPost(
				{ 
					script: '../../app/server/move-user.php',
					args: [
						{
							name: 'user-name',
							value: userName
						},
						{
							name: 'from-role',
							value: fromRole
						},
						{
							name: 'to-role',
							value: toRole
						}
					]
				}
			)
			.then(data => {
				if(data.success) {
					Controller.browseUsers();
				}
			})
		};

		static removeUser = (userName, userRole) => {
			if(confirm('Supprimer le compte : ' + userName)) {
				Model.ajaxPost(
					{ 
						script: '../../app/server/remove-user.php',
						args: [
							{
								name: 'user-name',
								value: userName
							},
							{
								name: 'user-role',
								value: userRole
							}
						]
					}
				)
				.then(data => {
					if(data.success) {
						Controller.browseUsers();
					}
				})
			}
		};

		static managePublicAccess = action => {
			Model.ajaxPost(
				{
					script: '../../app/server/manage-public-access.php',
					args: [
						{
							name: 'action',
							value: action
						}
					]			
				}
			)
			.then(data => {
				if(data.success) {
					View.setList('public-access__list', data.content);
				}
			})
		};

		static manageInvitations = (action, role) => {
			Model.ajaxPost(
				{
					script: '../../app/server/manage-invitations.php',
					args: [
						{
							name: 'role',
							value: role
						},
						{
							name: 'action',
							value: action
						}
					]	
				}
			)
			.then(data => {
				if(data.success) {
					View.setList(role + '__list', data.content);
				}
			})
		};

		static manageLogs = action => {
			Model.ajaxPost(
				{ 
					script: '../../app/server/manage-logs.php',
					args: [
						{
							name: 'action',
							value: action
						}
					]		
				}
			)
			.then(data => {
				if(data.success) {
					View.setList('logs__list', data.content);
				}
			})
		};

	};

/* ### build user interface ### */

	const ui = {};
	
	ui.main = document.createElement('main');
	ui.main.setAttribute('class', 'admin');

	/* header */

		ui.header = document.createElement('header');
		
		ui.header.cirrusLogo = document.createElement('img');
		ui.header.cirrusLogo.setAttribute('alt', 'Logo cirrus');
		ui.header.cirrusLogo.setAttribute('src', '../../app/client/cirrus-logo-alt.svg');

		ui.header.mainTitle = document.createElement('h1');
		ui.header.mainTitle.innerHTML = 'cirrus | <span>administration</span>';
		
		ui.header.appendChild(ui.header.cirrusLogo);
		ui.header.appendChild(ui.header.mainTitle);		
		ui.main.appendChild(ui.header);

	/* buttons */

		ui.switchThemeBt = document.createElement('button');
		ui.switchThemeBt.setAttribute('id', 'switchThemeBt');
		ui.switchThemeBt.setAttribute('title', 'Basculer entre thème clair / thème sombre');
		ui.switchThemeBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>';
		ui.switchThemeBt.onclick = () => View.switchThemeColor();
		ui.main.appendChild(ui.switchThemeBt);

		ui.backLink = document.createElement('a');
		ui.backLink.setAttribute('href', '../../');
		ui.backLink.textContent = 'Retour';
		ui.main.appendChild(ui.backLink);

	/* public access */

		ui.accessCt = document.createElement('details');
		ui.accessCt.ontoggle = () => Controller.managePublicAccess('browse');

		ui.accessCt.summary = document.createElement('summary');
		ui.accessCt.summary.textContent = 'Lien d\'accès public';
		
		ui.accessCt.list = document.createElement('ul');
		ui.accessCt.list.setAttribute('id', 'public-access__list');
		
		ui.accessCt.addBt = document.createElement('button');
		ui.accessCt.addBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg> Activer le lien d\'accès public';
		ui.accessCt.addBt.onclick = () => Controller.managePublicAccess('create');
		
		ui.accessCt.removeBt = document.createElement('button');
		ui.accessCt.removeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg> Désactiver le lien d\'accès public';
		ui.accessCt.removeBt.onclick = () => Controller.managePublicAccess('remove');
		
		ui.accessCt.appendChild(ui.accessCt.summary);
		ui.accessCt.appendChild(ui.accessCt.list);
		ui.accessCt.appendChild(ui.accessCt.addBt);
		ui.accessCt.appendChild(ui.accessCt.removeBt);
		ui.main.appendChild(ui.accessCt);

	/* viewer invitations */

		ui.viewersCt = document.createElement('details');
		ui.viewersCt.ontoggle = () => Controller.manageInvitations('browse', 'viewer');

		ui.viewersCt.summary = document.createElement('summary');
		ui.viewersCt.summary.textContent = 'Invitations "visualiseur"';

		ui.viewersCt.list = document.createElement('ul');
		ui.viewersCt.list.setAttribute('id', 'viewer__list');
		
		ui.viewersCt.addBt = document.createElement('button');
		ui.viewersCt.addBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg> Générer un lien d\'inscription';
		ui.viewersCt.addBt.onclick = () => Controller.manageInvitations('create', 'viewer');
	
		ui.viewersCt.removeBt = document.createElement('button');
		ui.viewersCt.removeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg> Supprimer les invitations';
		ui.viewersCt.removeBt.onclick = () => Controller.manageInvitations('remove', 'viewer');
				
		ui.viewersCt.appendChild(ui.viewersCt.summary);
		ui.viewersCt.appendChild(ui.viewersCt.list);
		ui.viewersCt.appendChild(ui.viewersCt.addBt);
		ui.viewersCt.appendChild(ui.viewersCt.removeBt);
		ui.main.appendChild(ui.viewersCt);

	/* publisher invitations */

		ui.publisherCt = document.createElement('details');
		ui.publisherCt.ontoggle = () => Controller.manageInvitations('browse', 'publisher');
		
		ui.publisherCt.summary = document.createElement('summary');
		ui.publisherCt.summary.textContent = 'Invitations "éditeur"';
		
		ui.publisherCt.list = document.createElement('ul');
		ui.publisherCt.list.setAttribute('id', 'publisher__list');
		
		ui.publisherCt.addBt = document.createElement('button');
		ui.publisherCt.addBt.innerHTML = '<svg viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg> Générer un lien d\'inscription';
		ui.publisherCt.addBt.onclick = () => Controller.manageInvitations('create', 'publisher');
		
		ui.publisherCt.removeBt = document.createElement('button');
		ui.publisherCt.removeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg> Supprimer les invitations';
		ui.publisherCt.removeBt.onclick = () => Controller.manageInvitations('remove', 'publisher');
		
		ui.publisherCt.appendChild(ui.publisherCt.summary);
		ui.publisherCt.appendChild(ui.publisherCt.list);
		ui.publisherCt.appendChild(ui.publisherCt.addBt);
		ui.publisherCt.appendChild(ui.publisherCt.removeBt);
		ui.main.appendChild(ui.publisherCt);

	/* user list */

		ui.userListCt = document.createElement('details');
		ui.userListCt.ontoggle = () => Controller.browseUsers();

		ui.userListCt.summary = document.createElement('summary');
		ui.userListCt.summary.textContent = 'Gérer les utilisateurs';

		ui.userListCt.list = document.createElement('ul');
		ui.userListCt.list.setAttribute('id', 'users__list');
			
		ui.userListCt.appendChild(ui.userListCt.summary);
		ui.userListCt.appendChild(ui.userListCt.list);
		ui.main.appendChild(ui.userListCt);

	/* logs */

		ui.logCt = document.createElement('details');
		ui.logCt.ontoggle = () => Controller.manageLogs('browse');

		ui.logCt.summary = document.createElement('summary');
		ui.logCt.summary.textContent = 'Journaux';
		
		ui.logCt.list = document.createElement('ul');
		ui.logCt.list.setAttribute('id', 'logs__list');
		
		ui.logCt.removeBt = document.createElement('button');
		ui.logCt.removeBt.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg> Purger les journaux';
		ui.logCt.removeBt.onclick = () => Controller.manageLogs('remove');			

		ui.logCt.appendChild(ui.logCt.summary);
		ui.logCt.appendChild(ui.logCt.list);
		ui.logCt.appendChild(ui.logCt.removeBt);
		ui.main.appendChild(ui.logCt);

	document.body.insertAdjacentElement('afterbegin', ui.main);

/* ### Ending procedural ### */

	if(localStorage.getItem('theme') === 'dark') {
		View.setDarkTheme();
	}