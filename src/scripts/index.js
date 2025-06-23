import '../styles/styles.css';
import App from './pages/app';
import { askNotificationPermission } from './utils/notification-helper.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inisialisasi App
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Render halaman pertama
  await app.renderPage();

  // Navigasi halaman dengan hashchange
  window.addEventListener('hashchange', async () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => app.renderPage());
    } else {
      await app.renderPage();
    }
  });

  // Toggle drawer navigation
  const drawer = document.getElementById('navigation-drawer');
  const button = document.getElementById('drawer-button');

  if (drawer && button) {
    button.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }

  // Subscribe Button Handler
  const subscribeButton = document.getElementById('subscribe-button');
  const subscribeFeedback = document.getElementById('subscribe-feedback');

  if (subscribeButton && subscribeFeedback) {
    subscribeButton.addEventListener('click', () => {
      subscribeButton.style.display = 'none';
      subscribeFeedback.style.display = 'block';
    });
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker berhasil terdaftar:', registration);
        })
        .catch((error) => {
          console.log('Service Worker gagal terdaftar:', error);
        });
    });
  }

  // Minta izin notifikasi
  if ('Notification' in window && navigator.serviceWorker) {
    askNotificationPermission();
  }
});