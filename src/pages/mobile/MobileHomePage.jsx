import React, { useRef } from 'react';
import { useHomeMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function MobileHomePage({ setActiveTab, openModal, lang = 'ar' }) {
  const chooseSectionRef = useRef(null);
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  // Synchronous cache hydration + background revalidation with server replacement
  const { 
    destinationImages 
  } = useHomeMedia();

  return (
    <div className={`mobile-home-container ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      {/* Hero Section */}
      <section className="mobile-hero-section">
        <div className="hero-text-content">
          {isArabic ? (
            <h1 className="hero-main-title font-alexandria">
              <span style={{ color: '#ffffff' }}>العب. </span>
              <span style={{ color: '#f7a81b' }}>تحدى. </span>
              <span style={{ color: '#00a9c3' }}>انطلق.</span>
            </h1>
          ) : (
            <h1 className="hero-main-title">
              <span className="hero-title-line">
                <span style={{ color: '#ffffff' }}>P</span>
                <span style={{ color: '#00a9c3' }}>L</span>
                <span style={{ color: '#f7a81b' }}>A</span>
                <span style={{ color: '#ffffff' }}>Y. </span>
                <span style={{ color: '#ffffff' }}>C</span>
                <span style={{ color: '#f7a81b' }}>H</span>
                <span style={{ color: '#f7a81b' }}>A</span>
                <span style={{ color: '#ffffff' }}>L</span>
                <span style={{ color: '#ffffff' }}>L</span>
                <span style={{ color: '#f7a81b' }}>E</span>
                <span style={{ color: '#f7a81b' }}>N</span>
                <span style={{ color: '#00a9c3' }}>G</span>
                <span style={{ color: '#00a9c3' }}>E</span>
                <span style={{ color: '#ffffff' }}>.</span>
              </span>
              <br />
              <span className="hero-title-line">
                <span style={{ color: '#f7a81b' }}>A</span>
                <span style={{ color: '#f7a81b' }}>D</span>
                <span style={{ color: '#00a9c3' }}>V</span>
                <span style={{ color: '#00a9c3' }}>E</span>
                <span style={{ color: '#ffffff' }}>N</span>
                <span style={{ color: '#f7a81b' }}>T</span>
                <span style={{ color: '#00a9c3' }}>U</span>
                <span style={{ color: '#ffffff' }}>R</span>
                <span style={{ color: '#f7a81b' }}>E</span>
                <span style={{ color: '#f7a81b' }}>.</span>
              </span>
            </h1>
          )}

          <p className="hero-subtitle-desc">
            {t.home.heroSub}
          </p>

          <button 
            className="hero-primary-cta" 
            onClick={() => {
              const el = document.getElementById('choose-experience');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveTab('package');
              }
            }}
            aria-label={t.home.exploreBtn}
          >
            <span>{t.home.exploreBtn}</span>
            <span className="btn-arrow-sym" style={{ transform: isArabic ? 'scaleX(-1)' : 'none', display: 'inline-block' }}>→</span>
          </button>

          <button 
            className="hero-secondary-cta"
            onClick={() => openModal('virtual-tour')}
            aria-label={t.home.videoBtn}
          >
            <span className="video-play-badge">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffffff">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            </span>
            <span className="video-btn-txt">{t.home.videoBtn}</span>
          </button>

          {/* Thin Divider */}
          <div className="hero-divider-line" />

          {/* 3 Quick Stat Badges */}
          <div className="hero-stats-row">
            <div className="stat-card" style={isArabic ? { textAlign: 'right', alignItems: 'flex-start' } : {}}>
              <div className="stat-icon-wrap stat-icon-teal">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00a9c3" strokeWidth="2.4">
                  <circle cx="7" cy="7" r="3" />
                  <circle cx="17" cy="7" r="3" />
                  <circle cx="7" cy="17" r="3" />
                  <circle cx="17" cy="17" r="3" />
                </svg>
              </div>
              <div className="stat-num" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat1Title}</div>
              <div className="stat-desc" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat1Desc}</div>
            </div>

            <div className="stat-card" style={isArabic ? { textAlign: 'right', alignItems: 'flex-start' } : {}}>
              <div className="stat-icon-wrap stat-icon-yellow">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f7a81b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M7 8V6a2 2 0 0 1 2-2h2" />
                  <path d="M17 8V6a2 2 0 0 0-2-2h-2" />
                  <path d="M7 16v2a2 2 0 0 0 2 2h2" />
                  <path d="M17 16v2a2 2 0 0 1-2 2h-2" />
                </svg>
              </div>
              <div className="stat-num" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat2Title}</div>
              <div className="stat-desc" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat2Desc}</div>
            </div>

            <div className="stat-card" style={isArabic ? { textAlign: 'right', alignItems: 'flex-start' } : {}}>
              <div className="stat-icon-wrap stat-icon-orange">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                  <circle cx="17" cy="9" r="2.2" />
                  <path d="M18 19v-1a3 3 0 0 0-2-2.82" />
                  <path d="M19 4l2 1.5L19 7V4z" fill="#f59e0b" />
                </svg>
              </div>
              <div className="stat-num" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat3Title}</div>
              <div className="stat-desc" style={isArabic ? { textAlign: 'right', width: '100%' } : {}}>{t.home.stat3Desc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR EXPERIENCE Section */}
      <section className="choose-experience-section" ref={chooseSectionRef} id="choose-experience" style={lang === 'ar' ? { textAlign: 'right' } : {}}>
        <div className="section-label-tag" style={lang === 'ar' ? { textAlign: 'right' } : {}}>{t.home.chooseTag}</div>
        <h2 className="section-colorful-heading" style={lang === 'ar' ? { textAlign: 'right' } : {}}>
          {t.home.chooseTitle}
        </h2>
        <p className="section-intro-text" style={lang === 'ar' ? { textAlign: 'right' } : {}}>
          {t.home.chooseSub}
        </p>

        {/* 4 Cards */}
        <div className="experience-cards-list">
          {/* Card 1: Kids Area */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/toddler-soft-ball-pit.png" 
                alt={t.home.kidsCard.name} 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">{t.home.kidsCard.tag}</span>
              <span className="exp-badge-pill pill-right pill-yellow">{t.home.kidsCard.age}</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">{t.home.kidsCard.name}</h3>
              <p className="exp-card-tagline">{t.home.kidsCard.quote}</p>
              <p className="exp-card-desc">
                {t.home.kidsCard.desc}
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('kids-area');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{t.home.kidsCard.btn}</span> &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 2: Fun Park */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/family-bumper-cars.png" 
                alt={t.home.funParkCard.name} 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">{t.home.funParkCard.tag}</span>
              <span className="exp-badge-pill pill-right pill-yellow">{t.home.funParkCard.age}</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">{t.home.funParkCard.name}</h3>
              <p className="exp-card-tagline">{t.home.funParkCard.quote}</p>
              <p className="exp-card-desc">
                {t.home.funParkCard.desc}
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('fun-park');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{t.home.funParkCard.btn}</span> &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 3: Challenge Zone */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/kid-vr-headset.png" 
                alt={t.home.challengeCard.name} 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">{t.home.challengeCard.tag}</span>
              <span className="exp-badge-pill pill-right pill-yellow">{t.home.challengeCard.age}</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">{t.home.challengeCard.name}</h3>
              <p className="exp-card-tagline">{t.home.challengeCard.quote}</p>
              <p className="exp-card-desc">
                {t.home.challengeCard.desc}
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('challenge');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{t.home.challengeCard.btn}</span> &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 4: Adventure Zone */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/high-ropes-course.png" 
                alt={t.home.adventureCard.name} 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">{t.home.adventureCard.tag}</span>
              <span className="exp-badge-pill pill-right pill-yellow">{t.home.adventureCard.age}</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">{t.home.adventureCard.name}</h3>
              <p className="exp-card-tagline">{t.home.adventureCard.quote}</p>
              <p className="exp-card-desc">
                {t.home.adventureCard.desc}
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('adventure');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{t.home.adventureCard.btn}</span> &nbsp; &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ONE PLACE, FOUR WAYS TO HAVE FUN */}
      <section className="four-ways-section">
        <h2 className="four-ways-title">
          {t.home.destinationTitle}
        </h2>
        <p className="four-ways-subtitle">
          {t.home.destinationSub}
        </p>

        <div className="four-ways-grid">
          {destinationImages.slice(0, 4).map((item, idx) => {
            const itemTitle = isArabic ? (item.titleAr || item.title) : (item.titleEn || item.title);
            const itemSubtitle = isArabic ? (item.subtitleAr || item.subtitle) : (item.subtitleEn || item.subtitle);
            return (
              <div 
                key={item.id || idx} 
                className="four-way-tile" 
                onClick={() => {
                  if (item.targetTab) setActiveTab(item.targetTab);
                  else if (item.targetModal) openModal(item.targetModal);
                  else setActiveTab(idx === 1 ? 'adventure' : 'challenge');
                }}
                role="button"
                tabIndex={0}
              >
                <img 
                  src={item.src || item.url} 
                  alt={itemTitle} 
                  className="tile-bg-img"
                  loading="lazy"
                  onError={(e) => {
                    if (item.fallbackSrc && !e.currentTarget.src.includes(item.fallbackSrc)) {
                      e.currentTarget.src = item.fallbackSrc;
                    }
                  }}
                />
                <div className="tile-overlay">
                  <span className="tile-title">{itemTitle}</span>
                  {itemSubtitle && (
                    <span style={{ fontSize: '0.72rem', color: '#ffd15c', opacity: 0.9, marginTop: '2px' }}>
                      {itemSubtitle}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* READY TO PLAY? Card */}
      <section className="ready-to-play-card">
        <div className="ready-card-content">
          <span className="ready-label">{t.home.ctaTag}</span>
          <h2 className="ready-title">
            {t.home.ctaTitle}
          </h2>
          <p className="ready-skip-text" style={{ fontSize: '0.78rem', color: '#bce3ea', marginBottom: '10px' }}>
            {t.home.ctaDesc}
          </p>

          <button 
            className="ready-ticket-btn hero-packages-cta"
            onClick={() => setActiveTab('package')}
            aria-label={t.home.ctaBtn}
          >
            <img 
              src="/photo/kid-area-pic/icon/Vector (3).png" 
              alt="ticket" 
              className="btn-ticket-vector-icon" 
            />
            <span>{t.home.ctaBtn}</span>
          </button>

          <div className="ready-links-list">
            <a 
              href="#packages" 
              onClick={(e) => { e.preventDefault(); setActiveTab('package'); }}
              className="ready-link-item"
            >
              {isArabic ? 'باقات المجموعات وأعياد الميلاد' : 'Group & Birthday Packages'}
            </a>
            <a 
              href="#trips" 
              onClick={(e) => { 
                e.preventDefault(); 
                openModal('info', { 
                  title: isArabic ? 'رحلات المدارس والمجموعات' : 'School Field Trips', 
                  text: isArabic 
                    ? 'أسعار وعروض خاصة للمدارس والحضانات والمجموعات مع إشراف وتجهيز كامل ووجبات طازجة!' 
                    : 'Special discounted group rates for schools, academies, and private groups. Contact us for custom timing and catering!' 
                }); 
              }}
              className="ready-link-item"
            >
              {isArabic ? 'تخطيط رحلات المدارس والحضانات' : 'Plan a School Field Trip'}
            </a>
            <a 
              href="#hours" 
              onClick={(e) => { 
                e.preventDefault(); 
                openModal('info', { 
                  title: isArabic ? 'مواعيد العمل والعنوان' : 'Opening Hours & Location', 
                  text: isArabic 
                    ? 'مفتوح يومياً من ١٠:٠٠ ص حتى ١١:٣٠ م. العنوان: الإسماعيلية - طريق البلاجات على ضفاف القناة.' 
                    : 'Open daily from 10:00 AM to 11:30 PM. Located in Ismailia American Dream Park.' 
                }); 
              }}
              className="ready-link-item"
            >
              {isArabic ? 'مواعيد العمل والعنوان بالتفصيل' : 'Directions & Opening Hours'}
            </a>
          </div>
        </div>
      </section>

      {/* Padding space for floating bottom navigation dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
