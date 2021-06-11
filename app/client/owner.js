"use strict";

/* ### Enhance UI ### */

	/* Navigation */

		const toAdminBtElm = document.createElement('button');
		toAdminBtElm.setAttribute('title', 'Accéder aux outils d\'administration');
		toAdminBtElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></svg>';
		toAdminBtElm.onclick = () => window.location.href = './pages/admin';
		document.getElementById('switchThemeBt').insertAdjacentElement('afterend', toAdminBtElm);

	/* Permissions */

		const permsPanElm = document.createElement('div');
		permsPanElm.classList.add('perms-panel');
		permsPanElm.innerHTML =
			`<div>
				<nav class="perms-panel__nav">
					<!-- Close the panel. -->
					<button 
						class="start-trap" 
						onclick="unsetPermsPanel()" 
						title="Fermer">
						<svg viewBox="-3 -3 30 30"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
					</button>
				</nav>
				<div>
					<form data-item-path="">
						<fieldset>
							<legend>Règle d'accès au dossier</legend>
							<label>
								<input class="perms-radio" type="radio" name="isRestricted" value="false" />
								Ouvert à tout membre ayant accès à ce cirrus
							</label>
							<label>
								<input class="perms-radio" type="radio" name="isRestricted" value="true" />
								Ouvert aux seuls membres enregistrés figurant dans la liste ci-dessous
							</label>
						</fieldset>
						<label>
							Membres accrédités (un par ligne)
							<textarea name="accreditedMembers"></textarea>
						</label>
						<button 
							class="start-trap"
							title="Valider" 
							type="submit">
							<svg viewBox="0 0 24 24"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/></svg>
						</button>
					</form>
				</div>
			</div>`;
		document.querySelector('main').insertAdjacentElement('beforeend', permsPanElm);		
		permsPanElm.querySelector('form').onsubmit = e => {
			updatePerms(e.target.getAttribute('data-item-path'));
			e.preventDefault();
		};

	/* Registration */

		const regBanElm = document.createElement('div');
		regBanElm.classList.add('registration-banner');
		regBanElm.textContent = 'cirrus non enregistré';

		const purchAElm = document.createElement('a');
		purchAElm.classList.add('cta');
		purchAElm.setAttribute('href', 'http://dev.getcirrus/enregistrer?cirrusId=' + cirrusId);
		purchAElm.setAttribute('target', '_blank');
		purchAElm.setAttribute('title', 'Enregistrer ce cirrus');
		purchAElm.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 23.73l-3-2.122v-14.2l3 1.359v14.963zm2-14.855v15.125l13-1.954v-15.046l-13 1.875zm5.963-7.875c-2.097 0-3.958 2.005-3.962 4.266l-.001 1.683c0 .305.273.54.575.494.244-.037.425-.247.425-.494v-1.681c.003-1.71 1.416-3.268 2.963-3.268.537 0 1.016.195 1.384.564.422.423.654 1.035.653 1.727v1.747c0 .305.273.54.575.494.243-.037.423-.246.423-.492l.002-1.749c.002-1.904-1.32-3.291-3.037-3.291zm-6.39 5.995c.245-.037.427-.247.427-.495v-2.232c.002-1.71 1.416-3.268 2.963-3.268l.162.015c.366-.283.765-.513 1.188-.683-.405-.207-.858-.332-1.35-.332-2.096 0-3.958 2.005-3.962 4.266v2.235c0 .306.272.538.572.494z"/></svg>';

		regBanElm.appendChild(purchAElm);
		document.querySelector('main').insertAdjacentElement('afterbegin', regBanElm);

		document.querySelector('.popup').innerHTML += 
			`<div class="popup-purchase">
				<p>Vous appréciez cirrus ?<br/>Enregistrez-le.</p>
				<a 
					class="popup__a purchase-bt" 
					href="http://dev.getcirrus/enregistrer?cirrusId=${cirrusId}"
					target="_blank">
					Enregistrer ce cirrus
				</a>
				<a 
					class="popup__a" 
					href="#"
					onclick="togglePopup(false, '--purchase')">
					Plus tard
				</a>
			</div>`;

/* ### Client side functions ### */

	function setPermsPanel(dirPath, content) {
		document.querySelector('.perms-radio[value=' + content.isRestricted + '').checked = true;
		const textAreaElm = permsPanElm.querySelector('textarea');
		textAreaElm.value = '';
		if(content.accreditedMembers !== null) {
			for(let member of content.accreditedMembers) {
				textAreaElm.value += member + '\n';
			}
		}
		permsPanElm.querySelector('form').setAttribute('data-item-path', dirPath);
		permsPanElm.classList.add('--visible');
	}
	function unsetPermsPanel() {
		permsPanElm.classList.remove('--visible');
	}

/* ### Server side functions ### */

	function browsePerms(dirPath) {
		ajaxPost(
			{ 
				script: './app/server/browse-permissions.php',
				args: [
					{
						name: 'dirPath',
						value: dirPath
					}
				]
			}
		)
		.then(
			resp => {
				if(resp.success) {	
					setPermsPanel(dirPath, resp.content);
				}
			}
		)
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
	}
	function updatePerms(dirPath) {
		ajaxPost(
			{ 
				script: './app/server/manage-permissions.php',
				args: [
					{
						name: 'dirPath',
						value: dirPath
					},
					{
						name: 'isRestricted',
						value: document.getElementsByName('isRestricted')[0].checked ? false : true
					},
					{
						name: 'accreditedMembers',
						value: document.getElementsByName('accreditedMembers')[0].value.trim()
					}
				]
			}
		)
		.then(
			resp => {
				if(resp.success) {	
					unsetPermsPanel();
				}
			}
		)
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
	}
	function checkLicence() {
		ajaxPost (
			{
				script: 'https://getcirrus.awebsome.fr/enregistrer/verification/',
				args: [
					{
						name: 'cirrusId',
						value: cirrusId
					}
				]
			}
		).then(
			resp => {
				if(resp.success) {
					if(!resp.isRegistered) {
						document.querySelector('.registration-banner').classList.add('--visible');
						togglePopup(true, '--purchase');
					}
				}
			}
		)
		.catch(() => console.log('Une erreur est survenue pendant le traitement de cette action.'));
	}

checkLicence();