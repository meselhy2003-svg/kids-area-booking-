import React, { useState, useEffect } from 'react';
import { useEventsMedia } from '../../hooks';
import BirthdayBuilderPage from './BirthdayBuilderPage';
import './DesktopEventsPage.css';

export default function DesktopEventsPage({ setActiveTab, openModal, lang = 'ar' }) {
  // Sub-view: 'overview' | 'birthday-builder'
  const [eventsSubView, setEventsSubView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('birthday')) {
      return 'birthday-builder';
    }
    return 'overview';
  });

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined') {
        if (window.location.hash.includes('birthday')) {
          setEventsSubView('birthday-builder');
        } else if (window.location.hash === '#events') {
          setEventsSubView('overview');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Media Hook: Synchronous cache hydration + background revalidation with server replacement
  const { 
    heroSlides, 
    vibeItems, 
    currentSlide, 
    setCurrentSlide,
    currentHero 
  } = useEventsMedia();

  // Lightbox State
  const [lightboxData, setLightboxData] = useState(null);

  const occasionCards = [
    {
      id: 'birthday',
      title: lang === 'ar' ? 'حفلات أعياد الميلاد' : 'Birthday',
      tag: lang === 'ar' ? 'لكل الأعمار' : 'AGES 1 - 99',
      image: '/photo/kid area pic/Image (1).png',
      iconBadge: '/photo/kid area pic/icon/Icon99.png',
      desc: lang === 'ar'
        ? 'احتفالات أعياد ميلاد لا تُنسى مع ديكورات مميزة، ودخول مناطق الألعاب، وتورتة وبوفيه شهي، وفريق ترفيهي واستعراضي خاص.'
        : 'Unforgettable birthday celebrations with themed decorations, energetic Play Zone access, delicious customized catering, dedicated party animators, and hassle-free planning for parents.',
      btnText: lang === 'ar' ? 'استكشف حفلات أعياد الميلاد' : 'Explore Birthday',
      bookingData: {
        type: lang === 'ar' ? 'حفل عيد ميلاد' : 'Birthday Celebration',
        name: lang === 'ar' ? 'باقة عيد ميلاد لا يُنسى' : 'Unforgettable Birthday Celebration',
        price: lang === 'ar' ? '٢,٥٠٠ ج.م' : '2,500 EGP',
        priceNum: 2500,
        discount: lang === 'ar' ? 'تشمل الديكور + تذاكر الألعاب + مراسم التورتة' : 'Includes Themed Decor + Play Zone Passes + Cake Ceremony',
        guests: lang === 'ar' ? 'حتى ٣٠ طفلاً + أولياء الأمور' : 'Up to 30 Kids + Parents',
        occasion: 'birthday'
      }
    },
    {
      id: 'family',
      title: lang === 'ar' ? 'اللقاءات العائلية والمناسبات' : 'Family Gathering',
      tag: lang === 'ar' ? 'لكل أفراد العائلة' : 'MULTI-GEN',
      image: '/photo/kid area pic/Image (2).png',
      iconBadge: '/photo/kid area pic/icon/Icon (11)12.png',
      desc: lang === 'ar'
        ? 'أجواء عائلية دافئة تجمع كل الأجيال. استمتع بجلسات خاصة مطلة على البحر، ومأكولات شهية، وإطلالة ساحرة على قناة السويس في الهواء الطلق.'
        : 'Cherished reunions and intimate milestones where all generations connect. Enjoy private seaside lounge seating, family-style Mediterranean feasts, and relaxing open-air Suez Canal views.',
      btnText: lang === 'ar' ? 'استكشف اللقاءات العائلية' : 'Explore Family Gathering',
      bookingData: {
        type: lang === 'ar' ? 'لقاء عائلي خاص' : 'Family Gathering',
        name: lang === 'ar' ? 'جلسة عائلية خاصة على البحر' : 'Private Seaside Family Gathering',
        price: lang === 'ar' ? '٣,٨٠٠ ج.م' : '3,800 EGP',
        priceNum: 3800,
        discount: lang === 'ar' ? 'استراحة مطلة على القناة + وجبات عائلية + مشروبات' : 'Seaside Lounge + Family Feast + Unlimited Hot Beverages',
        guests: lang === 'ar' ? 'حتى ٥٠ فرداً من العائلة' : 'Up to 50 Family Members',
        occasion: 'family'
      }
    },
    {
      id: 'general',
      title: lang === 'ar' ? 'الحفلات والفعاليات الكبرى' : 'General Event',
      tag: lang === 'ar' ? 'سعة حتى ٤٥٠ فرداً' : 'UP TO 450 GUESTS',
      image: '/photo/kid area pic/Image (3).png',
      iconBadge: '/photo/kid area pic/icon/Icon (9).png',
      desc: lang === 'ar'
        ? 'من حفلات التخرج والخطوبات إلى المؤتمرات واللقاءات السنوية، قاعاتنا تتسع لكافة احتياجاتكم مع أحدث أنظمة الصوت والإضاءة والشاشات العملاقة.'
        : 'From graduation banquets and private gala evenings to corporate retreats and community gatherings, our versatile halls adapt to your vision with state-of-the-art audiovisual systems and concierge hospitality.',
      btnText: lang === 'ar' ? 'استكشف القاعات الكبرى' : 'Explore General Events',
      bookingData: {
        type: lang === 'ar' ? 'حفل أو فعالية كبرى' : 'General Event & Gala',
        name: lang === 'ar' ? 'حجز القاعة الكبرى والبانكيت' : 'Grand Event & Gala Banqueting',
        price: lang === 'ar' ? '٦,٥٠٠ ج.م' : '6,500 EGP',
        priceNum: 6500,
        discount: lang === 'ar' ? 'دخول كامل للقاعة + أنظمة صوت وضوء + خدمة كونسيرج' : 'Full Ballroom Access + Audio-Visual Systems + Concierge Service',
        guests: lang === 'ar' ? 'حتى ٤٥٠ ضيفاً' : 'Up to 450 Guests',
        occasion: 'general'
      }
    }
  ];

  const openVibeModal = (item) => {
    setLightboxData(item);
  };

  if (eventsSubView === 'birthday-builder') {
    return (
      <BirthdayBuilderPage 
        onBack={() => {
          setEventsSubView('overview');
          if (typeof window !== 'undefined') window.location.hash = 'events';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setActiveTab={setActiveTab}
        openModal={openModal}
      />
    );
  }

  return (
    <div className="events-page-wrapper">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: EVENTS & HALLS */}
      {/* ========================================================================= */}
      <section className="events-hero-section">
        <div className="events-hero-container">
          {/* Main Title with precise alternating colors matching mockup */}
          <h1 className="events-title">
            {lang === 'ar' ? (
              <>
                <span className="letter-cyan">الحفلات </span>
                <span className="letter-navy">والقاعات</span>
              </>
            ) : (
              <>
                <span className="letter-cyan">E</span>
                <span className="letter-navy">V</span>
                <span className="letter-cyan">E</span>
                <span className="letter-navy">N</span>
                <span className="letter-cyan">T</span>
                <span className="letter-navy">S</span>
                <span className="letter-navy">&nbsp;&amp;&nbsp;</span>
                <span className="letter-cyan">H</span>
                <span className="letter-navy">A</span>
                <span className="letter-cyan">L</span>
                <span className="letter-navy">L</span>
                <span className="letter-cyan">S</span>
              </>
            )}
          </h1>

          {/* Subheading */}
          <h2 className="events-subtitle">
            {lang === 'ar' ? 'مناسبتك. مساحتك الخاصة. لحظات تدوم.' : 'Your event. Your space. Your moment.'}
          </h2>

          {/* Descriptive Paragraph */}
          <p className="events-description">
            {lang === 'ar'
              ? 'اختر المساحة المثالية لاحتفالك. من اللقاءات العائلية الدافئة إلى أضخم المناسبات، قاعاتنا على ضفاف قناة السويس تقدم أرقى بوفيهات الطعام والإضاءة والإشراف المتكامل.'
              : 'Find the perfect space for your celebration. From intimate gatherings to grand milestones, our waterfront venue brings world-class catering, ambient lighting, and personalized event management.'}
          </p>

          {/* Hero Banner Image with Carousel */}
          <div 
            className="events-hero-banner-wrap"
            onClick={() => openModal && openModal('booking', {
              name: lang === 'ar' ? 'قاعة أمريكان دريم الكبرى على القناة' : 'American Dream Grand Waterfront Hall',
              price: lang === 'ar' ? '٤,٥٠٠ ج.م' : '4,500 EGP',
              priceNum: 4500,
              discount: lang === 'ar' ? 'بانكيت مطل على البحر • سعة ٤٥٠ فرداً' : 'Waterfront Banquet • Up to 450 Guests',
              details: lang === 'ar' ? 'تنظيم احتفالات راقية مع مسرح وأنظمة صوت وإضاءة متكاملة.' : 'Bespoke event planning with waterfront dining, stage & sound setup.'
            })}
            title={lang === 'ar' ? 'اضغط لحجز أو استكشاف القاعة الكبرى' : 'Click to reserve or explore the Grand Waterfront Hall'}
          >
            <img 
              src={heroSlides[currentSlide]?.src || heroSlides[0]?.src} 
              alt={heroSlides[currentSlide]?.alt || 'American Dream Ismailia luxury event hall'}
              className="events-hero-banner-img"
              onError={(e) => {
                const fallback = heroSlides[currentSlide]?.fallbackSrc || heroSlides[0]?.fallbackSrc;
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />
            <div className="events-hero-banner-overlay" />

            {/* 3 Carousel Indicator Dots on the bottom-left */}
            <div className="events-carousel-dots" onClick={(e) => e.stopPropagation()}>
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  className={`events-carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  title={slide.title}
                />
              ))}
            </div>

            {/* Floating 360 Tour / Inquiry CTA */}
            <button 
              type="button" 
              className="events-hero-tour-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (openModal) openModal('virtual-tour');
              }}
              title={lang === 'ar' ? 'جولة افتراضية ٣٦٠° في القاعات' : 'Launch 360° Virtual Tour'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{lang === 'ar' ? 'جولة افتراضية ٣٦٠°' : '360° Hall Tour'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE YOUR OCCASION SECTION */}
      {/* ========================================================================= */}
      <section className="events-occasion-section">
        <div className="events-occasion-container">
          <div className="events-occasion-header">
            {/* Colorful letters matching mockup */}
            <h2 className="events-occasion-title">
              {lang === 'ar' ? (
                <>
                  <span style={{ color: '#22d3ee' }}>اختر </span>
                  <span style={{ color: '#fb923c' }}>مناسبتك </span>
                  <span style={{ color: '#22d3ee' }}>المميزة</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#22d3ee' }}>C</span>
                  <span style={{ color: '#ffffff' }}>h</span>
                  <span style={{ color: '#ffffff' }}>o</span>
                  <span style={{ color: '#fb923c' }}>o</span>
                  <span style={{ color: '#22d3ee' }}>s</span>
                  <span style={{ color: '#ffffff' }}>e</span>
                  <span>&nbsp;</span>
                  <span style={{ color: '#ffffff' }}>Y</span>
                  <span style={{ color: '#fb923c' }}>o</span>
                  <span style={{ color: '#22d3ee' }}>u</span>
                  <span style={{ color: '#ffffff' }}>r</span>
                  <span>&nbsp;</span>
                  <span style={{ color: '#ffffff' }}>O</span>
                  <span style={{ color: '#22d3ee' }}>c</span>
                  <span style={{ color: '#ffffff' }}>c</span>
                  <span style={{ color: '#fb923c' }}>a</span>
                  <span style={{ color: '#ffffff' }}>s</span>
                  <span style={{ color: '#22d3ee' }}>i</span>
                  <span style={{ color: '#fb923c' }}>o</span>
                  <span style={{ color: '#22d3ee' }}>n</span>
                </>
              )}
            </h2>
            <p className="events-occasion-subtitle">
              {lang === 'ar'
                ? 'باقات مخصصة، ومنسقو حفلات محترفون، وقاعات مجهزة بالكامل لتجعل مناسبتك ذكرى لا تُنسى.'
                : 'Explore tailored packages, dedicated event hosts, and customizable venues crafted for your special day.'}
            </p>
          </div>

          {/* 3 Occasion Cards Grid */}
          <div className="events-occasion-grid">
            {occasionCards.map((card) => (
              <div key={card.id} className="events-card">
                {/* Card Top Image with Floating Icon Badge */}
                <div className="events-card-image-wrap">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="events-card-img" 
                  />
                  <div className="events-card-badge-icon" title={card.title}>
                    <img 
                      src={card.iconBadge} 
                      alt="" 
                      onError={(e) => {
                        e.target.src = '/photo/kid area pic/icon/Symbol.png';
                      }}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="events-card-body">
                  <div className="events-card-header-row">
                    <h3 className="events-card-title">{card.title}</h3>
                    <span className="events-card-tag">{card.tag}</span>
                  </div>

                  <p className="events-card-desc">{card.desc}</p>

                  {/* Orange Gradient Pill Button */}
                  <button 
                    type="button" 
                    className="events-card-btn"
                    onClick={() => {
                      if (card.id === 'birthday') {
                        setEventsSubView('birthday-builder');
                        if (typeof window !== 'undefined') window.location.hash = 'events/birthday';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        openModal && openModal('booking', card.bookingData);
                      }
                    }}
                  >
                    <span>{card.btnText}</span>
                    <span className="events-card-btn-arrow">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VIBES OF EVENTS SECTION (MOSAIC PHOTO GALLERY) */}
      {/* ========================================================================= */}
      <section className="events-vibes-section">
        <div className="events-vibes-container">
          <div className="events-vibes-header">
            {/* Colorful letters matching mockup */}
            <h2 className="events-vibes-title">
              {lang === 'ar' ? (
                <>
                  <span style={{ color: '#f59e0b' }}>أجواء </span>
                  <span style={{ color: '#00a8cc' }}>الحفلات </span>
                  <span style={{ color: '#0d2847' }}>والفعاليات</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#f59e0b' }}>V</span>
                  <span style={{ color: '#00a8cc' }}>I</span>
                  <span style={{ color: '#0d2847' }}>B</span>
                  <span style={{ color: '#00a8cc' }}>E</span>
                  <span style={{ color: '#00a8cc' }}>S</span>
                  <span>&nbsp;</span>
                  <span style={{ color: '#00a8cc' }}>O</span>
                  <span style={{ color: '#0d2847' }}>F</span>
                  <span>&nbsp;</span>
                  <span style={{ color: '#f59e0b' }}>E</span>
                  <span style={{ color: '#00a8cc' }}>V</span>
                  <span style={{ color: '#0d2847' }}>E</span>
                  <span style={{ color: '#00a8cc' }}>N</span>
                  <span style={{ color: '#00a8cc' }}>T</span>
                  <span style={{ color: '#00a8cc' }}>S</span>
                </>
              )}
            </h2>
            <p className="events-vibes-subtitle">
              {lang === 'ar'
                ? 'عش اللحظة. اشعر بالأجواء الساحرة. كل احتفال يصنع ذكرى لا تُنسى.'
                : 'See the moments. Feel the atmosphere. Every celebration is tailored to perfection.'}
            </p>
          </div>

          {/* Mosaic Grid matching exact layout in mockup */}
          <div className="events-mosaic-grid">
            {/* Top Row: 3 Columns (Left large, Middle floral, Right stacked 2 cards) */}
            <div className="events-mosaic-top-row">
              {/* Column 1: Family Birthday with cake */}
              {vibeItems[0] && (
                <div 
                  className="events-mosaic-card events-mosaic-left"
                  onClick={() => openVibeModal(vibeItems[0])}
                  title={`Click to view full photo: ${vibeItems[0].title}`}
                >
                  <img 
                    src={vibeItems[0].src} 
                    alt={vibeItems[0].alt || vibeItems[0].title} 
                    className="events-mosaic-img" 
                    onError={(e) => {
                      if (vibeItems[0]?.fallbackSrc && e.currentTarget.src !== vibeItems[0].fallbackSrc) {
                        e.currentTarget.src = vibeItems[0].fallbackSrc;
                      }
                    }}
                  />
                  <div className="events-mosaic-overlay">
                    <span className="events-mosaic-caption">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      {vibeItems[0].title}
                    </span>
                  </div>
                </div>
              )}

              {/* Column 2: Floral Dining Setup */}
              {vibeItems[1] && (
                <div 
                  className="events-mosaic-card events-mosaic-mid"
                  onClick={() => openVibeModal(vibeItems[1])}
                  title={`Click to view full photo: ${vibeItems[1].title}`}
                >
                  <img 
                    src={vibeItems[1].src} 
                    alt={vibeItems[1].alt || vibeItems[1].title} 
                    className="events-mosaic-img" 
                    onError={(e) => {
                      if (vibeItems[1]?.fallbackSrc && e.currentTarget.src !== vibeItems[1].fallbackSrc) {
                        e.currentTarget.src = vibeItems[1].fallbackSrc;
                      }
                    }}
                  />
                  <div className="events-mosaic-overlay">
                    <span className="events-mosaic-caption">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      {vibeItems[1].title}
                    </span>
                  </div>
                </div>
              )}

              {/* Column 3: Stacked 2 Cards (Cocktail Reception & Chef Plating) */}
              <div className="events-mosaic-stacked-col">
                {/* Vibe 3: Cocktail reception */}
                {vibeItems[2] && (
                  <div 
                    className="events-mosaic-card"
                    onClick={() => openVibeModal(vibeItems[2])}
                    title={`Click to view full photo: ${vibeItems[2].title}`}
                  >
                    <img 
                      src={vibeItems[2].src} 
                      alt={vibeItems[2].alt || vibeItems[2].title} 
                      className="events-mosaic-img" 
                      onError={(e) => {
                        if (vibeItems[2]?.fallbackSrc && e.currentTarget.src !== vibeItems[2].fallbackSrc) {
                          e.currentTarget.src = vibeItems[2].fallbackSrc;
                        }
                      }}
                    />
                    <div className="events-mosaic-overlay">
                      <span className="events-mosaic-caption">{vibeItems[2].title}</span>
                    </div>
                  </div>
                )}

                {/* Vibe 4: Chef plating */}
                {vibeItems[3] && (
                  <div 
                    className="events-mosaic-card"
                    onClick={() => openVibeModal(vibeItems[3])}
                    title={`Click to view full photo: ${vibeItems[3].title}`}
                  >
                    <img 
                      src={vibeItems[3].src} 
                      alt={vibeItems[3].alt || vibeItems[3].title} 
                      className="events-mosaic-img" 
                      onError={(e) => {
                        if (vibeItems[3]?.fallbackSrc && e.currentTarget.src !== vibeItems[3].fallbackSrc) {
                          e.currentTarget.src = vibeItems[3].fallbackSrc;
                        }
                      }}
                    />
                    <div className="events-mosaic-overlay">
                      <span className="events-mosaic-caption">{vibeItems[3].title}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: 2 Wide Landscape Cards */}
            <div className="events-mosaic-bot-row">
              {/* Vibe 5: Family Canal Sunset Toast */}
              {vibeItems[4] && (
                <div 
                  className="events-mosaic-card"
                  onClick={() => openVibeModal(vibeItems[4])}
                  title={`Click to view full photo: ${vibeItems[4].title}`}
                >
                  <img 
                    src={vibeItems[4].src} 
                    alt={vibeItems[4].alt || vibeItems[4].title} 
                    className="events-mosaic-img" 
                    onError={(e) => {
                      if (vibeItems[4]?.fallbackSrc && e.currentTarget.src !== vibeItems[4].fallbackSrc) {
                        e.currentTarget.src = vibeItems[4].fallbackSrc;
                      }
                    }}
                  />
                  <div className="events-mosaic-overlay">
                    <span className="events-mosaic-caption">{vibeItems[4].title}</span>
                  </div>
                </div>
              )}

              {/* Vibe 6: Fairy lights dance party */}
              {vibeItems[5] && (
                <div 
                  className="events-mosaic-card"
                  onClick={() => openVibeModal(vibeItems[5])}
                  title={`Click to view full photo: ${vibeItems[5].title}`}
                >
                  <img 
                    src={vibeItems[5].src} 
                    alt={vibeItems[5].alt || vibeItems[5].title} 
                    className="events-mosaic-img" 
                    onError={(e) => {
                      if (vibeItems[5]?.fallbackSrc && e.currentTarget.src !== vibeItems[5].fallbackSrc) {
                        e.currentTarget.src = vibeItems[5].fallbackSrc;
                      }
                    }}
                  />
                  <div className="events-mosaic-overlay">
                    <span className="events-mosaic-caption">{vibeItems[5].title}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIGHTBOX MODAL FOR VIBES GALLERY */}
      {/* ========================================================================= */}
      {lightboxData && (
        <div 
          className="events-lightbox-backdrop"
          onClick={() => setLightboxData(null)}
        >
          <button 
            type="button" 
            className="events-lightbox-close"
            onClick={() => setLightboxData(null)}
            aria-label="Close"
          >
            &times;
          </button>

          <div 
            className="events-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="events-lightbox-image-wrap">
              <img 
                src={lightboxData.src} 
                alt={lightboxData.alt || lightboxData.title} 
                className="events-lightbox-img" 
                onError={(e) => {
                  if (lightboxData.fallbackSrc && e.currentTarget.src !== lightboxData.fallbackSrc) {
                    e.currentTarget.src = lightboxData.fallbackSrc;
                  }
                }}
              />
            </div>

            <div className="events-lightbox-info">
              <span className="event-modal-badge">{lightboxData.category}</span>
              <h3 className="events-lightbox-title">{lightboxData.title}</h3>
              <p className="events-lightbox-desc">{lightboxData.subtitle}</p>

              <button 
                type="button" 
                className="events-card-btn"
                style={{ maxWidth: '320px', margin: '0 auto' }}
                onClick={() => {
                  const bData = {
                    name: `${lightboxData.title} Package`,
                    price: lang === 'ar' ? '٣,٠٠٠ ج.م' : '3,000 EGP',
                    priceNum: 3000,
                    discount: `${lightboxData.category} Reservation`,
                    details: lightboxData.subtitle
                  };
                  setLightboxData(null);
                  if (openModal) openModal('booking', bData);
                }}
              >
                <span>{lang === 'ar' ? 'احجز هذه التجربة' : 'Book This Experience'}</span>
                <span className="events-card-btn-arrow">{lang === 'ar' ? '←' : '→'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
