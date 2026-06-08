import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function Navbar() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (shouldThrow) {
    throw new Error('Test Error Boundary');
  }

  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        About
      </NavLink>

      <NavLink
        to="/forms"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Forms
      </NavLink>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>

      <button
        className="error-btn"
        onClick={() => setShouldThrow(true)}
      >
        Test Error Boundary
      </button>
    </nav>
  );
}

export default Navbar;
