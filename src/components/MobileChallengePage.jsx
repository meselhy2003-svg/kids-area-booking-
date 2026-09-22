import React, { useState, useMemo } from 'react';
import RunningHeroBanner from './RunningHeroBanner';

export default function MobileChallengePage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [gamePickerOpen, setGamePickerOpen] = useState(false);
  const [selectedGames, setSelectedGames] = useState(['VR', 'Basketball', 'Shooting', 'Car Racing']);

  const allAvailableGames = [
    { id: 'vr', name: 'VR Arena Simulator', icon: '🎮' },
    { id: 'basketball', name: 'Basketball Shootout', icon: '🏀' },
    { id: 'shooting', name: 'Laser Shooting Gallery', icon: '🎯' },
    { id: 'racing', name: 'Car Racing Simulator', icon: '🏎️' },
    { id: 'airhockey', name: 'Air Hockey Battle', icon: '🏒' },
    { id: 'ps4', name: 'PS4 Lounge Station', icon: '🕹️' },
    { id: 'boxing', name: 'Boxing Power Test', icon: '🥊' },
    { id: 'pingpong', name: 'Ping Pong Challenge', icon: '🏓' }
  ];

  const toggleGameSelection = (gameName) => {
    if (selectedGames.includes(gameName)) {
      if (selectedGames.length > 1) {
        setSelectedGames(selectedGames.filter(g => g !== gameName));
      }
    } else {
      if (selectedGames.length < 4) {
        setSelectedGames([...selectedGames, gameName]);
      }
    }
  };

  const gameTickets = [
    {
      id: 'motorcycle-1',
      titleEn: 'Motorcycle Racing',
      titleAr: 'سباق الدراجات النارية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/game-motorcycle-arcade.png'
    },
    {
      id: 'airhockey-1',
      titleEn: 'Air Hockey',
      titleAr: 'هوكي الهواء المضيء',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/kid-area-pic/game-air-hockey-table.png'
    },
    {
      id: 'billiards',
      titleEn: 'Billiards',
      titleAr: 'بلياردو المحترفين',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/kid-area-pic/game-billiards-pool.png'
    },
    {
      id: 'pingpong',
      titleEn: 'Ping Pong',
      titleAr: 'تنس الطاولة',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/kid-area-pic/game-table-tennis.png'
    },
    {
      id: 'ps4',
      titleEn: 'PS4',
      titleAr: 'صالة البلايستيشن',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      badge: 'PS4',
      badgeColor: '#0284c7',
      img: '/photo/kid-area-pic/game-ps4-gaming.png'
    },
    {
      id: 'boxing-1',
      titleEn: 'Boxing Machine',
      titleAr: 'ماكينة قياس قوة الملاكمة',
      price: 'EGP 30 / ticket',
      priceNum: 30,
      badge: 'BOXER',
      badgeColor: '#dc2626',
      img: '/photo/kid-area-pic/game-boxing-punch.png'
    },
    {
      id: 'motorcycle-2',
      titleEn: 'Motorcycle Racing',
      titleAr: 'سباق الدراجات النارية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/game-motorcycle-arcade.png'
    },
    {
      id: 'airhockey-2',
      titleEn: 'Air Hockey',
      titleAr: 'هوكي الهواء المضيء',
      price: 'EGP 50 / 30 min',
      priceNum: 50,
      img: '/photo/kid-area-pic/game-air-hockey-table.png'
    },
    {
      id: 'boxing-2',
      titleEn: 'Boxing Machine',
      titleAr: 'ماكينة قياس قوة الملاكمة',
      price: 'EGP 30 / ticket',
      priceNum: 30,
      badge: 'BOXER',
      badgeColor: '#dc2626',
      img: '/photo/kid-area-pic/game-boxing-punch.png'
    }
  ];

  const attractions = [
    {
      id: 'ball-pit',
      titleEn: 'Ball Pit',
      titleAr: 'مسبح الكرات',
      img: '/photo/kid-area-pic/explore-ballpit-clean.png',
      fallbackImg: '/photo/kid-area-pic/kids-ball-pit-slide.png',
      desc: 'Interactive ball pit with play slides and obstacles.'
    },
    {
      id: 'soft-play',
      titleEn: 'Soft Play Maze',
      titleAr: 'مناطق اللعب الناعمة',
      img: '/photo/kid-area-pic/explore-softplay-clean.png',
      fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png',
      desc: 'Exciting climbing frames and balance structures.'
    },
    {
      id: 'art-workshop',
      titleEn: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      img: '/photo/kid-area-pic/explore-artworkshop-clean.png',
      fallbackImg: '/photo/kid-area-pic/classic-carousel.png',
      desc: 'Creative crafts, gypsum coloring, and painting.'
    }
  ];

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return gameTickets;
    const q = searchQuery.toLowerCase();
    return gameTickets.filter(
      t => t.titleEn.toLowerCase().includes(q) || t.titleAr.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mobile-zone-page challenge-screen">
      {/* Search Bar */}
      <div className="zone-search-wrapper">
        <div className="zone-search-box">
          <svg className="search-lens-svg" viewBox="0 0 24 24" fill="none" stroke="#7a9299" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text"
            className="zone-search-input"
            placeholder="Search for rides, offers, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Zone Hero Banner: Challenge Zone (fixed, does not move automatically) */}
      <RunningHeroBanner slideIndex={2} setActiveTab={setActiveTab} />

      {/* Packages vs Tickets Toggle Pills */}
      <div className="challenge-toggle-row">
        <button 
          className={`challenge-toggle-btn ${activeSubTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('packages')}
        >
          <img 
            src="/photo/kid-area-pic/icon/Icon (4).png" 
            alt="Packages" 
            className="toggle-pill-icon" 
          />
          <div className="toggle-text-block">
            <span className="toggle-en-text">Packages</span>
            <span className="toggle-ar-text">الباقات</span>
          </div>
        </button>

        <button 
          className={`challenge-toggle-btn ${activeSubTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('tickets')}
        >
          <img 
            src="/photo/kid-area-pic/icon/Vector (3).png" 
            alt="Tickets" 
            className="toggle-pill-icon" 
          />
          <div className="toggle-text-block">
            <span className="toggle-en-text">Tickets</span>
            <span className="toggle-ar-text">التذاكر</span>
          </div>
        </button>
      </div>

      {/* VIEW 1: PACKAGES TAB */}
      {activeSubTab === 'packages' && (
        <div className="challenge-packages-view">
          {/* Section Header */}
          <div className="zone-section-header">
            <div className="section-title-combo">
              <span className="title-part-en">Challenge zone Offers</span>
              <span className="title-divider">|</span>
              <span className="title-part-ar">عروض منطقة التحدي</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">All Ages</span>
            </div>
          </div>

          {/* Large Horizontal Offer Card strictly matching screenshot 1 */}
          <div className="challenge-pass-card">
            {/* Left Preview Box */}
            <div 
              className="pass-card-left"
              onClick={() => setGamePickerOpen(true)}
              role="button"
              tabIndex={0}
              title="Click to customize your 4 games"
            >
              <img 
                src="/photo/mobile-challenge/offer-collage.png" 
                alt="Choose Any 4 Games" 
                className="pass-collage-img" 
              />
            </div>

            {/* Right Card Content */}
            <div className="pass-card-right">
              <div className="pass-save-badge">Save 60 EGP</div>
              <h4 className="pass-main-title">Challenge Pass</h4>
              <p className="pass-sub-cyan">Pick any 4 games</p>

              {/* 2x2 Perks Grid */}
              <div className="pass-perks-grid">
                <div className="perk-item">
                  <span className="perk-icon">🎮</span>
                  <span className="perk-name">{selectedGames[0] || 'VR'}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🏀</span>
                  <span className="perk-name">{selectedGames[1] || 'Basketball'}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🎯</span>
                  <span className="perk-name">{selectedGames[2] || 'Shooting'}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🏎️</span>
                  <span className="perk-name">{selectedGames[3] || 'Car Racing'}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pass-price-row">
                <span className="pass-price-current">EGP 100</span>
                <span className="pass-price-orig">EGP 160</span>
              </div>

              {/* Get This Offer Button */}
              <button 
                className="get-this-offer-btn"
                onClick={() => openModal('booking', {
                  name: `Challenge Pass (${selectedGames.join(', ')})`,
                  price: 'EGP 100',
                  priceNum: 100,
                  discount: 'Save 60 EGP',
                  details: `Includes selected 4 games: ${selectedGames.join(', ')}`
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
        </div>
      )}

      {/* VIEW 2: TICKETS TAB */}
      {activeSubTab === 'tickets' && (
        <div className="challenge-tickets-view">
          {/* Section Header */}
          <div className="zone-section-header">
            <div className="section-title-combo">
              <span className="title-part-en">Challenge zone Tickets</span>
              <span className="title-divider">|</span>
              <span className="title-part-ar">تذاكر منطقة التحدي</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">All Ages</span>
              <button 
                className="see-all-link"
                onClick={() => openModal('all-offers', { zone: 'Challenge Tickets', offers: gameTickets })}
              >
                See All &gt;
              </button>
            </div>
          </div>

          {/* 2-Column Grid of Individual Game Cards strictly matching screenshot 2 & 3 */}
          <div className="game-tickets-grid">
            {filteredTickets.map((game) => (
              <div key={game.id} className="game-ticket-card">
                <div className="game-ticket-media">
                  <img src={game.img} alt={game.titleEn} className="game-ticket-img" />
                  {game.badge && (
                    <span 
                      className="game-corner-badge" 
                      style={{ backgroundColor: game.badgeColor || '#0284c7' }}
                    >
                      {game.badge}
                    </span>
                  )}
                </div>

                <div className="game-ticket-body">
                  <h4 className="game-ticket-title">{game.titleEn}</h4>
                  <div className="game-ticket-price">{game.price}</div>
                  <button 
                    className="play-now-btn"
                    onClick={() => openModal('booking', {
                      name: game.titleEn,
                      price: game.price,
                      priceNum: game.priceNum,
                      discount: 'Quick Pass',
                      details: `Instant access to ${game.titleEn} station`
                    })}
                  >
                    <img 
                      src="/photo/kid-area-pic/icon/Vector (3).png" 
                      alt="ticket" 
                      className="btn-ticket-vector-icon" 
                    />
                    <span>Play Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Challenge Zone Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">Explore Challenge zone</h3>
        <button 
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: 'Challenge Zone', attractions })}
        >
          See All &gt;
        </button>
      </div>

      {/* 3 Attraction Cards */}
      <div className="explore-attractions-row">
        {attractions.map((attr) => (
          <div 
            key={attr.id} 
            className="explore-attraction-card"
            onClick={() => openModal('attraction-detail', attr)}
            role="button"
            tabIndex={0}
          >
            <div className="attr-media-wrapper">
              <img 
                src={attr.img} 
                alt={attr.titleEn} 
                className="attr-card-img"
                onError={(e) => { e.currentTarget.src = attr.fallbackImg; }}
              />
              <div className="attr-overlay-labels">
                <div className="attr-en-name">{attr.titleEn}</div>
                <div className="attr-ar-name">{attr.titleAr}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EXPLORE 360° Button */}
      <div className="explore-360-btn-wrap">
        <button 
          className="explore-360-btn"
          onClick={() => openModal('virtual-tour')}
        >
          <img 
            src="/photo/kid-area-pic/icon/Container.png" 
            alt="360" 
            className="icon-360-img" 
          />
          <span className="explore-360-text">EXPLORE 360°</span>
        </button>
      </div>

      {/* Interactive Choose 4 Games Modal */}
      {gamePickerOpen && (
        <div className="mobile-modal-backdrop" onClick={() => setGamePickerOpen(false)}>
          <div className="mobile-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <button className="sheet-close-x" onClick={() => setGamePickerOpen(false)}>✕</button>
            <h3 className="booking-title">Choose Your 4 Games</h3>
            <p className="booking-details-text">Select any 4 arcade &amp; VR games for your Challenge Pass ({selectedGames.length}/4 selected):</p>

            <div className="game-picker-list">
              {allAvailableGames.map((g) => {
                const isSelected = selectedGames.includes(g.name);
                return (
                  <div 
                    key={g.id} 
                    className={`game-picker-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleGameSelection(g.name)}
                  >
                    <span className="picker-game-icon">{g.icon}</span>
                    <span className="picker-game-name">{g.name}</span>
                    <span className="picker-check-circle">{isSelected ? '✓' : ''}</span>
                  </div>
                );
              })}
            </div>

            <button 
              className="booking-submit-btn" 
              style={{ marginTop: '16px' }}
              disabled={selectedGames.length < 4}
              onClick={() => setGamePickerOpen(false)}
            >
              Confirm 4 Games ({selectedGames.length}/4)
            </button>
          </div>
        </div>
      )}

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
