import React from 'react';

export default function MobileHeader({ setActiveTab, onOpenMenu, onOpenProfile, lang }) {
  return (
    <header className="mobile-header">
      {/* Brand Logo strictly matching media_1790115673166.png */}
      <div className="mobile-header-left" onClick={() => setActiveTab('home')} role="button" tabIndex={0} aria-label="Go to Home">
        <img 
          src="/photo/logo/logo nav bar and footer.png" 
          alt="American Dream Logo" 
          className="mobile-header-logo"
        />
      </div>

      {/* Centered Colorful PLAY ZONE Title */}
      <div className="mobile-header-title" onClick={() => setActiveTab('home')} role="button" tabIndex={0} aria-label="Play Zone">
        <span style={{ color: '#00a9c3' }}>P</span>
        <span style={{ color: '#ffffff' }}>L</span>
        <span style={{ color: '#f7a81b' }}>A</span>
        <span style={{ color: '#ffffff' }}>Y</span>
        <span className="header-title-space">&nbsp;</span>
        <span style={{ color: '#00a9c3' }}>Z</span>
        <span style={{ color: '#ffffff' }}>O</span>
        <span style={{ color: '#f7a81b' }}>N</span>
        <span style={{ color: '#ffffff' }}>E</span>
      </div>

      {/* Action Icons: Cyan Profile & Cyan Hamburger Menu */}
      <div className="mobile-header-right">
        <button 
          className="mobile-icon-btn" 
          onClick={onOpenProfile}
          aria-label="User Profile"
        >
          <svg 
            className="header-nav-svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#00a9c3" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3.2" />
            <path d="M7 20.662V19a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5v1.662" />
          </svg>
        </button>

        <button 
          className="mobile-icon-btn" 
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu"
        >
          <svg 
            className="header-nav-svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#00a9c3" 
            strokeWidth="2.8" 
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
