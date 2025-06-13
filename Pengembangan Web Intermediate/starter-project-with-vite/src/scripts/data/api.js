const API_BASE_URL = 'https://story-api.dicoding.dev/v1';
const AUTH_TOKEN = 'Bearer dummytoken1234abcd5678efgh'; // Ganti dengan token login asli jika ada

export const getAllStories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.listStory;
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    return [];
  }
};

export const postStory = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    return { success: true, message: 'Story ditambahkan' };
  } catch (error) {
    console.error('Gagal mengirim story:', error);
    return { success: false, message: error.message };
  }
};
