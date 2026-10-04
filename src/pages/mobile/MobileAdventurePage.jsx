import React, { useState, useMemo } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useTickets } from '../../hooks/useTickets';
import { useZoneData } from '../../hooks/useZoneData';
import { useAdventureMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function MobileAdventurePage({ setActiveTab, openModal, lang = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  const { gameTickets: adventureTickets } = useTickets('adventure');
  const { filteredAttractions, attractions } = useZoneData('adventure', searchQuery);

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
          <div className="challenge-pass-card adventure-pass-card">
            {/* Left Preview Box */}
            <div 
              className="pass-card-left adventure-collage-box"
              onClick={() => openModal('booking', {
                name: isArabic ? 'باقة المغامرة الشاملة' : 'Adventure Pass',
                price: isArabic ? '١٠٠ ج.م' : 'EGP 100',
                priceNum: 100,
                discount: isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP',
                details: isArabic ? 'تجربة شاملة: سيارات التصادم، حلبة ببجي، كرات البامبر' : 'All Game Experience: BUMPER CARS, PUBG, and Bubble Ball'
              })}
              role="button"
              tabIndex={0}
              title={isArabic ? 'اضغط لحجز باقة المغامرة' : 'Click to book Adventure Pass'}
            >
              <img 
                src="/photo/kid-area-pic/family-bumper-cars.png" 
                alt="Adventure Pass" 
                className="pass-collage-img" 
              />
            </div>

            {/* Right Card Content */}
            <div className="pass-card-right">
              <div className="pass-save-badge">{isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP'}</div>
              <h4 className="pass-main-title">{isArabic ? 'باقة المغامرة' : 'Adventure Pass'}</h4>
              <p className="pass-sub-cyan">{isArabic ? 'تجربة شاملة لجميع الألعاب' : 'All Game Experience'}</p>

              {/* Cyan Checklist */}
              <div className="adventure-checklist">
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">{isArabic ? 'سيارات التصادم' : 'BUMPER CARS'}</span>
                </div>
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">{isArabic ? 'حلبة ببجي' : 'PUBG'}</span>
                </div>
                <div className="adventure-check-item">
                  <svg className="cyan-check-svg" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                    <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="check-item-text">{isArabic ? 'كرات البامبر الدائرية' : 'Bubble Ball'}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pass-price-row">
                <span className="pass-price-current">{isArabic ? '١٠٠ ج.م' : 'EGP 100'}</span>
                <span className="pass-price-orig">{isArabic ? '١٦٠ ج.م' : 'EGP 160'}</span>
              </div>

              {/* Get This Offer Button */}
              <button 
                className="get-this-offer-btn"
                onClick={() => openModal('booking', {
                  name: isArabic ? 'باقة المغامرة الشاملة' : 'Adventure Pass',
                  price: isArabic ? '١٠٠ ج.م' : 'EGP 100',
                  priceNum: 100,
                  discount: isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP',
                  details: isArabic ? 'تجربة شاملة: سيارات التصادم، حلبة ببجي، كرات البامبر' : 'All Game Experience: BUMPER CARS, PUBG, Bubble Ball'
                })}
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
              const gameTitle = isArabic ? (game.titleAr || game.titleEn || game.title) : (game.titleEn || game.title);
              const priceDisplay = isArabic 
                ? (game.priceAr || `${game.priceNum || 40} ج.م`) 
                : (game.priceText || `${game.price} EGP`);

              return (
                <div key={game.id} className="game-ticket-card">
                  <div className="game-ticket-media">
                    <img src={game.img || game.image} alt={gameTitle} className="game-ticket-img" />
                  </div>

                  <div className="game-ticket-body">
                    <h4 className="game-ticket-title">{gameTitle}</h4>
                    <div className="game-ticket-price">{priceDisplay}</div>
                    <button 
                      className="play-now-btn"
                      onClick={() => openModal('booking', {
                        name: gameTitle,
                        price: priceDisplay,
                        priceNum: game.priceNum || game.price,
                        discount: isArabic ? 'تذكرة مغامرة' : 'Adventure Ticket',
                        details: isArabic ? `تذكرة دخول فردية إلى ${gameTitle}` : `Single entry ticket to ${gameTitle}`
                      })}
                    >
                      <img 
                        src="/photo/kid-area-pic/icon/Vector (3).png" 
                        alt="ticket" 
                        className="btn-ticket-vector-icon" 
                      />
                      <span>{t.zones.playNow}</span>
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
