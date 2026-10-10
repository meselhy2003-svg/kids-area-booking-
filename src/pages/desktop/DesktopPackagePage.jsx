import React from 'react';
import { usePackages } from '../../hooks/usePackages';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';
import { getLocalizedPackage } from '../../utils/packageLocalization';

export default function DesktopPackagePage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { addToCart } = useData();

  const {
    activeCategory,
    setActiveCategory,
    packageList,
    currentPackage: currentPkg,
    loading
  } = usePackages('adventure');

  const localizedCurrentPkg = currentPkg ? getLocalizedPackage(currentPkg, lang) : null;
  const currentTitle = localizedCurrentPkg?.title || '';
  const currentSubtitle = localizedCurrentPkg?.subtitle || '';
  const currentBadge = localizedCurrentPkg?.saveBadge || '';
  const priceDisplay = localizedCurrentPkg?.priceDisplay || (currentPkg ? (isArabic ? `${currentPkg.priceNum || 0} ج.م` : `EGP ${currentPkg.priceNum || 0}`) : '');
  const oldPriceDisplay = localizedCurrentPkg?.oldPriceDisplay || null;
  const featureItems = localizedCurrentPkg?.features || [];

  const handleBooking = (pkg) => {
    if (!pkg) return;
    const localized = getLocalizedPackage(pkg, lang);
    const pkgTitle = localized?.title || pkg.title;
    const currentPrice = pkg.priceNum || pkg.priceAfterDiscount || 0;
    const origPrice = pkg.oldPrice || pkg.price;

    addToCart({
      id: pkg._id || pkg.id || `package-${activeCategory}`,
      package: pkg._id || pkg.id || `package-${activeCategory}`,
      type: 'package',
      title: pkgTitle,
      titleAr: isArabic ? pkgTitle : (pkg.titleAr || pkg.title),
      titleEn: !isArabic ? pkgTitle : (pkg.titleEn || pkg.title),
      zone: 'packages',
      zoneLabel: isArabic ? 'باقات الرحلات' : 'Packages',
      age: 'All Ages',
      inclusions: localized?.subtitle || pkg.description || pkg.details || (Array.isArray(featureItems) ? featureItems.join(' • ') : ''),
      priceEgp: currentPrice,
      oldPriceEgp: origPrice,
      pointsGets: pkg.pointsGets || 0,
      thumb: pkg.image || pkg.img || '/photo/kid-area-pic/family-bumper-cars.png',
      saveBadge: localized?.saveBadge || pkg.saveBadge
    });
    if (typeof setActiveTab === 'function') {
      setActiveTab('cart');
    }
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
                  alt={currentTitle || 'American Dream Packages'}
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

          {/* Filter Tabs Row - Dynamic from Server Packages */}
          <div className="desktop-pkg-tabs-row">
            {packageList && packageList.length > 0 ? (
              packageList.map((pkg) => {
                const isSelected = (currentPkg?._id === pkg._id) || (currentPkg?.id === pkg.id) || (activeCategory === pkg._id) || (activeCategory === pkg.id);
                const localized = getLocalizedPackage(pkg, lang);
                const tabTitle = localized?.title || pkg.title;
                return (
                  <button
                    key={pkg._id || pkg.id}
                    className={`desktop-pkg-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveCategory(pkg._id || pkg.id)}
                  >
                    {tabTitle}
                  </button>
                );
              })
            ) : (
              <button className="desktop-pkg-tab-btn active">
                {t.zones.packages.tabs.adventure}
              </button>
            )}
          </div>

          {/* The Selected Package Offer Card */}
          <div className="desktop-horizontal-pass-container">
            {currentPkg ? (
              <div className="desktop-horizontal-pass-card">
                {/* Left composite photo */}
                <div className="pass-card-left-img-wrap">
                  <img
                    src={currentPkg?.image || currentPkg?.img || '/photo/kid-area-pic/family-bumper-cars.png'}
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
                  {currentBadge && <span className="pass-card-save-badge">{currentBadge}</span>}
                </div>

                {/* Vertical Checklist with Cyan Circles for all packages */}
                <div className="pass-card-checklist">
                  {featureItems.map((item, idx) => (
                    <div key={idx} className="pass-check-item">
                      <svg viewBox="0 0 20 20" fill="none" className="pass-check-svg" style={{ width: 20, height: 20, flexShrink: 0 }}>
                        <circle cx="10" cy="10" r="8.5" stroke="#00bcd4" strokeWidth="1.8" />
                        <path d="M6 10.2L8.6 12.8L14 7.5" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="pass-check-bold">{typeof item === 'object' ? (isArabic ? item.labelAr || item.label : item.label) : item}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action Button */}
                <div className="pass-card-price-action-row">
                  <div className="pass-price-group">
                    <strong className="pass-current-price">{priceDisplay}</strong>
                    {oldPriceDisplay && <span className="pass-old-price">{oldPriceDisplay}</span>}
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
            ) : (
              <div className="desktop-horizontal-pass-card" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                <p>{isArabic ? 'جاري تحميل الباقات...' : 'Loading packages...'}</p>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
