import React, { useState } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useZoneData } from '../../hooks/useZoneData';
import { useFunParkMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function MobileFunParkPage({ setActiveTab, openModal, lang = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

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
          const offerTitle = isArabic ? (offer.titleAr || offer.title) : (offer.titleEn || offer.title);
          const priceDisplay = isArabic ? `${offer.priceNum || offer.price} ج.م` : offer.price;
          const origPriceDisplay = (offer.origPrice || offer.oldPrice)
            ? (isArabic ? `${offer.origPrice || offer.oldPrice} ج.م` : offer.origPrice)
            : null;

          return (
            <div key={offer.id} className="offer-card-item card-slider-item">
              <div className="offer-save-badge">{offer.saveBadge}</div>

              <div className="offer-thumb-container">
                <img 
                  src={offer.thumb} 
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
                  {offer.features && offer.features.map((feat, fidx) => (
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
                  onClick={() => openModal('booking', {
                    name: `${offerTitle} - ${t.zones.funPark.title}`,
                    price: priceDisplay,
                    priceNum: offer.priceNum,
                    discount: offer.saveBadge,
                    details: offer.features?.join(', ') || ''
                  })}
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
