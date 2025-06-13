export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <p>Aplikasi ini menampilkan daftar film populer dari API The Movie DB.</p>
        <p>Penggunaan API ini bertujuan untuk memberikan informasi terkini tentang film-film yang sedang populer di kalangan penonton.</p>
        <p>Dengan menggunakan API ini, pengguna dapat melihat daftar film, poster, dan rating dari film-film tersebut.</p>
        <p>Untuk informasi lebih lanjut, kunjungi <a href="https://www.themoviedb.org/documentation/api" target="_blank">dokumentasi API The Movie DB</a>.</p>
        <p>Jika Anda memiliki pertanyaan atau masukan, silakan hubungi kami melalui email di <a href="mailto:krisnaliantara2333@gmail.com">
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
