import React, { useState } from 'react';

export default function DesktopAdventurePage({ setActiveTab, openModal, lang, searchQuery }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewType, setViewType] = useState('packages'); // 'packages' | 'tickets'

  // Individual ticket adventure attractions (matching media_1790198436258.png)
  const ticketGames = [
    {
      id: 'pubg',
      title: 'PUBG',
      priceText: 'EGP 40 / ticket',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/photo-vr-friends.png'
    },
    {
      id: 'bamber-ball',
      title: 'Bamber Ball',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/Air Hockey Table.png',
      fallback: '/photo/kid-area-pic/Fast-Paced Air Hockey.png'
    },
    {
      id: 'car-bamber',
      title: 'Car Bamber',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/Billiards Pool Table.png',
      fallback: '/photo/kid-area-pic/Bumper Collision Bay.png'
    }
  ];

  const exploreItems = [
    {
      id: 'climbing',
      title: 'Climbing',
      titleAr: 'تسلق',
      image: '/photo/kid-area-pic/ball-pit-thumb.png',
      fallback: '/photo/kid-area-pic/explore-ballpit.png',
      desc: 'Tested auto-belay vertical rock faces with multiple difficulty grades.'
    },
    {
      id: 'trampoline',
      title: 'Mega Trampoline',
      titleAr: 'ترامبولين',
      image: '/photo/kid-area-pic/soft-play-thumb.png',
      fallback: '/photo/kid-area-pic/explore-softplay.png',
      desc: 'High flying trampoline launch pads with safe foam landing cubes.'
    },
    {
      id: 'art-workshop',
      title: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      image: '/photo/kid-area-pic/art-workshop-thumb.png',
      fallback: '/photo/kid-area-pic/explore-artworkshop.png',
      desc: 'Creative workshops, guided pottery, and colorful art creation.'
    }
  ];

  // Filter games based on search query
  const filteredGames = ticketGames.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.title.toLowerCase().includes(q) || g.priceText.toLowerCase().includes(q);
  });

  const handleBooking = (title, price, details) => {
    openModal('booking', {
      name: title,
      price: `${price} EGP`,
      priceNum: price,
      discount: 'Direct Booking',
      details: details || 'Full access adventure ticket'
    });
  };

  return (
    <div className="desktop-page desktop-zone-page">
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div className="desktop-zone-hero-banner adventure-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">ADVENTURE ZONE</h1>
            <h2 className="desktop-zone-hero-tagline">
              Where boundless energy meets endless family smiles in Ismailia's premier indoor wonderland.
            </h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">منطقة المغامرات</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">
              حيث تلتقي الطاقة والحماس بابتسامات عائلية لا تنتهي في عالم المغامرات الداخلي الأول في الإسماعيلية
            </p>
            
            {/* Carousel Dots */}
            <div className="desktop-zone-hero-dots">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`desktop-hero-dot ${activeSlide === i ? 'active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Tilted Sticker Badge */}
          <div className="desktop-tilted-badge">
            <span>PLAY</span>
            <span>EXPLORE</span>
            <span>LEARN</span>
            <span>TOGETHER!</span>
          </div>
        </div>

        {/* 2. SECTION HEADER & TOGGLE */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              {viewType === 'packages' ? (
                <>Adventure Zone Area Offers <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة المغامرات</span></>
              ) : (
                <>Adventure Zone Area Tickets <span className="text-separator">|</span> <span className="font-alexandria">تذاكر منطقة المغامرات</span></>
              )}
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">All Ages</span>
            </div>
          </div>

          {/* TOGGLE SWITCH: Packages vs Tickets */}
          <div className="desktop-zone-view-toggle-wrap">
            <div className="desktop-zone-view-toggle">
              <button 
                className={`toggle-tab-btn ${viewType === 'packages' ? 'active' : ''}`}
                onClick={() => setViewType('packages')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="toggle-tab-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <div className="toggle-tab-labels">
                  <span className="tab-en">Packages</span>
                  <span className="tab-ar font-alexandria">الباقات</span>
                </div>
              </button>

              <button 
                className={`toggle-tab-btn ${viewType === 'tickets' ? 'active' : ''}`}
                onClick={() => setViewType('tickets')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="toggle-tab-icon">
                  <rect x="2" y="6" width="20" height="12" rx="3" />
                  <line x1="6" y1="12" x2="6.01" y2="12" />
                  <line x1="18" y1="12" x2="18.01" y2="12" />
                </svg>
                <div className="toggle-tab-labels">
                  <span className="tab-en">Tickets</span>
                  <span className="tab-ar font-alexandria">التذاكر</span>
                </div>
              </button>
            </div>
          </div>

          {/* VIEW A: PACKAGES VIEW (Matching media_1790196526672.png) */}
          {viewType === 'packages' && (
            <div className="desktop-horizontal-pass-container">
              <div className="desktop-horizontal-pass-card">
                {/* Left 4-split composite image */}
                <div className="pass-card-left-img-wrap">
                  <img 
                    src="/photo/kid-area-pic/Graphic Composition.png" 
                    alt="Adventure Pass Games" 
                    className="pass-card-composite-img"
                    onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                  />
                  <div className="pass-card-ribbon-badge">
                    <span>&#9733; ALL-INCLUSIVE ADVENTURE &#9733;</span>
                  </div>
                </div>

                {/* Right Offer Details */}
                <div className="pass-card-right-body">
                  <div className="pass-card-header-row">
                    <div>
                      <h3 className="pass-card-main-title">Adventure Pass</h3>
                      <span className="pass-card-subtitle-cyan">All Game Experiance</span>
                    </div>
                    <span className="pass-card-save-badge">Save 60 EGP</span>
                  </div>

                  {/* Adventure Perks Checklist */}
                  <div className="pass-card-checklist">
                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">BUMPER CARS</span>
                    </div>

                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">PUBG</span>
                    </div>

                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">Bubble Ball</span>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pass-card-price-action-row">
                    <div className="pass-price-group">
                      <strong className="pass-current-price">EGP 100</strong>
                      <span className="pass-old-price">EGP 160</span>
                    </div>

                    <button 
                      className="pass-get-offer-btn"
                      onClick={() => handleBooking('Adventure Pass - باقة المغامرة الشاملة', 100, 'All Game Experience: Bumper Cars, PUBG, Bubble Ball')}
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
          )}

          {/* VIEW B: TICKETS VIEW (Matching media_1790198436258.png with exactly PUBG, Bamber Ball, Car Bamber) */}
          {viewType === 'tickets' && (
            <div className="desktop-ticket-games-grid">
              {filteredGames.map((game) => (
                <div key={game.id} className="desktop-ticket-game-card">
                  <div className="ticket-game-img-box">
                    <img 
                      src={game.image} 
                      alt={game.title} 
                      className="ticket-game-img"
                      onError={(e) => { e.target.src = game.fallback; }}
                    />
                  </div>

                  <div className="ticket-game-info-body">
                    <h4 className="ticket-game-title">{game.title}</h4>
                    <span className="ticket-game-price-label">{game.priceText}</span>

                    <button 
                      className="ticket-game-play-btn"
                      onClick={() => handleBooking(`${game.title} Pass`, game.price, game.priceText)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="play-btn-ticket-icon">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      </svg>
                      <span>Play Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* 3. EXPLORE ADVENTURE ZONE SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">Explore Adventure Zone</h2>
            <button 
              className="desktop-see-all-link"
              onClick={() => openModal('gallery')}
            >
              See All &gt;
            </button>
          </div>

          {/* 3 FEATURE CARDS */}
          <div className="desktop-explore-grid-3">
            {exploreItems.map((item) => (
              <div 
                key={item.id} 
                className="desktop-explore-card"
                onClick={() => openModal('attraction-detail', {
                  titleEn: item.title,
                  titleAr: item.titleAr,
                  desc: item.desc,
                  img: item.image
                })}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="desktop-explore-img"
                  onError={(e) => { e.target.src = item.fallback; }}
                />
                <div className="desktop-explore-overlay">
                  <h3 className="desktop-explore-title">{item.title}</h3>
                  <h4 className="desktop-explore-title-ar font-alexandria">{item.titleAr}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. EXPLORE 360° CENTER BUTTON */}
        <div className="desktop-360-btn-wrap">
          <button 
            className="desktop-360-pill-btn"
            onClick={() => openModal('360-tour')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-360-icon">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>EXPLORE 360°</span>
          </button>
        </div>

      </div>
    </div>
  );
}
