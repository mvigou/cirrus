"use strict";

const ajaxPost = (req) => {

	return new Promise(
	
		(resolve, reject) => {

			let formData = new FormData();
			for(const arg of req.args) {
				formData.append(arg.name, arg.value);
			}
	
			fetch(
				'/app/server/' + req.script, {
					method: 'POST',
					body: formData
				}
			).
			then(
				response => {					
					if(response.ok) {
						response.text().then(
							response => resolve(response)
						)
					}
					else {
						reject(new Error(response.status + ': ' + response.statusText));
					}
				}
			);

		}

	);

};

const ajaxLog = (origin, log) => {

	ajaxPost(
		{
			script: 'log.php',
			args: [
				{ 
					name: 'origin', 
					value: origin
				},
				{ 
					name: 'log',
					value: log
				}
			]
		},
	)
	.then(response => setPop('warning', lab.pop.loggedError));

};

const createInvit = (role) => {

	ajaxPost(
		{
			script: 'inv-create.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then( 
		response => {
		   UI.messBox.innerHTML = `<a href="${response}">${response}</a>`;
		}
	)
	.catch(error => ajaxLog('createInvit', error));

};

const removeInvit = (role) => {

	ajaxPost(
		{
			script: 'inv-remove.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then( 
		response => {
			UI.messBox.innerHTML = lab.mess.invitDeleted
		}
	)
	.catch(error => ajaxLog('removeInvit', error));

};

const browseInvit = (role) => {

	ajaxPost(
		{
			script: 'inv-browse.php',
			args: [
				{
					name: 'role',
					value: role
				}
			]
		}
	)
	.then( 
		response => {
			try {
				
				const signUpUrls = JSON.parse(response);
				UI.messBox.innerHTML = '';

				if(signUpUrls.length > 0) {
					for(const signUpUrl of signUpUrls) {
						UI.messBox.appendChild(
							chess(
								{		
									type: 'a',
									attributes: {
										href: signUpUrl,
									},
									text: signUpUrl
								}
							)
						);
					}
				}
				else {
					UI.messBox.innerHTML = lab.mess.invitEmpty;
				}
				
			}
			catch(e) {
				throw new Error('A JSON object was expected but the server sent something else.')
			}
		}
	)
	.catch(error => ajaxLog('browseInvit', error));

}

const writeMess = (mess) => {
	
	UI.messBox.innerHTML += mess;

};