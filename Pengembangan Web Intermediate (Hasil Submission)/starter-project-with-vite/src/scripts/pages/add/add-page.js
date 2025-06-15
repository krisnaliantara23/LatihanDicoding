import L from 'leaflet';
import { saveFilm } from '../../utils/db.js';

export default class AddPage {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Story Baru</h1>
        <form id="storyForm">
          <div>
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label for="camera">Kamera</label>
            <video id="camera" autoplay playsinline width="300"></video>
            <button type="button" id="captureBtn">Ambil Foto</button>
            <canvas id="canvas" width="300" height="300" style="display: none;"></canvas>
          </div>
          <div>
            <label for="photo">Upload Manual (Opsional)</label>
            <input type="file" id="photo" name="photo" accept="image/*" />
          </div>
          <div>
            <label>Lokasi (klik pada peta)</label>
            <div id="map" style="height: 300px;"></div>
          </div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />
          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const map = L.map('map').setView([-6.200000, 106.816666], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let marker;
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(map).bindPopup('Lokasi dipilih').openPopup();
    });

    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    let capturedFile;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      captureBtn.addEventListener('click', () => {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          capturedFile = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          document.getElementById('photo').files = createFileList(capturedFile);
        });
      });

      function createFileList(file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        return dataTransfer.files;
      }
    } catch (err) {
      console.warn('Kamera tidak dapat diakses:', err);
    }

    const form = document.getElementById('storyForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const description = form.description.value;
      const photo = form.photo.files[0];
      const lat = form.lat.value;
      const lon = form.lon.value;

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        });

        const result = await response.json();

        if (!result.error) {
          alert('Story berhasil dikirim!');
          window.location.hash = '/';
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error(error);
        await saveFilm({
          name,
          description,
          lat,
          lon,
          offline: true,
          timestamp: Date.now()
        });
        alert('Story gagal dikirim, tapi disimpan offline.');
      }
    });
  }
}
