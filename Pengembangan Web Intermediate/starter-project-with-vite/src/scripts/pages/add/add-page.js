import { postStory } from '../../data/api';
import { createAddFormTemplate } from '../../utils/index';

const AddPage = {
  async render() {
    return `
      <section class="add-section container">
        <h2>Tambah Story</h2>
        <div id="form-container">${createAddFormTemplate()}</div>
        <div id="message-box"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#add-form');
    const messageBox = document.querySelector('#message-box');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Ambil input
      const description = form.description.value.trim();
      const photo = form.photo.files[0];
      const lat = form.latitude.value.trim();
      const lon = form.longitude.value.trim();

      // Validasi input
      if (!description || !photo || !lat || !lon) {
        showMessage('Semua field harus diisi!', 'error');
        return;
      }

      // Buat FormData
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      formData.append('lat', lat);
      formData.append('lon', lon);

      // Kirim ke API
      const result = await postStory(formData);
      if (result.success) {
        showMessage('Story berhasil dikirim!', 'success');
        form.reset();
      } else {
        showMessage(`Gagal kirim: ${result.message}`, 'error');
      }
    });

    function showMessage(msg, type) {
      messageBox.innerHTML = `<p class="${type}">${msg}</p>`;
      messageBox.scrollIntoView({ behavior: 'smooth' });
    }
  },
};

export default AddPage;
