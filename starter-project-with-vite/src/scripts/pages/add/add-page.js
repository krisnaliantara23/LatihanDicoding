export default class AddPage {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Data Baru</h1>
        <form id="add-form">
          <label for="title">Judul:</label>
          <input type="text" id="title" name="title" required />

          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label for="image">Gambar (kamera):</label>
          <video id="video" width="300" autoplay></video>
          <button type="button" id="capture">Ambil Gambar</button>
          <canvas id="canvas" width="300" height="200" style="display:none;"></canvas>

          <label for="coordinates">Koordinat:</label>
          <input type="text" id="coordinates" name="coordinates" readonly />
          <div id="map" style="height: 300px; margin-top: 10px;"></div>

          <button type="submit">Simpan</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Kamera
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture');
    const context = canvas.getContext('2d');

    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      captureBtn.addEventListener('click', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
        stream.getTracks().forEach(track => track.stop());
      });
    }

    // Leaflet Map
    const coordInput = document.getElementById('coordinates');
    const map = L.map('map').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      coordInput.value = `${lat}, ${lng}`;
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map).bindPopup('Lokasi dipilih').openPopup();
    });

    // Submit Dummy
    document.getElementById('add-form').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Data disimpan (dummy)');
    });
  }
}
