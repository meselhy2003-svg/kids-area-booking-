import React, { useState } from 'react';

export default function DesktopChallengePage({ setActiveTab, openModal, lang, searchQuery }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewType, setViewType] = useState('packages'); // 'packages' | 'tickets'

  // Individual ticket attractions (matching media_1790196521011.png)
  const ticketGames = [
    {
      id: 'shooting-1',
      title: 'Shooting',
      priceText: 'EGP 40 / ticket',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      badge: null
    },
    {
      id: 'basketball',
      title: 'Basketball',
      priceText: 'EGP 40 / ticket',
      price: 40,
      image: '/photo/kid-area-pic/Air Hockey Table.png',
      fallback: '/photo/kid-area-pic/Fast-Paced Air Hockey.png',
      badge: null
    },
    {
      id: 'boxing-1',
      title: 'Boxing Machine',
      priceText: 'EGP 40 / ticket',
      price: 40,
      image: '/photo/kid-area-pic/Boxing Punch Machine.png',
      fallback: '/photo/kid-area-pic/Boxing Punch Machine (1).png',
      badge: null
    },
    {
      id: 'pingpong',
      title: 'Ping Pong',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/Table Tennis Ping Pong.png',
      fallback: '/photo/kid-area-pic/Table Tennis Ping Pong.png',
      badge: null
    },
    {
      id: 'ps4-1',
      title: 'PS4',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      fallback: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      badge: 'PS4'
    },
    {
      id: 'boxing-2',
      title: 'Boxing Machine',
      priceText: 'EGP 50 / ticket',
      price: 50,
      image: '/photo/kid-area-pic/Boxing Punch Machine (1).png',
      fallback: '/photo/kid-area-pic/Boxing Punch Machine.png',
      badge: null
    },
    {
      id: 'shooting-vr',
      title: 'VR Shooting Arena',
      priceText: 'EGP 40 / ticket',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      badge: null
    },
    {
      id: 'airhockey',
      title: 'Air Hockey',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/Air Hockey Table (1).png',
      fallback: '/photo/kid-area-pic/Air Hockey Table.png',
      badge: null
    },
    {
      id: 'billiards',
      title: 'Billiards',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/Billiards Pool Table.png',
      fallback: '/photo/kid-area-pic/Billiards Pool Table.png',
      badge: null
    },
    {
      id: 'ps4-2',
      title: 'PS4',
      priceText: 'EGP 50 / 30 min',
      price: 50,
      image: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      fallback: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      badge: 'PS4'
    }
  ];

  const exploreItems = [
    {
      id: 'climbing',
      title: 'Climbing',
      titleAr: 'تسلق',
      image: '/photo/kid-area-pic/ball-pit-thumb.png',
      fallback: '/photo/kid-area-pic/explore-ballpit.png',
      desc: 'Multi-level climbing challenges and auto-belay vertical walls.'
    },
    {
      id: 'trampoline',
      title: 'Mega Trampoline',
      titleAr: 'ترامبولين',
      image: '/photo/kid-area-pic/soft-play-thumb.png',
      fallback: '/photo/kid-area-pic/explore-softplay.png',
      desc: 'High bounce interconnected trampoline arenas and foam plunge pits.'
    },
    {
      id: 'art-workshop',
      title: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      image: '/photo/kid-area-pic/art-workshop-thumb.png',
      fallback: '/photo/kid-area-pic/explore-artworkshop.png',
      desc: 'Pottery sculpting, coloring workshops, and creative hands-on craft sessions.'
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
      details: details || 'Full access ticket to attraction'
    });
  };

  return (
    <div className="desktop-page desktop-zone-page">
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div className="desktop-zone-hero-banner challenge-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">CHALLENGE  ZONE</h1>
            <h2 className="desktop-zone-hero-tagline">Challenge yourself, beat your score, and have fun</h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">منطقة التحدي</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">تحدي نفسك، حطم رقمك القياسي، واستمتع باللعب</p>
            
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
                <>Challenge Zone Area Offers <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة التحدي</span></>
              ) : (
                <>Challenge Zone Area Tickets <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة تذاكر</span></>
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

          {/* VIEW A: PACKAGES VIEW (Matching media_1790196506528.png) */}
          {viewType === 'packages' && (
            <div className="desktop-horizontal-pass-container">
              <div className="desktop-horizontal-pass-card">
                {/* Left 4-split composite image */}
                <div className="pass-card-left-img-wrap">
                  <img 
                    src="/photo/kid-area-pic/Graphic Composition.png" 
                    alt="Challenge Pass Games" 
                    className="pass-card-composite-img"
                    onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                  />
                  <div className="pass-card-ribbon-badge">
                    <span>&#9733; CHOOSE ANY 4 GAMES &#9733;</span>
                  </div>
                </div>

                {/* Right Offer Details */}
                <div className="pass-card-right-body">
                  <div className="pass-card-header-row">
                    <div>
                      <h3 className="pass-card-main-title">Challenge Pass</h3>
                      <span className="pass-card-subtitle-cyan">Pick any 4 games</span>
                    </div>
                    <span className="pass-card-save-badge">Save 60 EGP</span>
                  </div>

                  {/* 4 Games Grid with Cyan Icons */}
                  <div className="pass-card-perks-grid">
                    <div className="pass-card-perk-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                        <rect x="2" y="6" width="20" height="12" rx="3" />
                        <path d="M6 12h4M8 10v4M16 11h.01M18 13h.01" />
                      </svg>
                      <span>VR</span>
                    </div>

                    <div className="pass-card-perk-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
                      </svg>
                      <span>Basketball</span>
                    </div>

                    <div className="pass-card-perk-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <span>Shooting</span>
                    </div>

                    <div className="pass-card-perk-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
                      </svg>
                      <span>Car Racing</span>
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
                      onClick={() => handleBooking('Challenge Pass - باقة التحدي (4 ألعاب)', 100, 'Pick any 4 games: VR, Basketball, Shooting, Car Racing')}
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

          {/* VIEW B: TICKETS VIEW (Matching media_1790196521011.png) */}
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
                    {game.badge && (
                      <span className="ticket-game-badge">{game.badge}</span>
                    )}
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

        {/* 3. EXPLORE CHALLENGE ZONE SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">Explore Challenge Zone</h2>
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
