const pushSubscribe = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BLQw8r4FdEICr0Yw_QkqKTK_SGw7UZmTfpLCJoPTM_ygqPdzesGaDySO2aYY9gWNMuAec4_VEiksLw8lsY3oHw0') // ← Ganti ini
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('Push Subscription:', JSON.stringify(subscription));
    // Kirim subscription ke server kamu di sini jika perlu
  } catch (err) {
    console.error('Failed to subscribe:', err);
  }
};

const askNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    pushSubscribe();
  } else {
    console.log('Izin notifikasi tidak diberikan');
  }
};

// Helper untuk konversi public key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export { askNotificationPermission };
