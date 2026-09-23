import React from 'react';

export default function DesktopSubNav({ activeTab, setActiveTab, searchQuery, setSearchQuery }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'kids-area',
      label: 'Kids Area',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )
    },
    {
      id: 'fun-park',
      label: 'Fun Park',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
        </svg>
      )
    },
    {
      id: 'challenge',
      label: 'CHALLENGE ZONE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <rect x="2" y="6" width="20" height="12" rx="3" />
          <path d="M6 12h4M8 10v4M16 11h.01M18 13h.01" />
        </svg>
      )
    },
    {
      id: 'adventure',
      label: 'ADVENTURE ZONE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      id: 'package',
      label: 'PACKAGES',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h10M7 9h10" />
        </svg>
      )
    },
    {
      id: 'vibes',
      label: 'VIBES',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="subnav-pill-icon">
          <path d="m12 3 1.912 5.886a2 2 0 0 0 1.272 1.272L21 12l-5.816 1.842a2 2 0 0 0-1.272 1.272L12 21l-1.912-5.886a2 2 0 0 0-1.272-1.272L3 12l5.816-1.842a2 2 0 0 0 1.272-1.272z" />
        </svg>
      )
    }
  ];

  return (
    <div className="desktop-subnav-section">
      <div className="desktop-subnav-container">
        {/* Pills row */}
        <div className="desktop-subnav-pills">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`desktop-subnav-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (tab.id === 'vibes') {
                    // Navigate to home and scroll to vibes or set activeTab
                    setActiveTab('home');
                    setTimeout(() => {
                      const el = document.getElementById('play-zone-vibes');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input bar (hidden on packages page matching Image 2) */}
        {activeTab !== 'package' && (
          <div className="desktop-search-bar-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="desktop-search-input"
              placeholder="Search for rides, offers, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="desktop-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}
            className="desktop-search-input"
            placeholder="Search for rides, offers, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="desktop-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
