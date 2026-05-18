import {
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import PokemonDetails from '../pages/PokemonDetails/PokemonDetails';

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      >
        <Route
          path="pokemon/:id"
          element={<PokemonDetails />}
        />
      </Route>

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default AppRouter;

