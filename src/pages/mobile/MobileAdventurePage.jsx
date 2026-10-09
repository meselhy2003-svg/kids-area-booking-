import React, { useState, useMemo } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useTickets } from '../../hooks/useTickets';
import { useZoneData } from '../../hooks/useZoneData';
import { usePackages } from '../../hooks/usePackages';
import { useAdventureMedia } from '../../hooks';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';

export default function MobileAdventurePage({ setActiveTab, openModal, lang = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { addToCart } = useData();

  const { gameTickets: adventureTickets } = useTickets('adventure');
  const { filteredAttractions, attractions } = useZoneData('adventure', searchQuery);
  const { currentPackage: adventurePkg } = usePackages('adventure');

  // Adventure Zone Hero & Explore image caching and server synchronization
  const { currentHero, exploreItems } = useAdventureMedia();

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return adventureTickets;
    const q = searchQuery.toLowerCase();
    return adventureTickets.filter(
      item => (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
        (item.titleAr && item.titleAr.includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q))
    );
  }, [adventureTickets, searchQuery]);

  return (
    <div className={`mobile-zone-page adventure-screen ${isArabic ? 'lang-ar' : 'lang-en'}`}>
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
            placeholder={t.common.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Zone Hero Banner: Adventure Zone */}
      <RunningHeroBanner slideIndex={3} heroSlide={currentHero} setActiveTab={setActiveTab} lang={lang} />

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
            <span className="toggle-single-text">{t.zones.packagesTab}</span>
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
            <span className="toggle-single-text">{t.zones.ticketsTab}</span>
          </div>
        </button>
      </div>

      {/* VIEW 1: PACKAGES TAB */}
      {activeSubTab === 'packages' && (
        <div className="challenge-packages-view">
          {/* Section Header */}
          <div className="zone-section-header">
            <div className="section-title-combo">
              <span className="title-part-current">{t.zones.adventure.offersTitle}</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">{t.zones.adventure.ageFilter}</span>
            </div>
          </div>

          {/* Adventure Pass Card */}
          {adventurePkg && (
            <div className="challenge-pass-card adventure-pass-card">
              {/* Left Preview Box */}
              <div
                className="pass-card-left adventure-collage-box"
                onClick={() => {
                  addToCart({
                    id: adventurePkg._id,
                    package: adventurePkg._id,
                    type: 'package',
                    title: adventurePkg.title,
                    titleAr: adventurePkg.title,
                    titleEn: adventurePkg.title,
                    zone: 'adventure',
                    zoneLabel: isArabic ? 'منطقة المغامرات' : 'Adventure Zone',
                    age: 'Ages 6+',
                    inclusions: adventurePkg.description || (Array.isArray(adventurePkg.features) ? adventurePkg.features.join(' • ') : ''),
                    priceEgp: adventurePkg.priceNum,
                    oldPriceEgp: adventurePkg.oldPrice,
                    pointsGets: adventurePkg.pointsGets || 0,
                    thumb: adventurePkg.image || adventurePkg.img || '/photo/kid-area-pic/family-bumper-cars.png',
                    saveBadge: adventurePkg.saveBadge
                  });
                  if (typeof setActiveTab === 'function') {
                    setActiveTab('cart');
                  }
                }}
                role="button"
                tabIndex={0}
                title={isArabic ? 'اضغط لحجز باقة المغامرة' : 'Click to book Adventure Pass'}
              >
                <img
                  src={adventurePkg.image || adventurePkg.img || '/photo/kid-area-pic/family-bumper-cars.png'}
                  alt={adventurePkg.title}
                  className="pass-collage-img"
                />
              </div>

              {/* Right Card Content */}
              <div className="pass-card-right">
                {adventurePkg.saveBadge && <div className="pass-save-badge">{adventurePkg.saveBadge}</div>}
                <h4 className="pass-main-title">{adventurePkg.title}</h4>
                <p className="pass-sub-cyan">{adventurePkg.subtitle}</p>

                {/* Cyan Checklist */}
                <div className="adventure-checklist">
                  {(Array.isArray(adventurePkg.features) && adventurePkg.features.length > 0 ? adventurePkg.features : [
                    isArabic ? 'سيارات التصادم' : 'BUMPER CARS',
                    isArabic ? 'حلبة ببجي' : 'PUBG',
                    isArabic ? 'كرات البامبر الدائرية' : 'Bubble Ball'
                  ]).map((feat, idx) => (
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
                  <span className="pass-price-current">{isArabic ? `${adventurePkg.priceNum} ج.م` : `EGP ${adventurePkg.priceNum}`}</span>
                  {adventurePkg.oldPrice && adventurePkg.oldPrice > adventurePkg.priceNum && (
                    <span className="pass-price-orig">{isArabic ? `${adventurePkg.oldPrice} ج.م` : `EGP ${adventurePkg.oldPrice}`}</span>
                  )}
                </div>

                {/* Get This Offer Button */}
                <button
                  className="get-this-offer-btn"
                  onClick={() => {
                    addToCart({
                      id: adventurePkg._id,
                      package: adventurePkg._id,
                      type: 'package',
                      title: adventurePkg.title,
                      titleAr: adventurePkg.title,
                      titleEn: adventurePkg.title,
                      zone: 'adventure',
                      zoneLabel: isArabic ? 'منطقة المغامرات' : 'Adventure Zone',
                      age: 'Ages 6+',
                      inclusions: adventurePkg.description || (Array.isArray(adventurePkg.features) ? adventurePkg.features.join(' • ') : ''),
                      priceEgp: adventurePkg.priceNum,
                      oldPriceEgp: adventurePkg.oldPrice,
                      pointsGets: adventurePkg.pointsGets || 0,
                      thumb: adventurePkg.image || adventurePkg.img || '/photo/kid-area-pic/family-bumper-cars.png',
                      saveBadge: adventurePkg.saveBadge
                    });
                    if (typeof setActiveTab === 'function') {
                      setActiveTab('cart');
                    }
                  }}
                >
                  <img
                    src="/photo/kid-area-pic/icon/Vector (3).png"
                    alt="ticket"
                    className="btn-ticket-vector-icon"
                  />
                  <span>{t.zones.getThisOffer}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TICKETS TAB */}
      {activeSubTab === 'tickets' && (
        <div className="challenge-tickets-view">
          {/* Section Header */}
          <div className="zone-section-header">
            <div className="section-title-combo">
              <span className="title-part-current">{t.zones.adventure.ticketsTitle}</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">{t.zones.adventure.ageFilter}</span>
              <button
                className="see-all-link"
                onClick={() => openModal('all-offers', { zone: t.zones.adventure.title, offers: adventureTickets })}
              >
                {t.zones.seeAll}
              </button>
            </div>
          </div>

          {/* 2-Column Grid of Adventure Ticket Cards */}
          <div className="game-tickets-grid">
            {filteredTickets.map((game) => {
              const gameTitle = game.title || (isArabic ? game.titleAr : game.titleEn) || game.titleAr || game.titleEn;
              const currentPrice = game.priceAfterDiscount ?? game.priceNum ?? game.price ?? 40;
              const origPrice = (game.price && game.price > currentPrice) ? game.price : (game.oldPrice || game.origPrice);
              const priceDisplay = isArabic ? `${currentPrice} ج.م` : `EGP ${currentPrice}`;
              const origPriceDisplay = origPrice ? (isArabic ? `${origPrice} ج.م` : `EGP ${origPrice}`) : null;

              return (
                <div key={game._id || game.id} className="game-ticket-card">
                  <div className="game-ticket-media">
                    <img
                      src={game.image || game.thumb || game.img || '/photo/kid-area-pic/Laser & Tactical Arena.png'}
                      alt={gameTitle}
                      className="game-ticket-img"
                      onError={(e) => { e.target.src = '/photo/kid-area-pic/Laser & Tactical Arena.png'; }}
                    />
                    {game.saveBadge && (
                      <span className="offer-save-badge">
                        {game.saveBadge}
                      </span>
                    )}
                  </div>

                  <div className="game-ticket-body">
                    <h4 className="game-ticket-title">{gameTitle}</h4>
                    {game.age && (
                      <div className="offer-meta-row" style={{ marginTop: '2px', marginBottom: '4px' }}>
                        <img
                          src="/photo/kid-area-pic/icon/Icon.png"
                          alt="age"
                          className="meta-icon-img"
                        />
                        <span className="meta-text">{game.age}</span>
                      </div>
                    )}
                    {(game.description || (Array.isArray(game.features) && game.features.length > 0)) && (
                      <div className="ticket-desc-text" style={{ fontSize: '0.72rem', color: '#9bb', marginBottom: '6px', lineHeight: 1.3 }}>
                        {game.description || game.features.join(' • ')}
                      </div>
                    )}
                    <div className="game-ticket-price">
                      <span>{priceDisplay}</span>
                      {origPriceDisplay && <span className="price-orig" style={{ marginLeft: 6, textDecoration: 'line-through', opacity: 0.6, fontSize: '0.8em' }}>{origPriceDisplay}</span>}
                    </div>
                    <button
                      className="play-now-btn"
                      onClick={() => {
                        addToCart({
                          id: game._id || game.id,
                          ticket: game._id || game.id,
                          type: 'ticket',
                          title: gameTitle,
                          titleAr: gameTitle,
                          titleEn: gameTitle,
                          zone: 'adventure',
                          zoneLabel: isArabic ? 'منطقة المغامرات' : 'Adventure Zone',
                          age: game.age,
                          inclusions: game.description || game.bundle || (Array.isArray(game.features) ? game.features.join(' • ') : ''),
                          priceEgp: currentPrice,
                          oldPriceEgp: origPrice,
                          thumb: game.image || game.thumb || '/photo/kid-area-pic/Laser & Tactical Arena.png',
                          saveBadge: game.saveBadge || (isArabic ? 'تذكرة مغامرة' : 'Adventure Ticket')
                        });
                        if (typeof setActiveTab === 'function') {
                          setActiveTab('cart');
                        }
                      }}
                    >
                      <img
                        src="/photo/kid-area-pic/icon/Vector (3).png"
                        alt="ticket"
                        className="btn-ticket-vector-icon"
                      />
                      <span>{isArabic ? 'احجز العرض' : 'Book Offer'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explore Adventure Zone Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">{t.zones.adventure.exploreTitle}</h3>
        <button
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: t.zones.adventure.title, attractions })}
        >
          {t.zones.seeAll}
        </button>
      </div>

      {/* 3 Attraction Cards with LazyImage */}
      <div className="explore-attractions-row">
        {(searchQuery ? filteredAttractions : exploreItems).map((attr) => {
          const attrTitle = isArabic ? (attr.titleAr || attr.title) : (attr.titleEn || attr.title);
          return (
            <div
              key={attr.id}
              className="explore-attraction-card"
              onClick={() => openModal('attraction-detail', attr)}
              role="button"
              tabIndex={0}
            >
              <div className="attr-media-wrapper">
                <LazyImage
                  src={attr.img || attr.image || attr.src}
                  alt={attrTitle}
                  className="attr-card-img"
                  fallbackSrc={attr.fallbackImg || attr.fallback || attr.fallbackSrc}
                />
                <div className="attr-overlay-labels">
                  <div className="attr-single-name">{attrTitle}</div>
                </div>
              </div>
            </div>
          );
        })}
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
          <span className="explore-360-text">{t.zones.explore360}</span>
        </button>
      </div>

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
