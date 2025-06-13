const API_KEY = 'd9439aa546664d778bab2395ca525287';
const BASE_URL = 'https://api.themoviedb.org/3';

async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const responseJson = await response.json();
  return responseJson.results;
}

export const getStories = async () => {
  const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1');
  const data = await response.json();
  return data.listStory;
};

export { getPopularMovies };
