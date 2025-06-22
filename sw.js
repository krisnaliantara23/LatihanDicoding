const CACHE_NAME = 'film-cache-v1';
const urlsToCache = [
  '/LatihanDicoding/',
  '/LatihanDicoding/index.html',
  '/LatihanDicoding/icons/popcorn.png',
  '/LatihanDicoding/icons/cinema.png',
  '/LatihanDicoding/manifest.json',
  '/LatihanDicoding/sw.js',
  // Tidak cache styles.css dan index.js langsung
  // karena mereka dibundling dan berubah nama
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
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
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/LatihanDicoding/icons/popcorn.png',
    badge: '/LatihanDicoding/icons/cinema.png',
  };

  event.waitUntil(
    self.registration.showNotification('New Story Available!', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/LatihanDicoding/'));
});
