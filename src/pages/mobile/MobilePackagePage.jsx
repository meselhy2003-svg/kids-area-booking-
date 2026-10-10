import React from 'react';
import { usePackages } from '../../hooks/usePackages';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';
import { getLocalizedPackage } from '../../utils/packageLocalization';

export default function MobilePackagePage({ setActiveTab, openModal, lang = 'ar' }) {
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
  const pkgTitle = localizedCurrentPkg?.title || '';
  const pkgSubtitle = localizedCurrentPkg?.subtitle || '';
  const pkgSaveBadge = localizedCurrentPkg?.saveBadge || '';
  const priceDisplay = localizedCurrentPkg?.priceDisplay || (currentPkg ? (isArabic ? `${currentPkg.priceNum || 0} ج.م` : `EGP ${currentPkg.priceNum || 0}`) : '');
  const origPriceDisplay = localizedCurrentPkg?.oldPriceDisplay || null;
  const featuresList = localizedCurrentPkg?.features || [];

  const handleBooking = () => {
    if (!currentPkg) return;
    const localized = getLocalizedPackage(currentPkg, lang);
    const title = localized?.title || currentPkg.title;
    addToCart({
      id: currentPkg._id || currentPkg.id || `package-${activeCategory}`,
      package: currentPkg._id || currentPkg.id || `package-${activeCategory}`,
      type: 'package',
      title: title,
      titleAr: isArabic ? title : (currentPkg.titleAr || currentPkg.title),
      titleEn: !isArabic ? title : (currentPkg.titleEn || currentPkg.title),
      zone: 'packages',
      zoneLabel: isArabic ? 'باقات الرحلات' : 'Packages',
      age: 'All Ages',
      inclusions: localized?.subtitle || currentPkg?.details || currentPkg?.description || (Array.isArray(featuresList) ? featuresList.join(' • ') : ''),
      priceEgp: currentPkg?.priceNum || 0,
      oldPriceEgp: currentPkg?.oldPrice,
      pointsGets: currentPkg?.pointsGets || 0,
      thumb: currentPkg?.image || currentPkg?.img,
      saveBadge: localized?.saveBadge || pkgSaveBadge
    });
    if (typeof setActiveTab === 'function') {
      setActiveTab('cart');
    }
  };

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

        {/* Dynamic Horizontal Pill Buttons from Server */}
        <div className="dream-filter-pills">
          {packageList && packageList.length > 0 ? (
            packageList.map((pkg) => {
              const isSelected = (currentPkg?._id === pkg._id) || (currentPkg?.id === pkg.id) || (activeCategory === pkg._id) || (activeCategory === pkg.id);
              const localized = getLocalizedPackage(pkg, lang);
              const tabTitle = localized?.title || pkg.title;
              return (
                <button
                  key={pkg._id || pkg.id}
                  className={`dream-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveCategory(pkg._id || pkg.id)}
                >
                  {tabTitle}
                </button>
              );
            })
          ) : (
            <button className="dream-pill-btn active">{t.zones.packages.tabs.adventure}</button>
          )}
        </div>

        {/* The Feature Pass Card */}
        {currentPkg && (
          <div className="challenge-pass-card dream-pass-card">
            {/* Left Preview Box */}
            <div
              className="pass-card-left dream-card-media"
              onClick={handleBooking}
              role="button"
              tabIndex={0}
              title={`Click to book ${pkgTitle}`}
            >
              <img
                src={currentPkg.image || currentPkg.img || '/photo/kid-area-pic/family-bumper-cars.png'}
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
                onClick={handleBooking}
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
      </section>

      {/* Bottom spacer for floating wave dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
