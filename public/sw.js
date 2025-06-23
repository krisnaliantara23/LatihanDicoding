const CACHE_NAME = 'film-cache-v1';
const BASE_PATH = '/LatihanDicoding';

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/sw.js`,
  `${BASE_PATH}/styles/styles.css`,
  `${BASE_PATH}/scripts/index.js`,
  `${BASE_PATH}/icons/popcorn.png`,
  `${BASE_PATH}/icons/cinema.png`,
  `${BASE_PATH}/images/favicon.png`,
  `${BASE_PATH}/images/logo.png`,
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});

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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(BASE_PATH + '/'));
});
