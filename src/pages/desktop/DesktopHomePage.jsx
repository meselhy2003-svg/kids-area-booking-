import React from 'react';
import { useHomeMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function DesktopHomePage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  // Synchronous cache hydration + background revalidation with server replacement
  const { 
    destinationImages 
  } = useHomeMedia();

  const scrollToExperience = () => {
    const el = document.getElementById('choose-experience');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`desktop-page desktop-home-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      {/* 1. HERO SECTION */}
      <section className="desktop-hero-section">
        <div className="desktop-hero-bg">
          <img 
            src="/photo/kid-area-pic/Cinematic Full-Width Backdrop.png" 
            alt="Play Zone Wide View" 
            className="desktop-hero-bg-img"
            onError={(e) => { e.target.src = '/photo/kid-area-pic/cinematic-backdrop.png'; }}
          />
          <div className="desktop-hero-overlay" />
        </div>

        <div className="desktop-hero-content">
          {isArabic ? (
            <h1 className="desktop-hero-title font-alexandria">
              <span className="title-white">العب.</span>{' '}
              <span className="hl-cyan">تحدى.</span>{' '}
              <br />
              <span className="hl-gold">انطلق في المغامرة.</span>
            </h1>
          ) : (
            <h1 className="desktop-hero-title">
              <span className="title-white">PLAY.</span>{' '}
              <span className="title-word">
                <span className="title-white">C</span>
                <span className="hl-cyan">H</span>
                <span className="title-white">A</span>
                <span className="hl-gold">L</span>
                <span className="hl-gold">L</span>
                <span className="title-white">E</span>
                <span className="hl-cyan">N</span>
                <span className="hl-cyan">G</span>
                <span className="hl-gold">E</span>
                <span className="title-white">.</span>
              </span>
              <br />
              <span className="title-word">
                <span className="title-white">A</span>
                <span className="hl-gold">D</span>
                <span className="hl-gold">V</span>
                <span className="hl-gold">E</span>
                <span className="hl-gold">N</span>
                <span className="hl-cyan">T</span>
                <span className="title-white">U</span>
                <span className="title-white">R</span>
                <span className="title-white">E</span>
                <span className="title-white">.</span>
              </span>
            </h1>
          )}
          
          <p className="desktop-hero-subtitle">
            {t.home.heroSub}
          </p>

          <div className="desktop-hero-actions">
            <button 
              className="desktop-hero-btn primary hero-glow-btn"
              onClick={scrollToExperience}
            >
              <span>{t.home.exploreBtn}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="desktop-btn-arrow" style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button 
              className="desktop-hero-btn secondary"
              onClick={() => openModal('video-tour')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-btn-play-icon">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>{t.home.videoBtn}</span>
            </button>
          </div>

          {/* Frosted Glass Stat Badges */}
          <div className="desktop-hero-stats">
            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-teal-dark">
                <img 
                  src="/photo/kid-area-pic/icon/Icon11.png" 
                  alt="4 Zones Icon" 
                  className="desktop-stat-img"
                  onError={(e) => { e.target.src = '/photo/kid-area-pic/icon/stat-zones.png'; }}
                />
              </div>
              <div className="desktop-stat-text">
                <strong>{t.home.stat1Title}</strong>
                <span>{t.home.stat1Desc}</span>
              </div>
            </div>

            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-amber-solid">
                <img 
                  src="/photo/kid-area-pic/icon/Icon (8).png" 
                  alt="50+ Games Icon" 
                  className="desktop-stat-img"
                  onError={(e) => { e.target.src = '/photo/kid-area-pic/icon/stat-games.png'; }}
                />
              </div>
              <div className="desktop-stat-text">
                <strong>{t.home.stat2Title}</strong>
                <span>{t.home.stat2Desc}</span>
              </div>
            </div>

            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-white-solid">
                <img 
                  src="/photo/kid-area-pic/icon/Icon (11)12.png" 
                  alt="Family Fun Icon" 
                  className="desktop-stat-img"
                  onError={(e) => { e.target.src = '/photo/kid-area-pic/icon/stat-family.png'; }}
                />
              </div>
              <div className="desktop-stat-text">
                <strong>{t.home.stat3Title}</strong>
                <span>{t.home.stat3Desc}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR EXPERIENCE SECTION */}
      <section className="desktop-section choose-experience-section" id="choose-experience">
        <div className="desktop-section-container">
          <div className="desktop-section-header">
            <div className="desktop-section-title-wrap" style={isArabic ? { textAlign: 'right' } : {}}>
              <span className="desktop-section-tag" style={isArabic ? { textAlign: 'right' } : {}}>{t.home.chooseTag}</span>
              <h2 className="desktop-section-title" style={isArabic ? { textAlign: 'right' } : {}}>{t.home.chooseTitle}</h2>
              <p className="desktop-section-subtitle" style={isArabic ? { textAlign: 'right' } : {}}>
                {t.home.chooseSub}
              </p>
            </div>
            <div className="desktop-safety-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-safety-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{t.home.safetyPill}</span>
            </div>
          </div>

          {/* 4 ZONE CARDS GRID (2x2) */}
          <div className="desktop-zones-grid">
            {/* 1. KIDS AREA */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Toddler laughing in soft ball pit.png" 
                  alt={t.home.kidsCard.name} 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">{t.home.kidsCard.tag}</span>
                <span className="desktop-zone-age-badge">{t.home.kidsCard.age}</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">{t.home.kidsCard.name}</h3>
                <p className="desktop-zone-quote">{t.home.kidsCard.quote}</p>
                <p className="desktop-zone-desc">
                  {t.home.kidsCard.desc}
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.home.kidsCard.time}
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('kids-area')}
                  >
                    <span>{t.home.kidsCard.btn}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. FUN PARK */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Family bumper car arena.png" 
                  alt={t.home.funParkCard.name} 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">{t.home.funParkCard.tag}</span>
                <span className="desktop-zone-age-badge">{t.home.funParkCard.age}</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">{t.home.funParkCard.name}</h3>
                <p className="desktop-zone-quote">{t.home.funParkCard.quote}</p>
                <p className="desktop-zone-desc">
                  {t.home.funParkCard.desc}
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.home.funParkCard.time}
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('fun-park')}
                  >
                    <span>{t.home.funParkCard.btn}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. CHALLENGE ZONE */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Kid wearing VR headset in neon arcade.png" 
                  alt={t.home.challengeCard.name} 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">{t.home.challengeCard.tag}</span>
                <span className="desktop-zone-age-badge">{t.home.challengeCard.age}</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">{t.home.challengeCard.name}</h3>
                <p className="desktop-zone-quote">{t.home.challengeCard.quote}</p>
                <p className="desktop-zone-desc">
                  {t.home.challengeCard.desc}
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.home.challengeCard.time}
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('challenge')}
                  >
                    <span>{t.home.challengeCard.btn}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. ADVENTURE ZONE */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png" 
                  alt={t.home.adventureCard.name} 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">{t.home.adventureCard.tag}</span>
                <span className="desktop-zone-age-badge">{t.home.adventureCard.age}</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">{t.home.adventureCard.name}</h3>
                <p className="desktop-zone-quote">{t.home.adventureCard.quote}</p>
                <p className="desktop-zone-desc">
                  {t.home.adventureCard.desc}
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.home.adventureCard.time}
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('adventure')}
                  >
                    <span>{t.home.adventureCard.btn}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ONE PLACE. FOUR WAYS TO HAVE FUN. */}
      <section className="desktop-section four-ways-section">
        <div className="desktop-section-container">
          <div className="desktop-center-header">
            <span className="desktop-section-tag">{t.home.destinationTag}</span>
            <h2 className="desktop-section-title">{t.home.destinationTitle}</h2>
            <p className="desktop-section-subtitle">
              {t.home.destinationSub}
            </p>
          </div>

          <div className="desktop-mosaic-grid">
            {/* 1. Left Card: High-Octane Racing */}
            {destinationImages[0] && (
              <div 
                className="mosaic-card left-card" 
                onClick={() => {
                  if (destinationImages[0].targetTab) setActiveTab(destinationImages[0].targetTab);
                  else if (destinationImages[0].targetModal) openModal(destinationImages[0].targetModal);
                  else setActiveTab('challenge');
                }}
                title={isArabic ? (destinationImages[0].titleAr || destinationImages[0].title) : (destinationImages[0].titleEn || destinationImages[0].title)}
                role="button"
                tabIndex={0}
              >
                <img 
                  src={destinationImages[0].src || destinationImages[0].url} 
                  alt={isArabic ? (destinationImages[0].titleAr || destinationImages[0].title) : (destinationImages[0].titleEn || destinationImages[0].title || 'High-Octane Racing')}
                  loading="lazy"
                  onError={(e) => {
                    if (destinationImages[0].fallbackSrc && !e.currentTarget.src.includes(destinationImages[0].fallbackSrc)) {
                      e.currentTarget.src = destinationImages[0].fallbackSrc;
                    }
                  }}
                />
                <div className="mosaic-overlay">
                  <div>
                    <h3>{isArabic ? (destinationImages[0].titleAr || destinationImages[0].title) : (destinationImages[0].titleEn || destinationImages[0].title)}</h3>
                    {(destinationImages[0].subtitle || destinationImages[0].subtitleAr) && (
                      <p style={{ color: '#ffd15c', fontSize: '0.82rem', margin: '4px 0 0', fontWeight: '600' }}>
                        {isArabic ? (destinationImages[0].subtitleAr || destinationImages[0].subtitle) : (destinationImages[0].subtitleEn || destinationImages[0].subtitle)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Center Card: Family Dining Table */}
            {destinationImages[1] && (
              <div 
                className="mosaic-card center-card" 
                onClick={() => {
                  if (destinationImages[1].targetModal) openModal(destinationImages[1].targetModal);
                  else if (destinationImages[1].targetTab) setActiveTab(destinationImages[1].targetTab);
                  else openModal('restaurant-menu');
                }}
                title={isArabic ? (destinationImages[1].titleAr || destinationImages[1].title) : (destinationImages[1].titleEn || destinationImages[1].title)}
                role="button"
                tabIndex={0}
              >
                <img 
                  src={destinationImages[1].src || destinationImages[1].url} 
                  alt={isArabic ? (destinationImages[1].titleAr || destinationImages[1].title) : (destinationImages[1].titleEn || destinationImages[1].title || 'Family Milestones')}
                  loading="lazy"
                  onError={(e) => {
                    if (destinationImages[1].fallbackSrc && !e.currentTarget.src.includes(destinationImages[1].fallbackSrc)) {
                      e.currentTarget.src = destinationImages[1].fallbackSrc;
                    }
                  }}
                />
                <div className="mosaic-overlay">
                  <div>
                    <h3>{isArabic ? (destinationImages[1].titleAr || destinationImages[1].title) : (destinationImages[1].titleEn || destinationImages[1].title)}</h3>
                    {(destinationImages[1].subtitle || destinationImages[1].subtitleAr) && (
                      <p style={{ color: '#ffd15c', fontSize: '0.82rem', margin: '4px 0 0', fontWeight: '600' }}>
                        {isArabic ? (destinationImages[1].subtitleAr || destinationImages[1].subtitle) : (destinationImages[1].subtitleEn || destinationImages[1].subtitle)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Right Column (2 stacked cards: 3 & 4) */}
            <div className="mosaic-right-col">
              {/* 3. Fast-Paced Air Hockey */}
              {destinationImages[2] && (
                <div 
                  className="mosaic-card right-card-top" 
                  onClick={() => {
                    if (destinationImages[2].targetTab) setActiveTab(destinationImages[2].targetTab);
                    else if (destinationImages[2].targetModal) openModal(destinationImages[2].targetModal);
                    else setActiveTab('challenge');
                  }}
                  title={isArabic ? (destinationImages[2].titleAr || destinationImages[2].title) : (destinationImages[2].titleEn || destinationImages[2].title)}
                  role="button"
                  tabIndex={0}
                >
                  <img 
                    src={destinationImages[2].src || destinationImages[2].url} 
                    alt={isArabic ? (destinationImages[2].titleAr || destinationImages[2].title) : (destinationImages[2].titleEn || destinationImages[2].title || 'Fast-Paced Air Hockey')}
                    loading="lazy"
                    onError={(e) => {
                      if (destinationImages[2].fallbackSrc && !e.currentTarget.src.includes(destinationImages[2].fallbackSrc)) {
                        e.currentTarget.src = destinationImages[2].fallbackSrc;
                      }
                    }}
                  />
                  <div className="mosaic-overlay">
                    <div>
                      <h3>{isArabic ? (destinationImages[2].titleAr || destinationImages[2].title) : (destinationImages[2].titleEn || destinationImages[2].title)}</h3>
                      {(destinationImages[2].subtitle || destinationImages[2].subtitleAr) && (
                        <p style={{ color: '#ffd15c', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: '600' }}>
                          {isArabic ? (destinationImages[2].subtitleAr || destinationImages[2].subtitle) : (destinationImages[2].subtitleEn || destinationImages[2].subtitle)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Climbing Walls & High Ropes */}
              {destinationImages[3] && (
                <div 
                  className="mosaic-card right-card-bottom" 
                  onClick={() => {
                    if (destinationImages[3].targetTab) setActiveTab(destinationImages[3].targetTab);
                    else if (destinationImages[3].targetModal) openModal(destinationImages[3].targetModal);
                    else setActiveTab('adventure');
                  }}
                  title={isArabic ? (destinationImages[3].titleAr || destinationImages[3].title) : (destinationImages[3].titleEn || destinationImages[3].title)}
                  role="button"
                  tabIndex={0}
                >
                  <img 
                    src={destinationImages[3].src || destinationImages[3].url} 
                    alt={isArabic ? (destinationImages[3].titleAr || destinationImages[3].title) : (destinationImages[3].titleEn || destinationImages[3].title || 'Climbing Walls')}
                    loading="lazy"
                    onError={(e) => {
                      if (destinationImages[3].fallbackSrc && !e.currentTarget.src.includes(destinationImages[3].fallbackSrc)) {
                        e.currentTarget.src = destinationImages[3].fallbackSrc;
                      }
                    }}
                  />
                  <div className="mosaic-overlay">
                    <div>
                      <h3>{isArabic ? (destinationImages[3].titleAr || destinationImages[3].title) : (destinationImages[3].titleEn || destinationImages[3].title)}</h3>
                      {(destinationImages[3].subtitle || destinationImages[3].subtitleAr) && (
                        <p style={{ color: '#ffd15c', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: '600' }}>
                          {isArabic ? (destinationImages[3].subtitleAr || destinationImages[3].subtitle) : (destinationImages[3].subtitleEn || destinationImages[3].subtitle)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* 5. READY TO PLAY? CTA BANNER */}
      <section className="desktop-cta-section">
        <div className="desktop-section-container">
          <div className="desktop-cta-banner">
            <div className="desktop-cta-content">
              <span className="desktop-cta-tag">{t.home.ctaTag}</span>
              <h2 className="desktop-cta-title">{t.home.ctaTitle}</h2>
              <p className="desktop-cta-desc">
                {t.home.ctaDesc}
              </p>
              
              <button 
                className="desktop-cta-btn"
                onClick={() => setActiveTab('package')}
              >
                <span>{t.home.ctaBtn}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-ticket-icon">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </button>

              <div className="desktop-cta-features-row">
                <span className="desktop-cta-feat-item">
                  <span className="feat-gold-dot">⊙</span>
                  <span>{t.home.feat1}</span>
                </span>
                <span className="feat-sep">•</span>
                <span className="desktop-cta-feat-item">
                  <span className="feat-gold-dot">⊙</span>
                  <span>{t.home.feat2}</span>
                </span>
                <span className="feat-sep">•</span>
                <span className="desktop-cta-feat-item">
                  <span className="feat-gold-dot">⊙</span>
                  <span>{t.home.feat3}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
