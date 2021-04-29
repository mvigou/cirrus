"use strict";

function ajaxLog(origin, log){
	console.log('here');
}
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
function browseInvits(role) {
	ajaxPost(
		{
			script: 'browse-invits.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then( 
		resp => {
			if(resp.success) {
				setInvits(role, resp.content);
			}
		}
	)
	.catch(error => ajaxLog('browseInvits', error));
};
function createInvit(role) {
	ajaxPost(
		{
			script: 'create-invit.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then(
		resp => {
			if(resp.success) {
				browseInvits(role);
			}
		}
	)
	.catch(error => ajaxLog('createInvit', error));
}
function removeInvits(role) {
	ajaxPost(
		{
			script: 'remove-invits.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then( 
		resp => {
			if(resp.success) {
				browseInvits(role);
			}
		}
	)
	.catch(error => ajaxLog('removeInvits', error));
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
				setUsers(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('browseUsers', error));
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
	.catch(error => ajaxLog('moveUser', error));
}
function removeUser(userName, userRole) {
	if(confirm(lab.mess.confirm + userName)) {
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
		.catch(error => ajaxLog('removeUser', error));
	}
}
function browseLogs() {
	ajaxPost(
		{ 
			script: 'browse-logs.php'
		}
	)
	.then( 
		resp => {
			if(resp.success) {
				setLogs(JSON.parse(resp.content));
			}
		}
	)
	.catch(error => ajaxLog('browseLogs', error));
}
function removeLogs() {
	ajaxPost(
		{ 
			script: 'remove-logs.php'
		}
	)
	.then( 
		resp => {
			if(resp.success) {
				browseLogs();
			}
		}
	)
	.catch(error => ajaxLog('removeLogs', error));
}