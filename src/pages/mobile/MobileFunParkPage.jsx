import React, { useState } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useZoneData } from '../../hooks/useZoneData';
import { useFunParkMedia } from '../../hooks';
import { useData } from '../../context/DataContext';
import { getTranslations } from '../../data/translations';

export default function MobileFunParkPage({ setActiveTab, openModal, lang = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { addToCart } = useData();

  const {
    filteredOffers,
    filteredAttractions,
    attractions,
    timing,
    setTiming
  } = useZoneData('fun-park', searchQuery);

  // Fun Park Hero & Explore image caching and server synchronization
  const { currentHero, exploreItems } = useFunParkMedia();

  return (
    <div className={`mobile-zone-page fun-park-screen ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      {/* Search Bar */}
      <div className="zone-search-wrapper">
        <div className="zone-search-box">
          <svg
            className="search-lens-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7a9299"
            strokeWidth="2.5"
          >
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
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Zone Hero Banner: Fun Park */}
      <RunningHeroBanner slideIndex={1} heroSlide={currentHero} setActiveTab={setActiveTab} lang={lang} />

      {/* Section Header: Fun Park Offers */}
      <div className="zone-section-header">
        <div className="section-title-combo">
          <span className="title-part-current">{t.zones.funPark.offersTitle}</span>
        </div>
        <div className="section-header-actions">
          <span className="age-pill-badge">{t.zones.funPark.ageFilter}</span>
        </div>
      </div>

      {/* Weekend vs Mid-Week Toggle Pills */}
      <div className="timing-toggle-container">
        <button
          className={`timing-pill-btn pill-weekend ${timing === 'weekend' ? 'active' : ''}`}
          onClick={() => setTiming('weekend')}
        >
          <div className="pill-single-label">{isArabic ? 'نهاية الأسبوع' : 'Weekend'}</div>
        </button>

        <button
          className={`timing-pill-btn pill-midweek ${timing === 'midweek' ? 'active' : ''}`}
          onClick={() => setTiming('midweek')}
        >
          <div className="pill-single-label">{isArabic ? 'منتصف الأسبوع' : 'Mid-Week'}</div>
        </button>
      </div>

      {/* Horizontal Scroll / 2-Column Offers */}
      <div className="offers-slider-row">
        {filteredOffers.map((offer) => {
          const offerTitle = offer.title || (isArabic ? offer.titleAr : offer.titleEn) || offer.titleAr || offer.titleEn;
          const currentPrice = offer.priceAfterDiscount ?? offer.priceNum ?? offer.price;
          const origPrice = (offer.oldPrice || offer.origPrice || (offer.price > currentPrice ? offer.price : null));
          const priceDisplay = isArabic ? `${currentPrice} ج.م` : `${currentPrice} EGP`;
          const origPriceDisplay = origPrice ? (isArabic ? `${origPrice} ج.م` : `${origPrice} EGP`) : null;

          return (
            <div key={offer._id || offer.id} className="offer-card-item card-slider-item">
              {offer.saveBadge && <div className="offer-save-badge">{offer.saveBadge}</div>}

              <div className="offer-thumb-container">
                <img
                  src={offer.image || offer.thumb}
                  alt={offerTitle}
                  className="offer-thumb-img"
                />
              </div>

              <div className="offer-content">
                <h4 className="offer-main-title">{offerTitle}</h4>

                <div className="offer-meta-row">
                  <img
                    src="/photo/kid-area-pic/icon/Icon.png"
                    alt="age"
                    className="meta-icon-img"
                  />
                  <span className="meta-text">{offer.age}</span>
                </div>

                <div className="offer-features-list">
                  {offer.description && (
                    <div className="offer-feature-item">
                      <span className="feat-text">{offer.description}</span>
                    </div>
                  )}
                  {Array.isArray(offer.features) && offer.features.map((feat, fidx) => (
                    <div key={fidx} className="offer-feature-item">
                      <img
                        src="/photo/kid-area-pic/icon/Vector (3).png"
                        alt="feat"
                        className="feat-vector-icon"
                      />
                      <span className="feat-text">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="offer-pricing-row">
                  <span className="price-current">{priceDisplay}</span>
                  {origPriceDisplay && <span className="price-orig">{origPriceDisplay}</span>}
                </div>

                <button
                  className="get-offer-btn"
                  onClick={() => {
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
                      saveBadge: offer.saveBadge || (isArabic ? `وفر ${offer.price - currentPrice} ج.م` : `Save ${offer.price - currentPrice} EGP`)
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
                  <span>{t.zones.getOffer}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore Fun Park Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">{t.zones.funPark.exploreTitle}</h3>
        <button
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: t.zones.funPark.title, attractions })}
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
            src="/photo/kid-area-pic/icon/explore-360.png"
            alt="360"
            className="icon-360-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="explore-360-text">{t.zones.explore360}</span>
        </button>
      </div>

      {/* Spacer for bottom nav dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
