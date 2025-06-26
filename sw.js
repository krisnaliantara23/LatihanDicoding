const BASE_URL = '/LatihanDicoding/'; // SESUAI VITE CONFIG

const assetsToCache = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}styles/styles.css`,
  `${BASE_URL}scripts/index.js`,
  `${BASE_URL}manifest.json`,
  `${BASE_URL}images/favicon.png`,
  `${BASE_URL}icons/icon-192.png`,
  `${BASE_URL}icons/icon-512.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});


// Aktivasi SW dan hapus cache lama yang tidak dipakai
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
  self.clients.claim();  // Ambil kendali untuk SW
});

// Fetch event untuk mengambil file dari cache atau jaringan
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;  // Ambil dari cache jika ada
      return fetch(event.request);  // Jika tidak ada di cache, ambil dari jaringan
    })
  );
});

// Push notification ketika ada notifikasi baru
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

// Ketika notifikasi diklik, buka halaman utama
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(BASE_PATH + '/'));
});
