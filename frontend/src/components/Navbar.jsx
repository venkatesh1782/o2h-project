import React from 'react';
import { FaSun, FaMoon, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // Format today's date: e.g. "Saturday, June 20, 2026"
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top px-3 py-2">
      <div className="container-fluid px-0">
        <button
          className="btn btn-outline-secondary d-lg-none me-2"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <span className="navbar-brand fw-bold text-primary d-none d-sm-inline-block fs-4 mb-0">
          Project Management Portal
        </span>
        <span className="navbar-brand fw-bold text-primary d-inline-block d-sm-none fs-5 mb-0">
          PMP
        </span>

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Today's Date */}
          <span className="text-secondary d-none d-md-inline-block small fw-medium">
            {getFormattedDate()}
          </span>

          {/* Dark Mode Toggle */}
          <button
            className="btn btn-link text-secondary p-1"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ textDecoration: 'none' }}
          >
            {isDarkMode ? <FaSun className="fs-5 text-warning" /> : <FaMoon className="fs-5" />}
          </button>

          {/* User Name */}
          {user && (
            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <span className="fw-semibold text-primary d-none d-sm-inline-block">
                {user.name}
              </span>
              <button
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 py-1 px-2"
                onClick={logout}
                title="Log Out"
              >
                <FaSignOutAlt />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
