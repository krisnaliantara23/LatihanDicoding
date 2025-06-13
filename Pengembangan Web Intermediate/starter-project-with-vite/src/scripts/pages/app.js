// scripts/pages/app.js
import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.getActiveRoute(); // gunakan metode yang tersedia
    const page = routes[url];

    if (!page) {
      this._content.innerHTML = '<p>Halaman tidak ditemukan</p>';
      return;
    }

    this._content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
