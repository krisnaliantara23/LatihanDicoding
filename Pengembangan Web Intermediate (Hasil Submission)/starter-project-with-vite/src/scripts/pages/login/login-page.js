export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="loginForm">
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button> <!-- Tombol Login -->
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!result.error) {
          localStorage.setItem('token', result.loginResult.token); // Simpan token di localStorage
          alert('Login berhasil!');
          window.location.hash = '/';
        } else {
          alert(`Login gagal: ${result.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat login.');
        console.error(error);
      }
    });
  }
}
