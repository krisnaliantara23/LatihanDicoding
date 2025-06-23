import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import SavedStoriesPage from '../pages/saved/saved-stories';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/saved-stories': new SavedStoriesPage(),
};

export default routes;
