// CSS imports
import '../styles/styles.css';
import App from './pages/app';
import { askNotificationPermission } from './utils/notification-helper.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => app.renderPage());
    } else {
      await app.renderPage();
    }
  });

  // ✅ Inisialisasi Service Worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/scripts/sw.js');
      console.log('Service Worker registered!');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // ✅ Minta izin notifikasi dan subscribe push
  askNotificationPermission();
});
