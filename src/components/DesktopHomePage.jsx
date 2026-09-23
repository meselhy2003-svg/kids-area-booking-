import React from 'react';

export default function DesktopHomePage({ setActiveTab, openModal, lang }) {
  const scrollToExperience = () => {
    const el = document.getElementById('choose-experience');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const vibesPhotos = [
    { src: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png', title: 'Ball Pit Joy' },
    { src: '/photo/kid-area-pic/Air Hockey Table.png', title: 'Family Air Hockey' },
    { src: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png', title: 'VR Arena Squad' },
    { src: '/photo/kid-area-pic/girl-rope-bridge.png', title: 'Rope Course Adventure' },
    { src: '/photo/kid-area-pic/Classic illuminated carousel ride.png', title: 'Illuminated Carousel' },
    { src: '/photo/kid-area-pic/Family birthday party celebration with cake.png', title: 'Birthday Milestones' },
    { src: '/photo/kid-area-pic/thumb-bg-eeeee.png', title: 'Cafe Treats' },
    { src: '/photo/kid-area-pic/Photo 8_ Neon Air Hockey.png', title: 'Neon Arcade Battle' },
    { src: '/photo/kid-area-pic/Toddler laughing in soft ball pit.png', title: 'Little Explorers' }
  ];

  return (
    <div className="desktop-page desktop-home-page">
      {/* 1. HERO SECTION */}
      <section className="desktop-hero-section">
        <div className="desktop-hero-bg">
          <img 
            src="/photo/kid-area-pic/hero-banner.png" 
            alt="Play Zone Wide View" 
            className="desktop-hero-bg-img"
            onError={(e) => { e.target.src = '/photo/kid-area-pic/Background+Shadow.png'; }}
          />
          <div className="desktop-hero-overlay" />
        </div>

        <div className="desktop-hero-content">
          <h1 className="desktop-hero-title">
            <span className="title-white">PLAY.</span>{' '}
            <span className="title-word">
              <span className="title-white">C</span>
              <span className="hl-cyan">H</span>
              <span className="title-white">A</span>
              <span className="hl-gold">L</span>
              <span className="hl-gold">L</span>
              <span className="title-white">E</span>
              <span className="hl-cyan">N</span>
              <span className="hl-cyan">G</span>
              <span className="hl-gold">E</span>
              <span className="title-white">.</span>
            </span>
            <br />
            <span className="title-word">
              <span className="title-white">A</span>
              <span className="hl-gold">D</span>
              <span className="hl-gold">V</span>
              <span className="hl-gold">E</span>
              <span className="hl-gold">N</span>
              <span className="hl-cyan">T</span>
              <span className="title-white">U</span>
              <span className="title-white">R</span>
              <span className="title-white">E</span>
              <span className="title-white">.</span>
            </span>
          </h1>
          
          <p className="desktop-hero-subtitle">
            Choose your zone and start your experience.
          </p>

          <div className="desktop-hero-actions">
            <button 
              className="desktop-hero-btn primary hero-glow-btn"
              onClick={scrollToExperience}
            >
              <span>EXPLORE ALL ZONES</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="desktop-btn-arrow">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button 
              className="desktop-hero-btn secondary"
              onClick={() => openModal('video-tour')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-btn-play-icon">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>Watch Video Tour</span>
            </button>
          </div>

          {/* Frosted Glass Stat Badges (Exact text and styling from screenshot) */}
          <div className="desktop-hero-stats">
            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-teal-dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="6" height="16" rx="3" />
                  <rect x="14" y="4" width="6" height="16" rx="3" />
                  <circle cx="7" cy="10" r="1" fill="#ffffff" />
                  <circle cx="17" cy="14" r="1" fill="#ffffff" />
                </svg>
              </div>
              <div className="desktop-stat-text">
                <strong>4 Distinct Zones</strong>
                <span>from toddlers to daredevils</span>
              </div>
            </div>

            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-amber-solid">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div className="desktop-stat-text">
                <strong>50+ Games</strong>
                <span>Modern arcades &amp; kinetic thrill</span>
              </div>
            </div>

            <div className="desktop-stat-badge">
              <div className="desktop-stat-icon-wrap wrap-white-solid">
                <svg viewBox="0 0 24 24" fill="none" stroke="#012b32" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="desktop-stat-text">
                <strong>Family Fun</strong>
                <span>Safe certified for all ages</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR EXPERIENCE SECTION */}
      <section className="desktop-section choose-experience-section" id="choose-experience">
        <div className="desktop-section-container">
          <div className="desktop-section-header">
            <div className="desktop-section-title-wrap">
              <span className="desktop-section-tag">DISCOVER THE THRILLS</span>
              <h2 className="desktop-section-title">CHOOSE YOUR EXPERIENCE</h2>
              <p className="desktop-section-subtitle">
                Four distinct zones designed for every age group and energy level.
              </p>
            </div>
            <div className="desktop-safety-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-safety-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>All tickets include full safety surveillance &amp; lockers</span>
            </div>
          </div>

          {/* 4 ZONE CARDS GRID (2x2) */}
          <div className="desktop-zones-grid">
            {/* 1. KIDS AREA */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Toddler laughing in soft ball pit.png" 
                  alt="Kids Area" 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">SAFE &amp; SOFT PLAY 🧸</span>
                <span className="desktop-zone-age-badge">AGES 1 - 3</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">KIDS AREA</h3>
                <p className="desktop-zone-quote">"A world of fun, laughter, and endless smiles."</p>
                <p className="desktop-zone-desc">
                  Soft play structures, ball pits, sensory games, and visual discovery designed especially for our youngest adventurers.
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    10:00 AM - 11:30 PM
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('kids-area')}
                  >
                    <span>EXPLORE KIDS AREA</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. FUN PARK */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Family bumper car arena.png" 
                  alt="Fun Park" 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">CLASSIC AMUSEMENT &amp; RIDES</span>
                <span className="desktop-zone-age-badge">AGES 4 - 12</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">FUN PARK</h3>
                <p className="desktop-zone-quote">"Where laughter echoes and imaginations take flight."</p>
                <p className="desktop-zone-desc">
                  Non-stop excitement with bumper cars, mini carousels, mega trampolines, climbing walls, and thrilling slides.
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Open All Week 10am-11pm
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('fun-park')}
                  >
                    <span>EXPLORE FUN PARK</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. CHALLENGE ZONE */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Kid wearing VR headset in neon arcade.png" 
                  alt="Challenge Zone" 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">SKILL &amp; COMPETITION</span>
                <span className="desktop-zone-age-badge">ALL AGES &amp; ADULTS</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">CHALLENGE ZONE</h3>
                <p className="desktop-zone-quote">"Challenge your friends to sports, racing, and VR!"</p>
                <p className="desktop-zone-desc">
                  Step into high-stakes arcade battles, laser shooting arenas, air hockey showdowns, and immersive VR simulators.
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Open Until 11:30 PM
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('challenge')}
                  >
                    <span>EXPLORE CHALLENGE ZONE</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. ADVENTURE ZONE */}
            <div className="desktop-zone-card">
              <div className="desktop-zone-img-wrap">
                <img 
                  src="/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png" 
                  alt="Adventure Zone" 
                  className="desktop-zone-img" 
                />
                <span className="desktop-zone-tag-left">HIGH ENERGY &amp; COURSES</span>
                <span className="desktop-zone-age-badge">AGES 6+ &amp; TEENS</span>
              </div>
              <div className="desktop-zone-body">
                <h3 className="desktop-zone-name">ADVENTURE ZONE</h3>
                <p className="desktop-zone-quote">"Unleash your inner explorer on suspended challenges!"</p>
                <p className="desktop-zone-desc">
                  High rope courses, suspended obstacle bridges, climbing challenges, and ninja courses tested for maximum thrills.
                </p>
                <div className="desktop-zone-footer">
                  <span className="desktop-zone-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="desktop-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Harness &amp; Shoes Required
                  </span>
                  <button 
                    className="desktop-zone-btn"
                    onClick={() => setActiveTab('adventure')}
                  >
                    <span>EXPLORE ADVENTURE ZONE</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ONE PLACE. FOUR WAYS TO HAVE FUN. */}
      <section className="desktop-section four-ways-section">
        <div className="desktop-section-container">
          <div className="desktop-center-header">
            <span className="desktop-section-tag">THE ULTIMATE DESTINATION</span>
            <h2 className="desktop-section-title">ONE PLACE. FOUR WAYS TO HAVE FUN.</h2>
            <p className="desktop-section-subtitle">
              From toddlers to teens, and parents too - there's something for everyone
            </p>
          </div>

          <div className="desktop-mosaic-grid">
            {/* Left Card: High-Octane Racing */}
            <div className="mosaic-card left-card" onClick={() => setActiveTab('challenge')}>
              <img src="/photo/kid-area-pic/High-Octane Racing.png" alt="High-Octane Racing" />
              <div className="mosaic-overlay">
                <h3>High-Octane Racing</h3>
              </div>
            </div>

            {/* Center Card: Family Dining Table */}
            <div className="mosaic-card center-card" onClick={() => openModal('restaurant-menu')}>
              <img src="/photo/kid-area-pic/Family birthday party celebration with cake.png" alt="Family Milestones & Laughter" />
              <div className="mosaic-overlay">
                <h3>Family Milestones &amp; Laughter</h3>
              </div>
            </div>

            {/* Right Column (2 stacked cards) */}
            <div className="mosaic-right-col">
              <div className="mosaic-card right-card-top" onClick={() => setActiveTab('challenge')}>
                <img src="/photo/kid-area-pic/Fast-Paced Air Hockey.png" alt="Fast-Paced Air Hockey" />
                <div className="mosaic-overlay">
                  <h3>Fast-Paced Air Hockey</h3>
                </div>
              </div>
              <div className="mosaic-card right-card-bottom" onClick={() => setActiveTab('adventure')}>
                <img src="/photo/kid-area-pic/High ropes suspended course.png" alt="High Ropes & Climbing" />
                <div className="mosaic-overlay">
                  <h3>Suspended Ropes &amp; Climbing</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLAY ZONE VIBES */}
      <section className="desktop-section vibes-section" id="play-zone-vibes">
        <div className="desktop-section-container">
          <div className="desktop-section-header-simple">
            <span className="desktop-section-tag">PHOTO MOMENTS</span>
            <h2 className="desktop-section-title">PLAY ZONE VIBES</h2>
            <p className="desktop-section-subtitle">
              Real moments, real smiles, captured right here across our four incredible zones.
            </p>
          </div>

          {/* 9-PHOTO GALLERY GRID */}
          <div className="desktop-vibes-grid">
            {vibesPhotos.map((item, idx) => (
              <div 
                key={idx} 
                className="desktop-vibe-item"
                onClick={() => openModal('lightbox', item.src)}
                title={`Click to view: ${item.title}`}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="desktop-vibe-hover-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. READY TO PLAY? CTA BANNER */}
      <section className="desktop-cta-section">
        <div className="desktop-section-container">
          <div className="desktop-cta-banner">
            <div className="desktop-cta-content">
              <span className="desktop-cta-badge">SPECIAL OFFERS</span>
              <h2 className="desktop-cta-title">READY TO PLAY?</h2>
              <p className="desktop-cta-desc">
                Your next adventure starts here. Secure your passes online and skip the line.
              </p>
              
              <button 
                className="desktop-cta-btn"
                onClick={() => setActiveTab('package')}
              >
                <span>Get Recharged Online</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="desktop-ticket-icon">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2M13 17v2M13 11v2" />
                </svg>
              </button>

              <div className="desktop-cta-features">
                <span className="desktop-cta-feat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Instant Booking Confirmation
                </span>
                <span className="desktop-cta-feat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  100% Secure Checkout
                </span>
                <span className="desktop-cta-feat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Flexible Rescheduling
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
