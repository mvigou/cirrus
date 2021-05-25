"use strict";

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
				setUsers(resp.content);
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