"use strict";

const ajaxPost = (req) => {

	return new Promise(
	
		(resolve, reject) => {

			let formData = new FormData();
			for(const arg of req.args) {
				formData.append(arg.name, arg.value);
			}
	
			fetch(
				'./app/server/' + req.script, {
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
			script: 'cir-log.php',
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