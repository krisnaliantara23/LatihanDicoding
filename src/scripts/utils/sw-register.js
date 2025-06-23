if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/LatihanDicoding/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker terdaftar di scope:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Gagal mendaftarkan Service Worker:', error);
      });
  });
}
