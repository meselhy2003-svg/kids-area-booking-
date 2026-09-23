import React from 'react';

export default function DesktopFooter({ openModal }) {
  return (
    <footer className="desktop-footer">
      <div className="desktop-footer-container">
        {/* Left: Brand Logo */}
        <div className="desktop-footer-brand">
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt="American Dream Logo" 
            className="desktop-footer-logo-img" 
          />
        </div>

        {/* Center: Legal & Info Links */}
        <div className="desktop-footer-links">
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('about-info')}
          >
            About Us
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('menu-drawer')}
          >
            Contact
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('safety-guidelines')}
          >
            Safety Rules
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('about-info')}
          >
            Privacy Policy
          </button>
        </div>

        {/* Right: Copyright Text */}
        <div className="desktop-footer-copy">
          &copy; 2026 American Dream Ismailia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
