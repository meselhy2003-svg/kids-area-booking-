import React, { useState, useMemo } from 'react';
import { useChallengeMedia } from '../../hooks';
import { useTickets } from '../../hooks/useTickets';
import { usePackages } from '../../hooks/usePackages';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';

export default function DesktopChallengePage({ setActiveTab, openModal, lang = 'ar', searchQuery }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { addToCart } = useData();

  const {
    heroBanners,
    exploreItems,
    activeSlide,
    setActiveSlide,
    currentHero
  } = useChallengeMedia();
  const [viewType, setViewType] = useState('packages'); // 'packages' | 'tickets'
  const { tickets: serverTickets } = useTickets('challenge');
  const { currentPackage: challengePkg } = usePackages('challenge');

  // Individual ticket attractions
  const ticketGames = [
    {
      id: 'shooting-1',
      title: 'Shooting',
      titleAr: 'الرماية بالليزر',
      priceText: 'EGP 40 / ticket',
      priceTextAr: '٤٠ ج.م / تذكرة',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      badge: null
    },
    {
      id: 'basketball',
      title: 'Basketball',
      titleAr: 'كرة السلة التفاعلية',
      priceText: 'EGP 40 / ticket',
      priceTextAr: '٤٠ ج.م / تذكرة',
      price: 40,
      image: '/photo/kid-area-pic/Air Hockey Table.png',
      fallback: '/photo/kid-area-pic/Fast-Paced Air Hockey.png',
      badge: null
    },
    {
      id: 'boxing-1',
      title: 'Boxing Machine',
      titleAr: 'لعبة قياس قوة اللكمة',
      priceText: 'EGP 40 / ticket',
      priceTextAr: '٤٠ ج.م / تذكرة',
      price: 40,
      image: '/photo/kid-area-pic/Boxing Punch Machine.png',
      fallback: '/photo/kid-area-pic/Boxing Punch Machine (1).png',
      badge: null
    },
    {
      id: 'pingpong',
      title: 'Ping Pong',
      titleAr: 'بينج بونج (تنس طاولة)',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/Table Tennis Ping Pong.png',
      fallback: '/photo/kid-area-pic/Table Tennis Ping Pong.png',
      badge: null
    },
    {
      id: 'ps4-1',
      title: 'PS4',
      titleAr: 'بلايستيشن ٤',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      fallback: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      badge: 'PS4'
    },
    {
      id: 'boxing-2',
      title: 'Boxing Machine',
      titleAr: 'لعبة قياس قوة اللكمة',
      priceText: 'EGP 50 / ticket',
      priceTextAr: '٥٠ ج.م / تذكرة',
      price: 50,
      image: '/photo/kid-area-pic/Boxing Punch Machine (1).png',
      fallback: '/photo/kid-area-pic/Boxing Punch Machine.png',
      badge: null
    },
    {
      id: 'shooting-vr',
      title: 'VR Shooting Arena',
      titleAr: 'رماية الواقع الافتراضي VR',
      priceText: 'EGP 40 / ticket',
      priceTextAr: '٤٠ ج.م / تذكرة',
      price: 40,
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      badge: null
    },
    {
      id: 'airhockey',
      title: 'Air Hockey',
      titleAr: 'هوكي الطاولة المضيء',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/Air Hockey Table (1).png',
      fallback: '/photo/kid-area-pic/Air Hockey Table.png',
      badge: null
    },
    {
      id: 'billiards',
      title: 'Billiards',
      titleAr: 'بلياردو وسنوكر',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/Billiards Pool Table.png',
      fallback: '/photo/kid-area-pic/Billiards Pool Table.png',
      badge: null
    },
    {
      id: 'ps4-2',
      title: 'PS4',
      titleAr: 'بلايستيشن ٤',
      priceText: 'EGP 50 / 30 min',
      priceTextAr: '٥٠ ج.م / ٣٠ دقيقة',
      price: 50,
      image: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      fallback: '/photo/kid-area-pic/PS4 PlayStation Gaming.png',
      badge: 'PS4'
    }
  ];

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    const list = serverTickets && serverTickets.length > 0 ? serverTickets : ticketGames;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(g =>
      (g.title && g.title.toLowerCase().includes(q)) ||
      (g.titleAr && g.titleAr.includes(q)) ||
      (g.priceText && g.priceText.toLowerCase().includes(q))
    );
  }, [serverTickets, searchQuery]);

  const handleBooking = (title, price, details, id, isPackage = false, item = null) => {
    const pkgDoc = isPackage ? (challengePkg || item) : item;
    const finalId = pkgDoc?._id || pkgDoc?.id || id || `challenge-${Date.now()}`;
    const finalPrice = pkgDoc?.priceNum ?? price;
    const finalOldPrice = pkgDoc?.oldPrice ?? (isPackage ? finalPrice : (item?.oldPrice || item?.origPrice));
    const finalTitle = pkgDoc?.title || title;
    const finalThumb = pkgDoc?.image || pkgDoc?.img || item?.image || item?.thumb || (isPackage ? '/photo/kid-area-pic/Graphic Composition.png' : '/photo/kid-area-pic/Laser & Tactical Arena.png');
    const finalBadge = pkgDoc?.saveBadge || (isPackage ? '' : (item?.saveBadge || ''));

    addToCart({
      id: finalId,
      ticket: isPackage ? undefined : finalId,
      package: isPackage ? finalId : undefined,
      type: isPackage ? 'package' : 'ticket',
      title: finalTitle,
      titleAr: finalTitle,
      titleEn: finalTitle,
      zone: 'challenge',
      zoneLabel: isArabic ? 'منطقة التحدي' : 'Challenge Zone',
      age: item?.age || (isPackage ? 'Ages 8+' : 'All Ages'),
      inclusions: details || pkgDoc?.description || pkgDoc?.details || (isArabic ? 'تذكرة دخول كاملة إلى اللعبة' : 'Full access ticket to attraction'),
      priceEgp: finalPrice,
      oldPriceEgp: finalOldPrice > finalPrice ? finalOldPrice : null,
      pointsGets: pkgDoc?.pointsGets || 0,
      thumb: finalThumb,
      saveBadge: finalBadge
    });
    if (typeof setActiveTab === 'function') {
      setActiveTab('cart');
    }
  };

  return (
    <div className={`desktop-page desktop-zone-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      <div className="desktop-page-container">

        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div
          className="desktop-zone-hero-banner challenge-hero-banner"
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
                <h1 className="desktop-zone-hero-title font-alexandria">{currentHero?.titleAr || t.zones.challenge.title}</h1>
                <h2 className="desktop-zone-hero-tagline font-alexandria">{currentHero?.subtitleAr || t.zones.challenge.subtitle}</h2>
              </>
            ) : (
              <>
                <h1 className="desktop-zone-hero-title">{currentHero?.titleEn || t.zones.challenge.title}</h1>
                <h2 className="desktop-zone-hero-tagline">{currentHero?.subtitleEn || t.zones.challenge.subtitle}</h2>
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
              {viewType === 'packages' ? t.zones.challenge.offersTitle : t.zones.challenge.ticketsTitle}
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">{t.zones.challenge.ageFilter}</span>
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
          {viewType === 'packages' && challengePkg && (
            <div className="desktop-horizontal-pass-container">
              <div className="desktop-horizontal-pass-card">
                {/* Left 4-split composite image */}
                <div className="pass-card-left-img-wrap">
                  <img
                    src={challengePkg.image || challengePkg.img || '/photo/kid-area-pic/Graphic Composition.png'}
                    alt={challengePkg.title || (isArabic ? 'باقة ألعاب التحدي' : 'Challenge Pass Games')}
                    className="pass-card-composite-img"
                    onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                  />
                  <div className="pass-card-ribbon-badge">
                    <span>{isArabic ? '★ باقة ألعاب حماسية ★' : '★ EXCITING GAMES PASS ★'}</span>
                  </div>
                </div>

                {/* Right Offer Details */}
                <div className="pass-card-right-body">
                  <div className="pass-card-header-row">
                    <div>
                      <h3 className="pass-card-main-title">{challengePkg.title || (isArabic ? 'باقة التحدي' : 'Challenge Pass')}</h3>
                      <span className="pass-card-subtitle-cyan">{challengePkg.subtitle || (isArabic ? 'اختر أي ٤ ألعاب مفضلة' : 'Pick any 4 games')}</span>
                    </div>
                    {challengePkg.saveBadge && <span className="pass-card-save-badge">{challengePkg.saveBadge}</span>}
                  </div>

                  {/* Challenge Perks Checklist */}
                  <div className="pass-card-checklist">
                    {(Array.isArray(challengePkg.features) && challengePkg.features.length > 0 ? challengePkg.features : [
                      isArabic ? 'حلبة الواقع الافتراضي (VR Arena)' : 'VR Arena Simulator',
                      isArabic ? 'رميات كرة السلة التنافسية' : 'Basketball Shootout',
                      isArabic ? 'الرماية بالليزر والتهديف' : 'Laser Shooting Target',
                      isArabic ? 'سباق محاكاة السيارات' : 'Car Racing Simulator'
                    ]).map((feat, idx) => (
                      <div key={idx} className="pass-check-item">
                        <svg viewBox="0 0 20 20" fill="none" className="pass-check-svg">
                          <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                          <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="pass-check-bold">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action Button */}
                  <div className="pass-card-price-action-row">
                    <div className="pass-price-group">
                      <strong className="pass-current-price">{isArabic ? `${challengePkg.priceNum} ج.م` : `EGP ${challengePkg.priceNum}`}</strong>
                      {challengePkg.oldPrice && challengePkg.oldPrice > challengePkg.priceNum && (
                        <span className="pass-old-price">{isArabic ? `${challengePkg.oldPrice} ج.م` : `EGP ${challengePkg.oldPrice}`}</span>
                      )}
                    </div>

                    <button
                      className="pass-get-offer-btn"
                      onClick={() => handleBooking(
                        challengePkg.title,
                        challengePkg.priceNum,
                        challengePkg.description || (challengePkg.features ? challengePkg.features.join(' • ') : ''),
                        challengePkg._id,
                        true,
                        challengePkg
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
                const gameTitle = game.title || (isArabic ? game.titleAr : game.titleEn) || game.titleAr || game.title;
                const currentPrice = game.priceAfterDiscount ?? game.priceNum ?? game.price ?? 40;
                const origPrice = (game.price && game.price > currentPrice) ? game.price : (game.oldPrice || game.origPrice);
                const priceDisplay = isArabic ? `${currentPrice} ج.م` : `EGP ${currentPrice}`;
                const oldPriceDisplay = (origPrice && origPrice > currentPrice)
                  ? (isArabic ? `${origPrice} ج.م` : `EGP ${origPrice}`)
                  : null;

                return (
                  <div key={game._id || game.id} className="desktop-ticket-game-card">
                    <div className="ticket-game-img-box">
                      <img
                        src={game.image || game.thumb || '/photo/kid-area-pic/game-motorcycle-arcade.png'}
                        alt={gameTitle}
                        className="ticket-game-img"
                        onError={(e) => { e.target.src = game.fallback || '/photo/kid-area-pic/game-motorcycle-arcade.png'; }}
                      />
                      {(game.saveBadge || game.badge) && (
                        <span className="ticket-game-badge">{game.saveBadge || game.badge}</span>
                      )}
                    </div>

                    <div className="ticket-game-info-body">
                      <h4 className="ticket-game-title">{gameTitle}</h4>
                      {game.age && (
                        <div className="desktop-spec-row" style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                          <span>{game.age}</span>
                        </div>
                      )}
                      {(game.description || (Array.isArray(game.features) && game.features.length > 0)) && (
                        <div style={{ fontSize: '0.75rem', color: '#8899a6', marginBottom: '6px', lineHeight: 1.3 }}>
                          {game.description || game.features.join(' • ')}
                        </div>
                      )}
                      <div className="ticket-game-price-label">
                        <span>{priceDisplay}</span>
                        {oldPriceDisplay && <span style={{ marginLeft: 6, textDecoration: 'line-through', opacity: 0.6, fontSize: '0.85em' }}>{oldPriceDisplay}</span>}
                      </div>

                      <button
                        className="ticket-game-play-btn"
                        onClick={() => handleBooking(
                          isArabic ? `تذكرة ${gameTitle}` : `${gameTitle} Ticket`,
                          currentPrice,
                          game.description || game.bundle || (Array.isArray(game.features) ? game.features.join(', ') : ''),
                          game._id || game.id,
                          false,
                          game
                        )}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="play-btn-ticket-icon">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        </svg>
                        <span>{t.zones.getOffer || (isArabic ? 'احجز العرض' : 'Book Offer')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* 3. EXPLORE CHALLENGE ZONE SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">{t.zones.challenge.exploreTitle}</h2>
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
            onClick={() => openModal('360-tour')}
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
