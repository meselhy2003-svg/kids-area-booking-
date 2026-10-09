import React from 'react';
import { useZoneData } from '../../hooks/useZoneData';
import { useKidsAreaMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function DesktopKidsAreaPage({ setActiveTab, openModal, lang = 'ar', searchQuery }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';
  const { filteredOffers } = useZoneData('kids-area', searchQuery);
  
  // Kids Area Hero & Explore image caching and server synchronization
  const { 
    heroBanners, 
    exploreItems, 
    activeSlide, 
    setActiveSlide, 
    currentHero 
  } = useKidsAreaMedia();

  const handleBooking = (offer) => {
    const title = isArabic ? (offer.titleAr || offer.title) : (offer.titleEn || offer.title);
    const curr = isArabic ? 'ج.م' : 'EGP';
    openModal('booking', {
      name: title,
      price: `${offer.priceNum || offer.price} ${curr}`,
      priceNum: offer.priceNum || offer.price,
      discount: offer.saveBadge,
      details: `${offer.bundle || offer.features?.join(', ') || ''} ${offer.extra || ''}`
    });
  };

  return (
    <div className={`desktop-page desktop-zone-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div 
          className="desktop-zone-hero-banner kids-hero-banner"
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
                <h1 className="desktop-zone-hero-title font-alexandria">{currentHero?.titleAr || t.zones.kidsArea.title}</h1>
                <h2 className="desktop-zone-hero-tagline font-alexandria">{currentHero?.subtitleAr || t.zones.kidsArea.subtitle}</h2>
              </>
            ) : (
              <>
                <h1 className="desktop-zone-hero-title">{currentHero?.titleEn || t.zones.kidsArea.title}</h1>
                <h2 className="desktop-zone-hero-tagline">{currentHero?.subtitleEn || t.zones.kidsArea.subtitle}</h2>
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
              {t.zones.kidsArea.offersTitle}
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">{t.zones.kidsArea.ageFilter}</span>
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('booking', { 
                  name: isArabic ? 'تذكرة منطقة الأطفال الشاملة' : 'Kids Area All-Inclusive Pass', 
                  price: isArabic ? '١٠٠ ج.م' : '100 EGP', 
                  priceNum: 100 
                })}
              >
                {t.zones.seeAll}
              </button>
            </div>
          </div>

          {/* 4 OFFERS CARDS GRID */}
          <div className="desktop-offers-grid-4">
            {filteredOffers.map((offer) => {
              const offerTitle = isArabic ? (offer.titleAr || offer.title) : (offer.titleEn || offer.title);
              const priceDisplay = isArabic ? `${offer.priceNum || offer.price} ج.م` : `EGP ${offer.priceNum || offer.price}`;
              const oldPriceDisplay = (offer.oldPrice || offer.origPrice) 
                ? (isArabic ? `${offer.oldPrice || offer.origPrice} ج.م` : `EGP ${offer.oldPrice || offer.origPrice}`) 
                : null;

              return (
                <div key={offer.id} className="desktop-offer-card">
                  <div className="desktop-offer-img-box">
                    <img 
                      src={offer.image || offer.thumb} 
                      alt={offerTitle} 
                      className="desktop-offer-img"
                      onError={(e) => { e.target.src = '/photo/kid-area-pic/kids-ball-pit-slide.png'; }}
                    />
                    <span className={`desktop-offer-save-tag ${offer.badgeColor || 'badge-cyan'}`}>
                      {offer.saveBadge}
                    </span>
                  </div>

                  <div className="desktop-offer-body">
                    <h3 className="desktop-offer-title">{offerTitle}</h3>

                    <div className="desktop-offer-specs">
                      <div className="desktop-spec-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-spec-icon">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{offer.age}</span>
                      </div>

                      <div className="desktop-spec-row bundle-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-spec-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{offer.bundle || offer.features?.join(', ')}</span>
                      </div>

                      {offer.extra && (
                        <div className="desktop-offer-extra-perk">
                          {offer.extra}
                        </div>
                      )}
                    </div>

                    <div className="desktop-offer-price-row">
                      <div className="desktop-price-val">
                        <strong className="desktop-curr">{priceDisplay}</strong>
                        {oldPriceDisplay && (
                          <span className="desktop-old-price">
                            {oldPriceDisplay}
                          </span>
                        )}
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

        {/* 3. EXPLORE KIDS AREA SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">{t.zones.kidsArea.exploreTitle}</h2>
            {exploreItems && exploreItems.length > 3 && (
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('all-attractions', {
                  title: t.zones.kidsArea.exploreTitle,
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
            onClick={() => openModal('virtual-tour')}
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
