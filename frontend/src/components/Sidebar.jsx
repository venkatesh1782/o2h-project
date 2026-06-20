import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaTasks } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <aside className={`custom-sidebar d-flex flex-column p-3 ${isOpen ? 'show' : ''}`}>
      {/* Brand Profile section */}
      <div className="d-flex align-items-center gap-3 pb-3 mb-4 border-bottom">
        <div 
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '45px', height: '45px', fontSize: '1.25rem', fontWeight: 'bold' }}
        >
          {user ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <h6 className="mb-0 text-truncate fw-bold">{user ? user.name : 'Guest User'}</h6>
          <span className="text-secondary small text-truncate d-block">{user ? user.email : ''}</span>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink 
            to="/dashboard" 
            className="nav-link text-secondary d-flex align-items-center gap-3 py-2 px-3 fw-medium"
            onClick={() => toggleSidebar(false)}
          >
            <FaTasks className="fs-5" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/tasks/new" 
            className="nav-link text-secondary d-flex align-items-center gap-3 py-2 px-3 fw-medium"
            onClick={() => toggleSidebar(false)}
          >
            <FaPlus className="fs-5" />
            <span>Add New Task</span>
          </NavLink>
        </li>
      </ul>

      {/* Sidebar Footer Info */}
      <div className="mt-auto border-top pt-3 text-center">
        <span className="text-light small">Version 1.0.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
