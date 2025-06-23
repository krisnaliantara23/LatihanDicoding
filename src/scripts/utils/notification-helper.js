const pushSubscribe = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk')
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('✅ Push Subscription berhasil:', JSON.stringify(subscription));

    // Kirim subscription ke server Dicoding
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Kamu harus login terlebih dahulu untuk mengaktifkan notifikasi.');
      return;
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error(`Gagal mengirim subscription ke API: ${response.status}`);
    }

    document.getElementById('subscribe-feedback').style.display = 'block';
    console.log('📬 Subscription berhasil dikirim ke API Dicoding');

  } catch (err) {
    console.error('❌ Gagal subscribe push notification:', err);
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

// Helper untuk konversi public key VAPID ke format yang benar
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
