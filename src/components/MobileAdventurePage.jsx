import React, { useState, useMemo } from 'react';
import RunningHeroBanner from './RunningHeroBanner';

export default function MobileAdventurePage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'

  const adventureTickets = [
    {
      id: 'pubg',
      titleEn: 'PUBG',
      titleAr: 'لعبة ببجي الحركية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/game-motorcycle-arcade.png'
    },
    {
      id: 'bamber-ball',
      titleEn: 'Bamber Ball',
      titleAr: 'كرات التصادم الهوائية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/game-air-hockey-table.png'
    },
    {
      id: 'bumper-cars',
      titleEn: 'Bumper Cars',
      titleAr: 'سيارات التصادم العائلية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/family-bumper-cars.png'
    },
    {
      id: 'bubble-ball',
      titleEn: 'Bubble Ball Arena',
      titleAr: 'حلبة الفقاعات الهوائية',
      price: 'EGP 40 / ticket',
      priceNum: 40,
      img: '/photo/kid-area-pic/kids-ball-pit-slide.png'
    },
    {
      id: 'sky-suspension',
      titleEn: 'Sky Suspension Bridge',
      titleAr: 'جسر الحبال المعلقة',
      price: 'EGP 50 / round',
      priceNum: 50,
      img: '/photo/kid-area-pic/girl-rope-bridge.png'
    },
    {
      id: 'high-ropes',
      titleEn: 'High Ropes Course',
      titleAr: 'مسار المغامرات الشاهق',
      price: 'EGP 60 / round',
      priceNum: 60,
      img: '/photo/kid-area-pic/high-ropes-course.png'
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
    if (!searchQuery.trim()) return adventureTickets;
    const q = searchQuery.toLowerCase();
    return adventureTickets.filter(
      t => t.titleEn.toLowerCase().includes(q) || t.titleAr.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mobile-zone-page adventure-screen">
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

      {/* Zone Hero Banner: Adventure Zone (fixed, does not move automatically) */}
      <RunningHeroBanner slideIndex={3} setActiveTab={setActiveTab} />

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

      {/* VIEW 1: PACKAGES TAB (matching media_1790098558523.png) */}
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

          {/* Adventure Pass Card strictly matching media_1790098558523.png */}
          <div className="challenge-pass-card adventure-pass-card">
            {/* Left Preview Box */}
            <div 
              className="pass-card-left adventure-collage-box"
              onClick={() => openModal('booking', {
                name: 'Adventure Pass',
                price: 'EGP 100',
                priceNum: 100,
                discount: 'Save 60 EGP',
                details: 'All Game Experience: BUMPER CARS, PUBG, and Bubble Ball'
              })}
              role="button"
              tabIndex={0}
              title="Click to book Adventure Pass"
            >
              <img 
                src="/photo/kid-area-pic/family-bumper-cars.png" 
                alt="Adventure Pass" 
                className="pass-collage-img" 
              />
            </div>

            {/* Right Card Content */}
            <div className="pass-card-right">
              <div className="pass-save-badge">Save 60 EGP</div>
              <h4 className="pass-main-title">Adventure Pass</h4>
              <p className="pass-sub-cyan">All Game Experiance</p>

              {/* Cyan Checklist strictly matching screenshot */}
              <div className="adventure-checklist">
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">BUMPER CARS</span>
                </div>
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">PUBG</span>
                </div>
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">Bubble Ball</span>
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
                  name: 'Adventure Pass',
                  price: 'EGP 100',
                  priceNum: 100,
                  discount: 'Save 60 EGP',
                  details: 'All Game Experience: BUMPER CARS, PUBG, Bubble Ball'
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

      {/* VIEW 2: TICKETS TAB (matching media_1790098564135.png) */}
      {activeSubTab === 'tickets' && (
        <div className="challenge-tickets-view">
          {/* Section Header */}
          <div className="zone-section-header">
            <div className="section-title-combo">
              <span className="title-part-en">Adventure zone Tickets</span>
              <span className="title-divider">|</span>
              <span className="title-part-ar">تذاكر منطقة المغامرات</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">All Ages</span>
              <button 
                className="see-all-link"
                onClick={() => openModal('all-offers', { zone: 'Adventure Tickets', offers: adventureTickets })}
              >
                See All &gt;
              </button>
            </div>
          </div>

          {/* 2-Column Grid of Adventure Ticket Cards */}
          <div className="game-tickets-grid">
            {filteredTickets.map((game) => (
              <div key={game.id} className="game-ticket-card">
                <div className="game-ticket-media">
                  <img src={game.img} alt={game.titleEn} className="game-ticket-img" />
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
                      discount: 'Adventure Ticket',
                      details: `Single entry ticket to ${game.titleEn}`
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

      {/* Explore Adventure Zone Section (strictly matching screenshot) */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">Explore Adventure zone</h3>
        <button 
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: 'Adventure Zone', attractions })}
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

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
