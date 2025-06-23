import { getStories } from '../../data/api';  // Fungsi untuk mengambil cerita dari API
import { saveFilm, getAllFilms, deleteFilm } from '../../utils/db.js';  // Fungsi untuk berinteraksi dengan IndexedDB

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <div id="map" style="height: 300px; margin-bottom: 1.5rem;"></div>
        <div id="stories" class="story-list"></div>
        <a href="#/saved-stories">Lihat Saved Stories</a>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#stories');
    const mapElement = document.getElementById('map');
    container.innerHTML = '<p>Loading stories...</p>';
    

    try {
      // Mengambil data cerita dari API
      const stories = await getStories();

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Tidak ada story yang tersedia.</p>';
        return;
      }

      // Menampilkan peta menggunakan Leaflet
      const map = L.map(mapElement).setView([-2.5489, 118.0149], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      stories.forEach((story) => {
        const item = document.createElement('div');
        item.classList.add('story-card');
        item.innerHTML = `
          <img class="story-img" src="${story.photoUrl}" alt="${story.name}" />
          <h2 class="story-title">${story.name}</h2>
          <p>${story.description}</p>
          <p><strong>Lat:</strong> ${story.lat}, <strong>Lng:</strong> ${story.lon}</p>
          <button class="save-button" data-id="${story.id}">Save</button>
        `;
        container.appendChild(item);

        // Menambahkan marker di peta jika lat dan lon tersedia
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        }

        // Event listener untuk tombol Save
        item.querySelector('.save-button').addEventListener('click', async () => {
          await saveFilm({
            id: story.id,
            name: story.name,
            description: story.description,
            photoUrl: story.photoUrl,
            lat: story.lat,
            lon: story.lon
          });
        });
      });
    } catch (error) {
      console.warn('Gagal fetch dari API. Coba dari IndexedDB...');

      // Jika gagal mengambil cerita dari API, ambil dari IndexedDB
      const offlineStories = await getAllFilms();
      if (offlineStories.length > 0) {
        offlineStories.forEach((story) => {
          const item = document.createElement('div');
          item.classList.add('story-card');
          item.innerHTML = `
            <h2 class="story-title">${story.name}</h2>
            <p>${story.description}</p>
            <p><strong>Lat:</strong> ${story.lat}, <strong>Lng:</strong> ${story.lon}</p>
            <p><em>(Disimpan Offline)</em></p>
            <button class="delete-button" data-id="${story.id}">Delete</button>
          `;
          container.appendChild(item);

          // Event listener untuk tombol Delete
          item.querySelector('.delete-button').addEventListener('click', async () => {
            await deleteFilm(story.id);
            // Menghapus elemen dari halaman
            item.remove();
          });
        });
      } else {
        container.innerHTML = `
          <p style="color: red; margin-top: 1rem;">Gagal memuat data dari server maupun lokal.</p>
        `;
      }
    }
  }
}
