import AppRouter from './router/AppRouter';
import Navbar from './components/Navbar/Navbar';
import Flyout from './components/Flyout/Flyout';

function App() {
  return (
    <div className="app">
      <Navbar />
      <AppRouter />
      <Flyout />
    </div>
  );
}

export default App;

