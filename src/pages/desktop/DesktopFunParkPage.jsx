import React, { useState } from 'react';
import { useFunParkMedia } from '../../hooks';
import { useZoneData } from '../../hooks/useZoneData';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';

export default function DesktopFunParkPage({ setActiveTab, openModal, lang = 'ar', searchQuery }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { addToCart } = useData();

  const {
    heroBanners,
    exploreItems,
    activeSlide,
    setActiveSlide,
    currentHero
  } = useFunParkMedia();

  const {
    filteredOffers,
    timing,
    setTiming
  } = useZoneData('fun-park', searchQuery);

  const handleBooking = (offer) => {
    const offerTitle = offer.title || (isArabic ? offer.titleAr : offer.titleEn) || offer.titleAr;
    const currentPrice = offer.priceAfterDiscount ?? offer.priceNum ?? offer.price;
    const origPrice = (offer.price && offer.price > currentPrice) ? offer.price : (offer.oldPrice || offer.origPrice);

    addToCart({
      id: offer._id || offer.id,
      ticket: offer._id || offer.id,
      type: 'ticket',
      title: `${offerTitle} - ${t.zones.funPark.title}`,
      titleAr: `${offerTitle} - ${t.zones.funPark.title}`,
      titleEn: `${offerTitle} - ${t.zones.funPark.title}`,
      zone: 'fun-park',
      zoneLabel: isArabic ? 'فن بارك' : 'Fun Park',
      age: offer.age,
      inclusions: offer.description || offer.bundle || (Array.isArray(offer.features) ? offer.features.join(' • ') : ''),
      priceEgp: currentPrice,
      oldPriceEgp: origPrice,
      thumb: offer.image || offer.thumb,
      saveBadge: offer.saveBadge || (isArabic ? offer.saveBadgeAr : offer.saveBadge)
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
          className="desktop-zone-hero-banner funpark-hero-banner"
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
                <h1 className="desktop-zone-hero-title font-alexandria">{currentHero?.titleAr || t.zones.funPark.title}</h1>
                <h2 className="desktop-zone-hero-tagline font-alexandria">{currentHero?.subtitleAr || t.zones.funPark.subtitle}</h2>
              </>
            ) : (
              <>
                <h1 className="desktop-zone-hero-title">{currentHero?.titleEn || t.zones.funPark.title}</h1>
                <h2 className="desktop-zone-hero-tagline">{currentHero?.subtitleEn || t.zones.funPark.subtitle}</h2>
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

        {/* 2. OFFERS SECTION */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              {t.zones.funPark.offersTitle}
            </h2>
            <div className="desktop-offers-filters" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="timing-toggle-container" style={{ display: 'inline-flex', gap: '8px', margin: 0 }}>
                <button
                  className={`timing-pill-btn pill-weekend ${timing === 'weekend' ? 'active' : ''}`}
                  onClick={() => setTiming('weekend')}
                  style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' }}
                >
                  {isArabic ? 'نهاية الأسبوع' : 'Weekend'}
                </button>
                <button
                  className={`timing-pill-btn pill-midweek ${timing === 'midweek' ? 'active' : ''}`}
                  onClick={() => setTiming('midweek')}
                  style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' }}
                >
                  {isArabic ? 'منتصف الأسبوع' : 'Mid-Week'}
                </button>
              </div>
              <span className="desktop-age-badge dark-badge">{t.zones.funPark.ageFilter}</span>
              <button
                className="desktop-see-all-link"
                onClick={() => openModal('booking', {
                  name: isArabic ? 'تذكرة فن بارك الشاملة' : 'Fun Park All-Inclusive Pass',
                  price: isArabic ? '١٥٠ ج.م' : '150 EGP',
                  priceNum: 150
                })}
              >
                {t.zones.seeAll}
              </button>
            </div>
          </div>

          {/* OFFERS CARDS GRID */}
          <div className="desktop-offers-grid-3x2">
            {filteredOffers.map((offer) => {
              const offerTitle = offer.title || (isArabic ? offer.titleAr : offer.titleEn) || offer.titleAr;
              const offerBundle = offer.description || offer.bundle || (Array.isArray(offer.features) ? offer.features.join(', ') : '');
              const offerAge = offer.age || (isArabic ? offer.ageAr : offer.age);
              const offerBadge = offer.saveBadge || (isArabic ? offer.saveBadgeAr : offer.saveBadge);
              const currentPrice = offer.priceAfterDiscount ?? offer.priceNum ?? offer.price;
              const origPrice = (offer.price && offer.price > currentPrice) ? offer.price : (offer.oldPrice || offer.origPrice);
              const priceDisplay = isArabic ? `${currentPrice} ج.م` : `EGP ${currentPrice}`;
              const oldPriceDisplay = (origPrice && origPrice > currentPrice)
                ? (isArabic ? `${origPrice} ج.م` : `EGP ${origPrice}`)
                : null;

              return (
                <div key={offer._id || offer.id} className="desktop-offer-card">
                  <div className="desktop-offer-img-box">
                    <img
                      src={offer.image || offer.thumb}
                      alt={offerTitle}
                      className="desktop-offer-img"
                      onError={(e) => { e.target.src = '/photo/kid-area-pic/Junior GP Speedway.png'; }}
                    />
                    {offerBadge && (
                      <span className={`desktop-offer-save-tag ${offer.badgeColor || 'badge-cyan'}`}>
                        {offerBadge}
                      </span>
                    )}
                  </div>

                  <div className="desktop-offer-body">
                    <h3 className="desktop-offer-title">{offerTitle}</h3>

                    <div className="desktop-offer-specs">
                      <div className="desktop-spec-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-spec-icon">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{offerAge}</span>
                      </div>

                      <div className="desktop-spec-row bundle-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-spec-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{offerBundle}</span>
                      </div>
                    </div>

                    <div className="desktop-offer-price-row">
                      <div className="desktop-price-val">
                        <strong className="desktop-curr">{priceDisplay}</strong>
                        {oldPriceDisplay && <span className="desktop-old-price">{oldPriceDisplay}</span>}
                      </div>

                      <button
                        className="desktop-get-offer-btn"
                        onClick={() => handleBooking(offer)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-ticket-icon">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        </svg>
                        <span>{t.zones.getOffer}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. EXPLORE FUN PARK SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">{t.zones.funPark.exploreTitle}</h2>
            {exploreItems && exploreItems.length > 3 && (
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('all-attractions', {
                  title: t.zones.funPark.exploreTitle,
                  items: exploreItems
                })}
              >
                {t.zones.seeAll}
              </button>
            )}
          </div>

          {/* 3 FEATURE CARDS */}
          <div className="desktop-explore-grid-3">
            {exploreItems.slice(0, 3).map((item) => {
              const itemTitle = isArabic ? (item.titleAr || item.title) : (item.titleEn || item.title);
              const imgSrc = item.image || item.src || item.img || item.url;
              const fallbackImg = item.fallback || item.fallbackSrc || item.fallbackImg;
              return (
                <div
                  key={item.id}
                  className="desktop-explore-card"
                  onClick={() => openModal('image-only', {
                    img: imgSrc,
                    fallbackImg: fallbackImg,
                    title: itemTitle
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
