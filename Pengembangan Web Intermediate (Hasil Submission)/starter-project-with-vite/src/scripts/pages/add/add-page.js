import L from 'leaflet';

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
            <label for="photo">Foto</label>
            <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required />
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

      const token = localStorage.getItem('token'); // Mendapatkan token login

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        const result = await response.json();

        if (!result.error) {
          alert('Story berhasil dikirim!');
          window.location.hash = '/';
        } else {
          alert(`Gagal: ${result.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat mengirim data.');
        console.error(error);
      }
    });
  }
}
