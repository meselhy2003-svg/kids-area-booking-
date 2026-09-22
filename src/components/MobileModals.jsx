import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function MobileModals({ 
  modalType, 
  modalData, 
  closeModal, 
  setActiveTab, 
  lang, 
  setLang 
}) {
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

  useEffect(() => {
    // Reset booking state when opening new booking
    if (modalType === 'booking') {
      setTicketQty(1);
      setBookingSuccess(false);
      setBookingCode('');
    }
    if (modalType === 'lightbox') {
      setLightboxIndex(modalData?.activeIndex || 0);
    }
  }, [modalType, modalData]);

  // Handle Confetti on successful booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const code = 'PZ-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(code);
    setBookingSuccess(true);

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
                Your ticket voucher is ready. Show this code or barcode at the Play Zone front reception.
              </p>

              <div className="booking-pass-card">
                <div className="pass-code-label">RESERVATION PASS CODE</div>
                <div className="pass-code-val">{bookingCode}</div>
                <div className="pass-details-row">
                  <span><strong>Guest:</strong> {guestName || 'Valued Visitor'}</span>
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

      {/* 4. USER PROFILE MODAL */}
      {modalType === 'profile' && (
        <div 
          className="mobile-modal-sheet profile-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>

          <div className="profile-header">
            <div className="profile-avatar-wrap">
              <img 
                src="/photo/kid-area-pic/icon/user-icon.png" 
                alt="Profile" 
                className="profile-avatar-img" 
              />
            </div>
            <h3 className="profile-name">American Dream Guest</h3>
            <span className="profile-membership">VIP Member • Gold Club</span>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="stat-value">2</span>
              <span className="stat-label">Active Passes</span>
            </div>
            <div className="profile-stat-box">
              <span className="stat-value">340</span>
              <span className="stat-label">Play Points</span>
            </div>
            <div className="profile-stat-box">
              <span className="stat-value">4</span>
              <span className="stat-label">Zone Visits</span>
            </div>
          </div>

          <div className="profile-actions-list">
            <button 
              className="profile-action-btn"
              onClick={() => { closeModal(); setActiveTab('package'); }}
            >
              <div className="profile-btn-icon-wrap wrap-orange">
                <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="12" rx="3" />
                  <path d="M12 9l-1.5 3h3L12 15" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="6" cy="12" r="1" fill="#ea580c" />
                  <circle cx="18" cy="12" r="1" fill="#ea580c" />
                </svg>
              </div>
              <span className="profile-btn-text">View &amp; Recharge Wristband</span>
            </button>

            <button 
              className="profile-action-btn"
              onClick={() => { closeModal(); setActiveTab('kids-area'); }}
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
              onClick={closeModal}
            >
              <div className="profile-btn-icon-wrap wrap-teal">
                <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#012b32" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <span className="profile-btn-text">Account Settings</span>
            </button>
          </div>
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
