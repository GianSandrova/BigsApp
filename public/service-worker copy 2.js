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
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(cacheName)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});


// self.addEventListener('push', (event) => {
//     console.log('Push event received', event);
//     const payload = event.data.json();
//     const title = payload.title;
//     const options = {
//         body: payload.body,
//         icon: '/public/icons/icon-512x512.png',
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
// });

// Pengelolaan Push Notifikasi
// self.addEventListener('push', (event) => {
//     const data = event.data.json();
//     event.waitUntil(
//         self.registration.showNotification(data.title, {
//             icon: './icon-120.png',
//             body: data.body,
//         })
//     );
// });




// self.addEventListener('install', (event) => {
//     console.log('service worker installed');
//     const asyncInstall = new Promise(function (resolve) {
//         console.log("waiting install to finish....");
//         setTimeout(resolve, 5000)
//     })

//     event.waitUntil(asyncInstall);
// });
// self.addEventListener('activate', () => {
//     console.log('service worker activated');
// });


// // const cacheName = 'v1'
// // const cacheClone = async (e) => {
// //     const res = await fetch(e.request);
// //     const resClone = res.clone();

// //     const cache = await caches.open(cacheName);
// //     await cache.put(e.request, resClone);
// //     return res;
// // };

// // const fetchEvent = () => {
// //     self.addEventListener('fetch', (e) => {
// //         e.respondWith(
// //             cacheClone(e)
// //                 .catch(() => caches.match(e.request))
// //                 .then((res) => res)
// //         );
// //     });
// // };

// // fetchEvent();
// const cacheName = 'v1';

// const cacheClone = async (e) => {
//     try {
//         self.addEventListener('fetch', (event) => {
//             event.respondWith(
//                 caches.match(event.request)
//                     .then((response) => {
//                         // Jika data sudah ada di cache, kembalikan respons dari cache
//                         if (response) {
//                             return response;
//                         }

//                         // Jika data belum ada di cache, ambil dari jaringan dan simpan di cache
//                         return fetch(event.request)
//                             .then((response) => {
//                                 // Periksa apakah respons valid dan bukan dari cache
//                                 if (!response || response.status !== 200 || response.type !== 'basic') {
//                                     return response;
//                                 }

//                                 // Clone respons agar dapat digunakan oleh kedua sumber
//                                 const responseToCache = response.clone();

//                                 // Simpan respons ke dalam cache
//                                 caches.open(cacheName)
//                                     .then((cache) => {
//                                         cache.put(event.request, responseToCache);
//                                     });

//                                 return response;
//                             });
//                     })
//             );
//         });
//     } catch (error) {
//         console.error('Error fetching and caching:', error);
//         throw error; // Melemparkan error untuk ditangani di luar fungsi
//     }
// };


// cacheClone()


// const requestNotificationPermission = async () => {
//     const permission = await window.Notification.requestPermission();
//     if (permission !== 'granted') {
//         throw new Error('Permission not granted for Notification');
//     }
// }
// requestNotificationPermission()

// const pushNotification = async () => {

// }
// pushNotification()
// self.addEventListener('push', (event) => {
//     event.waitUntil(
//         self.registration.showNotification("Emesys Go", {
//             icon: './icon-120.png',
//             body: event.data.text(),
//         })
//     )
// })