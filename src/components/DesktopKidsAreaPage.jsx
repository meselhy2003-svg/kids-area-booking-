import React, { useState } from 'react';

export default function DesktopKidsAreaPage({ setActiveTab, openModal, lang, searchQuery }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const offers = [
    {
      id: 'single-midweek',
      title: 'Single Midweek',
      titleAr: 'تذكرة فردية منتصف الأسبوع',
      saveBadge: 'SAVE 85 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png',
      age: 'Ages 1 – 3',
      bundle: 'All-day entry + 1 Package ديس وألوان',
      extra: null,
      price: 100,
      oldPrice: 185
    },
    {
      id: 'sisters-midweek',
      title: 'Sisters Midweek',
      titleAr: 'تذكرة الأختين منتصف الأسبوع',
      saveBadge: 'SAVE 150 EGP',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Classic illuminated carousel ride.png',
      age: 'Ages 1 – 3',
      bundle: 'All-day entry for 2 kids',
      extra: null,
      price: 150,
      oldPrice: 300
    },
    {
      id: 'single-weekend',
      title: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'SAVE 35 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/kids-ball-pit-slide.png',
      age: 'Ages 1 – 3',
      bundle: 'All-day entry + 1 Package ديس وألوان',
      extra: '+ Free coloring workshop + Party included',
      price: 150,
      oldPrice: 185
    },
    {
      id: 'sisters-weekend',
      title: 'Sisters Weekend',
      titleAr: 'تذكرة الأختين نهاية الأسبوع',
      saveBadge: 'SAVE 120 EGP',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Boy laughing playing with toys.png',
      age: 'Ages 1 – 3',
      bundle: 'Entry for 2 kids + 2 Package ديس وألوان',
      extra: '+ Free coloring workshop + Party included',
      price: 250,
      oldPrice: 370
    }
  ];

  const exploreItems = [
    {
      id: 'ball-pit',
      title: 'Ball Pit',
      titleAr: 'مسبح الكرات',
      image: '/photo/kid-area-pic/ball-pit-thumb.png',
      fallback: '/photo/kid-area-pic/Toddler laughing in soft ball pit.png',
      desc: 'Over 50,000 sanitized sensory balls with twin gentle slides and interactive targets.'
    },
    {
      id: 'soft-play',
      title: 'Soft Play Maze',
      titleAr: 'مناطق اللعب الناعمة',
      image: '/photo/kid-area-pic/soft-play-thumb.png',
      fallback: '/photo/kid-area-pic/explore-softplay.png',
      desc: 'Multi-level foam obstacles, tunnels, bridges, and padded discovery paths for toddlers.'
    },
    {
      id: 'art-workshop',
      title: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      image: '/photo/kid-area-pic/art-workshop-thumb.png',
      fallback: '/photo/kid-area-pic/explore-artworkshop.png',
      desc: 'Guided pottery painting, safe finger coloring, sensory craft tables, and take-home keepsakes.'
    }
  ];

  // Filter offers based on search query
  const filteredOffers = offers.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.titleAr.includes(q) || o.bundle.toLowerCase().includes(q);
  });

  const handleBooking = (offer) => {
    openModal('booking', {
      name: `${offer.title} - ${offer.titleAr}`,
      price: `${offer.price} EGP`,
      priceNum: offer.price,
      discount: offer.saveBadge,
      details: `${offer.bundle} ${offer.extra || ''}`
    });
  };

  return (
    <div className="desktop-page desktop-zone-page">
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div className="desktop-zone-hero-banner kids-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">Kids Area</h1>
            <h2 className="desktop-zone-hero-tagline">Little Adventurers Big Smiles!</h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">منطقة الأطفال</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">مغامرات صغيرة وسعادة كبيرة!</p>
            
            {/* Carousel Dots */}
            <div className="desktop-zone-hero-dots">
              {[0, 1, 2].map((i) => (
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
            <span>PLAY</span>
            <span>EXPLORE</span>
            <span>LEARN</span>
            <span>TOGETHER!</span>
          </div>
        </div>

        {/* 2. OFFERS SECTION */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              Kids Area Offers <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة الأطفال</span>
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">Ages 1 – 3</span>
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('booking', { name: 'Kids Area All-Inclusive Pass', price: '100 EGP', priceNum: 100 })}
              >
                See All &gt;
              </button>
            </div>
          </div>

          {/* 4 OFFERS CARDS GRID */}
          <div className="desktop-offers-grid-4">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="desktop-offer-card">
                <div className="desktop-offer-img-box">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="desktop-offer-img"
                    onError={(e) => { e.target.src = '/photo/kid-area-pic/kids-ball-pit-slide.png'; }}
                  />
                  <span className={`desktop-offer-save-tag ${offer.badgeColor}`}>
                    {offer.saveBadge}
                  </span>
                </div>

                <div className="desktop-offer-body">
                  <h3 className="desktop-offer-title">{offer.title}</h3>
                  <h4 className="desktop-offer-title-ar font-alexandria">{offer.titleAr}</h4>

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
                      <span>{offer.bundle}</span>
                    </div>

                    {offer.extra && (
                      <div className="desktop-offer-extra-perk">
                        {offer.extra}
                      </div>
                    )}
                  </div>

                  <div className="desktop-offer-price-row">
                    <div className="desktop-price-val">
                      <strong className="desktop-curr">EGP {offer.price}</strong>
                      {offer.oldPrice && <span className="desktop-old-price">EGP {offer.oldPrice}</span>}
                    </div>

                    <button 
                      className="desktop-get-offer-btn"
                      onClick={() => handleBooking(offer)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-ticket-icon">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      </svg>
                      <span>Get Offer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. EXPLORE KIDS AREA SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">Explore Kids Area</h2>
            <button 
              className="desktop-see-all-link"
              onClick={() => openModal('gallery')}
            >
              See All &gt;
            </button>
          </div>

          {/* 3 FEATURE CARDS */}
          <div className="desktop-explore-grid-3">
            {exploreItems.map((item) => (
              <div 
                key={item.id} 
                className="desktop-explore-card"
                onClick={() => openModal('attraction-detail', {
                  titleEn: item.title,
                  titleAr: item.titleAr,
                  desc: item.desc,
                  img: item.image
                })}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="desktop-explore-img"
                  onError={(e) => { e.target.src = item.fallback; }}
                />
                <div className="desktop-explore-overlay">
                  <h3 className="desktop-explore-title">{item.title}</h3>
                  <h4 className="desktop-explore-title-ar font-alexandria">{item.titleAr}</h4>
                </div>
              </div>
            ))}
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
            <span>EXPLORE 360°</span>
          </button>
        </div>

      </div>
    </div>
  );
}
