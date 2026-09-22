import React, { useState, useMemo } from 'react';
import RunningHeroBanner from './RunningHeroBanner';

export default function MobileFunParkPage({ setActiveTab, openModal, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTiming, setActiveTiming] = useState('weekend'); // 'weekend' | 'midweek'
  const [activeBannerSlide, setActiveBannerSlide] = useState(1);

  const bannerSlides = [
    {
      titleEn: 'Family Adventure',
      subtitleEn: 'Together moments & shared joy!',
      titleAr: 'مغامرات العائلة',
      subtitleAr: 'لحظات مشتركة وأجواء ساحرة!',
      badge: 'All Ages Welcome!',
      bgGradient: 'linear-gradient(135deg, #092c3a 0%, #0e4c5b 60%, #156d7f 100%)'
    },
    {
      titleEn: 'Fun Park',
      subtitleEn: 'world of fun, laughter, and endless smiles',
      titleAr: 'منطقة المرح',
      subtitleAr: 'عالم من المرح والضحك والابتسامات التي لا تنتهي',
      badge: 'Play Explore Learn Together!',
      bgGradient: 'linear-gradient(135deg, #082935 0%, #0d4653 60%, #136272 100%)'
    },
    {
      titleEn: 'Adrenaline Rides',
      subtitleEn: 'Bumper cars, speedway & arcade thrills!',
      titleAr: 'حلبات وحركات',
      subtitleAr: 'سباقات وتصادم وألعاب حماسية!',
      badge: 'Unlimited Smiles!',
      bgGradient: 'linear-gradient(135deg, #072a31 0%, #0b515d 60%, #127a89 100%)'
    }
  ];

  const weekendOffers = [
    {
      id: 'fun-single-weekend-1',
      titleEn: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'Save 85 EGP',
      age: 'Ages 4 – 12',
      features: [
        'All-day entry + 2 Game(1 VR, 1 Basketball) + Party'
      ],
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'fun-single-weekend-2',
      titleEn: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'Save 85 EGP',
      age: 'Ages 4 – 12',
      features: [
        'All-day entry + 2 Game(1 VR, 1 Basketball) + Party'
      ],
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'fun-family-weekend',
      titleEn: 'Family Weekend Duo',
      titleAr: 'تذكرة الثنائي نهاية الأسبوع',
      saveBadge: 'Save 150 EGP',
      age: 'Ages 4 – 12',
      features: [
        'Entry for 2 kids + 4 Games (2 VR, 2 Racing) + Party'
      ],
      price: 'EGP 190',
      priceNum: 190,
      origPrice: 'EGP 340',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    }
  ];

  const midweekOffers = [
    {
      id: 'fun-single-midweek',
      titleEn: 'Single Midweek Pass',
      titleAr: 'تذكرة فردية منتصف الأسبوع',
      saveBadge: 'Save 100 EGP',
      age: 'Ages 4 – 12',
      features: [
        'All-day unlimited rides + 2 Arcade Tokens'
      ],
      price: 'EGP 85',
      priceNum: 85,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'fun-afterschool-midweek',
      titleEn: 'After-School Rush',
      titleAr: 'تذكرة بعد المدرسة',
      saveBadge: 'Save 90 EGP',
      age: 'Ages 4 – 12',
      features: [
        'Entry from 2 PM to 9 PM + Free Popcorn & Juice'
      ],
      price: 'EGP 75',
      priceNum: 75,
      origPrice: 'EGP 165',
      thumb: '/photo/kid-area-pic/graphic-composition.png'
    },
    {
      id: 'fun-siblings-midweek',
      titleEn: 'Siblings Midweek Special',
      titleAr: 'تذكرة الإخوة منتصف الأسبوع',
      saveBadge: 'Save 160 EGP',
      age: 'Ages 4 – 12',
      features: [
        'Entry for 2 + 4 Token Games + Free Bumper Car Ride'
      ],
      price: 'EGP 140',
      priceNum: 140,
      origPrice: 'EGP 300',
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
      desc: 'Adventure ball pit with interactive climbing frames and colorful slide.'
    },
    {
      id: 'soft-play',
      titleEn: 'Soft Play Maze',
      titleAr: 'مناطق اللعب الناعمة',
      img: '/photo/kid-area-pic/explore-softplay-clean.png',
      fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png',
      desc: 'Exciting multi-tier climbing tower with rope ladders and suspension tunnels.'
    },
    {
      id: 'art-workshop',
      titleEn: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      img: '/photo/kid-area-pic/explore-artworkshop-clean.png',
      fallbackImg: '/photo/kid-area-pic/classic-carousel.png',
      desc: 'Hands-on creative workshop with painting, pottery, and fun crafts.'
    }
  ];

  const currentOffers = activeTiming === 'weekend' ? weekendOffers : midweekOffers;

  const filteredOffers = useMemo(() => {
    if (!searchQuery.trim()) return currentOffers;
    const q = searchQuery.toLowerCase();
    return currentOffers.filter(
      o => o.titleEn.toLowerCase().includes(q) || 
           o.titleAr.includes(q) || 
           o.features.some(f => f.toLowerCase().includes(q))
    );
  }, [searchQuery, currentOffers]);

  return (
    <div className="mobile-zone-page fun-park-screen">
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

      {/* Zone Hero Banner: Fun Park (fixed, does not move automatically) */}
      <RunningHeroBanner slideIndex={1} setActiveTab={setActiveTab} />

      {/* Section Header: Fun park Offers | عروض منطقة المرح */}
      <div className="zone-section-header">
        <div className="section-title-combo">
          <span className="title-part-en">Fun park Offers</span>
          <span className="title-divider">|</span>
          <span className="title-part-ar">عروض منطقة المرح</span>
        </div>
        <div className="section-header-actions">
          <span className="age-pill-badge">Ages 4 – 12</span>
        </div>
      </div>

      {/* Weekend vs Mid-Week Toggle Pills matching screenshot 3 */}
      <div className="timing-toggle-container">
        <button 
          className={`timing-pill-btn pill-weekend ${activeTiming === 'weekend' ? 'active' : ''}`}
          onClick={() => setActiveTiming('weekend')}
        >
          <div className="pill-en-styled">
            <span className="w-col-1">W</span>
            <span className="w-col-2">ee</span>
            <span className="w-col-3">k</span>
            <span className="w-col-4">e</span>
            <span className="w-col-5">nd</span>
          </div>
          <div className="pill-ar">نهاية الأسبوع</div>
        </button>

        <button 
          className={`timing-pill-btn pill-midweek ${activeTiming === 'midweek' ? 'active' : ''}`}
          onClick={() => setActiveTiming('midweek')}
        >
          <div className="pill-en-styled">
            <span className="m-col-1">Mid</span>
            <span>-</span>
            <span className="m-col-2">Week</span>
          </div>
          <div className="pill-ar">منتصف الأسبوع</div>
        </button>
      </div>

      {/* Horizontal Scroll / 2-Column Offers matching screenshot 3 */}
      <div className="offers-slider-row">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="offer-card-item card-slider-item">
            <div className="offer-save-badge">{offer.saveBadge}</div>

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
                <span className="price-current">{offer.price}</span>
                <span className="price-orig">{offer.origPrice}</span>
              </div>

              <button 
                className="get-offer-btn"
                onClick={() => openModal('booking', {
                  name: `${offer.titleEn} - Fun Park`,
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

      {/* Explore Fun Park Section */}
      <div className="zone-section-header" style={{ marginTop: '2rem' }}>
        <h3 className="section-title-plain">Explore Fun Park</h3>
        <button 
          className="see-all-link"
          onClick={() => openModal('all-attractions', { zone: 'Fun Park', attractions })}
        >
          See All &gt;
        </button>
      </div>

      {/* 3 Attraction Cards */}
      <div className="explore-attractions-row">
        {attractions.map((attr) => (
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
          <span className="explore-360-text">EXPLORE 360°</span>
        </button>
      </div>

      {/* Spacer for bottom nav dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
