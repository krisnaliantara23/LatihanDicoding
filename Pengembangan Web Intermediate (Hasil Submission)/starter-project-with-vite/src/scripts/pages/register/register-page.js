export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (!result.error) {
          alert('Registrasi berhasil! Silakan login.');
          window.location.hash = '/login';
        } else {
          alert(`Gagal daftar: ${result.message}`);
        }
      } catch (err) {
        console.error('Gagal daftar:', err);
        alert('Terjadi kesalahan saat mendaftar.');
      }
    });
  }
}
