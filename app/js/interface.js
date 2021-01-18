"use strict";

const UI = {};

UI.main = chess({ type: 'main' });
UI.browser = chess({ type: 'section', attributes: { class: 'bwr' }});
UI.browserNav = chess({ type: 'nav', attributes: { class: 'bwr__nav' }});
UI.browserNavActions = chess({ type: 'div', attributes: { class: 'bwr__nav__actions' }});
UI.browserNavTree = chess({ type: 'div', attributes: { class: 'bwr__nav__tree' }});
UI.browserList = chess({ type: 'ul', attributes: { class: 'bwr__list' }});

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg viewBox="0 0 24 24"><path d="M12 5c3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-13c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78zm0-2c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092z"/></svg>',
			attributes: {
				class: 'bwr__nav__bt recycle-feature',
				onclick: 'browseDirectory(\'DATAS\'), switchMainDir(\'DATAS\')',
				title: lab.bt.toDataDir
			}
		}
	)
);

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg viewBox="0 0 24 24"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>',
			attributes: {
				class: 'bwr__nav__bt datas-feature',
				onclick: 'browseDirectory(\'RECYCLE\'), switchMainDir(\'RECYCLE\')',
				title: lab.bt.toRecycleDir
			}
		}
	)
);

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg viewBox="3 3 18 18"><path d="M10.4971 12.9823L10 12.4853L12.4853 10L14.9706 12.4853L14.4735 12.9823L12.8368 11.3456V16H12.1338V11.3456L10.4971 12.9823Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1571 3H6.63636C5.73262 3 5 3.73262 5 4.63636V19.3636C5 20.2674 5.73262 21 6.63636 21H18.0909C18.9946 21 19.7273 20.2674 19.7273 19.3636V7.57019L15.1571 3ZM6.63636 4.63636H13.1818V7.90909C13.1818 8.81283 13.9144 9.54545 14.8182 9.54545H18.0909V19.3636H6.63636V4.63636ZM14.8182 7.90909V4.97527L17.752 7.90909H14.8182Z"/></svg>',
			attributes: {
				class: 'bwr__nav__bt datas-feature',
				onclick: 'uploadFiles()',
				title: lab.bt.sendFiles
			}
		}
	)
);

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg viewBox="3 3 18 18"><path d="M12.75 16H11.25V13.75H9V12.25H11.25V10H12.75V12.25H15V13.75H12.75V16Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3636 6.63636C20.2674 6.63636 21 7.36899 21 8.27273V18.0909C21 18.9946 20.2674 19.7273 19.3636 19.7273H4.63636C3.73262 19.7273 3 18.9946 3 18.0909V6.63636C3 5.73262 3.73262 5 4.63636 5H9.54545C10.4618 5 11.0451 5.38901 11.631 6.12815C11.6472 6.14858 11.6866 6.19938 11.7303 6.25567C11.792 6.3352 11.8624 6.42596 11.8875 6.45703C11.9129 6.48848 11.9342 6.51449 11.9519 6.53598C12.0239 6.6235 12.0343 6.63619 12.0015 6.63636H19.3636ZM19.3636 18.0909V8.27273L11.9956 8.27272C11.408 8.26957 11.0253 7.99447 10.6139 7.48444C10.5766 7.43825 10.4861 7.32155 10.4203 7.23679C10.3859 7.19243 10.3582 7.15674 10.3486 7.14458C10.0421 6.75792 9.85984 6.63636 9.54545 6.63636H4.63636V18.0909H19.3636Z" /></svg>',
			attributes: {
				class: 'bwr__nav__bt datas-feature',
				onclick: 'createDirectory()',
				title: lab.bt.createDir
			}
		}
	)
);

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg class="dangerous" viewBox="0 0 24 24"><path d="M18.5 15c-2.486 0-4.5 2.015-4.5 4.5s2.014 4.5 4.5 4.5c2.484 0 4.5-2.015 4.5-4.5s-2.016-4.5-4.5-4.5zm-.469 6.484l-1.688-1.637.695-.697.992.94 2.115-2.169.697.696-2.811 2.867zm-2.031-12.484v4.501c-.748.313-1.424.765-2 1.319v-5.82c0-.552.447-1 1-1s1 .448 1 1zm-4 0v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1zm1.82 15h-11.82v-18h2v16h8.502c.312.749.765 1.424 1.318 2zm-6.82-16c.553 0 1 .448 1 1v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1zm14-4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-1 2v7.182c-.482-.115-.983-.182-1.5-.182l-.5.025v-7.025h2z"/></svg>',
			attributes: {
				class: 'bwr__nav__bt recycle-feature',
				onmousedown: 'watchConfirmClick(\'start\', \'empty-recycle\')',
				onmouseup: 'watchConfirmClick(\'end\', \'empty-recycle\'), removeElm(\'RECYCLE\')',
				onmouseleave: 'cancelConfirm()',
				ontouchmove: 'cancelConfirm()',
				title: lab.bt.emptyRecycle
			},
			events: [
				{
					type: 'touchstart',
					function: (e) => watchConfirmTouch('start', e)
				},
				{
					type: 'touchend',
					function: (e) => { 
						watchConfirmTouch('end', e);
						removeElm('RECYCLE');
					}
				}
			]
		}
	)
);

UI.browserNavActions.appendChild(
	chess(
		{
			type: 'button',
			html: '<svg viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>',
			attributes: {
				class: 'bwr__nav__bt',
				onclick: 'switchTheme()',
				title: lab.bt.switchTheme
			}
		}
	)
);

UI.progressClick = chess(
	{ type: 'div', attributes: { class: 'pgr-click' }, children: [
		{ type: 'div', children: [
			{ type: 'div', attributes: { class: 'pgr-click__tiles-ct' }, children: [   
				{ type: 'div', attributes: { class: 'pgr-click__tile' }},
				{ type: 'div', attributes: { class: 'pgr-click__tile' }},
				{ type: 'div', attributes: { class: 'pgr-click__tile' }},
				{ type: 'div', attributes: { class: 'pgr-click__tile' }},
			]},
			{ type: 'p', text: lab.confirmPress, attributes: { class: 'pgr-click__mess' }}
		]}
	]}
);

UI.progressUpload = chess(
	{ type: 'div', attributes: { class: 'pgr-upload' }, children: [
		{ type: 'p', attributes: { class: 'pgr-upload__mess' }},
		{ type: 'div', attributes: { class: 'pgr-upload__progress' }}		
	]}
);

UI.dial = chess(
	{ type: 'div', attributes: { class: 'dial' }, children: [
		{ type: 'div', attributes: { class: 'dial__content' }}		
	]}
);

UI.browserNav.appendChild(UI.browserNavActions);
UI.browserNav.appendChild(UI.browserNavTree);
UI.browser.appendChild(UI.browserNav);
UI.browser.appendChild(UI.browserList);

UI.main.appendChild(UI.browser);
UI.main.appendChild(UI.progressClick);
UI.main.appendChild(UI.progressUpload);
UI.main.appendChild(UI.dial);

document.body.appendChild(UI.main);