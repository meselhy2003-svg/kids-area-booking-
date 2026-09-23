import React, { useState } from 'react';

export default function DesktopAdventurePage({ setActiveTab, openModal, lang, searchQuery }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const offers = [
    {
      id: 'ropes-explorer',
      title: 'High Ropes Explorer',
      titleAr: 'تذكرة مسار الحبال المعلقة',
      saveBadge: 'SAVE 50 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png',
      fallback: '/photo/kid-area-pic/girl-rope-bridge.png',
      age: 'Ages 6+ & Teens',
      bundle: 'Full suspended aerial course with certified harness gear',
      price: 130,
      oldPrice: 180
    },
    {
      id: 'ninja-adventure',
      title: 'Ninja Warrior Challenge',
      titleAr: 'تحدي النينجا والموانع الرياضية',
      saveBadge: 'SAVE 90 EGP',
      badgeColor: 'badge-blue',
      image: '/photo/kid-area-pic/High ropes suspended course.png',
      fallback: '/photo/kid-area-pic/high-ropes-course.png',
      age: 'Ages 6+ & Teens',
      bundle: 'Speed obstacle course + 2 wall climbs + Timing chip',
      price: 170,
      oldPrice: 260
    },
    {
      id: 'duo-adrenaline',
      title: 'Duo High Altitude Pass',
      titleAr: 'باقة المغامرين الثنائية',
      saveBadge: 'SAVE 130 EGP',
      badgeColor: 'badge-cyan',
      image: '/photo/kid-area-pic/high-ropes-course.png',
      fallback: '/photo/kid-area-pic/girl-rope-bridge.png',
      age: 'Ages 6+ & Teens',
      bundle: 'Entry for 2 adventurers + Safety harness + Photo souvenir',
      price: 250,
      oldPrice: 380
    }
  ];

  const exploreItems = [
    {
      id: 'aerial-bridge',
      title: 'Suspended Sky Bridge',
      titleAr: 'جسر السماء المعلق',
      image: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png',
      fallback: '/photo/kid-area-pic/girl-rope-bridge.png',
      desc: 'Tested suspension bridge walkway 5 meters above ground with safety line.'
    },
    {
      id: 'vertical-climb',
      title: 'Apex Climbing Wall',
      titleAr: 'جدار التسلق الشاهق',
      image: '/photo/kid-area-pic/High ropes suspended course.png',
      fallback: '/photo/kid-area-pic/high-ropes-course.png',
      desc: 'Speed-climbing lanes with magnetic auto-belay system.'
    },
    {
      id: 'ninja-track',
      title: 'Ninja Obstacle Arena',
      titleAr: 'حلبة تحدي النينجا',
      image: '/photo/kid-area-pic/photo-vr-friends.png',
      fallback: '/photo/kid-area-pic/graphic-composition.png',
      desc: 'Warped wall, balance beams, ring swings, and soft landing pits.'
    }
  ];

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
        
        {/* HERO BANNER */}
        <div className="desktop-zone-hero-banner adventure-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">Adventure Zone</h1>
            <h2 className="desktop-zone-hero-tagline">High ropes, suspension bridges, and fearless adventures!</h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">منطقة المغامرات</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">تحديات الحبال المعلقة وحلبات الموانع المرتفعة</p>
            
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

          <div className="desktop-tilted-badge">
            <span>PLAY</span>
            <span>EXPLORE</span>
            <span>LEARN</span>
            <span>TOGETHER!</span>
          </div>
        </div>

        {/* OFFERS SECTION */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              Adventure Zone Offers <span className="text-separator">|</span> <span className="font-alexandria">عروض منطقة المغامرات</span>
            </h2>
            <div className="desktop-offers-filters">
              <span className="desktop-age-badge dark-badge">Ages 6+ &amp; Teens</span>
              <button 
                className="desktop-see-all-link"
                onClick={() => openModal('booking', { name: 'Adventure Zone Unlimited Pass', price: '190 EGP', priceNum: 190 })}
              >
                See All &gt;
              </button>
            </div>
          </div>

          <div className="desktop-offers-grid-3">
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

        {/* EXPLORE SECTION */}
        <section className="desktop-zone-section explore-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-explore-heading">Explore Adventure Zone</h2>
            <button 
              className="desktop-see-all-link"
              onClick={() => openModal('gallery')}
            >
              See All &gt;
            </button>
          </div>

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

        {/* 360 BUTTON */}
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
