import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function MobileModals({ 
  modalType, 
  modalData, 
  closeModal, 
  setActiveTab, 
  lang, 
  setLang 
}) {
  const { user, isAuthenticated, login, register, logout, addPassToWallet } = useAuth();

  // Booking Modal State
  const [ticketQty, setTicketQty] = useState(1);
  const [selectedDate, setSelectedDate] = useState('today');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  // 360 Tour State
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(
    modalData?.activeIndex || 0
  );

  // Profile / Auth View State
  const [profileView, setProfileView] = useState('profile'); // 'profile' | 'login' | 'register' | 'passes' | 'qr'
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  useEffect(() => {
    // Reset booking state when opening new booking
    if (modalType === 'booking') {
      setTicketQty(1);
      setBookingSuccess(false);
      setBookingCode('');
      if (user && user.id !== 'guest') {
        setGuestName(user.name || '');
        setGuestPhone(user.phone || '');
      }
    }
    if (modalType === 'lightbox') {
      setLightboxIndex(modalData?.activeIndex || 0);
    }
    if (modalType === 'profile') {
      setProfileView('profile');
      setAuthMsg('');
    }
  }, [modalType, modalData, user]);

  // Handle Confetti and Pass Persistence on successful booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const code = 'PZ-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(code);
    setBookingSuccess(true);

    try {
      await addPassToWallet({
        code,
        name: modalData?.name || 'Play Zone Pass',
        zone: modalData?.discount || 'Play Zone Admission',
        quantity: ticketQty,
        date: selectedDate === 'today' ? 'Valid Today' : selectedDate === 'tomorrow' ? 'Valid Tomorrow' : 'Valid Weekend',
        price: `${(modalData?.priceNum ? modalData.priceNum * ticketQty : 100 * ticketQty)} EGP`,
        priceNum: modalData?.priceNum || 100
      });
    } catch (err) {
      console.warn('Booking wallet sync note:', err);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Auth Login
  const handleAuthLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ identifier: authIdentifier, password: authPassword });
      setAuthMsg('Logged in successfully!');
      setTimeout(() => {
        setProfileView('profile');
        setAuthMsg('');
      }, 700);
    } catch (err) {
      setAuthMsg('Login error: ' + (err.message || 'Please check details'));
    }
  };

  // Handle Auth Register
  const handleAuthRegister = async (e) => {
    e.preventDefault();
    try {
      await register({
        name: authName,
        phone: authPhone,
        email: authIdentifier,
        password: authPassword
      });
      setAuthMsg('Registered & logged in successfully! Welcome bonus +100 Points added!');
      setTimeout(() => {
        setProfileView('profile');
        setAuthMsg('');
      }, 1000);
    } catch (err) {
      setAuthMsg('Registration error: ' + (err.message || 'Please check details'));
    }
  };

  // 360 Panorama Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const diff = currentX - startX;
    setPanX(prev => prev + diff * 0.5);
    setStartX(currentX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!modalType) return null;

  return (
    <div className="mobile-modal-backdrop" onClick={closeModal}>
      {/* 1. TICKET BOOKING MODAL */}
      {modalType === 'booking' && (
        <div 
          className="mobile-modal-sheet booking-sheet" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal} aria-label="Close">✕</button>

          {!bookingSuccess ? (
            <form onSubmit={handleConfirmBooking} className="booking-form-content">
              <div className="booking-header">
                <span className="booking-badge">{modalData?.discount || 'Special Offer'}</span>
                <h3 className="booking-title">{modalData?.name || 'Play Zone Pass'}</h3>
                {modalData?.details && (
                  <p className="booking-details-text">{modalData.details}</p>
                )}
                <div className="booking-price-tag">
                  {modalData?.price || '100 EGP'} 
                  <span className="per-person"> / person</span>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="booking-section-group">
                <label className="booking-label">Tickets Quantity:</label>
                <div className="qty-counter-row">
                  <button 
                    type="button" 
                    className="qty-btn"
                    onClick={() => setTicketQty(q => Math.max(1, q - 1))}
                  >
                    –
                  </button>
                  <span className="qty-number-display">{ticketQty}</span>
                  <button 
                    type="button" 
                    className="qty-btn"
                    onClick={() => setTicketQty(q => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Visit Date Selection */}
              <div className="booking-section-group">
                <label className="booking-label">Select Visit Day:</label>
                <div className="date-pills-row">
                  {[
                    { id: 'today', label: 'Today (اليوم)' },
                    { id: 'tomorrow', label: 'Tomorrow (غداً)' },
                    { id: 'weekend', label: 'Weekend (الجمعة)' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`date-pill ${selectedDate === d.id ? 'active' : ''}`}
                      onClick={() => setSelectedDate(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="booking-section-group">
                <label className="booking-label">Parent / Guest Name:</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter full name"
                  className="booking-text-input"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="booking-section-group">
                <label className="booking-label">Mobile Phone (WhatsApp):</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 01012345678"
                  className="booking-text-input"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              {/* Live Price Summary */}
              <div className="booking-total-box">
                <div className="total-label">Total Payable:</div>
                <div className="total-amount">
                  {(modalData?.priceNum ? modalData.priceNum * ticketQty : 100 * ticketQty)} EGP
                </div>
              </div>

              <button type="submit" className="booking-submit-btn">
                🎟️ &nbsp; Confirm &amp; Reserve Online
              </button>
            </form>
          ) : (
            <div className="booking-confirmation-view">
              <div className="confirm-icon-circle">✓</div>
              <h3 className="confirm-title">Booking Confirmed!</h3>
              <p className="confirm-subtitle">
                Your ticket voucher is ready. It has also been saved to your profile passes. Show this code or barcode at reception.
              </p>

              <div className="booking-pass-card">
                <div className="pass-code-label">RESERVATION PASS CODE</div>
                <div className="pass-code-val">{bookingCode}</div>
                <div className="pass-details-row">
                  <span><strong>Guest:</strong> {guestName || user?.name || 'Valued Visitor'}</span>
                  <span><strong>Tickets:</strong> {ticketQty}x Pass</span>
                </div>
                <div className="pass-zone-title">{modalData?.name}</div>
              </div>

              <button 
                type="button" 
                className="confirm-done-btn"
                onClick={closeModal}
              >
                Done &amp; Return to Park
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. 360 VIRTUAL TOUR MODAL */}
      {modalType === 'virtual-tour' && (
        <div 
          className="mobile-modal-sheet tour-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tour-header">
            <div className="tour-title-wrap">
              <span className="tour-badge">INTERACTIVE 360°</span>
              <h3>Play Zone Virtual Tour</h3>
            </div>
            <button className="tour-close-btn" onClick={closeModal}>✕</button>
          </div>

          <div 
            className="tour-viewport"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <div 
              className="tour-pan-layer"
              style={{
                transform: `translateX(${panX % 800}px)`
              }}
            >
              <img 
                src="/photo/kid-area-pic/dome-360.png" 
                alt="360 View" 
                className="tour-pan-img" 
                onError={(e) => {
                  e.currentTarget.src = '/photo/kid-area-pic/360 Virtual Dome Card (~32% width_ 4 columns).png';
                }}
              />
            </div>

            <div className="tour-hint-overlay">
              <span>↔ Drag left &amp; right to look around 360°</span>
            </div>

            {/* Virtual Zone Jump Buttons */}
            <div className="tour-zone-pills">
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('kids-area'); }}
              >
                Kids Area
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('fun-park'); }}
              >
                Fun Park
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('challenge'); }}
              >
                Arcade VR
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('adventure'); }}
              >
                High Ropes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NAVIGATION MENU DRAWER */}
      {modalType === 'menu-drawer' && (
        <div 
          className="mobile-menu-drawer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-top-bar">
            <div className="drawer-brand">
              <img 
                src="/photo/logo/logo nav bar and footer.png" 
                alt="Play Zone" 
                className="drawer-logo-img" 
              />
              <span className="drawer-brand-name">PLAY ZONE</span>
            </div>
            <button className="drawer-close-btn" onClick={closeModal}>✕</button>
          </div>

          <div className="drawer-nav-links">
            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('home'); }}
            >
              <img src="/photo/kid-area-pic/icon/home-icon.png" alt="Home" className="drawer-icon" />
              <span className="drawer-item-title-en">Home</span>
              <span className="drawer-item-title-ar font-alexandria">(الرئيسية)</span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('kids-area'); }}
            >
              <img src="/photo/kid-area-pic/icon/kids-icon.png" alt="Kids Area" className="drawer-icon" />
              <span className="drawer-item-title-en">Kids Area</span>
              <span className="drawer-item-title-ar font-alexandria">(منطقة الأطفال)</span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('fun-park'); }}
            >
              <img src="/photo/kid-area-pic/icon/funpark-icon.png" alt="Fun Park" className="drawer-icon" />
              <span className="drawer-item-title-en">Fun Park</span>
              <span className="drawer-item-title-ar font-alexandria">(منطقة المرح)</span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('challenge'); }}
            >
              <img src="/photo/kid-area-pic/icon/challenge-icon.png" alt="Challenge" className="drawer-icon" />
              <span className="drawer-item-title-en">Challenge Zone</span>
              <span className="drawer-item-title-ar font-alexandria">(الآركيد وVR)</span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('adventure'); }}
            >
              <img src="/photo/kid-area-pic/icon/adventure-icon.png" alt="Adventure" className="drawer-icon" />
              <span className="drawer-item-title-en">Adventure Zone</span>
              <span className="drawer-item-title-ar font-alexandria">(الحبال والتسلق)</span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('package'); }}
            >
              <img src="/photo/kid-area-pic/icon/package-icon.png" alt="Packages" className="drawer-icon" />
              <span className="drawer-item-title-en">Party &amp; Birthday Packages</span>
              <span className="drawer-item-title-ar font-alexandria">(الباقات)</span>
            </button>
          </div>

          <div className="drawer-divider" />

          {/* Quick Info */}
          <div className="drawer-info-block">
            <div className="info-row">
              <span className="info-label">
                <svg className="drawer-info-icon icon-cyan" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location:
              </span>
              <span className="info-val">American Dream Park, Ismailia</span>
            </div>
            <div className="info-row">
              <span className="info-label">
                <svg className="drawer-info-icon icon-yellow" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Working Hours:
              </span>
              <span className="info-val">10:00 AM – 11:30 PM Daily</span>
            </div>
            <div className="info-row">
              <span className="info-label">
                <svg className="drawer-info-icon icon-cyan" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Support Hotline:
              </span>
              <span className="info-val">19876 / 01023456789</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. USER PROFILE & AUTHENTICATION MODAL */}
      {modalType === 'profile' && (
        <div 
          className="mobile-modal-sheet profile-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>

          {/* VIEW: MAIN PROFILE */}
          {profileView === 'profile' && (
            <>
              <div className="profile-header">
                <div className="profile-avatar-wrap">
                  <img 
                    src={user?.avatar || '/photo/kid-area-pic/icon/user-icon.png'} 
                    alt="Profile" 
                    className="profile-avatar-img" 
                  />
                </div>
                <h3 className="profile-name">{user?.name || 'American Dream Guest'}</h3>
                <span className="profile-membership">{user?.membership || 'VIP Member • Gold Club'}</span>
                {user?.phone && (
                  <span style={{ fontSize: '0.8rem', color: '#7a9299', marginTop: '4px' }}>
                    📱 {user.phone}
                  </span>
                )}
              </div>

              <div className="profile-stats-grid">
                <div 
                  className="profile-stat-box" 
                  onClick={() => setProfileView('passes')} 
                  style={{ cursor: 'pointer' }}
                >
                  <span className="stat-value">{user?.activePasses?.length || 0}</span>
                  <span className="stat-label">Active Passes</span>
                </div>
                <div className="profile-stat-box">
                  <span className="stat-value">{user?.points || 340}</span>
                  <span className="stat-label">Play Points</span>
                </div>
                <div className="profile-stat-box">
                  <span className="stat-value">{user?.zoneVisits || 4}</span>
                  <span className="stat-label">Zone Visits</span>
                </div>
              </div>

              <div className="profile-actions-list">
                <button 
                  className="profile-action-btn"
                  onClick={() => setProfileView('passes')}
                >
                  <div className="profile-btn-icon-wrap wrap-orange">
                    <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="6" width="18" height="12" rx="3" />
                      <path d="M12 9l-1.5 3h3L12 15" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="6" cy="12" r="1" fill="#ea580c" />
                      <circle cx="18" cy="12" r="1" fill="#ea580c" />
                    </svg>
                  </div>
                  <span className="profile-btn-text">
                    View &amp; Recharge Wristband ({user?.activePasses?.length || 0} passes)
                  </span>
                </button>

                <button 
                  className="profile-action-btn"
                  onClick={() => setProfileView('qr')}
                >
                  <div className="profile-btn-icon-wrap wrap-cyan">
                    <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="5.5" y="5.5" width="2" height="2" fill="#00a9c3" />
                      <rect x="16.5" y="5.5" width="2" height="2" fill="#00a9c3" />
                      <rect x="5.5" y="16.5" width="2" height="2" fill="#00a9c3" />
                      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h3M20 14v3" />
                    </svg>
                  </div>
                  <span className="profile-btn-text">Kids Area Fast Entry QR</span>
                </button>

                <button 
                  className="profile-action-btn"
                  onClick={() => setProfileView('login')}
                >
                  <div className="profile-btn-icon-wrap wrap-teal">
                    <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#012b32" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                  </div>
                  <span className="profile-btn-text">
                    {isAuthenticated ? 'Switch Account / Re-login' : 'Sign In / Register'}
                  </span>
                </button>

                {isAuthenticated && (
                  <button 
                    className="profile-action-btn"
                    onClick={async () => {
                      await logout();
                      closeModal();
                    }}
                    style={{ opacity: 0.8 }}
                  >
                    <div className="profile-btn-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                      <span style={{ fontSize: '1.1rem' }}>🚪</span>
                    </div>
                    <span className="profile-btn-text" style={{ color: '#ef4444' }}>Log Out</span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* VIEW: PASSES / WRISTBANDS */}
          {profileView === 'passes' && (
            <div className="profile-passes-view">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setProfileView('profile')}
                  style={{ background: 'transparent', border: 'none', color: '#00a9c3', fontSize: '1rem', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>My Active Passes</h3>
              </div>

              {(!user?.activePasses || user.activePasses.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#7a9299' }}>
                  <p>No active passes yet.</p>
                  <button 
                    className="booking-submit-btn"
                    style={{ marginTop: '1rem' }}
                    onClick={() => { closeModal(); setActiveTab('kids-area'); }}
                  >
                    Book Your First Pass
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {user.activePasses.map((pass, idx) => (
                    <div 
                      key={idx} 
                      className="booking-pass-card"
                      style={{ margin: 0, textAlign: 'left' }}
                    >
                      <div className="pass-code-label">CODE: {pass.code}</div>
                      <div className="pass-zone-title" style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                        {pass.name}
                      </div>
                      <div className="pass-details-row" style={{ marginTop: '8px' }}>
                        <span><strong>Qty:</strong> {pass.quantity}x Pass</span>
                        <span><strong>Status:</strong> <span style={{ color: '#10b981' }}>{pass.status || 'Active'}</span></span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#7a9299', marginTop: '4px' }}>
                        {pass.date || 'Valid Today'} • {pass.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: QR FAST ENTRY */}
          {profileView === 'qr' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setProfileView('profile')}
                  style={{ background: 'transparent', border: 'none', color: '#00a9c3', fontSize: '1rem', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>Fast Entry QR</h3>
              </div>

              <div style={{ 
                background: '#ffffff', 
                border: '2px dashed #00a9c3', 
                borderRadius: '16px', 
                padding: '24px', 
                display: 'inline-block',
                margin: '12px auto'
              }}>
                <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="#06283d" strokeWidth="1.5">
                  <rect x="2" y="2" width="8" height="8" rx="1" />
                  <rect x="14" y="2" width="8" height="8" rx="1" />
                  <rect x="2" y="14" width="8" height="8" rx="1" />
                  <rect x="5" y="5" width="2" height="2" fill="#06283d" />
                  <rect x="17" y="5" width="2" height="2" fill="#06283d" />
                  <rect x="5" y="17" width="2" height="2" fill="#06283d" />
                  <line x1="14" y1="14" x2="16" y2="14" strokeWidth="2" />
                  <line x1="14" y1="17" x2="20" y2="17" strokeWidth="2" />
                  <line x1="18" y1="14" x2="18" y2="20" strokeWidth="2" />
                </svg>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#06283d' }}>
                {user?.name || 'American Dream Member'}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7a9299', margin: '6px 0 16px' }}>
                Scan at turnstile barrier gate for instant contact-free entry.
              </p>
            </div>
          )}

          {/* VIEW: LOGIN FORM */}
          {profileView === 'login' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setProfileView('profile')}
                  style={{ background: 'transparent', border: 'none', color: '#00a9c3', fontSize: '1rem', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>Sign In to Account</h3>
              </div>

              {authMsg && (
                <div style={{ padding: '8px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {authMsg}
                </div>
              )}

              <form onSubmit={handleAuthLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="booking-label">Mobile Number or Email:</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="01012345678 or user@domain.com"
                    className="booking-text-input"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">Password:</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Enter password"
                    className="booking-text-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="booking-submit-btn" style={{ marginTop: '8px' }}>
                  Sign In
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.88rem' }}>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setProfileView('register'); setAuthMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#00a9c3', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Register New Account
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: REGISTER FORM */}
          {profileView === 'register' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setProfileView('profile')}
                  style={{ background: 'transparent', border: 'none', color: '#00a9c3', fontSize: '1rem', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>Create New Account</h3>
              </div>

              {authMsg && (
                <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {authMsg}
                </div>
              )}

              <form onSubmit={handleAuthRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="booking-label">Your Full Name:</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sara Mohamed"
                    className="booking-text-input"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">Mobile Number (WhatsApp):</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. 01098765432"
                    className="booking-text-input"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">Email (Optional):</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="booking-text-input"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">Password:</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Create a password"
                    className="booking-text-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="booking-submit-btn" style={{ marginTop: '8px' }}>
                  Create Account (+100 Bonus Points)
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.88rem' }}>
                  Already registered?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setProfileView('login'); setAuthMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#00a9c3', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 5. ATTRACTION DETAIL MODAL */}
      {modalType === 'attraction-detail' && (
        <div 
          className="mobile-modal-sheet attraction-sheet" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>

          <div className="attraction-detail-hero">
            <img 
              src={modalData?.img || modalData?.fallbackImg} 
              alt={modalData?.titleEn} 
              className="attr-detail-hero-img" 
              onError={(e) => {
                e.currentTarget.src = modalData?.fallbackImg;
              }}
            />
          </div>

          <div className="attraction-detail-body">
            <h3 className="attr-detail-title">{modalData?.titleEn}</h3>
            <h4 className="attr-detail-title-ar">{modalData?.titleAr}</h4>
            <p className="attr-detail-desc">{modalData?.desc}</p>

            <div className="attr-safety-checklist">
              <div className="checklist-item">✓ Fully sanitized and cleaned every 2 hours</div>
              <div className="checklist-item">✓ Trained safety supervisors present at all times</div>
              <div className="checklist-item">✓ Grip socks required (available at reception)</div>
            </div>

            <button 
              className="booking-submit-btn"
              onClick={() => {
                closeModal();
                // trigger booking for this attraction
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('open-booking-for', { detail: modalData }));
                }, 100);
              }}
            >
              Book Entry Pass For This Attraction
            </button>
          </div>
        </div>
      )}

      {/* 6. PHOTO LIGHTBOX MODAL */}
      {modalType === 'lightbox' && modalData?.images && (
        <div 
          className="lightbox-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="lightbox-close-btn" onClick={closeModal}>✕</button>
          
          <div className="lightbox-content">
            <button 
              className="lightbox-nav-btn prev"
              onClick={() => setLightboxIndex(i => (i - 1 + modalData.images.length) % modalData.images.length)}
            >
              ‹
            </button>

            <div className="lightbox-img-wrap">
              <img 
                src={modalData.images[lightboxIndex]?.src} 
                alt={modalData.images[lightboxIndex]?.title} 
                className="lightbox-main-img" 
              />
              <div className="lightbox-caption">
                {modalData.images[lightboxIndex]?.title} ({lightboxIndex + 1} / {modalData.images.length})
              </div>
            </div>

            <button 
              className="lightbox-nav-btn next"
              onClick={() => setLightboxIndex(i => (i + 1) % modalData.images.length)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* 7. GENERIC INFO MODAL */}
      {modalType === 'info' && (
        <div 
          className="mobile-modal-sheet info-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>
          <h3 className="info-modal-title">{modalData?.title}</h3>
          <p className="info-modal-body">{modalData?.text}</p>
          <button className="confirm-done-btn" onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}
