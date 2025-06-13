import { getPopularMovies } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Popular Movies</h1>
        <div id="movies" class="movie-list"></div>

        <h2 style="margin-top: 2rem;">Peta Lokasi Bioskop</h2>
        <div id="map" style="height: 400px; margin-bottom: 2rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    const movies = await getPopularMovies();
    const movieListElement = document.querySelector('#movies');

    movies.forEach((movie) => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.style.marginBottom = '1.5rem';
      movieItem.innerHTML = `
        <img 
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
          alt="${movie.title}" 
          style="max-width: 200px; display: block;" 
        />
        <h2>${movie.title}</h2>
        <p>Rating: ${movie.vote_average}</p>
        <p>Rilis: ${movie.release_date}</p>
      `;
      movieListElement.appendChild(movieItem);
    });

    // Inisialisasi peta Leaflet
    const map = L.map('map').setView([-6.2, 106.816666], 11); // Jakarta

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marker lokasi bioskop (dummy)
    const marker = L.marker([-6.2, 106.816666]).addTo(map);
    marker.bindPopup('<b>Bioskop Jakarta</b><br>Jalan Sudirman').openPopup();
  }
}
