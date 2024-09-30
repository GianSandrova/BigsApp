const installEvent = () => {
    self.addEventListener('install', (event) => {
        console.log('service worker installed');
        const asyncInstall = new Promise(function (resolve) {
            console.log("waiting install to finish....");
            setTimeout(resolve, 5000)
        })

        event.waitUntil(asyncInstall);
    });
};
installEvent();

const activateEvent = () => {
    self.addEventListener('activate', () => {
        console.log('service worker activated');
    });
};
activateEvent();

const cacheName = 'v1'
const cacheClone = async (e) => {
    const res = await fetch(e.request);
    const resClone = res.clone();

    const cache = await caches.open(cacheName);
    await cache.put(e.request, resClone);
    return res;
};

const fetchEvent = () => {
    self.addEventListener('fetch', (e) => {
        e.respondWith(
            cacheClone(e)
                .catch(() => caches.match(e.request))
                .then((res) => res)
        );
    });
};

fetchEvent();


const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
}

requestNotificationPermission()

const pushNotification = async () => {
    await self.addEventListener('push', (event) => {
        event.waitUntil(
            self.registration.showNotification("Emesys Go", {
                icon: './icon-120.png',
                body: event.data.text(),
                vibra
            })
        )
    })
}

pushNotification();


const cacheName1 = 'v1';
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();

                        caches.open(cacheName1)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch((error) => {
                                console.error('Failed to cache:', error);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error('Cache match failed:', error);
                throw error;
            })
    );
});