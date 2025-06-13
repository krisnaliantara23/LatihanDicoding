// src/scripts/utils/index.js

const API_KEY = 'd9439aa546664d778bab2395ca525287';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Gagal memuat data dari API:', error);
    return [];
  }
};

export { fetchPopularMovies };
