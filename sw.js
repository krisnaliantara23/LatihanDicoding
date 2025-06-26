const CACHE_NAME = 'dicoding-story-cache-v1';
const BASE_URL = '/LatihanDicoding/';

const assetsToCache = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}manifest.json`,
  `${BASE_URL}icons/icon-192.png`,
  `${BASE_URL}icons/icon-512.png`,
  `${BASE_URL}images/favicon.png`,
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
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
      return cachedResponse || fetch(event.request);
    })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: `${BASE_URL}icons/popcorn.png`,
    badge: `${BASE_URL}icons/cinema.png`,
  };

  event.waitUntil(
    self.registration.showNotification('New Story Available!', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(BASE_URL));
});
