self.oninstall = e => {
	e.waitUntil(
		caches.open('cirrus-cache')
			.then(cache => {
				return cache.addAll(
					[
						'./app/client/cirrus-favicon.png',
						'./app/client/cirrus-logo-192.png',
						'./app/client/cirrus-logo-512.png',
						'./app/client/cirrus-logo-alt.svg',
						'./app/client/cabin-regular.woff2',
					]
				);
			}
		)
	);
};
self.onfetch = e => {
	e.respondWith(	
		caches.match(e.request)
			.then(resp => {
				if(resp) {
					return resp;
				}
				return fetch(e.request);
			}
		)
	);
};