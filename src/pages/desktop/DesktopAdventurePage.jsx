import React, { useState } from 'react';
import { useAdventureMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function DesktopAdventurePage({ setActiveTab, openModal, lang = 'ar', searchQuery }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  const {
    heroBanners,
    exploreItems,
    activeSlide,
    setActiveSlide,
    currentHero
  } = useAdventureMedia();
  const [viewType, setViewType] = useState('packages'); // 'packages' | 'tickets'

  // Individual ticket adventure attractions
  const ticketGames = [
    {
      id: 'pubg',
      title: 'PUBG Arena',
      titleAr: 'حلبة ببجي الواقعية',
      priceText: 'EGP 40 / ticket',
      priceTextAr: '٤٠ ج.م / تذكرة',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/photo-vr-friends.png'
    },
    {
      id: 'bamber-ball',
      title: 'Bamber Ball',
      titleAr: 'كرات البامبر الدائرية',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/Air Hockey Table.png',
      fallback: '/photo/kid-area-pic/Fast-Paced Air Hockey.png'
    },
    {
      id: 'car-bamber',
      title: 'Car Bamber',
      titleAr: 'سيارات التصادم الحديثة',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/Billiards Pool Table.png',
      fallback: '/photo/kid-area-pic/Bumper Collision Bay.png'
    }
  ];

  // Filter games based on search query
  const filteredGames = ticketGames.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.title.toLowerCase().includes(q) || g.titleAr.includes(q) || g.priceText.toLowerCase().includes(q);
  });

  const handleBooking = (title, price, details) => {
    const curr = isArabic ? 'ج.م' : 'EGP';
    openModal('booking', {
      name: title,
      price: `${price} ${curr}`,
      priceNum: price,
      discount: isArabic ? 'حجز مباشر' : 'Direct Booking',
      details: details || (isArabic ? 'تذكرة دخول كاملة إلى لعبة المغامرة' : 'Full access adventure ticket')
    });
  };

  return (
    <div className={`desktop-page desktop-zone-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div 
          className="desktop-zone-hero-banner adventure-hero-banner"
          style={{
            backgroundImage: (currentHero?.image || currentHero?.src)
              ? `url("${currentHero.image || currentHero.src}")`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.4s ease-in-out'
          }}
        >
          <div className="desktop-zone-hero-left">
            {isArabic ? (
              <>
                <h1 className="desktop-zone-hero-title font-alexandria">{currentHero?.titleAr || t.zones.adventure.title}</h1>
                <h2 className="desktop-zone-hero-tagline font-alexandria">{currentHero?.subtitleAr || t.zones.adventure.subtitle}</h2>
              </>
            ) : (
              <>
                <h1 className="desktop-zone-hero-title">{currentHero?.titleEn || t.zones.adventure.title}</h1>
                <h2 className="desktop-zone-hero-tagline">{currentHero?.subtitleEn || t.zones.adventure.subtitle}</h2>
              </>
            )}
            
            {/* Carousel Dots */}
            <div className="desktop-zone-hero-dots">
              {heroBanners.map((_, i) => (
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
            <span>{t.zones.badge.play}</span>
            <span>{t.zones.badge.explore}</span>
            <span>{t.zones.badge.learn}</span>
            <span>{t.zones.badge.together}</span>
          </div>
        </div>

        {/* 2. SECTION HEADER & TOGGLE */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              {viewType === 'packages' ? t.zones.adventure.offersTitle : t.zones.adventure.ticketsTitle}
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">{t.zones.adventure.ageFilter}</span>
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
                  <span className="tab-current">{t.zones.packagesTab}</span>
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
                  <span className="tab-current">{t.zones.ticketsTab}</span>
                </div>
              </button>
            </div>
          </div>

          {/* VIEW A: PACKAGES VIEW */}
          {viewType === 'packages' && (
            <div className="desktop-horizontal-pass-container">
              <div className="desktop-horizontal-pass-card">
                {/* Left 4-split composite image */}
                <div className="pass-card-left-img-wrap">
                  <img 
                    src="/photo/kid-area-pic/Graphic Composition.png" 
                    alt={isArabic ? 'باقة ألعاب المغامرة' : 'Adventure Pass Games'} 
                    className="pass-card-composite-img"
                    onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                  />
                  <div className="pass-card-ribbon-badge">
                    <span>{isArabic ? '★ باقة المغامرة الشاملة ★' : '★ ALL-INCLUSIVE ADVENTURE ★'}</span>
                  </div>
                </div>

                {/* Right Offer Details */}
                <div className="pass-card-right-body">
                  <div className="pass-card-header-row">
                    <div>
                      <h3 className="pass-card-main-title">{isArabic ? 'باقة المغامرة' : 'Adventure Pass'}</h3>
                      <span className="pass-card-subtitle-cyan">{isArabic ? 'تجربة شاملة لجميع الألعاب' : 'All Game Experience'}</span>
                    </div>
                    <span className="pass-card-save-badge">{isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP'}</span>
                  </div>

                  {/* Adventure Perks Checklist */}
                  <div className="pass-card-checklist">
                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">{isArabic ? 'سيارات التصادم' : 'BUMPER CARS'}</span>
                    </div>

                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">{isArabic ? 'حلبة ببجي' : 'PUBG'}</span>
                    </div>

                    <div className="pass-check-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="pass-check-bold">{isArabic ? 'كرات البامبر الدائرية' : 'Bubble Ball'}</span>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pass-card-price-action-row">
                    <div className="pass-price-group">
                      <strong className="pass-current-price">{isArabic ? '١٠٠ ج.م' : 'EGP 100'}</strong>
                      <span className="pass-old-price">{isArabic ? '١٦٠ ج.م' : 'EGP 160'}</span>
                    </div>

                    <button 
                      className="pass-get-offer-btn"
                      onClick={() => handleBooking(
                        isArabic ? 'باقة المغامرة الشاملة' : 'Adventure Pass', 
                        100, 
                        isArabic ? 'تجربة شاملة: سيارات التصادم، حلبة ببجي، كرات البامبر' : 'All Game Experience: Bumper Cars, PUBG, Bubble Ball'
                      )}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-ticket-icon">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      </svg>
                      <span>{t.zones.getThisOffer}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: TICKETS VIEW */}
          {viewType === 'tickets' && (
            <div className="desktop-ticket-games-grid">
              {filteredGames.map((game) => {
                const gameTitle = isArabic ? game.titleAr : game.title;
                const priceLabel = isArabic ? game.priceTextAr : game.priceText;

                return (
                  <div key={game.id} className="desktop-ticket-game-card">
                    <div className="ticket-game-img-box">
                      <img 
                        src={game.image} 
                        alt={gameTitle} 
                        className="ticket-game-img"
                        onError={(e) => { e.target.src = game.fallback; }}
                      />
                    </div>

                    <div className="ticket-game-info-body">
                      <h4 className="ticket-game-title">{gameTitle}</h4>
                      <span className="ticket-game-price-label">{priceLabel}</span>

                      <button 
                        className="ticket-game-play-btn"
                        onClick={() => handleBooking(
                          isArabic ? `تذكرة ${gameTitle}` : `${game.title} Ticket`, 
                          game.price, 
                          priceLabel
                        )}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="play-btn-ticket-icon">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        </svg>
                        <span>{t.zones.playNow}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* 3. EXPLORE ADVENTURE ZONE SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">{t.zones.adventure.exploreTitle}</h2>
            <button 
              className="desktop-see-all-link"
              onClick={() => openModal('gallery')}
            >
              {t.zones.seeAll}
            </button>
          </div>

          {/* 3 FEATURE CARDS */}
          <div className="desktop-explore-grid-3">
            {exploreItems.map((item) => {
              const itemTitle = isArabic ? (item.titleAr || item.title) : (item.titleEn || item.title);
              return (
                <div 
                  key={item.id} 
                  className="desktop-explore-card"
                  onClick={() => openModal('attraction-detail', {
                    title: itemTitle,
                    titleEn: item.titleEn || item.title,
                    titleAr: item.titleAr,
                    desc: isArabic ? (item.descAr || item.desc) : item.desc,
                    img: item.image || item.src || item.img
                  })}
                  role="button"
                  tabIndex={0}
                >
                  <img 
                    src={item.image || item.src || item.img || item.url} 
                    alt={itemTitle} 
                    className="desktop-explore-img"
                    loading="lazy"
                    onError={(e) => { 
                      const fb = item.fallback || item.fallbackSrc || item.fallbackImg;
                      if (fb && !e.currentTarget.src.includes(fb)) {
                        e.currentTarget.src = fb;
                      }
                    }}
                  />
                  <div className="desktop-explore-overlay">
                    <h3 className="desktop-explore-title">{itemTitle}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. EXPLORE 360° CENTER BUTTON */}
        <div className="desktop-360-btn-wrap">
          <button 
            className="desktop-360-pill-btn"
            onClick={() => openModal('virtual-tour')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-360-icon">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>{t.zones.explore360}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
