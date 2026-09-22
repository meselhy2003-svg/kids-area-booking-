import React, { useState } from 'react';

export default function MobilePackagePage({ setActiveTab, openModal, lang }) {
  const [activeCategory, setActiveCategory] = useState('adventure'); // 'adventure' | 'challenge' | 'midweek' | 'weekend'

  const packageData = {
    adventure: {
      id: 'adv-pass',
      title: 'Adventure Pass',
      subtitle: 'All Game Experiance',
      saveBadge: 'Save 60 EGP',
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 160',
      img: '/photo/kid-area-pic/family-bumper-cars.png',
      features: ['BUMPER CARS', 'PUBG', 'Bubble Ball'],
      details: 'Full access to Bumper Cars, PUBG action simulator, and Bubble Ball arena.'
    },
    challenge: {
      id: 'chal-pass',
      title: 'Challenge Pass',
      subtitle: 'Pick any 4 games',
      saveBadge: 'Save 60 EGP',
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 160',
      img: '/photo/mobile-challenge/offer-collage.png',
      features: ['VR Arena', 'Basketball Shootout', 'Laser Shooting', 'Car Racing'],
      details: 'Choose any 4 exciting challenges: VR, Basketball, Shooting, and Racing.'
    },
    midweek: {
      id: 'mid-pass',
      title: 'Single Midweek Pass',
      subtitle: 'All Day Play & Crafts',
      saveBadge: 'Save 85 EGP',
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      img: '/photo/kid-area-pic/graphic-composition.png',
      features: ['All-day entry + 1 Package', 'جبس وألوان', '2 Arcade Tokens Included'],
      details: 'Full day access to Kids Area & Fun Park with art workshop included.'
    },
    weekend: {
      id: 'wknd-pass',
      title: 'Single Weekend Pass',
      subtitle: 'Weekend Ultimate Joy',
      saveBadge: 'Save 85 EGP',
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      img: '/photo/kid-area-pic/graphic-composition.png',
      features: ['All-day entry + 2 Games', '1 VR + 1 Basketball', 'Free Coloring & Party Access'],
      details: 'Weekend pass with 2 premium game tokens and stage party admission.'
    }
  };

  const currentPkg = packageData[activeCategory] || packageData.adventure;

  return (
    <div className="mobile-zone-page package-page-container">
      {/* Light Top Hero Section strictly matching media_1790098638255.png */}
      <section className="package-make-day-hero">
        <h1 className="make-day-title">
          MAKE A DAY<br />OF IT
        </h1>
        <p className="make-day-orange-sub">
          More games. More fun. More memories.
        </p>
        <p className="make-day-desc">
          Choose your gateway into Egypt's premier indoor entertainment wonderland. One contactless wristband unlocks cutting-edge VR arcades, giant Scandinavian soft play, and high-octane racing.
        </p>
      </section>

      {/* Dark Teal Experience Section strictly matching media_1790098638255.png */}
      <section className="dream-experience-section">
        {/* Top Tag */}
        <div className="dream-top-tag">
          <img 
            src="/photo/kid-area-pic/icon/Vector (3).png" 
            alt="tag" 
            className="dream-tag-icon" 
          />
          <span>PURE JOY, TAILORED FOR YOU</span>
        </div>

        {/* Section Heading */}
        <h2 className="dream-heading">Select Your Dream Experience</h2>
        <p className="dream-subheading">More games. More fun. More to enjoy</p>

        {/* 4 Horizontal Pill Buttons */}
        <div className="dream-filter-pills">
          <button 
            className={`dream-pill-btn ${activeCategory === 'adventure' ? 'active' : ''}`}
            onClick={() => setActiveCategory('adventure')}
          >
            Adventure
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'challenge' ? 'active' : ''}`}
            onClick={() => setActiveCategory('challenge')}
          >
            Challenge
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'midweek' ? 'active' : ''}`}
            onClick={() => setActiveCategory('midweek')}
          >
            Mid-Week
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'weekend' ? 'active' : ''}`}
            onClick={() => setActiveCategory('weekend')}
          >
            Weekend
          </button>
        </div>

        {/* The Feature Pass Card matching screenshot */}
        <div className="challenge-pass-card dream-pass-card">
          {/* Left Preview Box */}
          <div 
            className="pass-card-left dream-card-media"
            onClick={() => openModal('booking', {
              name: currentPkg.title,
              price: currentPkg.price,
              priceNum: currentPkg.priceNum,
              discount: currentPkg.saveBadge,
              details: currentPkg.details
            })}
            role="button"
            tabIndex={0}
            title={`Click to book ${currentPkg.title}`}
          >
            <img 
              src={currentPkg.img} 
              alt={currentPkg.title} 
              className="pass-collage-img" 
            />
          </div>

          {/* Right Card Content */}
          <div className="pass-card-right">
            <div className="pass-save-badge">{currentPkg.saveBadge}</div>
            <h4 className="pass-main-title">{currentPkg.title}</h4>
            <p className="pass-sub-cyan">{currentPkg.subtitle}</p>

            {/* Cyan Checklist strictly matching screenshot */}
            <div className="adventure-checklist">
              {currentPkg.features.map((feat, idx) => (
                <div key={idx} className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">{feat}</span>
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="pass-price-row">
              <span className="pass-price-current">{currentPkg.price}</span>
              <span className="pass-price-orig">{currentPkg.origPrice}</span>
            </div>

            {/* Get This Offer Button */}
            <button 
              className="get-this-offer-btn"
              onClick={() => openModal('booking', {
                name: currentPkg.title,
                price: currentPkg.price,
                priceNum: currentPkg.priceNum,
                discount: currentPkg.saveBadge,
                details: currentPkg.details
              })}
            >
              <img 
                src="/photo/kid-area-pic/icon/Vector (3).png" 
                alt="ticket" 
                className="btn-ticket-vector-icon" 
              />
              <span>Get This Offer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
