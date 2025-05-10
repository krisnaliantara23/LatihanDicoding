import { getData } from "../../data/api";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="movies-list"></div> <!-- Tempat untuk menampilkan film -->
        <div id="map" style="height: 400px;"></div> <!-- Peta -->
      </section>
    `;
  }

  async afterRender() {
    // Ambil data dari API
    const data = await getData();
    const movies = data.results || []; // Asumsi data.results adalah array film

    // Tampilkan daftar film di halaman
    const moviesList = document.getElementById('movies-list');
    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
      `;
      moviesList.appendChild(movieItem);
    });

    // Inisialisasi Peta
    const map = L.map('map').setView([51.505, -0.09], 13); // Sesuaikan dengan koordinat yang relevan

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Menambahkan marker di peta, menggunakan koordinat lokasi film atau data lainnya
    // Contoh marker di tempat acak. Anda dapat mengganti koordinat ini dengan data yang relevan
    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A custom marker')
      .openPopup();
  }
}
