import React, { useState } from 'react';
import RunningHeroBanner from '../../components/RunningHeroBanner';
import LazyImage from '../../components/common/LazyImage';
import { useZoneData } from '../../hooks/useZoneData';

export default function KidsAreaPage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredOffers, filteredAttractions, offers, attractions } = useZoneData('kids-area', searchQuery);

  return (
    <div className="mobile-zone-page kids-area-screen">
      {/* Search Bar matching reference */}
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
            placeholder="Search for rides, offers, and more..."
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

      {/* Zone Hero Banner: Kids Area */}
      <RunningHeroBanner slideIndex={0} setActiveTab={setActiveTab} />

      {/* Section Header: Kids Area Offers | عروض منطقة الأطفال */}
      <div className="zone-section-header">
        <div className="section-title-combo">
          <span className="title-part-en">Kids Area Offers</span>
          <span className="title-divider">|</span>
          <span className="title-part-ar">عروض منطقة الأطفال</span>
        </div>
        <div className="section-header-actions">
          <span className="age-pill-badge">Ages 1 – 3</span>
          <button 
            className="see-all-link"
            onClick={() => openModal('all-offers', { zone: 'Kids Area', offers })}
          >
            See All &gt;
          </button>
        </div>
      </div>

      {/* 2x2 Offer Cards Grid with LazyImage */}
      <div className="offers-grid-2x2">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="offer-card-item">
            {/* Top Cyan Save Badge */}
            <div className="offer-save-badge">{offer.saveBadge}</div>

            {/* Collage Thumbnail */}
            <div className="offer-thumb-container">
              <LazyImage 
                src={offer.thumb} 
                alt={offer.titleEn} 
                className="offer-thumb-img" 
              />
            </div>

            <div className="offer-content">
              <h4 className="offer-en-title">{offer.titleEn}</h4>
              <p className="offer-ar-title">{offer.titleAr}</p>

              {/* Offer Details */}
              <div className="offer-meta-row">
                <img 
                  src="/photo/kid-area-pic/icon/Icon.png" 
                  alt="age" 
                  className="meta-icon-img" 
                  loading="lazy"
                  decoding="async"
                />
                <span className="meta-text">{offer.age}</span>
              </div>

              <div className="offer-features-list">
                {offer.features.map((feat, fidx) => (
                  <div key={fidx} className="offer-feature-item">
                    {fidx === 0 && (
                      <img 
                        src="/photo/kid-area-pic/icon/Vector (3).png" 
                        alt="feat" 
                        className="feat-vector-icon" 
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="feat-text">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price Row */}
              <div className="offer-pricing-row">
                <span className="price-current">{offer.price}</span>
                <span className="price-orig">{offer.origPrice}</span>
              </div>

              {/* Get Offer Button */}
              <button 
                className="get-offer-btn"
                onClick={() => openModal('booking', {
                  name: `${offer.titleEn} (${offer.titleAr})`,
                  price: offer.price,
                  priceNum: offer.priceNum,
                  discount: offer.saveBadge,
                  details: offer.features.join(', ')
                })}
              >
                <img 
                  src="/photo/kid-area-pic/icon/Vector (3).png" 
                  alt="ticket" 
                  className="btn-ticket-vector-icon" 
                  loading="lazy"
                  decoding="async"
                />
                <span>Get Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Explore Kids Area Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">Explore Kids Area</h3>
        <button 
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: 'Kids Area', attractions })}
        >
          See All &gt;
        </button>
      </div>

      {/* 3 Attraction Cards with LazyImage */}
      <div className="explore-attractions-row">
        {filteredAttractions.map((attr) => (
          <div 
            key={attr.id} 
            className="explore-attraction-card"
            onClick={() => openModal('attraction-detail', attr)}
            role="button"
            tabIndex={0}
          >
            <div className="attr-media-wrapper">
              <LazyImage 
                src={attr.img} 
                alt={attr.titleEn} 
                className="attr-card-img"
                fallbackSrc={attr.fallbackImg}
              />
              <div className="attr-overlay-labels">
                <div className="attr-en-name">{attr.titleEn}</div>
                <div className="attr-ar-name">{attr.titleAr}</div>
              </div>
            </div>
          </div>
        ))}
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
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="explore-360-text">EXPLORE 360°</span>
        </button>
      </div>

      {/* Spacer for bottom nav dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
