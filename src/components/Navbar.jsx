import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsersCog } from 'react-icons/fa'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top custom-navbar">
      <div className="container p-2">
        {/* Brand with Logo */}
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/employees">
          <FaUsersCog size={30} />
          RoleManager
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  'nav-link px-3' + (isActive ? ' active fw-semibold' : '')
                }
              >
                Employees
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  'nav-link px-3' + (isActive ? ' active fw-semibold' : '')
                }
              >
                Roles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/create-role"
                className={({ isActive }) =>
                  'nav-link px-3' + (isActive ? ' active fw-semibold' : '')
                }
              >
                Create Role
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
