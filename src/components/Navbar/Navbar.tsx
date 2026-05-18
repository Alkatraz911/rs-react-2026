import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    const [shouldThrow, setShouldThrow] =
        useState(false);

    if (shouldThrow) {
        throw new Error(
            'Test Error Boundary'
        );
    }

    return (

        <nav className="navbar">

            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? 'nav-link active'
                        : 'nav-link'
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/about"
                className={({ isActive }) =>
                    isActive
                        ? 'nav-link active'
                        : 'nav-link'
                }
            >
                About
            </NavLink>


            <button
                className="error-btn"
                onClick={() =>
                    setShouldThrow(true)
                }
            >
                Test Error Boundary
            </button>
        </nav>

    );
}

export default Navbar;