import React, { useState } from 'react';
import { getTranslations } from '../../data/translations';

export default function DesktopPackagePage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('adventure'); // 'adventure' | 'challenge' | 'mid-week' | 'weekend'

  const packageOffers = {
    adventure: {
      id: 'adventure-pass',
      title: 'Adventure Pass',
      titleAr: 'باقة المغامرة',
      subtitle: 'All Game Experience',
      subtitleAr: 'تجربة شاملة لجميع ألعاب المغامرة',
      saveBadge: 'Save 60 EGP',
      saveBadgeAr: 'وفر ٦٠ ج.م',
      type: 'checklist',
      perks: ['BUMPER CARS', 'PUBG', 'Bubble Ball'],
      perksAr: ['سيارات التصادم الحديثة', 'حلبة ببجي الواقعية', 'كرات البامبر الدائرية'],
      price: 100,
      oldPrice: 160
    },
    challenge: {
      id: 'challenge-pass',
      title: 'Challenge Pass',
      titleAr: 'باقة التحدي',
      subtitle: 'Pick any 4 games',
      subtitleAr: 'اختر أي ٤ ألعاب مفضلة',
      saveBadge: 'Save 60 EGP',
      saveBadgeAr: 'وفر ٦٠ ج.م',
      type: 'grid',
      perks: [
        { label: 'VR', labelAr: 'واقع افتراضي VR', icon: 'vr' },
        { label: 'Basketball', labelAr: 'كرة السلة التفاعلية', icon: 'ball' },
        { label: 'Shooting', labelAr: 'الرماية بالليزر', icon: 'target' },
        { label: 'Car Racing', labelAr: 'سباق السيارات', icon: 'wheel' }
      ],
      price: 100,
      oldPrice: 160
    },
    'mid-week': {
      id: 'midweek-pass',
      title: 'Mid-Week Super Saver',
      titleAr: 'سوبر توفير منتصف الأسبوع',
      subtitle: 'All Day Fun Experience',
      subtitleAr: 'يوم كامل من اللعب والمرح طوال الأسبوع',
      saveBadge: 'Save 85 EGP',
      saveBadgeAr: 'وفر ٨٥ ج.م',
      type: 'checklist',
      perks: ['All-Day Access to All Zones', '1 VR Simulation Session Included', 'Free Grip Socks at Reception'],
      perksAr: ['دخول مفتوح طوال اليوم لكل المناطق', 'جلسة واقع افتراضي VR مجاناً', 'جوارب مضادة للانزلاق هدية عند الاستقبال'],
      price: 120,
      oldPrice: 205
    },
    weekend: {
      id: 'weekend-pass',
      title: 'Weekend Ultimate Pass',
      titleAr: 'باقة عطلة نهاية الأسبوع الملكية',
      subtitle: 'Peak Energy & Mascot Shows',
      subtitleAr: 'أقوى أجواء الويكند وعروض الشخصيات الكرتونية',
      saveBadge: 'Save 120 EGP',
      saveBadgeAr: 'وفر ١٢٠ ج.م',
      type: 'checklist',
      perks: ['Entry for 2 Adults + 2 Kids', '4 Arcade Tokens + 2 VR Sessions', 'Free Mascot & Bubble Show Access'],
      perksAr: ['دخول عائلي لفردين بالغين + طفلين', '٤ عملات آركيد + جلستين VR', 'حضور عروض الشخصيات وفقاعات الصابون مجاناً'],
      price: 250,
      oldPrice: 370
    }
  };

  const currentPkg = packageOffers[selectedCategory] || packageOffers.adventure;
  const currentTitle = isArabic ? currentPkg.titleAr : currentPkg.title;
  const currentSubtitle = isArabic ? currentPkg.subtitleAr : currentPkg.subtitle;
  const currentBadge = isArabic ? currentPkg.saveBadgeAr : currentPkg.saveBadge;
  const priceDisplay = isArabic ? `${currentPkg.price} ج.م` : `EGP ${currentPkg.price}`;
  const oldPriceDisplay = isArabic ? `${currentPkg.oldPrice} ج.م` : `EGP ${currentPkg.oldPrice}`;

  const handleBooking = (pkg) => {
    const pkgTitle = isArabic ? pkg.titleAr : pkg.title;
    const curr = isArabic ? 'ج.م' : 'EGP';
    openModal('booking', {
      name: pkgTitle,
      price: `${pkg.price} ${curr}`,
      priceNum: pkg.price,
      discount: isArabic ? pkg.saveBadgeAr : pkg.saveBadge,
      details: isArabic ? pkg.subtitleAr : pkg.subtitle
    });
  };

  return (
    <div className={`desktop-page desktop-packages-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      
      {/* 1. TOP HERO SECTION */}
      <section className="desktop-pkg-hero-section">
        <div className="desktop-page-container">
          <div className="desktop-pkg-hero-grid">
            {/* Left Column: Typography */}
            <div className="desktop-pkg-hero-left">
              <h1 className="desktop-pkg-hero-title">
                {t.zones.packages.heroTitle}
              </h1>
              <h2 className="desktop-pkg-hero-subtitle">
                {t.zones.packages.heroSub}
              </h2>
              <p className="desktop-pkg-hero-desc">
                {t.zones.packages.heroDesc}
              </p>
            </div>

            {/* Right Column: 3-panel selfie card */}
            <div className="desktop-pkg-hero-right">
              <div className="desktop-pkg-hero-img-card">
                <img 
                  src="/photo/kid-area-pic/packages-hero-trio.png" 
                  alt={currentTitle} 
                  className="desktop-pkg-hero-img"
                  onError={(e) => { e.target.src = '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELECT YOUR DREAM EXPERIENCE */}
      <section className="desktop-pkg-experience-section">
        <div className="desktop-page-container">
          
          {/* Header Row */}
          <div className="desktop-pkg-header-row">
            <div className="desktop-pkg-header-left">
              <span className="desktop-pkg-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pkg-tag-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <rect x="7" y="7" width="3" height="3" fill="currentColor" />
                </svg>
                {t.zones.packages.dreamTag}
              </span>
              <h2 className="desktop-pkg-main-heading">
                {t.zones.packages.dreamTitle}
              </h2>
            </div>

            <div className="desktop-pkg-header-right">
              <p className="desktop-pkg-subtext">
                {t.zones.packages.dreamSub}
              </p>
            </div>
          </div>

          {/* Filter Tabs Row */}
          <div className="desktop-pkg-tabs-row">
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'adventure' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('adventure')}
            >
              {t.zones.packages.tabs.adventure}
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'challenge' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('challenge')}
            >
              {t.zones.packages.tabs.challenge}
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'mid-week' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('mid-week')}
            >
              {t.zones.packages.tabs.midWeek}
            </button>
            <button 
              className={`desktop-pkg-tab-btn ${selectedCategory === 'weekend' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('weekend')}
            >
              {t.zones.packages.tabs.weekend}
            </button>
          </div>

          {/* The Selected Package Offer Card */}
          <div className="desktop-horizontal-pass-container">
            <div className="desktop-horizontal-pass-card">
              {/* Left 4-split composite photo */}
              <div className="pass-card-left-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Graphic Composition.png" 
                  alt={currentTitle} 
                  className="pass-card-composite-img"
                  onError={(e) => { e.target.src = '/photo/mobile-challenge/offer-collage.png'; }}
                />
              </div>

              {/* Right Offer Details */}
              <div className="pass-card-right-body">
                <div className="pass-card-header-row">
                  <div>
                    <h3 className="pass-card-main-title">{currentTitle}</h3>
                    <span className="pass-card-subtitle-cyan">{currentSubtitle}</span>
                  </div>
                  <span className="pass-card-save-badge">{currentBadge}</span>
                </div>

                {/* Checklist Type (Adventure, Mid-Week, Weekend) */}
                {currentPkg.type === 'checklist' && (
                  <div className="pass-card-checklist">
                    {(isArabic ? currentPkg.perksAr : currentPkg.perks).map((item, idx) => (
                      <div key={idx} className="pass-check-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pass-check-svg">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="16 9 11 14 8 11" />
                        </svg>
                        <span className="pass-check-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid Type (Challenge) */}
                {currentPkg.type === 'grid' && (
                  <div className="pass-card-perks-grid">
                    {currentPkg.perks.map((p, idx) => (
                      <div key={idx} className="pass-card-perk-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pass-perk-icon">
                          {p.icon === 'vr' && <rect x="2" y="6" width="20" height="12" rx="3" />}
                          {p.icon === 'ball' && <circle cx="12" cy="12" r="10" />}
                          {p.icon === 'target' && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /></>}
                          {p.icon === 'wheel' && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></>}
                        </svg>
                        <span>{isArabic ? p.labelAr : p.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & Action Button */}
                <div className="pass-card-price-action-row">
                  <div className="pass-price-group">
                    <strong className="pass-current-price">{priceDisplay}</strong>
                    <span className="pass-old-price">{oldPriceDisplay}</span>
                  </div>

                  <button 
                    className="pass-get-offer-btn"
                    onClick={() => handleBooking(currentPkg)}
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

        </div>
      </section>

    </div>
  );
}
