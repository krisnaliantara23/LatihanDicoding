import { getAllFilms, deleteFilm } from '../../utils/db.js';

export default class SavedStoriesPage {
  async render() {
    return `
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="saved-stories" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#saved-stories');
    const savedStories = await getAllFilms();

    if (savedStories.length > 0) {
      savedStories.forEach((story) => {
        const item = document.createElement('div');
        item.classList.add('story-card');
        item.innerHTML = `
          <h2 class="story-title">${story.name}</h2>
          <p>${story.description}</p>
          <button class="delete-button" data-id="${story.id}">Delete</button>
        `;
        container.appendChild(item);

        item.querySelector('.delete-button').addEventListener('click', async () => {
          await deleteFilm(story.id);
          item.remove();
        });
      });
    } else {
      container.innerHTML = `<p>Tidak ada cerita yang disimpan.</p>`;
    }
  }
}
