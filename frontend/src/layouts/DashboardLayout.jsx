import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar overlay backdrop for small screens */}
      {sidebarOpen && (
        <div 
          className="modal-backdrop fade show d-lg-none" 
          onClick={toggleSidebar}
          style={{ zIndex: 90 }}
        />
      )}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-column w-100 min-vh-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="main-content flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
