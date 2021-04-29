"use strict";

const ui = { messBox: document.querySelector('.admin__mess__box') };

function writeMessBox(html) {
	ui.messBox.innerHTML += `<p>${html}</p>`;
	ui.messBox.scrollTop = ui.messBox.scrollHeight;
}
function emptyMessBox() {
	ui.messBox.innerHTML = '';
} 
function ajaxLog(origin, log){
	writeMessBox('### ' + origin + ' ### ' + log);
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
				if(resp.content.length > 0) {
					writeMessBox(resp.content);
				}
				else {
					writeMessBox(lab.mess.empty);
				}
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
				writeMessBox(resp.content);
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
			if(resp.state === 'success') {
				writeMessBox(lab.mess.success);
			}
			else if(resp.state === 'empty') {
				writeMessBox(lab.mess.empty);
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
				writeMessBox(resp.content);
			}
		}
	)
	.catch(error => ajaxLog('browseUsers', error));
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
				const logs = JSON.parse(resp.content);
				if(logs.length > 0) {
					for(const log of logs) {
						writeMessBox(
							`<b>IN</b> -> ${log.in} | <b>ON</b> -> ${log.on} | <b>BY</b> -> ${log.by}<br/>
							<i>${log.log}</i>`
						);
					}
				}
				else {
					writeMessBox(lab.mess.empty);
				}
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
				writeMessBox(lab.mess.success);
			}
		}
	)
	.catch(error => ajaxLog('removeLogs', error));
}