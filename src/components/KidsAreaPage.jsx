import React, { useState } from 'react';
import { 
  Home, 
  ArrowRight, 
  Video, 
  Search, 
  User, 
  Menu, 
  Ticket, 
  MapPin, 
  Image as ImageIcon, 
  MoreHorizontal, 
  ShieldCheck, 
  Gamepad2, 
  Crosshair, 
  Car,
  Smartphone,
  Monitor
} from 'lucide-react';
import './KidsAreaPage.css';

export default function KidsAreaPage({ setActiveTab, openModal, lang }) {
  // Desktop state
  const [activeCategory, setActiveCategory] = useState('KIDS AREA');

  // Mobile state (defaults to 'Challenge Zone' to match reference screenshot exactly)
  const [mobileCategory, setMobileCategory] = useState('Challenge Zone');
  const [mobileNavTab, setMobileNavTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState('auto'); // 'auto' | 'mobile' | 'desktop'

  const desktopCategories = [
    { name: 'Home', icon: 'home', isSpecial: false },
    { name: 'KIDS AREA', icon: '/photo/kid-area-pic/icon/icon-kids.png', isSpecial: true },
    { name: 'FUN PARK', icon: '/photo/kid-area-pic/icon/icon-fun.png', isSpecial: false },
    { name: 'CHALLENGE ZONE', icon: '/photo/kid-area-pic/icon/icon-challenge.png', isSpecial: false },
    { name: 'ADVENTURE ZONE', icon: '/photo/kid-area-pic/icon/icon-adventure.png', isSpecial: false },
    { name: 'PACKAGES', icon: '/photo/kid-area-pic/icon/icon-package.png', isSpecial: false },
    { name: 'V-REG', icon: 'video', isSpecial: false },
  ];

  const mobileCategories = [
    'All',
    'Kids Area',
    'Fun Park',
    'Adventure Zone',
    'Challenge Zone'
  ];

  const extraGames = [
    {
      id: 'motorcycle',
      title: 'Motorcycle Racing',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/mobile-challenge/game-motorcycle.png'
    },
    {
      id: 'airhockey',
      title: 'Air Hockey',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/mobile-challenge/game-airhockey.png'
    },
    {
      id: 'billiards',
      title: 'Billards',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/mobile-challenge/game-billiards.png'
    },
    {
      id: 'pingpong',
      title: 'Ping Pong',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/mobile-challenge/game-pingpong.png'
    },
    {
      id: 'ps4',
      title: 'PS4',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/mobile-challenge/game-ps4.png'
    },
    {
      id: 'boxing',
      title: 'Boxing Machine',
      price: 'EGP 30 / ticket',
      priceNum: 30,
      img: '/photo/mobile-challenge/game-boxing.png'
    }
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

  const handleMobileNavClick = (tab) => {
    setMobileNavTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'offers') {
      const el = document.getElementById('mob-offers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'gallery') {
      if (openModal) openModal('gallery');
    } else if (tab === 'guide') {
      if (openModal) openModal('guide');
    } else if (tab === 'more') {
      if (openModal) openModal('info');
    }
  };

  return (
    <div className={`kids-area-page ${previewMode === 'mobile' ? 'force-mobile-mode' : ''} ${previewMode === 'desktop' ? 'force-desktop-mode' : ''}`}>

      {/* Floating Device Preview Toggle for easy testing */}
      <div className="ka-preview-toggle-bar">
        <button 
          className={`ka-preview-btn ${previewMode === 'auto' ? 'active' : ''}`}
          onClick={() => setPreviewMode('auto')}
          title="Responsive Auto Mode"
        >
          Auto (Screen)
        </button>
        <button 
          className={`ka-preview-btn ${previewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => setPreviewMode('mobile')}
          title="Force Mobile Preview"
        >
          <Smartphone size={14} /> Mobile View
        </button>
        <button 
          className={`ka-preview-btn ${previewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => setPreviewMode('desktop')}
          title="Force Desktop View"
        >
          <Monitor size={14} /> Desktop View
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          A. MOBILE VIEW (Matches user reference screenshot pixel-for-pixel)
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="ka-mobile-layout">
        
        {/* 1. Mobile Header */}
        <header className="ka-mob-header">
          {/* Top Bar: Logo & Icons */}
          <div className="ka-mob-header-top">
            <div className="ka-mob-brand" onClick={() => setActiveTab('lobby')}>
              <img 
                src="/photo/mobile-challenge/header-logo.png" 
                alt="American Dream Ismailia" 
                className="ka-mob-brand-logo" 
              />
            </div>
            <div className="ka-mob-header-actions">
              <button 
                className="ka-mob-icon-btn" 
                onClick={() => openModal && openModal('account')}
                aria-label="User profile"
              >
                <User size={22} color="#ffffff" strokeWidth={2} />
              </button>
              <button 
                className="ka-mob-icon-btn" 
                onClick={() => openModal && openModal('menu')}
                aria-label="Menu"
              >
                <Menu size={26} color="#ffffff" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="ka-mob-search-wrapper">
            <div className="ka-mob-search-bar">
              <Search size={17} className="ka-mob-search-icon" />
              <input 
                type="text"
                placeholder="Search for rides, offers, and more..."
                className="ka-mob-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="ka-mob-categories-scroll">
            {mobileCategories.map((cat) => {
              const isActive = mobileCategory === cat;
              return (
                <button
                  key={cat}
                  className={`ka-mob-cat-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {/* 2. Mobile Content Area */}
        <main className="ka-mob-main">

          {/* ── CASE 1: CHALLENGE ZONE (Exact screenshot view) ── */}
          {(mobileCategory === 'Challenge Zone' || mobileCategory === 'All') && (
            <div className="ka-mob-zone-section">
              {/* Hero Banner */}
              <div className="ka-mob-hero-wrap">
                <img 
                  src="/photo/mobile-challenge/challenge-hero-banner.png" 
                  alt="Challenge Zone - Test Your Skills Make More Memories!" 
                  className="ka-mob-hero-img"
                />
              </div>

              {/* Challenge Zone Offers */}
              <section id="mob-offers-section" className="ka-mob-section">
                <h2 className="ka-mob-section-title">
                  Challenge Zone Offers <span className="ka-mob-divider">|</span> عروض منطقة التحدي
                </h2>

                {/* Main Challenge Pass Card */}
                <div className="ka-mob-offer-card">
                  {/* Left: 4-Games Collage */}
                  <div className="ka-mob-offer-media">
                    <img 
                      src="/photo/mobile-challenge/offer-collage.png" 
                      alt="VR, Shooting, Basketball, Car Racing - Choose any 4 games"
                      className="ka-mob-offer-collage"
                    />
                  </div>

                  {/* Right: Offer Details */}
                  <div className="ka-mob-offer-body">
                    <div className="ka-mob-offer-top">
                      <h3 className="ka-mob-offer-name">Challenge Pass</h3>
                      <span className="ka-mob-badge-save">Save 60 EGP</span>
                    </div>

                    <p className="ka-mob-offer-sub">Pick any 4 games</p>

                    {/* 2x2 Features Grid */}
                    <div className="ka-mob-features-grid">
                      <div className="ka-mob-feat-item">
                        <Gamepad2 size={13} className="ka-mob-feat-icon" />
                        <span>VR</span>
                      </div>
                      <div className="ka-mob-feat-item">
                        <span className="ka-mob-feat-emoji">🏀</span>
                        <span>Basketball</span>
                      </div>
                      <div className="ka-mob-feat-item">
                        <Crosshair size={13} className="ka-mob-feat-icon" />
                        <span>Shooting</span>
                      </div>
                      <div className="ka-mob-feat-item">
                        <Car size={13} className="ka-mob-feat-icon" />
                        <span>Car Racing</span>
                      </div>
                    </div>

                    {/* Price Row */}
                    <div className="ka-mob-pricing-row">
                      <span className="ka-mob-price-main">EGP 100</span>
                      <span className="ka-mob-price-strike">EGP 160</span>
                    </div>

                    {/* Get This Offer Button */}
                    <button 
                      className="ka-mob-btn-offer"
                      onClick={() => handleBookPackage('Challenge Pass (Pick any 4 games)', 100)}
                    >
                      <Ticket size={15} />
                      <span>Get This Offer</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Extra Games Section */}
              <section className="ka-mob-section">
                <h2 className="ka-mob-section-title">
                  Extra Games <span className="ka-mob-divider">|</span> الألعاب الإضافية
                </h2>

                {/* 3-Column Grid */}
                <div className="ka-mob-games-grid">
                  {extraGames.map((game) => (
                    <div key={game.id} className="ka-mob-game-card">
                      <div className="ka-mob-game-img-wrap">
                        <img 
                          src={game.img} 
                          alt={game.title} 
                          className="ka-mob-game-img" 
                        />
                      </div>
                      <div className="ka-mob-game-details">
                        <h4 className="ka-mob-game-title">{game.title}</h4>
                        <p className="ka-mob-game-price">{game.price}</p>
                        <button 
                          className="ka-mob-btn-play"
                          onClick={() => handleBookPackage(game.title, game.priceNum)}
                        >
                          <Ticket size={11} />
                          <span>Play Now</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Safety & Rules Banner */}
              <div className="ka-mob-safety-banner">
                <div className="ka-mob-safety-icon-wrap">
                  <ShieldCheck size={24} color="#0097a7" />
                </div>
                <div className="ka-mob-safety-text">
                  <p className="ka-mob-safety-en">Ages vary by game. Safety and height rules apply.</p>
                  <p className="ka-mob-safety-ar">تختلف الأعمار من لعبة لأخرى. تطبق قواعد السلامة والطول.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── CASE 2: KIDS AREA (Mobile Adaptation of Kids Area) ── */}
          {mobileCategory === 'Kids Area' && (
            <div className="ka-mob-zone-section">
              {/* Kids Area Hero Banner */}
              <div className="ka-mob-hero-wrap">
                <img 
                  src="/photo/kid-area-pic/hero-banner.png" 
                  alt="Kids Area - A world of fun, laughter, and endless smiles" 
                  className="ka-mob-hero-img"
                />
              </div>

              {/* Kids Area Gallery Grid */}
              <div className="ka-mob-gallery-grid">
                <img src="/photo/kid-area-pic/gallery-1.png" alt="Toy puzzle birds" className="ka-mob-gallery-img" />
                <img src="/photo/kid-area-pic/gallery-2.png" alt="Wooden alphabet train" className="ka-mob-gallery-img" />
                <img src="/photo/kid-area-pic/gallery-3.png" alt="Sensory activity board" className="ka-mob-gallery-img" />
                <img src="/photo/kid-area-pic/gallery-4.png" alt="American Dream Kids Character" className="ka-mob-gallery-img" />
              </div>

              {/* 360 Virtual Dome Banner */}
              <div className="ka-mob-dome-wrap" onClick={() => openModal && openModal('tickets')}>
                <img src="/photo/kid-area-pic/dome-360.png" alt="360° Dome" className="ka-mob-dome-img" />
              </div>

              {/* Kids Area Weekend Packages */}
              <section className="ka-mob-section">
                <h2 className="ka-mob-section-title">
                  Weekend Packages <span className="ka-mob-divider">|</span> باقات نهاية الأسبوع
                </h2>
                <div className="ka-mob-pkg-card">
                  <div className="ka-mob-pkg-header">
                    <div>
                      <span className="ka-mob-badge-popular">POPULAR</span>
                      <h3 className="ka-mob-pkg-name">Kids Area Package (1 Child)</h3>
                      <p className="ka-mob-pkg-time">1 Child / 1 Hr • Age: 1-12 y</p>
                    </div>
                    <div className="ka-mob-pkg-price-box">
                      <span className="ka-mob-pkg-price">EGP 150</span>
                    </div>
                  </div>
                  <button 
                    className="ka-mob-btn-offer"
                    onClick={() => handleBookPackage('Kids Area (Weekend - 1 Child)', 150)}
                  >
                    <Ticket size={15} />
                    <span>BOOK THIS PACKAGE</span>
                  </button>
                </div>

                <div className="ka-mob-pkg-card" style={{ marginTop: '10px' }}>
                  <div className="ka-mob-pkg-header">
                    <div>
                      <span className="ka-mob-badge-family">FAMILY PACK</span>
                      <h3 className="ka-mob-pkg-name">Kids Area Package (Brothers)</h3>
                      <p className="ka-mob-pkg-time">2 Children / 1 Hr • Age: 1-12 y</p>
                    </div>
                    <div className="ka-mob-pkg-price-box">
                      <span className="ka-mob-pkg-price">EGP 250</span>
                    </div>
                  </div>
                  <button 
                    className="ka-mob-btn-offer"
                    onClick={() => handleBookPackage('Kids Area (Weekend - 2 Children)', 250)}
                  >
                    <Ticket size={15} />
                    <span>BOOK THIS PACKAGE</span>
                  </button>
                </div>
              </section>

              {/* Safety banner */}
              <div className="ka-mob-safety-banner">
                <div className="ka-mob-safety-icon-wrap">
                  <ShieldCheck size={24} color="#0097a7" />
                </div>
                <div className="ka-mob-safety-text">
                  <p className="ka-mob-safety-en">Supervised play area with trained safety facilitators.</p>
                  <p className="ka-mob-safety-ar">منطقة لعب آمنة ومراقبة بإشراف متخصصين.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── CASE 3: OTHER ZONES (Fun Park & Adventure Zone) ── */}
          {(mobileCategory === 'Fun Park' || mobileCategory === 'Adventure Zone') && (
            <div className="ka-mob-zone-section">
              <div className="ka-mob-empty-zone">
                <img 
                  src={mobileCategory === 'Fun Park' ? '/photo/kid-area-pic/Junior GP Speedway.png' : '/photo/kid-area-pic/Laser & Tactical Arena.png'} 
                  alt={mobileCategory} 
                  className="ka-mob-hero-img" 
                />
                <h3 className="ka-mob-section-title" style={{ marginTop: '16px' }}>{mobileCategory}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Experience the ultimate rides and challenges!</p>
                <button 
                  className="ka-mob-btn-offer" 
                  style={{ marginTop: '12px' }}
                  onClick={() => openModal && openModal('tickets')}
                >
                  <Ticket size={15} />
                  <span>View All Tickets & Passes</span>
                </button>
              </div>
            </div>
          )}

        </main>

        {/* 3. Fixed Bottom Navigation Bar */}
        <nav className="ka-mob-bottom-nav">
          <button 
            className={`ka-mob-nav-item ${mobileNavTab === 'home' ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('home')}
          >
            <Home size={20} className="ka-mob-nav-icon" />
            <span className="ka-mob-nav-label">Home</span>
            {mobileNavTab === 'home' && <span className="ka-mob-tab-indicator" />}
          </button>

          <button 
            className={`ka-mob-nav-item ${mobileNavTab === 'offers' ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('offers')}
          >
            <Ticket size={20} className="ka-mob-nav-icon" />
            <span className="ka-mob-nav-label">Offers</span>
            {mobileNavTab === 'offers' && <span className="ka-mob-tab-indicator" />}
          </button>

          <button 
            className={`ka-mob-nav-item ${mobileNavTab === 'guide' ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('guide')}
          >
            <MapPin size={20} className="ka-mob-nav-icon" />
            <span className="ka-mob-nav-label">Park Guide</span>
            {mobileNavTab === 'guide' && <span className="ka-mob-tab-indicator" />}
          </button>

          <button 
            className={`ka-mob-nav-item ${mobileNavTab === 'gallery' ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('gallery')}
          >
            <ImageIcon size={20} className="ka-mob-nav-icon" />
            <span className="ka-mob-nav-label">Gallery</span>
            {mobileNavTab === 'gallery' && <span className="ka-mob-tab-indicator" />}
          </button>

          <button 
            className={`ka-mob-nav-item ${mobileNavTab === 'more' ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('more')}
          >
            <MoreHorizontal size={20} className="ka-mob-nav-icon" />
            <span className="ka-mob-nav-label">More</span>
            {mobileNavTab === 'more' && <span className="ka-mob-tab-indicator" />}
          </button>
        </nav>

      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          B. DESKTOP VIEW (Preserved full desktop experience)
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="ka-desktop-layout">
        {/* 1. Main Navigation Bar */}
        <header className="ka-header">
          <div className="ka-header-inner">
            <div className="ka-brand" onClick={() => setActiveTab('lobby')} title="Back to Lobby">
              <img src="/photo/kid-area-pic/logo.png" alt="American Dream" className="ka-brand-logo" />
            </div>

            <nav className="ka-nav-links">
              <button className="ka-nav-link" onClick={() => setActiveTab('lobby')}>Home</button>
              <button className="ka-nav-link active">Play Zones</button>
              <button className="ka-nav-link" onClick={() => setActiveTab('menu')}>Restruant & Cafe</button>
              <button className="ka-nav-link" onClick={() => setActiveTab('events')}>Event & Halls</button>
              <button className="ka-nav-link">Trips</button>
            </nav>

            <div className="ka-nav-actions">
              <button className="ka-btn-book-us" onClick={() => openModal && openModal('tickets')}>
                About us
              </button>
            </div>
          </div>
        </header>

        {/* 2. Secondary Category Sub-Nav */}
        <div className="ka-subnav">
          <div className="ka-subnav-inner">
            {desktopCategories.map((cat) => {
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

        {/* 3. Main Hero & Gallery (Desktop) */}
        <div className="ka-light-container">
          <div className="ka-content-wrapper">
            <div className="ka-hero-banner-wrapper">
              <img
                src="/photo/kid-area-pic/hero-banner.png"
                alt="Kids Area - A world of fun, laughter, and endless smiles"
                className="ka-hero-banner-img"
              />
            </div>

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

            <div className="ka-dome-banner-wrapper" onClick={() => openModal && openModal('tickets')}>
              <img
                src="/photo/kid-area-pic/dome-360.png"
                alt="Explore 360° Dome"
                className="ka-dome-banner-img"
              />
            </div>
          </div>
        </div>

        {/* 4. Desktop Offers Section */}
        <section className="ka-offers-section">
          <div className="ka-offers-wrapper">
            {/* Week-end Offers */}
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

              <div className="ka-pricing-grid">
                {/* Weekend Card 1 */}
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

                {/* Weekend Card 2 */}
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

            {/* Mid-week Offers */}
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

              <div className="ka-pricing-grid">
                {/* Midweek Card 1 */}
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

                {/* Midweek Card 2 */}
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

        {/* 5. Desktop Footer */}
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

    </div>
  );
}
