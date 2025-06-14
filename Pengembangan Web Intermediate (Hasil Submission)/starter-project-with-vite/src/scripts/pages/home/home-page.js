import { getStories } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <div id="map" style="height: 300px; margin-bottom: 1.5rem;"></div>
        <div id="stories" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#stories');
    const mapElement = document.getElementById('map');

    try {
      const stories = await getStories();

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Tidak ada story yang tersedia.</p>';
        return;
      }

      // Inisialisasi Leaflet map
      const map = L.map(mapElement).setView([-2.5489, 118.0149], 4); // Koordinat Indonesia
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Render tiap story
      stories.forEach((story) => {
        const item = document.createElement('div');
        item.classList.add('story-card');
        item.innerHTML = `
          <img class="story-img" src="${story.photoUrl}" alt="${story.name}" />
          <h2 class="story-title">${story.name}</h2>
          <p>${story.description}</p>
          <p><strong>Lat:</strong> ${story.lat}, <strong>Lng:</strong> ${story.lon}</p>
        `;
        container.appendChild(item);

        // Tambahkan marker ke peta
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        }
      });

    } catch (error) {
      console.error('Gagal mengambil data story:', error);
      container.innerHTML = `
        <p style="color: red; margin-top: 1rem;">
          Gagal memuat data. Silakan login terlebih dahulu.
        </p>
        <p>
          <a href="#/login">Klik di sini untuk login</a>
        </p>
      `;
    }
  }
}
