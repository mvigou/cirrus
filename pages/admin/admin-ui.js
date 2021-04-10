"use strict";

// https://github.com/AwebsomeFr/chess
const chess=t=>{let e=document.createElement(t.type);if(t.text?e.textContent=t.text:t.html&&(e.innerHTML=t.html),t.attributes)for(let n in t.attributes)e.setAttribute(n,t.attributes[n]);if(t.events)for(let n of t.events)e.addEventListener(n.type,n.function);if(t.children)for(let n of t.children)e.appendChild(chess(n));return e}

const UI = {};

UI.main = chess({ type: 'main' });

UI.main.appendChild(
	chess(
		{
			type: 'a',
			attributes: {
				href: '../../'
			},
			text: lab.bt.back
		}
	)
);

UI.messBox = chess(
	{
		type: 'div',
		attributes: {
			class: 'admin__mess-box'
		}
	}
);

UI.main.appendChild(UI.messBox);

UI.main.appendChild(
	chess(
		{
			type: 'h2',
			text: lab.title.invit
		}
	)
);

UI.main.appendChild(
	chess(
		{
			type: 'p',
			text: lab.role.invit
		}
	)
);

UI.main.appendChild(
	chess(
		{
			type: 'div',
			attributes: {
				class: 'admin__invit'
			},
			children: [
				{
					type: 'div',
					children: [
						{
							type: 'h3',
							text: lab.title.owners
						},
						{
							type: 'p',
							text: lab.title.ownerRights
						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => createInvit('owner')
								}
							],
							html: '<svg class="admin__svg" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>' + lab.bt.createInvit
						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => browseInvit('owner')
								}
							],
							
							html: '<svg class="admin__svg" viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>' + lab.bt.browseInvit
						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => removeInvit('owner')
								}
							],
							html: '<svg class="admin__svg" viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>' + lab.bt.removeInvit
						}
					]
				},
				{
					type: 'div',
					children: [
						{
							type: 'h3',
							text: lab.title.viewers
						},
						{
							type: 'p',
							text: lab.title.viewerRights

						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => createInvit('viewer')
								}
							],
							html: '<svg class="admin__svg" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>' + lab.bt.createInvit
						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => browseInvit('viewer')
								}
							],
							
							html: '<svg class="admin__svg" viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>' + lab.bt.browseInvit
						},
						{
							type: 'button',
							attributes: {
								class: 'admin__bt'
							},
							events: [
								{
									type: 'click',
									function: () => removeInvit('viewer')
								}
							],
							html: '<svg class="admin__svg" viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>' + lab.bt.removeInvit
						}
					]
				}
			]
		}
	)
);

document.body.appendChild(UI.main);