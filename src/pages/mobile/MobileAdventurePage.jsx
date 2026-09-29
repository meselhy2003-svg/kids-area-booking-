import React, { useState, useMemo } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import { useTickets } from '../../hooks/useTickets';
import { useZoneData } from '../../hooks/useZoneData';

export default function MobileAdventurePage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'

  const { gameTickets: adventureTickets } = useTickets('adventure');
  const { attractions } = useZoneData('adventure');

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return adventureTickets;
    const q = searchQuery.toLowerCase();
    return adventureTickets.filter(
      t => (t.titleEn && t.titleEn.toLowerCase().includes(q)) || 
           (t.titleAr && t.titleAr.includes(q)) ||
           (t.title && t.title.toLowerCase().includes(q))
    );
  }, [adventureTickets, searchQuery]);

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

      {/* Zone Hero Banner: Adventure Zone */}
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

          {/* Adventure Pass Card */}
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

              {/* Cyan Checklist */}
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

      {/* VIEW 2: TICKETS TAB */}
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
                  <img src={game.img || game.image} alt={game.titleEn || game.title} className="game-ticket-img" />
                </div>

                <div className="game-ticket-body">
                  <h4 className="game-ticket-title">{game.titleEn || game.title}</h4>
                  <div className="game-ticket-price">{game.priceText || game.price}</div>
                  <button 
                    className="play-now-btn"
                    onClick={() => openModal('booking', {
                      name: game.titleEn || game.title,
                      price: game.priceText || `${game.price} EGP`,
                      priceNum: game.priceNum || game.price,
                      discount: 'Adventure Ticket',
                      details: `Single entry ticket to ${game.titleEn || game.title}`
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

      {/* Explore Adventure Zone Section */}
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
                alt={attr.titleEn || attr.title} 
                className="attr-card-img"
                onError={(e) => { e.currentTarget.src = attr.fallbackImg || attr.fallback; }}
              />
              <div className="attr-overlay-labels">
                <div className="attr-en-name">{attr.titleEn || attr.title}</div>
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
