// Instal dan Aktivasi Service Worker
self.addEventListener('install', (event) => {
    console.log('Service worker installed');
    const asyncInstall = new Promise((resolve) => {
        console.log("Waiting install to finish....");
        setTimeout(resolve, 5000);
    });

    event.waitUntil(asyncInstall);
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Pengelolaan Cache
const cacheName = 'v1';
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Jika fetch gagal (offline), coba berikan respons dari cache
                return caches.match(event.request).then((cacheResponse) => {
                    if (cacheResponse) {
                        console.log('No internet connection found. App is running in offline mode.');
                        return cacheResponse;
                    }
                    // Opsi fallback jika tidak ada cache yang cocok
                    return caches.match('/offline.html');
                });
            });
        })
    );
});

self.addEventListener('push', function (event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: './icons/icon-512x512.png',
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function (clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});


