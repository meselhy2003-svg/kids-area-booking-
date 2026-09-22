import React, { useState, useMemo } from 'react';
import RunningHeroBanner from './RunningHeroBanner';

export default function KidsAreaPage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  const bannerSlides = [
    {
      titleEn: 'Kids Area',
      subtitleEn: 'Little Adventurers Big Smiles!',
      titleAr: 'منطقة الأطفال',
      subtitleAr: 'مغامرات صغيرة وسعادة كبيرة!',
      badge: 'Play Explore Learn Together!',
      bgGradient: 'linear-gradient(135deg, #0b2533 0%, #104252 60%, #195b68 100%)'
    },
    {
      titleEn: 'Sensory Wonder',
      subtitleEn: 'Colors, Shapes & Joyful Play!',
      titleAr: 'عالم الاستكشاف',
      subtitleAr: 'ألوان ومرح وتنمية مهارات!',
      badge: 'Safe & Sanitized!',
      bgGradient: 'linear-gradient(135deg, #08343f 0%, #0d5162 60%, #126e82 100%)'
    },
    {
      titleEn: 'Creative Zone',
      subtitleEn: 'Clay, Colors & Imagination!',
      titleAr: 'ورش الإبداع',
      subtitleAr: 'ألوان وتلوين وجبس مرح!',
      badge: 'Workshops Daily!',
      bgGradient: 'linear-gradient(135deg, #0a3a40 0%, #15626a 60%, #208792 100%)'
    }
  ];

  const offers = [
    {
      id: 'single-midweek',
      titleEn: 'Single Midweek',
      titleAr: 'تذكرة فردية منتصف الأسبوع',
      saveBadge: 'Save 85 EGP',
      age: 'Ages 1 - 3',
      features: [
        'All-day entry + 1 Package',
        'جبس وألوان'
      ],
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'sisters-midweek',
      titleEn: 'Sisters Midweek',
      titleAr: 'تذكرة الأختين منتصف الأسبوع',
      saveBadge: 'Save 150 EGP',
      age: 'Ages 1 - 3',
      features: [
        'All-day entry for 2 kids'
      ],
      price: 'EGP 150',
      priceNum: 150,
      origPrice: 'EGP 300',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'single-weekend',
      titleEn: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'Save 35 EGP',
      age: 'Ages 1 - 3',
      features: [
        'All-day entry + 1 Package',
        'جبس وألوان',
        '+ Free coloring workshop + Party included'
      ],
      price: 'EGP 150',
      priceNum: 150,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'sisters-weekend',
      titleEn: 'Sisters Weekend',
      titleAr: 'تذكرة الأختين نهاية الأسبوع',
      saveBadge: 'Save 120 EGP',
      age: 'Ages 1 - 3',
      features: [
        'Entry for 2 kids + 2 Package',
        'جبس وألوان',
        '+ Free coloring workshop + Party included'
      ],
      price: 'EGP 250',
      priceNum: 250,
      origPrice: 'EGP 370',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    }
  ];

  const attractions = [
    {
      id: 'ball-pit',
      titleEn: 'Ball Pit',
      titleAr: 'مسبح الكرات',
      img: '/photo/kid-area-pic/explore-ballpit-clean.png',
      fallbackImg: '/photo/kid-area-pic/kids-ball-pit-slide.png',
      desc: 'Giant soft ball pit with safe slides, tunnels, and gentle climbing cushions.'
    },
    {
      id: 'soft-play',
      titleEn: 'Soft Play Maze',
      titleAr: 'مناطق اللعب الناعمة',
      img: '/photo/kid-area-pic/explore-softplay-clean.png',
      fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png',
      desc: 'Multi-level soft maze designed for toddlers to explore balance and coordination.'
    },
    {
      id: 'art-workshop',
      titleEn: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      img: '/photo/kid-area-pic/explore-artworkshop-clean.png',
      fallbackImg: '/photo/kid-area-pic/classic-carousel.png',
      desc: 'Creative corner for gypsum painting, coloring, sand art, and hands-on crafts.'
    }
  ];

  const filteredOffers = useMemo(() => {
    if (!searchQuery.trim()) return offers;
    const q = searchQuery.toLowerCase();
    return offers.filter(
      o => o.titleEn.toLowerCase().includes(q) || 
           o.titleAr.includes(q) || 
           o.features.some(f => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) return attractions;
    const q = searchQuery.toLowerCase();
    return attractions.filter(
      a => a.titleEn.toLowerCase().includes(q) || a.titleAr.includes(q)
    );
  }, [searchQuery]);

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

      {/* Zone Hero Banner: Kids Area (fixed, does not move automatically) */}
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

      {/* 2x2 Offer Cards Grid */}
      <div className="offers-grid-2x2">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="offer-card-item">
            {/* Top Cyan Save Badge */}
            <div className="offer-save-badge">{offer.saveBadge}</div>

            {/* Collage Thumbnail */}
            <div className="offer-thumb-container">
              <img 
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

      {/* 3 Attraction Cards */}
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
              <img 
                src={attr.img} 
                alt={attr.titleEn} 
                className="attr-card-img"
                onError={(e) => {
                  e.currentTarget.src = attr.fallbackImg;
                }}
              />
              <div className="attr-overlay-labels">
                <div className="attr-en-name">{attr.titleEn}</div>
                <div className="attr-ar-name">{attr.titleAr}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EXPLORE 360° Button matching screenshot */}
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
              // fallback SVG if png fails
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
