"use strict";

const UI = { messBox: document.querySelector('.admin__mess__box') };

const writeMessBox = html => {
	UI.messBox.innerHTML += `<p>${html}</p>`;
	UI.messBox.scrollTop = UI.messBox.scrollHeight;
};

const emptyMessBox = () => UI.messBox.innerHTML = '';

const ajaxLog = (origin, log) => writeMessBox('### ' + origin + ' ### ' + log);

const ajaxPost = (req) => {

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
									reject(UI.messBox.getAttribute('data-mess-notAJSON') + resp);
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

};

const browseInvits = role => {

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
			if(resp.state === 'success') {
				writeMessBox(resp.content);
			}
			else if(resp.state === 'empty') {
				writeMessBox(UI.messBox.getAttribute('data-mess-empty'));
			}
		}
	)
	.catch(error => ajaxLog('browseInvits', error));

}

const createInvit = role => {

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
			if(resp.state === 'success') {
				writeMessBox(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('createInvit', error));

};

const removeInvits = role => {

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
			if(resp.state === 'success') {
				writeMessBox(UI.messBox.getAttribute('data-mess-success'));
			}
			else if(resp.state === 'empty') {
				writeMessBox(UI.messBox.getAttribute('data-mess-empty'));
			}
		}
	)
	.catch(error => ajaxLog('removeInvits', error));

};

const browseUsers = () => {

	ajaxPost(
		{ 
			script: 'browse-users.php' 
		}
	)
	.then( 
		resp => {
			if(resp.state === 'success') {
				writeMessBox(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('browseUsers', error));

};