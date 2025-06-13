import { getStories } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Daftar Story</h1>
        <div id="stories" class="movie-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#stories');

    try {
      const stories = await getStories();

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Tidak ada story yang tersedia.</p>';
        return;
      }

      stories.forEach((story) => {
        const item = document.createElement('div');
        item.classList.add('movie-card');
        item.innerHTML = `
          <img class="movie-img" src="${story.photoUrl}" alt="${story.name}" />
          <h2 class="movie-title">${story.name}</h2>
          <p>${story.description}</p>
        `;
        container.appendChild(item);
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
