const CACHE_NAME = 'film-cache-v1';
const BASE_PATH = '/LatihanDicoding'; 

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/styles/styles.css`,
  `${BASE_PATH}/scripts/index.js`,
  `${BASE_PATH}/scripts/sw.js`,
  `${BASE_PATH}/popcorn.png`,
  `${BASE_PATH}/cinema.png`,
  `${BASE_PATH}/video.png` 
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});


self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) =>
      cachedResponse || fetch(event.request)
    )
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: `${BASE_PATH}/icons/popcorn.png`,
    badge: `${BASE_PATH}/icons/cinema.png`,
  };

  event.waitUntil(
    self.registration.showNotification('New Story Available!', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(`${BASE_PATH}/`)
  );
});
