const CACHE_NAME = 'film-cache-v2';
const BASE_PATH = '/LatihanDicoding';  // Sesuaikan dengan base path aplikasi Anda

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

// Install Service Worker dan simpan resource ke cache
self.addEventListener('install', (event) => {
  self.skipWaiting();  // Langsung aktifkan SW setelah diinstall
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
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
