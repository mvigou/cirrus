"use strict";

const ajaxPost = (req) => {

	return new Promise(
	
		(resolve, reject) => {
			
			let formData = new FormData();
			for(const arg of req.args) {
				formData.append(arg.name, arg.value);
			}
	
			fetch(
				'./app/php/' + req.script, {
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
		'log',
		[
			{ name: 'origin', value: origin },
			{ name: 'log', value: log }
		],
	)
	.then( // Expected response : absolutely nothing if it's done. 
		response => { 
			setPop('watching', response === '' ?
				`${lab.logErrorTrue} <a href="error-logs.html" target="_blank">error-logs.html</a> (en).` :
				lab.logErrorFalse
			);
			setTimeout(
				() => unsetPop(),
				3000
			);
		}
	)

};