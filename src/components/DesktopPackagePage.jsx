import React, { useState } from 'react';

export default function DesktopPackagePage({ setActiveTab, openModal, lang }) {
  const [selectedCategory, setSelectedCategory] = useState('adventure'); // 'adventure' | 'challenge' | 'mid-week' | 'weekend'

  const packageOffers = {
    adventure: {
      id: 'adventure-pass',
      title: 'Adventure Pass',
      subtitle: 'All Game Experiance',
      saveBadge: 'Save 60 EGP',
      type: 'checklist',
      perks: ['BUMPER CARS', 'PUBG', 'Bubble Ball'],
      price: 100,
      oldPrice: 160
    },
    challenge: {
      id: 'challenge-pass',
      title: 'Challenge Pass',
      subtitle: 'Pick any 4 games',
      saveBadge: 'Save 60 EGP',
      type: 'grid',
      perks: [
        { label: 'VR', icon: 'vr' },
        { label: 'Basketball', icon: 'ball' },
        { label: 'Shooting', icon: 'target' },
        { label: 'Car Racing', icon: 'wheel' }
      ],
      price: 100,
      oldPrice: 160
    },
    'mid-week': {
      id: 'midweek-pass',
      title: 'Mid-Week Super Saver',
      subtitle: 'All Day Fun Experience',
      saveBadge: 'Save 85 EGP',
      type: 'checklist',
      perks: ['All-Day Access to All Zones', '1 VR Simulation Session Included', 'Free Grip Socks at Reception'],
      price: 120,
      oldPrice: 205
    },
    weekend: {
      id: 'weekend-pass',
      title: 'Weekend Ultimate Pass',
      subtitle: 'Peak Energy & Mascot Shows',
      saveBadge: 'Save 120 EGP',
      type: 'checklist',
      perks: ['Entry for 2 Adults + 2 Kids', '4 Arcade Tokens + 2 VR Sessions', 'Free Mascot & Bubble Show Access'],
      price: 250,
      oldPrice: 370
    }
  };

  const currentPkg = packageOffers[selectedCategory] || packageOffers.adventure;

  const handleBooking = (pkg) => {
    openModal('booking', {
      name: `${pkg.title} (${selectedCategory.toUpperCase()})`,
      price: `${pkg.price} EGP`,
      priceNum: pkg.price,
      discount: pkg.saveBadge,
      details: pkg.subtitle
    });
  };

  return (
    <div className="desktop-page desktop-packages-page">
      
      {/* 1. TOP HERO SECTION (MATCHING MEDIA_1790198442148.PNG) */}
      <section className="desktop-pkg-hero-section">
        <div className="desktop-page-container">
          <div className="desktop-pkg-hero-grid">
            {/* Left Column: Typography */}
            <div className="desktop-pkg-hero-left">
              <h1 className="desktop-pkg-hero-title">
                MAKE A DAY<br />OF IT
              </h1>
              <h2 className="desktop-pkg-hero-subtitle">
                More games. More fun. More memories.
              </h2>
              <p className="desktop-pkg-hero-desc">
                Choose your gateway into Egypt's premier indoor entertainment wonderland. One contactless wristband unlocks cutting-edge VR arcades, giant Scandinavian soft play, and high-octane racing.
              </p>
            </div>

            {/* Right Column: 3-panel selfie card */}
            <div className="desktop-pkg-hero-right">
              <div className="desktop-pkg-hero-img-card">
                <img 
                  src="/photo/kid-area-pic/packages-hero-trio.png" 
                  alt="Make A Day Of It" 
                  className="desktop-pkg-hero-img"
                  onError={(e) => { e.target.src = '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DARK PETROL SECTION: SELECT YOUR DREAM EXPERIENCE */}
      <section className="desktop-pkg-experience-section">
        <div className="desktop-page-container">
          
          {/* Header Row */}
          <div className="desktop-pkg-header-row">
            <div className="desktop-pkg-header-left">
              <span className="desktop-pkg-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pkg-tag-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <rect x="7" y="7" width="3" height="3" fill="currentColor" />
                </svg>
                PURE JOY, TAILORED FOR YOU
              </span>
              <h2 className="desktop-pkg-main-heading">
                Select Your Dream Experience
              </h2>
            </div>

            <div className="desktop-pkg-header-right">
              <p className="desktop-pkg-subtext">
                Simple tiered entry packages designed for solo gaming champions, energetic toddlers, and whole families celebrating milestone days.
              </p>
            </div>
          </div>

          {/* Filter Tabs Row */}
          <div className="desktop-pkg-tabs-row">
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'adventure' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('adventure')}
            >
              Adventure
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'challenge' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('challenge')}
            >
              Challenge
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'mid-week' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('mid-week')}
            >
              Mid-Week
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'weekend' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('weekend')}
            >
              Weekend
            </button>
          </div>

          {/* The Selected Package Offer Card (Matching media_1790198442148.png) */}
          <div className="desktop-horizontal-pass-container">
            <div className="desktop-horizontal-pass-card">
              {/* Left 4-split composite photo */}
              <div className="pass-card-left-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Graphic Composition.png" 
                  alt={currentPkg.title} 
                  className="pass-card-composite-img"
                  onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                />
              </div>

              {/* Right Offer Details */}
              <div className="pass-card-right-body">
                <div className="pass-card-header-row">
                  <div>
                    <h3 className="pass-card-main-title">{currentPkg.title}</h3>
                    <span className="pass-card-subtitle-cyan">{currentPkg.subtitle}</span>
                  </div>
                  <span className="pass-card-save-badge">{currentPkg.saveBadge}</span>
                </div>

                {/* Checklist Type (Adventure, Mid-Week, Weekend) */}
                {currentPkg.type === 'checklist' && (
                  <div className="pass-card-checklist">
                    {currentPkg.perks.map((item, idx) => (
                      <div key={idx} className="pass-check-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="16 9 11 14 8 11" />
                        </svg>
                        <span className="pass-check-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid Type (Challenge) */}
                {currentPkg.type === 'grid' && (
                  <div className="pass-card-perks-grid">
                    {currentPkg.perks.map((p, idx) => (
                      <div key={idx} className="pass-card-perk-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                          {p.icon === 'vr' && <rect x="2" y="6" width="20" height="12" rx="3" />}
                          {p.icon === 'ball' && <circle cx="12" cy="12" r="10" />}
                          {p.icon === 'target' && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /></>}
                          {p.icon === 'wheel' && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></>}
                        </svg>
                        <span>{p.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & Action Button */}
                <div className="pass-card-price-action-row">
                  <div className="pass-price-group">
                    <strong className="pass-current-price">EGP {currentPkg.price}</strong>
                    <span className="pass-old-price">EGP {currentPkg.oldPrice}</span>
                  </div>

                  <button 
                    className="pass-get-offer-btn"
                    onClick={() => handleBooking(currentPkg)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-ticket-icon">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    </svg>
                    <span>Get This Offer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
