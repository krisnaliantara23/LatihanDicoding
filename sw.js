const CACHE_NAME = 'film-cache-v1';
const urlsToCache = [
  '/',
  '/LatihanDicoding/index.html',
  '/LatihanDicoding/styles/styles.css',
  '/LatihanDicoding/scripts/index.js',
  '/LatihanDicoding/icons/popcorn.png',
  '/LatihanDicoding/icons/cinema.png',
  '/LatihanDicoding/sw.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; 
        }
        return fetch(event.request); 
      })
  );
});


self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/popcorn.png',
    badge: '/icons/cinema.png',
  };

  event.waitUntil(
    self.registration.showNotification('New Story Available!', options)
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
