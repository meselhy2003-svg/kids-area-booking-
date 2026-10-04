import React from 'react';
import { useFunParkMedia } from '../../hooks';
import { getTranslations } from '../../data/translations';

export default function DesktopFunParkPage({ setActiveTab, openModal, lang = 'ar', searchQuery }) {
  const t = getTranslations(lang);
  const isArabic = lang === 'ar';

  const {
    heroBanners,
    exploreItems,
    activeSlide,
    setActiveSlide,
    currentHero
  } = useFunParkMedia();

  const offers = [
    {
      id: 'single-midweek',
      title: 'Single Midweek',
      titleAr: 'تذكرة فردية منتصف الأسبوع',
      saveBadge: 'SAVE 85 EGP',
      saveBadgeAr: 'وفر ٨٥ ج.م',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Junior GP Speedway.png',
      fallback: '/photo/kid-area-pic/family-bumper-cars.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry + 1 Game (1 VR)',
      bundleAr: 'دخول طوال اليوم + لعبة واحدة (VR)',
      price: 100,
      oldPrice: 185
    },
    {
      id: 'sisters-midweek',
      title: 'Sisters Midweek',
      titleAr: 'تذكرة الأختين منتصف الأسبوع',
      saveBadge: 'SAVE 150 EGP',
      saveBadgeAr: 'وفر ١٥٠ ج.م',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Family bumper car arena.png',
      fallback: '/photo/kid-area-pic/bumper-collision-bay.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry for 2 kids',
      bundleAr: 'دخول طوال اليوم لطفلين',
      price: 150,
      oldPrice: 300
    },
    {
      id: 'friends-midweek',
      title: 'Friends Midweek',
      titleAr: 'تذكرة الأصدقاء منتصف الأسبوع',
      saveBadge: 'SAVE 95 EGP',
      saveBadgeAr: 'وفر ٩٥ ج.م',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry for 3 kids',
      bundleAr: 'دخول طوال اليوم لـ ٣ أطفال',
      price: 225,
      oldPrice: 370
    },
    {
      id: 'single-weekend',
      title: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'SAVE 35 EGP',
      saveBadgeAr: 'وفر ٣٥ ج.م',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/High ropes suspended course.png',
      fallback: '/photo/kid-area-pic/high-ropes-course.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry + 2 Games (1 VR, 1 Basketball) + Party',
      bundleAr: 'دخول طوال اليوم + لعبتين (VR وسلة) + الحفلة',
      price: 150,
      oldPrice: 185
    },
    {
      id: 'sisters-weekend',
      title: 'Sisters Weekend',
      titleAr: 'تذكرة الأختين نهاية الأسبوع',
      saveBadge: 'SAVE 50 EGP',
      saveBadgeAr: 'وفر ٥٠ ج.م',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Bumper Collision Bay.png',
      fallback: '/photo/kid-area-pic/family-bumper-cars.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry for 2 kids + 2 Games (1 VR, 1 Basketball) + Party',
      bundleAr: 'دخول طوال اليوم لطفلين + لعبتين (VR وسلة) + الحفلة',
      price: 250,
      oldPrice: 330
    },
    {
      id: 'friends-weekend',
      title: 'Friends Weekend',
      titleAr: 'تذكرة الأصدقاء نهاية الأسبوع',
      saveBadge: 'SAVE 25 EGP',
      saveBadgeAr: 'وفر ٢٥ ج.م',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Kid wearing VR headset in neon arcade.png',
      fallback: '/photo/kid-area-pic/kid-vr-headset.png',
      age: 'Ages 4 – 12',
      ageAr: 'الأعمار: ٤ – ١٢ سنة',
      bundle: 'All-day entry for 3 kids + 3 Games (1 VR, 1 Basketball) + Party',
      bundleAr: 'دخول طوال اليوم لـ ٣ أطفال + ٣ ألعاب (VR وسلة) + الحفلة',
      price: 375,
      oldPrice: 400
    }
  ];

  // Filter offers based on search query
  const filteredOffers = offers.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.titleAr.includes(q) || o.bundle.toLowerCase().includes(q);
  });

  const handleBooking = (offer) => {
    const offerTitle = isArabic ? offer.titleAr : offer.title;
    const curr = isArabic ? 'ج.م' : 'EGP';
    openModal('booking', {
      name: offerTitle,
      price: `${offer.price} ${curr}`,
      priceNum: offer.price,
      discount: isArabic ? offer.saveBadgeAr : offer.saveBadge,
      details: isArabic ? offer.bundleAr : offer.bundle
    });
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
            <div className="desktop-offers-filters">
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

          {/* 6 OFFERS CARDS GRID */}
          <div className="desktop-offers-grid-3x2">
            {filteredOffers.map((offer) => {
              const offerTitle = isArabic ? offer.titleAr : offer.title;
              const offerBundle = isArabic ? offer.bundleAr : offer.bundle;
              const offerAge = isArabic ? offer.ageAr : offer.age;
              const offerBadge = isArabic ? offer.saveBadgeAr : offer.saveBadge;
              const priceDisplay = isArabic ? `${offer.price} ج.م` : `EGP ${offer.price}`;
              const oldPriceDisplay = offer.oldPrice 
                ? (isArabic ? `${offer.oldPrice} ج.م` : `EGP ${offer.oldPrice}`) 
                : null;

              return (
                <div key={offer.id} className="desktop-offer-card">
                  <div className="desktop-offer-img-box">
                    <img 
                      src={offer.image} 
                      alt={offerTitle} 
                      className="desktop-offer-img"
                      onError={(e) => { e.target.src = offer.fallback; }}
                    />
                    <span className={`desktop-offer-save-tag ${offer.badgeColor}`}>
                      {offerBadge}
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
            <button 
              className="desktop-see-all-link"
              onClick={() => openModal('gallery')}
            >
              {t.zones.seeAll}
            </button>
          </div>

          {/* 3 FEATURE CARDS */}
          <div className="desktop-explore-grid-3">
            {exploreItems.map((item) => {
              const itemTitle = isArabic ? (item.titleAr || item.title) : (item.titleEn || item.title);
              return (
                <div 
                  key={item.id} 
                  className="desktop-explore-card"
                  onClick={() => openModal('attraction-detail', {
                    title: itemTitle,
                    titleEn: item.titleEn || item.title,
                    titleAr: item.titleAr,
                    desc: isArabic ? (item.descAr || item.desc) : item.desc,
                    img: item.image || item.src || item.img
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
