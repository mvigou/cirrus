"use strict";

function setInvits(role, invits) {
	const listElm = document.querySelector('.' + role + '__list');
	if(invits.length > 0) {
		listElm.innerHTML = '';
		for(let invit of invits) {
			let itemElm = document.createElement('li');
			let aElm = document.createElement('a');
			aElm.setAttribute('href', invit.url);
			aElm.setAttribute('target', '_blank');
			aElm.textContent = invit.url.substring(0, 48) + '...';
			itemElm.appendChild(aElm);
			listElm.appendChild(itemElm);
		}
	}
	else {
		listElm.innerHTML = '...';
	}
}
function setUsers(users) {
	const listElm = document.querySelector('.users__list');
	if(users.length > 0) {
		listElm.innerHTML = '';
		for(let user of users) {
			let itemElm = document.createElement('li');
			itemElm.textContent = user.name;
			let setUserBtElm = document.createElement('button');
			if(user.role === 'viewer') {
				setUserBtElm.innerHTML = `<svg viewBox="0 0 24 24"><path d="M18.311 2.828l2.862 2.861-15.033 15.032-3.583.722.723-3.584 15.031-15.031zm0-2.828l-16.873 16.872-1.438 7.127 7.127-1.437 16.874-16.873-5.69-5.689z"/></svg>${lab.bt.setPublisher}`;
				setUserBtElm.onclick = () => moveUser(user.name, 'viewer', 'publisher');
			}
			else if(user.role === 'publisher') {
				setUserBtElm.innerHTML = `<svg viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>${lab.bt.setViewer}`;
				setUserBtElm.onclick = () => moveUser(user.name, 'publisher', 'viewer');
			}
			itemElm.appendChild(setUserBtElm);
			let removeBtElm = document.createElement('button');
			removeBtElm.innerHTML = `<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>${lab.bt.removeUser}`;
			removeBtElm.onclick = () => removeUser(user.name, user.role);
			itemElm.appendChild(removeBtElm);
			listElm.appendChild(itemElm);
		}
	}
	else {
		listElm.innerHTML = '...';
	}
}
function setLogs(logs) {
	const listElm = document.querySelector('.logs__list');
	if(logs.length > 0) {
		listElm.innerHTML = '';
		for(const log of logs) {
			let itemElm = document.createElement('li');
			let logElm = document.createElement('p');
			logElm.innerHTML =
				`<b>IN</b> -> ${log.in} | <b>ON</b> -> ${log.on} | <b>BY</b> -> ${log.by}<br/>
				<i>${log.log}</i>`;
			itemElm.appendChild(logElm);
			listElm.appendChild(itemElm);
		}
	}
	else {
		listElm.innerHTML = '...';
	}
}