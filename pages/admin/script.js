"use strict";

const UI = { messBox: document.querySelector('.admin__mess-box') };

const writeMessBox = html => {
	UI.messBox.innerHTML += `<p>${html}</p>`;
	UI.messBox.scrollTop = UI.messBox.scrollHeight;
};

const emptyMessBox = () => UI.messBox.innerHTML = '';

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
	.then(() => writeMessBox(UI.messBox.getAttribute('data-mess-server-error')))

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
		   writeMessBox(`<a href="${response}">${response}</a>`);
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
			writeMessBox(UI.messBox.getAttribute('data-mess-invit-removed'));
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
				if(signUpUrls.length > 0) {
					let html = '';
					for(const signUpUrl of signUpUrls) {			
						html += `<a href="${signUpUrl}">${signUpUrl}</a>`
					}
					writeMessBox(html);
				}
				else {
					writeMessBox(UI.messBox.getAttribute('data-mess-invit-empty'));
				}
			}
			catch(e) {
				throw new Error('A JSON object was expected but the server sent something else.')
			}
		}
	)
	.catch(error => ajaxLog('browseInvit', error));

}