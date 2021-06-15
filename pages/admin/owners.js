"use strict";

/* ### Client side functions ### */

	function toDarkTheme() {	
		document.body.classList.add('--dark-mode');
		localStorage.setItem('theme', 'dark');
	}
	function toLightTheme() {
		document.body.classList.remove('--dark-mode');
		localStorage.setItem('theme', 'light');
	};
	function switchTheme() {
		document.body.classList.contains('--dark-mode') ?
			toLightTheme():
			toDarkTheme();
	}
	function setList(listId, content = null) {
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
	}
	function setUserList(users) {
		const listElm = document.getElementById('users__list');
		if(users.length > 0) {
			listElm.innerHTML = '';
			for(let user of users) {
				let itemElm = document.createElement('li');
				itemElm.textContent = user.name;
				let setUserBtElm = document.createElement('button');
				if(user.role === 'viewer') {
					setUserBtElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>Changer en éditeur';
					setUserBtElm.onclick = () => moveUser(user.name, 'viewer', 'publisher');
				}
				else if(user.role === 'publisher') {
					setUserBtElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>Changer en visualiseur';
					setUserBtElm.onclick = () => moveUser(user.name, 'publisher', 'viewer');
				}
				itemElm.appendChild(setUserBtElm);
				let removeBtElm = document.createElement('button');
				removeBtElm.innerHTML = '<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>Supprimer';
				removeBtElm.onclick = () => removeUser(user.name, user.role);
				itemElm.appendChild(removeBtElm);
				listElm.appendChild(itemElm);
			}
		}
		else {
			listElm.innerHTML = '...';
		}
	}

/* ### Server side functions ### */

	function ajaxPost(req) {
		return new Promise(
			(resolve, reject) => {
				let formData = new FormData();
				if(req.args !== undefined) {
					for(const arg of req.args) {
						formData.append(arg.name, arg.value);
					}
				}
				fetch(
					'../../app/server/' + req.script, {
						method: 'POST',
						body: formData
					}
				).
				then(
					resp => {					
						if(resp.ok) {
							resp.text().then(
								resp => {
									try {
										const parsedResp = JSON.parse(resp);
										resolve(parsedResp);
									}
									catch(e) {
										reject(resp);
									}	
								}
							)
						}
						else {
							reject(new Error(resp.status + ': ' + resp.statusText));
						}
					}
				);
			}
		);
	}
	function browseUsers() {
		ajaxPost(
			{ 
				script: 'browse-users.php' 
			}
		)
		.then( 
			resp => {
				if(resp.success) {
					setUserList(resp.content);
				}
			}
		)
	}
	function moveUser(userName, fromRole, toRole) {
		ajaxPost(
			{ 
				script: 'move-user.php',
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
		.then( 
			resp => {
				if(resp.success) {
					browseUsers();
				}
			}
		)
	}
	function removeUser(userName, userRole) {
		if(confirm('Supprimer le compte : ' + userName)) {
			ajaxPost(
				{ 
					script: 'remove-user.php',
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
			.then( 
				resp => {
					if(resp.success) {
						browseUsers();
					}
				}
			)
		}
	}
	function managePublicAccess(action) {
		ajaxPost(
			{
				script: 'manage-public-access.php',
				args: [
					{
						name: 'action',
						value: action
					}
				]			
			}
		)
		.then(
			resp => {
				if(resp.success) {
					setList('public-access__list', resp.content);
				}
			}
		)
	}
	function manageInvitations(action, role) {
		ajaxPost(
			{
				script: 'manage-invitations.php',
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
		.then(
			resp => {
				if(resp.success) {
					setList(role + '__list', resp.content);
				}
			}
		)
	}
	function manageLogs(action) {
		ajaxPost(
			{ 
				script: 'manage-logs.php',
				args: [
					{
						name: 'action',
						value: action
					}
				]		
			}
		)
		.then( 
			resp => {
				if(resp.success) {
					setList('logs__list', resp.content);
				}
			}
		)
	}

/* ### Ending procedural ### */

	if(localStorage.getItem('theme') === 'dark') {
		toDarkTheme();
	}