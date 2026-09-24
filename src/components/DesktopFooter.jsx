import React from 'react';

export default function DesktopFooter({ openModal }) {
  return (
    <footer className="desktop-footer">
      <div className="desktop-footer-container">
        {/* Left: Brand Logo */}
        <a 
          href="#home"
          className="desktop-footer-brand" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab && setActiveTab('home');
          }}
          title="American Dream Ismailia"
          aria-label="American Dream Home"
        >
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt="American Dream Logo" 
            className="desktop-footer-logo-img" 
          />
        </a>

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
