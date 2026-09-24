import React from 'react';

export default function DesktopHeader({ 
  activeTab, 
  setActiveTab, 
  openModal, 
  lang, 
  setLang,
  isDesktopView,
  setIsDesktopView
}) {
  const isPlayZonesActive = ['kids-area', 'fun-park', 'challenge', 'adventure', 'package', 'vibes'].includes(activeTab);

  return (
    <header className="desktop-navbar">
      <div className="desktop-nav-container">
        {/* Brand Logo */}
        <div 
          className="desktop-nav-brand" 
          onClick={() => setActiveTab('home')}
          title="American Dream Ismailia"
        >
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt="American Dream Logo" 
            className="desktop-nav-logo-img" 
          />
        </div>

        {/* Center Main Nav Links */}
        <nav className="desktop-nav-menu">
          <button 
            className={`desktop-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`desktop-nav-link ${isPlayZonesActive ? 'active' : ''}`}
            onClick={() => setActiveTab('kids-area')}
          >
            Play Zones
          </button>
          <button 
            className="desktop-nav-link"
            onClick={() => openModal('restaurant-menu')}
          >
            Restruant &amp; Cafe
          </button>
          <button 
            className="desktop-nav-link"
            onClick={() => openModal('booking', {
              name: 'Birthday & Event Hall Celebration',
              price: '1,500 EGP',
              priceNum: 1500,
              discount: 'All-inclusive Hall Booking'
            })}
          >
            Event &amp; Halls
          </button>
          <button 
            className="desktop-nav-link"
            onClick={() => openModal('tour')}
          >
            Trips
          </button>
        </nav>

        {/* Right Nav Actions */}
        <div className="desktop-nav-right">
          {/* Profile Circle Icon */}
          <button 
            className="desktop-profile-btn"
            onClick={() => openModal('profile')}
            title="User Profile & Wristband"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-profile-svg">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* About us Button */}
          <button 
            className="desktop-about-btn"
            onClick={() => openModal('about-info')}
          >
            About us
          </button>
        </div>
      </div>
    </header>
  );
}
