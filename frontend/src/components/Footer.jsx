import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light border-top text-center text-secondary small bg-transparent">
      <div className="container">
        <span>&copy; {new Date().getFullYear()} Project Management Portal. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
