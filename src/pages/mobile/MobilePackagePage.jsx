import React from 'react';
import { usePackages } from '../../hooks/usePackages';
import { getTranslations } from '../../data/translations';

export default function MobilePackagePage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  const { 
    activeCategory, 
    setActiveCategory, 
    currentPackage: currentPkg 
  } = usePackages('adventure');

  const pkgTitle = isArabic ? (currentPkg.titleAr || currentPkg.title) : currentPkg.title;
  const pkgSubtitle = isArabic ? (currentPkg.subtitleAr || currentPkg.subtitle) : currentPkg.subtitle;
  const pkgSaveBadge = isArabic ? (currentPkg.saveBadgeAr || currentPkg.saveBadge) : currentPkg.saveBadge;
  const priceDisplay = isArabic ? `${currentPkg.priceNum || 100} ج.م` : (currentPkg.price || 'EGP 100');
  const origPriceDisplay = currentPkg.origPrice 
    ? (isArabic ? `${currentPkg.origPrice} ج.م` : currentPkg.origPrice) 
    : null;
  const featuresList = isArabic ? (currentPkg.featuresAr || currentPkg.features) : currentPkg.features;

  return (
    <div 
      className={`mobile-zone-page package-page-container ${isArabic ? 'lang-ar' : 'lang-en'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Light Top Hero Section */}
      <section className="package-make-day-hero">
        <h1 className="make-day-title">
          {t.zones.packages.heroTitle}
        </h1>
        <p className="make-day-orange-sub">
          {t.zones.packages.heroSub}
        </p>
        <p className="make-day-desc">
          {t.zones.packages.heroDesc}
        </p>
      </section>

      {/* Dark Teal Experience Section */}
      <section className="dream-experience-section">
        {/* Top Tag */}
        <div className="dream-top-tag">
          <img 
            src="/photo/kid-area-pic/icon/Vector (3).png" 
            alt="tag" 
            className="dream-tag-icon" 
          />
          <span>{t.zones.packages.dreamTag}</span>
        </div>

        {/* Section Heading */}
        <h2 className="dream-heading">{t.zones.packages.dreamTitle}</h2>
        <p className="dream-subheading">{t.zones.packages.dreamSub}</p>

        {/* 4 Horizontal Pill Buttons */}
        <div className="dream-filter-pills">
          <button 
            className={`dream-pill-btn ${activeCategory === 'adventure' ? 'active' : ''}`}
            onClick={() => setActiveCategory('adventure')}
          >
            {t.zones.packages.tabs.adventure}
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'challenge' ? 'active' : ''}`}
            onClick={() => setActiveCategory('challenge')}
          >
            {t.zones.packages.tabs.challenge}
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'midweek' ? 'active' : ''}`}
            onClick={() => setActiveCategory('midweek')}
          >
            {t.zones.packages.tabs.midWeek}
          </button>
          <button 
            className={`dream-pill-btn ${activeCategory === 'weekend' ? 'active' : ''}`}
            onClick={() => setActiveCategory('weekend')}
          >
            {t.zones.packages.tabs.weekend}
          </button>
        </div>

        {/* The Feature Pass Card */}
        <div className="challenge-pass-card dream-pass-card">
          {/* Left Preview Box */}
          <div 
            className="pass-card-left dream-card-media"
            onClick={() => openModal('booking', {
              name: pkgTitle,
              price: priceDisplay,
              priceNum: currentPkg.priceNum || 100,
              discount: pkgSaveBadge,
              details: currentPkg.details
            })}
            role="button"
            tabIndex={0}
            title={`Click to book ${pkgTitle}`}
          >
            <img 
              src={currentPkg.img} 
              alt={pkgTitle} 
              className="pass-collage-img" 
            />
            {pkgSaveBadge && <div className="pass-save-badge">{pkgSaveBadge}</div>}
          </div>

          {/* Right Card Content */}
          <div className="pass-card-right">
            <h4 className="pass-main-title">{pkgTitle}</h4>
            <p className="pass-sub-cyan">{pkgSubtitle}</p>

            {/* Cyan Checklist */}
            <div className="adventure-checklist">
              {featuresList && featuresList.map((feat, idx) => (
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
              <span className="pass-price-current">{priceDisplay}</span>
              {origPriceDisplay && <span className="pass-price-orig">{origPriceDisplay}</span>}
            </div>

            {/* Get This Offer Button */}
            <button 
              className="get-this-offer-btn"
              onClick={() => openModal('booking', {
                name: pkgTitle,
                price: priceDisplay,
                priceNum: currentPkg.priceNum || 100,
                discount: pkgSaveBadge,
                details: currentPkg.details
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
      </section>

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
