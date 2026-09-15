import React, { useState } from 'react';
import { Home, ArrowRight, Video } from 'lucide-react';
import './KidsAreaPage.css';

export default function KidsAreaPage({ setActiveTab, openModal, lang }) {
  const [activeCategory, setActiveCategory] = useState('KIDS AREA');

  const categories = [
    { name: 'Home', icon: 'home', isSpecial: false },
    { name: 'KIDS AREA', icon: '/photo/kid-area-pic/icon/icon-kids.png', isSpecial: true },
    { name: 'FUN PARK', icon: '/photo/kid-area-pic/icon/icon-fun.png', isSpecial: false },
    { name: 'CHALLENGE ZONE', icon: '/photo/kid-area-pic/icon/icon-challenge.png', isSpecial: false },
    { name: 'ADVENTURE ZONE', icon: '/photo/kid-area-pic/icon/icon-adventure.png', isSpecial: false },
    { name: 'PACKAGES', icon: '/photo/kid-area-pic/icon/icon-package.png', isSpecial: false },
    { name: 'V-REG', icon: 'video', isSpecial: false },
  ];

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.name);
    if (cat.name === 'Home') {
      setActiveTab('lobby');
    } else if (cat.name === 'FUN PARK') {
      setActiveTab('play');
    }
  };

  const handleBookPackage = (packageName, price) => {
    if (openModal) {
      openModal('tickets', { package: packageName, price });
    }
  };

  return (
    <div className="kids-area-page">

      {/* ─────────────────────────────────────────────
          1. MAIN NAVIGATION BAR (Dark Teal #013D47)
      ───────────────────────────────────────────── */}
      <header className="ka-header">
        <div className="ka-header-inner">
          {/* Left: Logo */}
          <div className="ka-brand" onClick={() => setActiveTab('lobby')} title="Back to Lobby">
            <img src="/photo/kid-area-pic/logo.png" alt="American Dream" className="ka-brand-logo" />
          </div>

          {/* Center: Navigation Links */}
          <nav className="ka-nav-links">
            <button className="ka-nav-link" onClick={() => setActiveTab('lobby')}>Home</button>
            <button className="ka-nav-link active">Play Zones</button>
            <button className="ka-nav-link" onClick={() => setActiveTab('menu')}>Restruant & Cafe</button>
            <button className="ka-nav-link" onClick={() => setActiveTab('events')}>Event & Halls</button>
            <button className="ka-nav-link">Trips</button>
          </nav>

          {/* Right: Book Us / About Us Button */}
          <div className="ka-nav-actions">
            <button className="ka-btn-book-us" onClick={() => openModal && openModal('tickets')}>
              About us
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          2. SECONDARY CATEGORY SUB-NAV (White row)
      ───────────────────────────────────────────── */}
      <div className="ka-subnav">
        <div className="ka-subnav-inner">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                className={`ka-subnav-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.icon === 'home' && <Home size={14} className="ka-subnav-icon" />}
                {cat.icon === 'video' && <Video size={14} className="ka-subnav-icon" />}
                {cat.icon.startsWith('/') && (
                  <img
                    src={cat.icon}
                    alt=""
                    className={`ka-subnav-img-icon ${isActive ? 'invert-white' : ''}`}
                  />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          3. MAIN HERO & GALLERY (Light Background)
      ───────────────────────────────────────────── */}
      <div className="ka-light-container">
        <div className="ka-content-wrapper">

          {/* Hero Banner with Shadow */}
          <div className="ka-hero-banner-wrapper">
            <img
              src="/photo/kid-area-pic/hero-banner.png"
              alt="Kids Area - A world of fun, laughter, and endless smiles"
              className="ka-hero-banner-img"
            />
          </div>

          {/* 4. Four Gallery Image Cards */}
          <div className="ka-gallery-grid">
            <div className="ka-gallery-card">
              <img src="/photo/kid-area-pic/gallery-1.png" alt="Toy puzzle birds" className="ka-gallery-img" />
            </div>
            <div className="ka-gallery-card">
              <img src="/photo/kid-area-pic/gallery-2.png" alt="Wooden alphabet train" className="ka-gallery-img" />
            </div>
            <div className="ka-gallery-card">
              <img src="/photo/kid-area-pic/gallery-3.png" alt="Sensory activity board" className="ka-gallery-img" />
            </div>
            <div className="ka-gallery-card">
              <img src="/photo/kid-area-pic/gallery-4.png" alt="American Dream Kids Character" className="ka-gallery-img" />
            </div>
          </div>

          {/* 5. 360° Virtual Dome Banner */}
          <div className="ka-dome-banner-wrapper" onClick={() => openModal && openModal('tickets')}>
            <img
              src="/photo/kid-area-pic/dome-360.png"
              alt="Explore 360° Dome"
              className="ka-dome-banner-img"
            />
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────
          6 & 7. OFFERS SECTIONS (Dark Teal #013D47)
      ───────────────────────────────────────────── */}
      <section className="ka-offers-section">
        <div className="ka-offers-wrapper">

          {/* ── 6. OFFERS SECTION (Week-end) ── */}
          <div className="ka-offers-group">
            <div className="ka-offers-header">
              <div className="ka-offers-title-col">
                <span className="ka-offers-eyebrow">PERSONALISED PACKAGES FOR YOU</span>
                <h2 className="ka-offers-title">Select Your Offers</h2>
              </div>
              <div className="ka-offers-term-col">
                <h3 className="ka-offers-term">(Week-end)</h3>
              </div>
              <div className="ka-offers-subtitle-col">
                <p className="ka-offers-subtext">More games. More fun. More memories.</p>
              </div>
            </div>

            {/* Weekend Cards Grid (2 cards) */}
            <div className="ka-pricing-grid">

              {/* Card 1: 1 Child */}
              <div className="ka-pricing-card">
                <div className="ka-card-thumb-wrap">
                  <img src="/photo/kid-area-pic/offer-thumb.png" alt="Kids Area Package" className="ka-card-thumb" />
                  <span className="ka-card-age-badge">1-12 y</span>
                </div>
                <div className="ka-card-body">
                  <span className="ka-badge ka-badge--popular">POPULAR</span>
                  <h4 className="ka-card-title">Kids Area Package</h4>
                  <p className="ka-card-subtitle">1 Child / 1 Hr</p>

                  <ul className="ka-checklist">
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>All-Day Kids Area Admission</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>1 Plaster Shape Coloring Activity</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>1 Drawing & Coloring Sheet</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>Party Included</span>
                    </li>
                  </ul>

                  <div className="ka-price-box">
                    <span className="ka-price-label">STANDARD RATE</span>
                    <div className="ka-price-row">
                      <span className="ka-price-val">EGP 150</span>
                      <span className="ka-price-per">/ 1 person</span>
                    </div>
                  </div>

                  <button
                    className="ka-btn-book"
                    onClick={() => handleBookPackage('Kids Area Package (Weekend - 1 Child)', 150)}
                  >
                    <span>BOOK THIS PACKAGE</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Card 2: 2 Children */}
              <div className="ka-pricing-card">
                <div className="ka-card-thumb-wrap">
                  <img src="/photo/kid-area-pic/offer-thumb.png" alt="Kids Area Package" className="ka-card-thumb" />
                  <span className="ka-card-age-badge">1-12 y</span>
                </div>
                <div className="ka-card-body">
                  <span className="ka-badge ka-badge--family">FAMILY PACK</span>
                  <h4 className="ka-card-title">Kids Area Package</h4>
                  <p className="ka-card-subtitle">Brothers / 2 Children</p>

                  <ul className="ka-checklist">
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>All-Day Kids Area Admission for 2 Children</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>2 Plaster Shape Coloring Activities</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>2 Drawing & Coloring Sheets</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>Party Included</span>
                    </li>
                  </ul>

                  <div className="ka-price-box">
                    <span className="ka-price-label">STANDARD RATE</span>
                    <div className="ka-price-row">
                      <span className="ka-price-val">EGP 250</span>
                      <span className="ka-price-per">/ 2 person</span>
                    </div>
                  </div>

                  <button
                    className="ka-btn-book"
                    onClick={() => handleBookPackage('Kids Area Package (Weekend - 2 Children)', 250)}
                  >
                    <span>BOOK THIS PACKAGE</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── 7. OFFERS SECTION (Mid-week) ── */}
          <div className="ka-offers-group" style={{ marginTop: '3.5rem' }}>
            <div className="ka-offers-header">
              <div className="ka-offers-title-col">
                <span className="ka-offers-eyebrow">PERSONALISED PACKAGES FOR YOU</span>
                <h2 className="ka-offers-title">Select Your Offers</h2>
              </div>
              <div className="ka-offers-term-col">
                <h3 className="ka-offers-term">(Mid-week)</h3>
              </div>
              <div className="ka-offers-subtitle-col">
                <p className="ka-offers-subtext">More games. More fun. More memories.</p>
              </div>
            </div>

            {/* Midweek Cards Grid (2 cards) */}
            <div className="ka-pricing-grid">

              {/* Card 1: 1 Child */}
              <div className="ka-pricing-card">
                <div className="ka-card-thumb-wrap">
                  <img src="/photo/kid-area-pic/offer-thumb.png" alt="Kids Area Package" className="ka-card-thumb" />
                  <span className="ka-card-age-badge">1-12 y</span>
                </div>
                <div className="ka-card-body">
                  <span className="ka-badge ka-badge--popular">PROMOTIONAL</span>
                  <h4 className="ka-card-title">Kids Area Package</h4>
                  <p className="ka-card-subtitle">1 Child / 1 Hr</p>

                  <ul className="ka-checklist">
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>All-Day Kids Area Admission</span>
                    </li>
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>1 Plaster Shape Coloring Activity</span>
                    </li>
                  </ul>

                  <div className="ka-price-box">
                    <span className="ka-price-label">STANDARD RATE</span>
                    <div className="ka-price-row">
                      <span className="ka-price-val">EGP 100</span>
                      <span className="ka-price-per">/ 1 person</span>
                    </div>
                  </div>

                  <button
                    className="ka-btn-book"
                    onClick={() => handleBookPackage('Kids Area Package (Mid-week - 1 Child)', 100)}
                  >
                    <span>BOOK THIS PACKAGE</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Card 2: 2 Children */}
              <div className="ka-pricing-card">
                <div className="ka-card-thumb-wrap">
                  <img src="/photo/kid-area-pic/offer-thumb.png" alt="Kids Area Package" className="ka-card-thumb" />
                  <span className="ka-card-age-badge">1-12 y</span>
                </div>
                <div className="ka-card-body">
                  <span className="ka-badge ka-badge--family">FAMILY PACK</span>
                  <h4 className="ka-card-title">Kids Area Package</h4>
                  <p className="ka-card-subtitle">Brothers / 2 Children</p>

                  <ul className="ka-checklist">
                    <li>
                      <img src="/photo/kid-area-pic/check-icon.png" alt="✓" className="ka-check-icon" />
                      <span>All-Day Kids Area Admission for 2 Children</span>
                    </li>
                  </ul>

                  <div className="ka-price-box">
                    <span className="ka-price-label">STANDARD RATE</span>
                    <div className="ka-price-row">
                      <span className="ka-price-val">EGP 150</span>
                      <span className="ka-price-per">/ 2 person</span>
                    </div>
                  </div>

                  <button
                    className="ka-btn-book"
                    onClick={() => handleBookPackage('Kids Area Package (Mid-week - 2 Children)', 150)}
                  >
                    <span>BOOK THIS PACKAGE</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          8. FOOTER (Dark Teal #013D47)
      ───────────────────────────────────────────── */}
      <footer className="ka-footer">
        <div className="ka-footer-inner">
          <div className="ka-footer-brand" onClick={() => setActiveTab('lobby')}>
            <img src="/photo/kid-area-pic/logo.png" alt="American Dream" className="ka-footer-logo" />
          </div>

          <div className="ka-footer-links">
            <button className="ka-footer-link">About Us</button>
            <button className="ka-footer-link">Contact</button>
            <button className="ka-footer-link">Safety Rules</button>
            <button className="ka-footer-link">Privacy Policy</button>
          </div>

          <div className="ka-footer-copy">
            © 2026 American Dream Ismailia. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
