import React, { useState } from 'react';

export default function DesktopFunParkPage({ setActiveTab, openModal, lang, searchQuery }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const offers = [
    {
      id: 'single-midweek',
      title: 'Single Midweek',
      titleAr: 'تذكرة فردية منتصف الأسبوع',
      saveBadge: 'SAVE 85 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Junior GP Speedway.png',
      fallback: '/photo/kid-area-pic/family-bumper-cars.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry + 1 Game(1 VR)',
      price: 100,
      oldPrice: 185
    },
    {
      id: 'sisters-midweek',
      title: 'Sisters Midweek',
      titleAr: 'تذكرة الأختين منتصف الأسبوع',
      saveBadge: 'SAVE 150 EGP',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Family bumper car arena.png',
      fallback: '/photo/kid-area-pic/bumper-collision-bay.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry for 2 kids',
      price: 150,
      oldPrice: 300
    },
    {
      id: 'friends-midweek',
      title: 'Friends Midweek',
      titleAr: 'تذكرة الأصدقاء منتصف الأسبوع',
      saveBadge: 'SAVE 95 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallback: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry for 3 kids',
      price: 225,
      oldPrice: 370
    },
    {
      id: 'single-weekend',
      title: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'SAVE 35 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/High ropes suspended course.png',
      fallback: '/photo/kid-area-pic/high-ropes-course.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry + 2 Game(1 VR, 1 Basketball) + Party',
      price: 150,
      oldPrice: 185
    },
    {
      id: 'sisters-weekend',
      title: 'Sisters Weekend',
      titleAr: 'تذكرة الأختين نهاية الأسبوع',
      saveBadge: 'SAVE 50 EGP',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/Bumper Collision Bay.png',
      fallback: '/photo/kid-area-pic/family-bumper-cars.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry for 2 kids + 2 Game(1 VR, 1 Basketball) + Party',
      price: 250,
      oldPrice: 330
    },
    {
      id: 'friends-weekend',
      title: 'Friends Weekend',
      titleAr: 'تذكرة الأصدقاء نهاية الأسبوع',
      saveBadge: 'SAVE 25 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Kid wearing VR headset in neon arcade.png',
      fallback: '/photo/kid-area-pic/kid-vr-headset.png',
      age: 'Ages 4 – 12',
      bundle: 'All-day entry for 3 kids + 3 Game(1 VR, 1 Basketball) + Party',
      price: 375,
      oldPrice: 400
    }
  ];

  const exploreItems = [
    {
      id: 'climbing',
      title: 'Climbing',
      titleAr: 'تسلق',
      image: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png',
      fallback: '/photo/kid-area-pic/girl-rope-bridge.png',
      desc: 'Multi-level rock wall routes with auto-belay safety harnesses and friendly supervisors.'
    },
    {
      id: 'trampoline',
      title: 'Mega Trampoline',
      titleAr: 'ترامبولين',
      image: '/photo/kid-area-pic/soft-play-thumb.png',
      fallback: '/photo/kid-area-pic/explore-softplay.png',
      desc: 'Interconnected high-bounce jump arenas, foam plunge pits, and basketball slam dunk tracks.'
    },
    {
      id: 'art-workshop',
      title: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      image: '/photo/kid-area-pic/art-workshop-thumb.png',
      fallback: '/photo/kid-area-pic/explore-artworkshop.png',
      desc: 'Creative pottery sculpting, guided glow-in-the-dark painting, and craft maker sessions.'
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
      details: offer.bundle
    });
  };

  return (
    <div className="desktop-page desktop-zone-page">
      <div className="desktop-page-container">
        
        {/* 1. HERO ZONE BANNER WITH TILTED BADGE */}
        <div className="desktop-zone-hero-banner funpark-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">Fun Park</h1>
            <h2 className="desktop-zone-hero-tagline">A world of fun, laughter, and endless smiles</h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">منطقة المرح</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">عالم من المرح والضحك والابتسامات التي لا تنتهي</p>
            
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
              Fun Park Area Offers <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة المرح</span>
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">Ages 4 – 12</span>
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('booking', { name: 'Fun Park All-Inclusive Pass', price: '150 EGP', priceNum: 150 })}
              >
                See All &gt;
              </button>
            </div>
          </div>

          {/* 6 OFFERS CARDS GRID (2 ROWS x 3 COLUMNS) */}
          <div className="desktop-offers-grid-3x2">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="desktop-offer-card">
                <div className="desktop-offer-img-box">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="desktop-offer-img"
                    onError={(e) => { e.target.src = offer.fallback; }}
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

        {/* 3. EXPLORE FUN PARK SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">Explore Fun Park</h2>
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
