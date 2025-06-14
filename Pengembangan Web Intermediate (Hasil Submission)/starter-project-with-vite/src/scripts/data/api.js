export const getStories = async () => {
  const token = localStorage.getItem('token'); // pastikan token sudah disimpan
  const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil stories. Status: ' + response.status);
  }

  const data = await response.json();
  return data.listStory;
};

