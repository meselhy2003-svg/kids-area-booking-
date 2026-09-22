import React, { useRef } from 'react';

export default function MobileHomePage({ setActiveTab, openModal, lang }) {
  const chooseSectionRef = useRef(null);

  const scrollToExperience = () => {
    if (chooseSectionRef.current) {
      chooseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const galleryImages = [
    { src: '/photo/kid-area-pic/kids-ball-pit-slide.png', title: 'Ball Pit Fun' },
    { src: '/photo/kid-area-pic/family-skeeball.png', title: 'Celebration Moments' },
    { src: '/photo/kid-area-pic/photo-vr-friends.png', title: 'VR Gaming Arena' },
    { src: '/photo/kid-area-pic/girl-rope-bridge.png', title: 'Suspension Bridge' },
    { src: '/photo/kid-area-pic/classic-carousel.png', title: 'Grand Carousel' },
    { src: '/photo/kid-area-pic/birthday-party-cake.png', title: 'Birthday Parties' },
    { src: '/photo/kid-area-pic/toddler-soft-ball-pit.png', title: 'Toddler Joy' },
    { src: '/photo/kid-area-pic/photo-neon-airhockey.png', title: 'Neon Air Hockey' }
  ];

  const fourWaysItems = [
    {
      title: 'High-Octane Racing',
      img: '/photo/kid-area-pic/high-octane-racing.png',
      action: () => setActiveTab('challenge')
    },
    {
      title: 'Fast-Paced Air Hockey',
      img: '/photo/kid-area-pic/fast-paced-air-hockey.png',
      action: () => setActiveTab('challenge')
    },
    {
      title: 'Climbing & High Ropes',
      img: '/photo/kid-area-pic/high-ropes-course.png',
      action: () => setActiveTab('adventure')
    },
    {
      title: 'Endless Arcade Battles',
      img: '/photo/kid-area-pic/family-skeeball.png',
      action: () => setActiveTab('challenge')
    }
  ];

  return (
    <div className="mobile-home-container">
      {/* Hero Section strictly matching media_1790115680651.png */}
      <section className="mobile-hero-section">
        <div className="hero-text-content">
          <h1 className="hero-main-title">
            <span className="hero-title-line">
              <span style={{ color: '#ffffff' }}>P</span>
              <span style={{ color: '#00a9c3' }}>L</span>
              <span style={{ color: '#f7a81b' }}>A</span>
              <span style={{ color: '#ffffff' }}>Y. </span>
              <span style={{ color: '#ffffff' }}>C</span>
              <span style={{ color: '#f7a81b' }}>H</span>
              <span style={{ color: '#f7a81b' }}>A</span>
              <span style={{ color: '#ffffff' }}>L</span>
              <span style={{ color: '#ffffff' }}>L</span>
              <span style={{ color: '#f7a81b' }}>E</span>
              <span style={{ color: '#f7a81b' }}>N</span>
              <span style={{ color: '#00a9c3' }}>G</span>
              <span style={{ color: '#00a9c3' }}>E</span>
              <span style={{ color: '#ffffff' }}>.</span>
            </span>
            <br />
            <span className="hero-title-line">
              <span style={{ color: '#f7a81b' }}>A</span>
              <span style={{ color: '#f7a81b' }}>D</span>
              <span style={{ color: '#00a9c3' }}>V</span>
              <span style={{ color: '#00a9c3' }}>E</span>
              <span style={{ color: '#ffffff' }}>N</span>
              <span style={{ color: '#f7a81b' }}>T</span>
              <span style={{ color: '#00a9c3' }}>U</span>
              <span style={{ color: '#ffffff' }}>R</span>
              <span style={{ color: '#f7a81b' }}>E</span>
              <span style={{ color: '#f7a81b' }}>.</span>
            </span>
          </h1>

          <p className="hero-subtitle-desc">
            Choose your zone and start your experience.
          </p>

          <button 
            className="hero-primary-cta" 
            onClick={() => {
              const el = document.getElementById('choose-experience');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveTab('package');
              }
            }}
            aria-label="Explore All Zones"
          >
            <span>EXPLORE ALL ZONES</span>
            <span className="btn-arrow-sym">→</span>
          </button>

          <button 
            className="hero-secondary-cta"
            onClick={() => openModal('virtual-tour')}
            aria-label="Watch Video Tour"
          >
            <span className="video-play-badge">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffffff">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            </span>
            <span className="video-btn-txt">Watch Video Tour</span>
          </button>

          {/* Thin Divider */}
          <div className="hero-divider-line" />

          {/* 3 Quick Stat Badges strictly matching screenshot */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <div className="stat-icon-wrap stat-icon-teal">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00a9c3" strokeWidth="2.4">
                  <circle cx="7" cy="7" r="3" />
                  <circle cx="17" cy="7" r="3" />
                  <circle cx="7" cy="17" r="3" />
                  <circle cx="17" cy="17" r="3" />
                </svg>
              </div>
              <div className="stat-num">4 Distinct Zones</div>
              <div className="stat-desc">Toddlers to daredevils</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap stat-icon-yellow">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f7a81b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M7 8V6a2 2 0 0 1 2-2h2" />
                  <path d="M17 8V6a2 2 0 0 0-2-2h-2" />
                  <path d="M7 16v2a2 2 0 0 0 2 2h2" />
                  <path d="M17 16v2a2 2 0 0 1-2 2h-2" />
                </svg>
              </div>
              <div className="stat-num">50+ Games</div>
              <div className="stat-desc">Arcades & kinetic thrill</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap stat-icon-orange">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                  <circle cx="17" cy="9" r="2.2" />
                  <path d="M18 19v-1a3 3 0 0 0-2-2.82" />
                  <path d="M19 4l2 1.5L19 7V4z" fill="#f59e0b" />
                </svg>
              </div>
              <div className="stat-num">Family Fun</div>
              <div className="stat-desc">Safe certified all ages</div>
            </div>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR EXPERIENCE Section */}
      <section className="choose-experience-section" ref={chooseSectionRef} id="choose-experience">
        <div className="section-label-tag">DISCOVER OUR ZONES</div>
        <h2 className="section-colorful-heading">
          <span className="txt-orange">CH</span>
          <span className="txt-navy">OO</span>
          <span className="txt-yellow">SE </span>
          <span className="txt-teal">YOUR </span>
          <span className="txt-navy">EX</span>
          <span className="txt-yellow">PER</span>
          <span className="txt-navy">IENCE</span>
        </h2>
        <p className="section-intro-text">
          Each zone is packed with thrills for all ages! Pick your favorite and jump right in!
        </p>

        {/* 4 Cards */}
        <div className="experience-cards-list">
          {/* Card 1: Kids Area */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/toddler-soft-ball-pit.png" 
                alt="Kids Area" 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">TODDLER & SOFT PLAY</span>
              <span className="exp-badge-pill pill-right pill-yellow">Ages 1 - 3</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">KIDS AREA</h3>
              <p className="exp-card-tagline">Safe exploration for little adventurers</p>
              <p className="exp-card-desc">
                Ball pits, soft slides, creative play, and sensory activities designed specially for young kids.
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('kids-area');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                EXPLORE KIDS AREA &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 2: Fun Park */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/family-bumper-cars.png" 
                alt="Fun Park" 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">BUMPER CARS & CLASSIC RIDES</span>
              <span className="exp-badge-pill pill-right pill-yellow">Ages 4 - 12</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">FUN PARK</h3>
              <p className="exp-card-tagline">High-energy fun with rides and attractions</p>
              <p className="exp-card-desc">
                Bumper cars, carousel, racing tracks, trampolines, and interactive play for the whole family.
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('fun-park');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                EXPLORE FUN PARK &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 3: Challenge Zone */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/kid-vr-headset.png" 
                alt="Challenge Zone" 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">ARCADE, VR & ESPORTS</span>
              <span className="exp-badge-pill pill-right pill-yellow">Teens & Adults</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">CHALLENGE ZONE</h3>
              <p className="exp-card-tagline">Thrilling arcade & virtual reality challenges</p>
              <p className="exp-card-desc">
                Next-gen VR headsets, competitive arcade machines, air hockey, and thrilling sports challenges.
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('challenge');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                EXPLORE CHALLENGE ZONE &nbsp; &gt;
              </button>
            </div>
          </div>

          {/* Card 4: Adventure Zone */}
          <div className="exp-card">
            <div className="exp-card-media">
              <img 
                src="/photo/kid-area-pic/high-ropes-course.png" 
                alt="Adventure Zone" 
                className="exp-card-img"
              />
              <span className="exp-badge-pill pill-left">CLIMBING & HIGH ROPES</span>
              <span className="exp-badge-pill pill-right pill-yellow">Thrill Seekers</span>
            </div>
            <div className="exp-card-body">
              <h3 className="exp-card-title">ADVENTURE ZONE</h3>
              <p className="exp-card-tagline">Test your limits with high-altitude rope courses & climbing</p>
              <p className="exp-card-desc">
                Suspended rope bridges, climbing walls, obstacle courses, and ziplines for true adventurers.
              </p>
              <button 
                className="exp-card-btn"
                onClick={() => {
                  setActiveTab('adventure');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                EXPLORE ADVENTURE ZONE &nbsp; &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ONE PLACE, FOUR WAYS TO HAVE FUN. */}
      <section className="four-ways-section">
        <h2 className="four-ways-title">
          <span className="txt-navy">ONE PLACE, </span>
          <span className="txt-teal">FOUR WAYS </span>
          <br />
          <span className="txt-yellow">TO HAVE </span>
          <span className="txt-navy">FUN.</span>
        </h2>
        <p className="four-ways-subtitle">
          Explore the thrills inside and outside PlayZone - fun that never stops for any age!
        </p>

        <div className="four-ways-grid">
          {fourWaysItems.map((item, idx) => (
            <div 
              key={idx} 
              className="four-way-tile" 
              onClick={item.action}
              role="button"
              tabIndex={0}
            >
              <img src={item.img} alt={item.title} className="tile-bg-img" />
              <div className="tile-overlay">
                <span className="tile-title">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOMENTS OF PURE JOY / PLAYZONE VIBES */}
      <section className="playzone-vibes-section">
        <div className="section-label-tag">MOMENTS OF PURE JOY</div>
        <h2 className="vibes-heading">
          <span className="txt-teal">PLAY</span>
          <span className="txt-yellow">ZONE </span>
          <span className="txt-teal">VIBES</span>
        </h2>
        <p className="vibes-subtitle">
          See the thrills, the smiles, and unforgettable memories captured live at our zones!
        </p>

        <div className="vibes-masonry-grid">
          {galleryImages.map((item, idx) => (
            <div 
              key={idx} 
              className="vibe-tile"
              onClick={() => openModal('lightbox', { images: galleryImages, activeIndex: idx })}
            >
              <img src={item.src} alt={item.title} className="vibe-img" loading="lazy" />
              <div className="vibe-hover-sheen" />
            </div>
          ))}
        </div>
      </section>

      {/* READY TO PLAY? Card */}
      <section className="ready-to-play-card">
        <div className="ready-card-content">
          <span className="ready-label">ARE YOU READY?</span>
          <h2 className="ready-title">
            <span className="txt-white">READY </span>
            <span className="txt-yellow">TO </span>
            <span className="txt-teal">PLAY?</span>
          </h2>
          <p className="ready-skip-text" style={{ fontSize: '0.78rem', color: '#bce3ea', marginBottom: '10px' }}>
            ... and skip the line.
          </p>

          <button 
            className="ready-ticket-btn hero-packages-cta"
            onClick={() => setActiveTab('package')}
            aria-label="View Packages & Offers"
          >
            <img 
              src="/photo/kid-area-pic/icon/Vector (3).png" 
              alt="ticket" 
              className="btn-ticket-vector-icon" 
            />
            <span>VIEW PACKAGES & OFFERS</span>
          </button>

          <div className="ready-links-list">
            <a 
              href="#packages" 
              onClick={(e) => { e.preventDefault(); setActiveTab('package'); }}
              className="ready-link-item"
            >
              Group & Birthday Packages
            </a>
            <a 
              href="#trips" 
              onClick={(e) => { e.preventDefault(); openModal('info', { title: 'School Field Trips', text: 'Special discounted group rates for schools, academies, and private groups. Contact us for custom timing and catering!' }); }}
              className="ready-link-item"
            >
              Plan a School Field Trip
            </a>
            <a 
              href="#hours" 
              onClick={(e) => { e.preventDefault(); openModal('info', { title: 'Opening Hours & Location', text: 'Open daily from 10:00 AM to 11:30 PM. Located in Ismailia American Dream Park.' }); }}
              className="ready-link-item"
            >
              Directions & Opening Hours
            </a>
          </div>
        </div>
      </section>

      {/* Padding space for floating bottom navigation dock */}
      <div className="bottom-nav-spacer" />
    </div>
  );
}
