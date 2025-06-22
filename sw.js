sw.js
const CACHE_NAME = 'film-cache-v1';
const BASE_PATH = '/LatihanDicoding';

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/styles/styles.css`,
  `${BASE_PATH}/scripts/index.js`,
  `${BASE_PATH}/icons/popcorn.png`,
  `${BASE_PATH}/icons/cinema.png`,
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate
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

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) =>
      cachedResponse || fetch(event.request)
    )
  );
});

// Push
self.addEventListener('push', (event) => {
  let data = { title: 'Notifikasi', options: { body: 'Ada update baru!' } };
  try {
    if (event.data) data = event.data.json();
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      ...data.options,
      icon: `${BASE_PATH}/icons/popcorn.png`,
      badge: `${BASE_PATH}/icons/cinema.png`,
    })
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(`${BASE_PATH}/`));
});