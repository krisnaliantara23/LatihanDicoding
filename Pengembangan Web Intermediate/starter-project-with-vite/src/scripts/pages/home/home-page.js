import { getAllStories } from '../../data/api.js';

const HomePage = {
  async render() {
    return `
      <section class="container">
        <h2>Story Terbaru</h2>
        <div id="story-list" class="story-list">Loading...</div>
      </section>
    `;
  },

  async afterRender() {
    const storyListEl = document.getElementById('story-list');
    storyListEl.innerHTML = '<p>Memuat data...</p>';

    const stories = await getAllStories();

    if (stories.length === 0) {
      storyListEl.innerHTML = '<p>Tidak ada story tersedia.</p>';
      return;
    }

    storyListEl.innerHTML = stories
      .map((story) => {
        return `
          <div class="story-card">
            <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
            <div class="story-info">
              <h3>${story.name}</h3>
              <p>${story.description}</p>
            </div>
          </div>
        `;
      })
      .join('');
  },
};

export default HomePage;
