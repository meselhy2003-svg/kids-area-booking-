import React, { useState, useMemo } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useTickets } from '../../hooks/useTickets';
import { useZoneData } from '../../hooks/useZoneData';
import { useChallengeMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function MobileChallengePage({ setActiveTab, openModal, lang = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'tickets'
  const [gamePickerOpen, setGamePickerOpen] = useState(false);
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  const defaultSelected = isArabic
    ? ['واقع افتراضي VR', 'كرة السلة', 'الرماية بالليزر', 'سباق السيارات']
    : ['VR', 'Basketball', 'Shooting', 'Car Racing'];
  const [selectedGames, setSelectedGames] = useState(defaultSelected);

  const { gameTickets } = useTickets('challenge');
  const { filteredAttractions, attractions } = useZoneData('challenge', searchQuery);

  // Challenge Zone Hero & Explore image caching and server synchronization
  const { currentHero, exploreItems } = useChallengeMedia();

  const allAvailableGames = [
    { id: 'vr', name: isArabic ? 'واقع افتراضي VR' : 'VR Arena Simulator', icon: '🎮' },
    { id: 'basketball', name: isArabic ? 'كرة السلة التفاعلية' : 'Basketball Shootout', icon: '🏀' },
    { id: 'shooting', name: isArabic ? 'الرماية بالليزر' : 'Laser Shooting Gallery', icon: '🎯' },
    { id: 'racing', name: isArabic ? 'سباق السيارات' : 'Car Racing Simulator', icon: '🏎️' },
    { id: 'airhockey', name: isArabic ? 'هوكي الطاولة المضيء' : 'Air Hockey Battle', icon: '🏒' },
    { id: 'ps4', name: isArabic ? 'صالة بلايستيشن ٤' : 'PS4 Lounge Station', icon: '🕹️' },
    { id: 'boxing', name: isArabic ? 'لعبة قياس قوة اللكمة' : 'Boxing Power Test', icon: '🥊' },
    { id: 'pingpong', name: isArabic ? 'تنس طاولة (بينج بونج)' : 'Ping Pong Challenge', icon: '🏓' }
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

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return gameTickets;
    const q = searchQuery.toLowerCase();
    return gameTickets.filter(
      item => (item.titleEn && item.titleEn.toLowerCase().includes(q)) || 
              (item.titleAr && item.titleAr.includes(q))
    );
  }, [gameTickets, searchQuery]);

  return (
    <div className={`mobile-zone-page challenge-screen ${isArabic ? 'lang-ar' : 'lang-en'}`}>
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

      {/* Zone Hero Banner: Challenge Zone */}
      <RunningHeroBanner slideIndex={2} heroSlide={currentHero} setActiveTab={setActiveTab} lang={lang} />

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
              <span className="title-part-current">{t.zones.challenge.offersTitle}</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">{t.zones.challenge.ageFilter}</span>
            </div>
          </div>

          {/* Large Horizontal Offer Card */}
          <div className="challenge-pass-card">
            {/* Left Preview Box */}
            <div 
              className="pass-card-left"
              onClick={() => setGamePickerOpen(true)}
              role="button"
              tabIndex={0}
              title={isArabic ? 'اضغط لتخصيص الألعاب الـ ٤' : 'Click to customize your 4 games'}
            >
              <img 
                src="/photo/mobile-challenge/offer-collage.png" 
                alt="Choose Any 4 Games" 
                className="pass-collage-img" 
              />
              <div className="pass-save-badge">{isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP'}</div>
            </div>

            {/* Right Card Content */}
            <div className="pass-card-right">
              <h4 className="pass-main-title">{isArabic ? 'باقة التحدي' : 'Challenge Pass'}</h4>
              <p className="pass-sub-cyan">{isArabic ? 'اختر أي ٤ ألعاب' : 'Pick any 4 games'}</p>

              {/* 2x2 Perks Grid */}
              <div className="pass-perks-grid">
                <div className="perk-item">
                  <span className="perk-icon">🎮</span>
                  <span className="perk-name">{selectedGames[0] || (isArabic ? 'واقع افتراضي' : 'VR')}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🏀</span>
                  <span className="perk-name">{selectedGames[1] || (isArabic ? 'كرة السلة' : 'Basketball')}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🎯</span>
                  <span className="perk-name">{selectedGames[2] || (isArabic ? 'الرماية' : 'Shooting')}</span>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🏎️</span>
                  <span className="perk-name">{selectedGames[3] || (isArabic ? 'سباق سيارات' : 'Car Racing')}</span>
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
                  name: isArabic ? `باقة التحدي (${selectedGames.join(', ')})` : `Challenge Pass (${selectedGames.join(', ')})`,
                  price: isArabic ? '١٠٠ ج.م' : 'EGP 100',
                  priceNum: 100,
                  discount: isArabic ? 'وفر ٦٠ ج.م' : 'Save 60 EGP',
                  details: isArabic ? `تشمل الألعاب الـ ٤ المختارة: ${selectedGames.join(', ')}` : `Includes selected 4 games: ${selectedGames.join(', ')}`
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
              <span className="title-part-current">{t.zones.challenge.ticketsTitle}</span>
            </div>
            <div className="section-header-actions">
              <span className="age-pill-badge">{t.zones.challenge.ageFilter}</span>
              <button 
                className="see-all-link"
                onClick={() => openModal('all-offers', { zone: t.zones.challenge.title, offers: gameTickets })}
              >
                {t.zones.seeAll}
              </button>
            </div>
          </div>

          {/* 2-Column Grid of Individual Game Cards */}
          <div className="game-tickets-grid">
            {filteredTickets.map((game) => {
              const gameTitle = isArabic ? (game.titleAr || game.titleEn) : (game.titleEn || game.titleAr);
              const priceDisplay = isArabic 
                ? (game.priceAr || `${game.priceNum || 40} ج.م`) 
                : (game.price || `EGP ${game.priceNum || 40}`);

              return (
                <div key={game.id} className="game-ticket-card">
                  <div className="game-ticket-media">
                    <img src={game.img} alt={gameTitle} className="game-ticket-img" />
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
                    <h4 className="game-ticket-title">{gameTitle}</h4>
                    <div className="game-ticket-price">{priceDisplay}</div>
                    <button 
                      className="play-now-btn"
                      onClick={() => openModal('booking', {
                        name: gameTitle,
                        price: priceDisplay,
                        priceNum: game.priceNum,
                        discount: isArabic ? 'دخول مباشر' : 'Quick Pass',
                        details: isArabic ? `دخول فوري لمحطة ${gameTitle}` : `Instant access to ${gameTitle} station`
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

      {/* Explore Challenge Zone Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">{t.zones.challenge.exploreTitle}</h3>
        {((searchQuery ? filteredAttractions : exploreItems)?.length > 3) && (
          <button 
            className="see-all-link"
            onClick={() => openModal('all-attractions', { zone: t.zones.challenge.title, attractions })}
          >
            {t.zones.seeAll}
          </button>
        )}
      </div>

      {/* 3 Attraction Cards with LazyImage */}
      <div className="explore-attractions-row">
        {(searchQuery ? filteredAttractions : exploreItems).slice(0, 3).map((attr) => {
          const attrTitle = isArabic ? (attr.titleAr || attr.title) : (attr.titleEn || attr.title);
          const imgSrc = attr.img || attr.image || attr.src;
          const fallbackImg = attr.fallbackImg || attr.fallback || attr.fallbackSrc;
          return (
            <div 
              key={attr.id} 
              className="explore-attraction-card"
              onClick={() => openModal('image-only', {
                img: imgSrc,
                fallbackImg: fallbackImg,
                title: attrTitle
              })}
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

      {/* Interactive Choose 4 Games Modal */}
      {gamePickerOpen && (
        <div className="mobile-modal-backdrop" onClick={() => setGamePickerOpen(false)}>
          <div className="mobile-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <button className="sheet-close-x" onClick={() => setGamePickerOpen(false)}>✕</button>
            <h3 className="booking-title">{isArabic ? 'اختر ٤ ألعاب للباقة' : 'Choose Your 4 Games'}</h3>
            <p className="booking-details-text">
              {isArabic 
                ? `حدد أي ٤ ألعاب لباقة التحدي (${selectedGames.length}/4 تم اختيارها):`
                : `Select any 4 arcade & VR games for your Challenge Pass (${selectedGames.length}/4 selected):`}
            </p>

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
              {isArabic ? `تأكيد الـ ٤ ألعاب (${selectedGames.length}/4)` : `Confirm 4 Games (${selectedGames.length}/4)`}
            </button>
          </div>
        </div>
      )}

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
