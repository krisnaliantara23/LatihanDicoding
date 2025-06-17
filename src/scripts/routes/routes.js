import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/login/login-page'; // Import halaman Login
import RegisterPage from '../pages/register/register-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(), // Tambahkan rute untuk halaman Register
};

export default routes;
