import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  User, 
  Phone, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isUserAuthenticated } from '../api/authService';
import MediaUploadModal from './common/MediaUploadModal';
import '../pages/LobbyPage.css';

export default function MobileModals({ 
  modalType, 
  modalData, 
  closeModal, 
  setActiveTab, 
  lang, 
  setLang,
  openModal 
}) {
  const { user, isAuthenticated, login, register, logout, addPassToWallet } = useAuth();

  // Booking Modal State
  const [ticketQty, setTicketQty] = useState(1);
  const [selectedDate, setSelectedDate] = useState('today');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  // Auth Required Interception State (Guest -> Offer / Checkout / Booking)
  const [authReqTab, setAuthReqTab] = useState('register'); // 'login' | 'register'
  const [authReqPhone, setAuthReqPhone] = useState('');
  const [authReqName, setAuthReqName] = useState('');
  const [authReqAge, setAuthReqAge] = useState('');
  const [authReqGender, setAuthReqGender] = useState('male'); // 'male' | 'female'
  const [authReqPassword, setAuthReqPassword] = useState('');
  const [authReqConfirmPassword, setAuthReqConfirmPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authReqChildren, setAuthReqChildren] = useState([]); // [{ name: '', age: '', gender: 'boy' }]
  const [authReqError, setAuthReqError] = useState('');
  const [authReqSuccess, setAuthReqSuccess] = useState('');
  const [authReqLoading, setAuthReqLoading] = useState(false);

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
    if (modalType === 'auth-required' || modalType === 'auth') {
      setAuthReqTab('login');
      setAuthReqPhone('');
      setAuthReqName('');
      setAuthReqPassword('');
      setAuthReqError('');
      setAuthReqSuccess('');
      setAuthReqLoading(false);
    }
  }, [modalType, modalData, user]);

  // Handle Confetti and Pass Persistence on successful booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!isUserAuthenticated()) {
      openModal('auth-required', {
        action: 'booking',
        returnData: modalData,
        returnType: 'booking'
      });
      return;
    }

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

  // Children helper functions for guest sign up
  const handleAddChild = () => {
    setAuthReqChildren(prev => [
      ...prev,
      { name: '', age: '', gender: 'boy' }
    ]);
  };

  const handleRemoveChild = (index) => {
    setAuthReqChildren(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateChild = (index, field, value) => {
    setAuthReqChildren(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle Auth Required Login (Guest Interception)
  const handleAuthReqLogin = async (e) => {
    e.preventDefault();
    setAuthReqError('');
    const clean = authReqPhone.trim();
    if (!clean) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
      return;
    }
    if (!authReqPassword.trim()) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
      return;
    }
    setAuthReqLoading(true);
    try {
      await login({ identifier: clean, password: authReqPassword });

      if (typeof window !== 'undefined') {
        localStorage.setItem('american_dream_user_logged_in', 'true');
        localStorage.removeItem('american_dream_is_guest');
      }

      setAuthReqSuccess(lang === 'ar' ? 'تم تسجيل الدخول بنجاح! جاري المتابعة...' : 'Logged in successfully! Continuing...');
      try { confetti({ particleCount: 75, spread: 70, origin: { y: 0.55 } }); } catch {}

      setTimeout(() => {
        closeModal();
        if (modalData?.onSuccess) {
          modalData.onSuccess();
        } else if (modalData?.action === 'offer' || modalData?.returnType === 'booking') {
          openModal('booking', modalData?.offerData || modalData?.returnData);
        }
      }, 550);
    } catch (err) {
      setAuthReqError(err.message || (lang === 'ar' ? 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية' : 'Login failed, please check details'));
    } finally {
      setAuthReqLoading(false);
    }
  };

  // Handle Auth Required Register (Guest Interception - Matches Image 2)
  const handleAuthReqRegister = async (e) => {
    e.preventDefault();
    setAuthReqError('');
    const cleanName = authReqName.trim();
    const cleanPhone = authReqPhone.trim();
    if (!cleanName) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }
    if (!cleanPhone) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
      return;
    }
    if (!authReqAge.trim()) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال العمر' : 'Please enter your age');
      return;
    }
    if (!authReqPassword.trim()) {
      setAuthReqError(lang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
      return;
    }
    if (authReqConfirmPassword && authReqPassword !== authReqConfirmPassword) {
      setAuthReqError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setAuthReqLoading(true);
    try {
      await register({
        name: cleanName,
        phone: cleanPhone,
        age: authReqAge.trim(),
        gender: authReqGender,
        password: authReqPassword,
        children: authReqChildren
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('american_dream_user_logged_in', 'true');
        localStorage.removeItem('american_dream_is_guest');
      }

      setAuthReqSuccess(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري المتابعة...' : 'Account created successfully! Continuing...');
      try { confetti({ particleCount: 85, spread: 80, origin: { y: 0.55 } }); } catch {}

      setTimeout(() => {
        closeModal();
        if (modalData?.onSuccess) {
          modalData.onSuccess();
        } else if (modalData?.action === 'offer' || modalData?.returnType === 'booking') {
          openModal('booking', modalData?.offerData || modalData?.returnData);
        }
      }, 550);
    } catch (err) {
      setAuthReqError(err.message || (lang === 'ar' ? 'حدث خطأ في إنشاء الحساب' : 'Registration failed'));
    } finally {
      setAuthReqLoading(false);
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
                <span className="booking-badge">{lang === 'ar' ? (modalData?.discountAr || modalData?.discount || 'عرض خاص') : (modalData?.discount || 'Special Offer')}</span>
                <h3 className="booking-title">{lang === 'ar' ? (modalData?.nameAr || modalData?.name || 'تذكرة أمريكان دريم') : (modalData?.name || 'Play Zone Pass')}</h3>
                {(modalData?.details || modalData?.detailsAr) && (
                  <p className="booking-details-text">{lang === 'ar' ? (modalData?.detailsAr || modalData?.details) : modalData?.details}</p>
                )}
                <div className="booking-price-tag">
                  {lang === 'ar' ? (modalData?.priceAr || modalData?.price || '١٠٠ ج.م') : (modalData?.price || '100 EGP')} 
                  <span className="per-person">{lang === 'ar' ? ' / للفرد' : ' / person'}</span>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="booking-section-group">
                <label className="booking-label">
                  {lang === 'ar' ? 'عدد التذاكر:' : 'Tickets Quantity:'}
                </label>
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
                <label className="booking-label">
                  {lang === 'ar' ? 'اختر يوم الزيارة:' : 'Select Visit Day:'}
                </label>
                <div className="date-pills-row">
                  {[
                    { id: 'today', label: lang === 'ar' ? 'اليوم' : 'Today' },
                    { id: 'tomorrow', label: lang === 'ar' ? 'غداً' : 'Tomorrow' },
                    { id: 'weekend', label: lang === 'ar' ? 'نهاية الأسبوع' : 'Weekend' }
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
                <label className="booking-label">
                  {lang === 'ar' ? 'اسم ولي الأمر / الزائر:' : 'Parent / Guest Name:'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={lang === 'ar' ? 'الاسم بالكامل' : 'Enter full name'}
                  className="booking-text-input"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="booking-section-group">
                <label className="booking-label">
                  {lang === 'ar' ? 'رقم الهاتف (واتساب):' : 'Mobile Phone (WhatsApp):'}
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="010XXXXXXXX"
                  className="booking-text-input"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              {/* Live Price Summary */}
              <div className="booking-total-box">
                <div className="total-label">
                  {lang === 'ar' ? 'الإجمالي المطلوب:' : 'Total Payable:'}
                </div>
                <div className="total-amount">
                  {(modalData?.priceNum ? modalData.priceNum * ticketQty : 100 * ticketQty)} {lang === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              </div>

              <button type="submit" className="booking-submit-btn">
                🎟️ &nbsp; {lang === 'ar' ? 'تأكيد وحجز التذكرة أونلاين' : 'Confirm & Reserve Online'}
              </button>
            </form>
          ) : (
            <div className="booking-confirmation-view">
              <div className="confirm-icon-circle">✓</div>
              <h3 className="confirm-title">{lang === 'ar' ? 'تم تأكيد الحجز بنجاح!' : 'Booking Confirmed!'}</h3>
              <p className="confirm-subtitle">
                {lang === 'ar' 
                  ? 'تذكرتك جاهزة الآن وتم حفظها في حسابك. يمكنك إبراز هذا الكود عند شباك الاستقبال.' 
                  : 'Your ticket voucher is ready. It has also been saved to your profile passes. Show this code or barcode at reception.'}
              </p>

              <div className="booking-pass-card">
                <div className="pass-code-label">{lang === 'ar' ? 'كود حجز التذكرة' : 'RESERVATION PASS CODE'}</div>
                <div className="pass-code-val">{bookingCode}</div>
                <div className="pass-details-row">
                  <span><strong>{lang === 'ar' ? 'الاسم:' : 'Guest:'}</strong> {guestName || user?.name || (lang === 'ar' ? 'زائر عزيز' : 'Valued Visitor')}</span>
                  <span><strong>{lang === 'ar' ? 'التذاكر:' : 'Tickets:'}</strong> {ticketQty}x {lang === 'ar' ? 'تذكرة' : 'Pass'}</span>
                </div>
                <div className="pass-zone-title">{modalData?.name}</div>
              </div>

              <button 
                type="button" 
                className="confirm-done-btn"
                onClick={closeModal}
              >
                {lang === 'ar' ? 'تم • العودة للمنطقة' : 'Done & Return to Park'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. 360 VIRTUAL TOUR MODAL */}
      {(modalType === 'virtual-tour' || modalType === 'tour') && (
        <div 
          className="mobile-modal-sheet tour-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tour-header">
            <div className="tour-title-wrap">
              <span className="tour-badge">{lang === 'ar' ? 'تفاعلية ٣٦٠°' : 'INTERACTIVE 360°'}</span>
              <h3>{lang === 'ar' ? 'جولة افتراضية ٣٦٠° في أمريكان دريم' : 'Play Zone Virtual Tour'}</h3>
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
                alt={lang === 'ar' ? 'عرض ٣٦٠°' : '360 View'} 
                className="tour-pan-img" 
                onError={(e) => {
                  e.currentTarget.src = '/photo/kid-area-pic/360 Virtual Dome Card (~32% width_ 4 columns).png';
                }}
              />
            </div>

            <div className="tour-hint-overlay">
              <span>{lang === 'ar' ? '↔ اسحب يميناً ويساراً للاستكشاف بزاوية ٣٦٠°' : '↔ Drag left & right to look around 360°'}</span>
            </div>

            {/* Virtual Zone Jump Buttons */}
            <div className="tour-zone-pills">
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('kids-area'); }}
              >
                {lang === 'ar' ? 'منطقة الأطفال' : 'Kids Area'}
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('fun-park'); }}
              >
                {lang === 'ar' ? 'فن بارك' : 'Fun Park'}
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('challenge'); }}
              >
                {lang === 'ar' ? 'ألعاب التحدي والـ VR' : 'Arcade VR'}
              </button>
              <button 
                className="tour-pill"
                onClick={() => { closeModal(); setActiveTab('adventure'); }}
              >
                {lang === 'ar' ? 'مسار الحبال والمغامرات' : 'High Ropes'}
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
              <span className="drawer-brand-name">
                {lang === 'ar' ? 'أمريكان دريم' : 'PLAY ZONE'}
              </span>
            </div>
            <button className="drawer-close-btn" onClick={closeModal}>✕</button>
          </div>

          {/* Language Switcher in Drawer: Main Arabic (Alexandria), Second English */}
          <div className="drawer-lang-toggle" style={{ display: 'flex', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', margin: '0 16px 14px' }}>
            <button 
              type="button"
              className={`drawer-lang-btn ar-choice font-alexandria arabic-alexandria-text ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => setLang && setLang('ar')}
              style={{
                flex: 1,
                padding: '9px 8px',
                borderRadius: '8px',
                border: lang === 'ar' ? '1.5px solid #00a9c3' : '1px solid rgba(255,255,255,0.15)',
                background: lang === 'ar' ? 'rgba(0, 169, 195, 0.25)' : 'transparent',
                color: lang === 'ar' ? '#00b4d8' : '#e2e8f0',
                fontWeight: 800,
                fontSize: '0.86rem',
                fontFamily: "'Alexandria', 'Tajawal', sans-serif",
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span 
                className="font-alexandria arabic-alexandria-text"
                style={{ fontFamily: "'Alexandria', 'Tajawal', sans-serif", fontWeight: 800, whiteSpace: 'nowrap' }}
              >
                العربية (مصر)
              </span>
            </button>
            <button 
              type="button"
              className={`drawer-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang && setLang('en')}
              style={{
                flex: 1,
                padding: '9px 10px',
                borderRadius: '8px',
                border: lang === 'en' ? '1.5px solid #00a9c3' : '1px solid rgba(255,255,255,0.15)',
                background: lang === 'en' ? 'rgba(0, 169, 195, 0.25)' : 'transparent',
                color: lang === 'en' ? '#00b4d8' : '#e2e8f0',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span>English</span>
            </button>
          </div>

          <div className="drawer-nav-links">
            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('home'); }}
            >
              <img src="/photo/kid-area-pic/icon/home-icon.png" alt="Home" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('kids-area'); }}
            >
              <img src="/photo/kid-area-pic/icon/kids-icon.png" alt="Kids Area" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'منطقة الأطفال' : 'Kids Area'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('fun-park'); }}
            >
              <img src="/photo/kid-area-pic/icon/funpark-icon.png" alt="Fun Park" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'فن بارك' : 'Fun Park'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('challenge'); }}
            >
              <img src="/photo/kid-area-pic/icon/challenge-icon.png" alt="Challenge" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'منطقة التحدي والآركيد' : 'Challenge Zone'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('adventure'); }}
            >
              <img src="/photo/kid-area-pic/icon/adventure-icon.png" alt="Adventure" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'منطقة المغامرات والحبال' : 'Adventure Zone'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('package'); }}
            >
              <img src="/photo/kid-area-pic/icon/package-icon.png" alt="Packages" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'باقات الألعاب والتوفير' : 'Party & Birthday Packages'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('events'); }}
            >
              <img src="/photo/kid area pic/icon/Icon (14).png" alt="Events" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'الحفلات والقاعات' : 'Events & Halls'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('restaurant'); }}
            >
              <img src="/photo/kid area pic/icon/Icon (12)dadd.png" alt="Restaurant" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'المطعم والكافيه' : 'Restaurant & Cafe'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('trips'); }}
            >
              <img src="/photo/kid area pic/icon/cart.png" alt="Trips" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'رحلات المدارس والمجموعات' : 'School & Group Trips'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('cart'); }}
            >
              <img src="/photo/kid area pic/icon/cart.png" alt="Cart" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'سلة الحجز والتذاكر' : 'My Cart & Passes'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('about'); }}
            >
              <img src="/photo/logo/logo nav bar and footer.png" alt="About" className="drawer-icon" />
              <span className={lang === 'ar' ? 'font-alexandria' : ''}>
                {lang === 'ar' ? 'عن الحديقة والآراء' : 'About Us & Reviews'}
              </span>
            </button>

            <button 
              className="drawer-nav-item"
              onClick={() => { closeModal(); setActiveTab('profile'); }}
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              <img 
                src="/photo/profile/ahmed-avatar-overview.png" 
                alt="Profile" 
                className="drawer-icon" 
                style={{ borderRadius: '50%', border: '1px solid #f59e0b' }} 
                onError={(e) => { e.currentTarget.src = '/photo/kid area pic/icon/Symbol.png'; }}
              />
              <span className={lang === 'ar' ? 'font-alexandria' : ''} style={{ color: '#f59e0b', fontWeight: 800 }}>
                {lang === 'ar' ? 'ملفي الشخصي (My Profile)' : 'My Profile (Ahmed)'}
              </span>
            </button>

            {isAuthenticated && (
              <button 
                className="drawer-nav-item"
                onClick={async () => {
                  closeModal();
                  await logout();
                  setActiveTab('lobby');
                  if (typeof window !== 'undefined') {
                    window.location.hash = '#lobby';
                  }
                }}
                style={{ background: 'rgba(239, 68, 68, 0.08)', marginTop: '4px' }}
              >
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <LogOut size={18} />
                </div>
                <span className={lang === 'ar' ? 'font-alexandria' : ''} style={{ color: '#ef4444', fontWeight: 800 }}>
                  {lang === 'ar' ? 'تسجيل الخروج (Log Out)' : 'Log Out'}
                </span>
              </button>
            )}

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
                {lang === 'ar' ? 'الموقع:' : 'Location:'}
              </span>
              <span className="info-val">
                {lang === 'ar' ? 'أمريكان دريم بارك، الإسماعيلية' : 'American Dream Park, Ismailia'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3.5 AUTH REQUIRED MODAL (FOR GUEST USERS: OFFERS / CHECKOUT / PROCEED TO BOOKING) */}
      {(modalType === 'auth-required' || modalType === 'auth') && (() => {
        const destinationName = modalData?.destination 
          || modalData?.title 
          || (modalData?.action === 'offer' 
                ? (lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers')
                : modalData?.action === 'checkout'
                ? (lang === 'ar' ? 'إتمام الشراء' : 'Checkout')
                : modalData?.action === 'booking'
                ? (lang === 'ar' ? 'حجز التذاكر' : 'Play Zone Tickets')
                : (lang === 'ar' ? 'الرحلات' : 'Trips'));

        return (
          <div 
            className="lobby-auth-card auth-required-gateway-card" 
            onClick={(e) => e.stopPropagation()}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header: Logo, Title, Close Button */}
            <div className="lobby-auth-header">
              <div className="lobby-auth-logo-row">
                <img 
                  src="/photo/logo/logo nav bar and footer.png" 
                  alt="American Dream" 
                  className="lobby-auth-logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <h3 className="lobby-auth-title">
                  {lang === 'ar' ? 'بوابة دخول أمريكان دريم' : 'American Dream Gateway'}
                </h3>
              </div>
              <button 
                type="button" 
                className="lobby-auth-close-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Destination Pill */}
            <div className="lobby-auth-destination-pill">
              <Sparkles size={16} color="#fde047" />
              <span>
                {lang === 'ar' ? 'الوجهة المختارة:' : 'Selected Destination:'}{' '}
                <strong>{destinationName}</strong>
              </span>
            </div>

            {/* Segmented Auth Tabs */}
            <div className="lobby-auth-tabs">
              <button 
                type="button"
                className={`lobby-auth-tab-btn ${authReqTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthReqTab('login'); setAuthReqError(''); setAuthReqSuccess(''); }}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button 
                type="button"
                className={`lobby-auth-tab-btn ${authReqTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthReqTab('register'); setAuthReqError(''); setAuthReqSuccess(''); }}
              >
                {lang === 'ar' ? 'إنشاء حساب جديد' : 'Sign Up'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="lobby-auth-body">
              {/* Status alerts */}
              {authReqError && (
                <div className="lobby-auth-error">
                  <span>⚠️</span>
                  <span>{authReqError}</span>
                </div>
              )}
              {authReqSuccess && (
                <div className="lobby-auth-success">
                  <span>✓</span>
                  <span>{authReqSuccess}</span>
                </div>
              )}

              {/* TAB 1: LOGIN FORM */}
              {authReqTab === 'login' && (
                <form onSubmit={handleAuthReqLogin} className="lobby-auth-form">
                  {/* Phone */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف المسجل:' : 'Registered Phone Number:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Phone size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="tel" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '01012345678 أو +20...' : '+20 101 234 5678'}
                        value={authReqPhone}
                        onChange={(e) => setAuthReqPhone(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'كلمة المرور:' : 'Password:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Lock size={18} className="lobby-auth-input-icon" />
                      <input 
                        type={showAuthPassword ? 'text' : 'password'} 
                        required
                        className="lobby-auth-input"
                        placeholder="••••••••"
                        value={authReqPassword}
                        onChange={(e) => setAuthReqPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="lobby-auth-eye-btn"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="lobby-auth-submit-btn" disabled={authReqLoading}>
                    <span>
                      {authReqLoading 
                        ? (lang === 'ar' ? 'جاري التحقق...' : 'Signing in...')
                        : (lang === 'ar' 
                            ? `تسجيل الدخول والمتابعة إلى ${destinationName}` 
                            : `Sign In & Continue to ${destinationName}`)}
                    </span>
                    {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>

                  {/* Switch to Sign Up */}
                  <div className="lobby-auth-switch-text">
                    <span>{lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}</span>{' '}
                    <button 
                      type="button" 
                      className="lobby-auth-switch-link"
                      onClick={() => { setAuthReqTab('register'); setAuthReqError(''); }}
                    >
                      {lang === 'ar' ? 'سجّل بياناتك كـ Guest الآن' : 'Sign Up as Guest now'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SIGN UP FORM (MATCHING IMAGE 2 EXACTLY) */}
              {authReqTab === 'register' && (
                <form onSubmit={handleAuthReqRegister} className="lobby-auth-form">
                  {/* Full Name: * */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'الاسم بالكامل:' : 'Full Name:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <User size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="text" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'}
                        value={authReqName}
                        onChange={(e) => setAuthReqName(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Phone Number: * */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Phone size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="tel" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '01012345678 أو +20...' : '+20 101 234 5678'}
                        value={authReqPhone}
                        onChange={(e) => setAuthReqPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Age & Gender Grid */}
                  <div className="lobby-auth-grid-2">
                    {/* Age: * */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'العمر (السن):' : 'Age:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Calendar size={18} className="lobby-auth-input-icon" />
                        <input 
                          type="number" 
                          required
                          min="1"
                          max="120"
                          className="lobby-auth-input"
                          placeholder={lang === 'ar' ? 'مثال: 32' : 'e.g. 32'}
                          value={authReqAge}
                          onChange={(e) => setAuthReqAge(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Gender: * */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'النوع:' : 'Gender:'} *
                      </label>
                      <div className="lobby-gender-toggles">
                        <button
                          type="button"
                          className={`lobby-gender-btn ${authReqGender === 'male' ? 'active' : ''}`}
                          onClick={() => setAuthReqGender('male')}
                        >
                          <span>👨</span>
                          <span>{lang === 'ar' ? 'ذكر' : 'Male'}</span>
                        </button>
                        <button
                          type="button"
                          className={`lobby-gender-btn ${authReqGender === 'female' ? 'active' : ''}`}
                          onClick={() => setAuthReqGender('female')}
                        >
                          <span>👩</span>
                          <span>{lang === 'ar' ? 'أنثى' : 'Female'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password Grid */}
                  <div className="lobby-auth-grid-2">
                    {/* Password */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'كلمة المرور:' : 'Password:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Lock size={18} className="lobby-auth-input-icon" />
                        <input 
                          type={showAuthPassword ? 'text' : 'password'} 
                          required
                          className="lobby-auth-input"
                          placeholder="••••••••"
                          value={authReqPassword}
                          onChange={(e) => setAuthReqPassword(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="lobby-auth-eye-btn"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'تأكيد كلمة المرور:' : 'Confirm Password:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Lock size={18} className="lobby-auth-input-icon" />
                        <input 
                          type={showAuthPassword ? 'text' : 'password'} 
                          required
                          className="lobby-auth-input"
                          placeholder="••••••••"
                          value={authReqConfirmPassword}
                          onChange={(e) => setAuthReqConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accompanying Children Section */}
                  <div className="lobby-children-card">
                    <div className="lobby-children-header">
                      <div className="lobby-children-title">
                        <Users size={16} />
                        <span>{lang === 'ar' ? 'الأطفال المرافقين' : 'Accompanying Children'}</span>
                        <span className="lobby-child-badge">
                          {authReqChildren.length} {lang === 'ar' ? 'طفل' : 'child'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="lobby-add-child-btn"
                        onClick={handleAddChild}
                      >
                        <Plus size={14} />
                        <span>{lang === 'ar' ? 'إضافة طفل' : 'Add Child'}</span>
                      </button>
                    </div>

                    {authReqChildren.length === 0 ? (
                      <div className="lobby-no-children-note">
                        {lang === 'ar' 
                          ? 'لم تتم إضافة أطفال بعد. اضغط (+ إضافة طفل) لإضافة طفل مرافق.' 
                          : 'No children added yet. Click (+ Add Child) to register a child.'}
                      </div>
                    ) : (
                      <div className="lobby-children-list">
                        {authReqChildren.map((child, index) => (
                          <div key={index} className="lobby-child-row">
                            <div className="lobby-child-row-top">
                              <span className="lobby-child-badge">
                                {lang === 'ar' ? `الطفل ${index + 1}` : `Child ${index + 1}`}
                              </span>
                              <button
                                type="button"
                                className="lobby-child-remove-btn"
                                onClick={() => handleRemoveChild(index)}
                                title={lang === 'ar' ? 'حذف الطفل' : 'Remove Child'}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="lobby-child-fields-grid">
                              <input 
                                type="text"
                                required
                                className="lobby-child-input"
                                placeholder={lang === 'ar' ? 'اسم الطفل' : 'Child name'}
                                value={child.name}
                                onChange={(e) => handleUpdateChild(index, 'name', e.target.value)}
                              />
                              <input 
                                type="number"
                                required
                                min="1"
                                max="18"
                                className="lobby-child-input"
                                placeholder={lang === 'ar' ? 'العمر' : 'Age'}
                                value={child.age}
                                onChange={(e) => handleUpdateChild(index, 'age', e.target.value)}
                              />
                              <select
                                className="lobby-child-gender-select"
                                value={child.gender}
                                onChange={(e) => handleUpdateChild(index, 'gender', e.target.value)}
                              >
                                <option value="boy">{lang === 'ar' ? 'ولد 👦' : 'Boy 👦'}</option>
                                <option value="girl">{lang === 'ar' ? 'بنت 👧' : 'Girl 👧'}</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Glowing Radiant Orange Submit Button */}
                  <button type="submit" className="lobby-auth-submit-btn" disabled={authReqLoading}>
                    <span>
                      {authReqLoading 
                        ? (lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...') 
                        : (lang === 'ar' 
                            ? `إنشاء الحساب ومتابعة إلى ${destinationName}` 
                            : `Sign Up & Continue to ${destinationName}`)}
                    </span>
                    {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>

                  {/* Switch to Sign In */}
                  <div className="lobby-auth-switch-text">
                    <span>{lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>{' '}
                    <button 
                      type="button" 
                      className="lobby-auth-switch-link"
                      onClick={() => { setAuthReqTab('login'); setAuthReqError(''); }}
                    >
                      {lang === 'ar' ? 'تسجيل الدخول الآن' : 'Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}

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
                <h3 className="profile-name">{user?.name || (lang === 'ar' ? 'زائر أمريكان دريم' : 'American Dream Guest')}</h3>
                <span className="profile-membership">{user?.membership || (lang === 'ar' ? 'عضو مميز • النادي الذهبي' : 'VIP Member • Gold Club')}</span>
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
                  <span className="stat-label">{lang === 'ar' ? 'تذاكر سارية' : 'Active Passes'}</span>
                </div>
                <div className="profile-stat-box">
                  <span className="stat-value">{user?.points || 340}</span>
                  <span className="stat-label">{lang === 'ar' ? 'نقاط اللعب' : 'Play Points'}</span>
                </div>
                <div className="profile-stat-box">
                  <span className="stat-value">{user?.zoneVisits || 4}</span>
                  <span className="stat-label">{lang === 'ar' ? 'مرات الزيارة' : 'Zone Visits'}</span>
                </div>
              </div>

              <div className="profile-actions-list">
                <button 
                  className="profile-action-btn"
                  onClick={() => {
                    setActiveTab('profile');
                    closeModal();
                  }}
                  style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.5)' }}
                >
                  <div className="profile-btn-icon-wrap wrap-orange">
                    <svg className="profile-btn-svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="profile-btn-text" style={{ color: '#f59e0b', fontWeight: 800 }}>
                    {lang === 'ar' ? 'فتح صفحة الحساب الكاملة (My Profile)' : 'Open Full Profile Page (My Profile)'}
                  </span>
                </button>

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
                    {lang === 'ar' 
                      ? `عرض وشحن الأسورة الذكية (${user?.activePasses?.length || 0} تذاكر)` 
                      : `View & Recharge Wristband (${user?.activePasses?.length || 0} passes)`}
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
                  <span className="profile-btn-text">
                    {lang === 'ar' ? 'رمز الدخول السريع QR للألعاب' : 'Kids Area Fast Entry QR'}
                  </span>
                </button>

                <button 
                  className="profile-action-btn"
                  onClick={() => {
                    closeModal();
                    setActiveTab('dashboard');
                  }}
                  style={{
                    background: 'rgba(0, 169, 195, 0.08)',
                    borderColor: 'rgba(0, 169, 195, 0.35)'
                  }}
                >
                  <div className="profile-btn-icon-wrap wrap-cyan">
                    <span style={{ fontSize: '1.15rem' }}>⚙️</span>
                  </div>
                  <span className="profile-btn-text" style={{ color: '#007287', fontWeight: 800 }}>
                    {lang === 'ar' ? 'لوحة التحكم الإدارية ورفع الصور' : 'Admin & Media Dashboard'}
                  </span>
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
                    {isAuthenticated 
                      ? (lang === 'ar' ? 'تبديل الحساب / تسجيل الدخول' : 'Switch Account / Re-login') 
                      : (lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register')}
                  </span>
                </button>

                {isAuthenticated && (
                  <button 
                    className="profile-action-btn"
                    onClick={async () => {
                      await logout();
                      closeModal();
                      setActiveTab('lobby');
                      if (typeof window !== 'undefined') {
                        window.location.hash = '#lobby';
                      }
                    }}
                    style={{ opacity: 0.9 }}
                  >
                    <div className="profile-btn-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                      <LogOut size={18} color="#ef4444" />
                    </div>
                    <span className="profile-btn-text" style={{ color: '#ef4444', fontWeight: 700 }}>
                      {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
                    </span>
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
                  {lang === 'ar' ? '← رجوع' : '← Back'}
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>
                  {lang === 'ar' ? 'تذاكري السارية' : 'My Active Passes'}
                </h3>
              </div>

              {(!user?.activePasses || user.activePasses.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#7a9299' }}>
                  <p>{lang === 'ar' ? 'لا توجد تذاكر نشطة حالياً.' : 'No active passes yet.'}</p>
                  <button 
                    className="booking-submit-btn"
                    style={{ marginTop: '1rem' }}
                    onClick={() => { closeModal(); setActiveTab('kids-area'); }}
                  >
                    {lang === 'ar' ? 'احجز تذكرتك الأولى الآن' : 'Book Your First Pass'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {user.activePasses.map((pass, idx) => (
                    <div 
                      key={idx} 
                      className="booking-pass-card"
                      style={{ margin: 0, textAlign: lang === 'ar' ? 'right' : 'left' }}
                    >
                      <div className="pass-code-label">{lang === 'ar' ? 'الكود:' : 'CODE:'} {pass.code}</div>
                      <div className="pass-zone-title" style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                        {pass.name}
                      </div>
                      <div className="pass-details-row" style={{ marginTop: '8px' }}>
                        <span><strong>{lang === 'ar' ? 'الكمية:' : 'Qty:'}</strong> {pass.quantity}x {lang === 'ar' ? 'تذكرة' : 'Pass'}</span>
                        <span><strong>{lang === 'ar' ? 'الحالة:' : 'Status:'}</strong> <span style={{ color: '#10b981' }}>{pass.status === 'Active' || !pass.status ? (lang === 'ar' ? 'سارية' : 'Active') : pass.status}</span></span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#7a9299', marginTop: '4px' }}>
                        {pass.date === 'Valid Today' ? (lang === 'ar' ? 'صالحة اليوم' : 'Valid Today') : pass.date} • {pass.price}
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
                  {lang === 'ar' ? '← رجوع' : '← Back'}
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>
                  {lang === 'ar' ? 'رمز الدخول السريع QR' : 'Fast Entry QR'}
                </h3>
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
                {user?.name || (lang === 'ar' ? 'عضو أمريكان دريم' : 'American Dream Member')}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7a9299', margin: '6px 0 16px' }}>
                {lang === 'ar' ? 'امسح الرمز عند البوابة الإلكترونية للدخول المباشر السريع دون انتظار.' : 'Scan at turnstile barrier gate for instant contact-free entry.'}
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
                  {lang === 'ar' ? '← رجوع' : '← Back'}
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>
                  {lang === 'ar' ? 'تسجيل الدخول إلى الحساب' : 'Sign In to Account'}
                </h3>
              </div>

              {authMsg && (
                <div style={{ padding: '8px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {authMsg}
                </div>
              )}

              <form onSubmit={handleAuthLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'رقم الهاتف أو البريد الإلكتروني:' : 'Mobile Number or Email:'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={lang === 'ar' ? '01012345678 أو البريد' : '01012345678 or user@domain.com'}
                    className="booking-text-input"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                  </label>
                  <input 
                    type="password" 
                    required 
                    placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="booking-text-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="booking-submit-btn" style={{ marginTop: '8px' }}>
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.88rem' }}>
                  {lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                  <button 
                    type="button" 
                    onClick={() => { setProfileView('register'); setAuthMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#00a9c3', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {lang === 'ar' ? 'إنشاء حساب جديد' : 'Register New Account'}
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
                  {lang === 'ar' ? '← رجوع' : '← Back'}
                </button>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#06283d' }}>
                  {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
                </h3>
              </div>

              {authMsg && (
                <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {authMsg}
                </div>
              )}

              <form onSubmit={handleAuthRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'الاسم بالكامل:' : 'Your Full Name:'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={lang === 'ar' ? 'مثال: سارة محمد' : 'e.g. Sara Mohamed'}
                    className="booking-text-input"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'رقم الهاتف (واتساب):' : 'Mobile Number (WhatsApp):'}
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="01098765432"
                    className="booking-text-input"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                  </label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="booking-text-input"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="booking-label">
                    {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                  </label>
                  <input 
                    type="password" 
                    required 
                    placeholder={lang === 'ar' ? 'أنشئ كلمة مرور' : 'Create a password'}
                    className="booking-text-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="booking-submit-btn" style={{ marginTop: '8px' }}>
                  {lang === 'ar' ? 'إنشاء الحساب (+١٠٠ نقطة ترحيبية)' : 'Create Account (+100 Bonus Points)'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.88rem' }}>
                  {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already registered? '}
                  <button 
                    type="button" 
                    onClick={() => { setProfileView('login'); setAuthMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#00a9c3', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
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
              alt={lang === 'ar' ? (modalData?.titleAr || modalData?.title) : (modalData?.titleEn || modalData?.title)} 
              className="attr-detail-hero-img" 
              onError={(e) => {
                e.currentTarget.src = modalData?.fallbackImg;
              }}
            />
          </div>

          <div className="attraction-detail-body">
            <h3 className="attr-detail-title">
              {lang === 'ar' ? (modalData?.titleAr || modalData?.title) : (modalData?.titleEn || modalData?.title)}
            </h3>
            <p className="attr-detail-desc">
              {lang === 'ar' ? (modalData?.descAr || modalData?.desc) : modalData?.desc}
            </p>

            <div className="attr-safety-checklist">
              <div className="checklist-item">
                {lang === 'ar' ? '✓ تعقيم وتطهير شامل للألعاب كل ساعتين' : '✓ Fully sanitized and cleaned every 2 hours'}
              </div>
              <div className="checklist-item">
                {lang === 'ar' ? '✓ مشرفون ومدربون معتمدون للسلامة طوال الوقت' : '✓ Trained safety supervisors present at all times'}
              </div>
              <div className="checklist-item">
                {lang === 'ar' ? '✓ جوارب مانعة للانزلاق إلزامية (متوفرة بالاستقبال)' : '✓ Grip socks required (available at reception)'}
              </div>
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
              {lang === 'ar' ? 'حجز تذكرة الدخول لهذه اللعبة' : 'Book Entry Pass For This Attraction'}
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
                src={modalData.images[lightboxIndex]?.src || modalData.images[lightboxIndex]?.url} 
                alt={modalData.images[lightboxIndex]?.title} 
                className="lightbox-main-img" 
                onError={(e) => {
                  const fallback = modalData.images[lightboxIndex]?.fallbackSrc;
                  if (fallback) e.currentTarget.src = fallback;
                }}
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
          <h3 className="info-modal-title">{lang === 'ar' ? (modalData?.titleAr || modalData?.title) : modalData?.title}</h3>
          <p className="info-modal-body">{lang === 'ar' ? (modalData?.textAr || modalData?.text) : modalData?.text}</p>
          <button className="confirm-done-btn" onClick={closeModal}>
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}

      {/* 8. ABOUT AMERICAN DREAM MODAL */}
      {modalType === 'about-info' && (
        <div 
          className="mobile-modal-sheet info-sheet"
          style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="sheet-close-x" onClick={closeModal} style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff' }}>✕</button>
          <div style={{ height: '200px', width: '100%', position: 'relative' }}>
            <img 
              src="/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png" 
              alt={lang === 'ar' ? 'أمريكان دريم بالإسماعيلية' : 'American Dream Ismailia'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, #0d2847 100%)' }} />
            <h3 style={{ position: 'absolute', bottom: '16px', left: lang === 'ar' ? 'auto' : '24px', right: lang === 'ar' ? '24px' : 'auto', color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              {lang === 'ar' ? 'عن أمريكان دريم بالإسماعيلية' : 'About American Dream Ismailia'}
            </h3>
          </div>
          <div style={{ padding: '24px 28px', color: '#1e293b' }}>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: '#475569', margin: '0 0 20px' }}>
              {lang === 'ar' ? (
                <>يقع <strong>أمريكان دريم</strong> مباشرة على ضفاف قناة السويس الهادئة بالإسماعيلية، وهو منتجع ترفيهي وعائلي فاخر متكامل. يجمع بين مناطق ألعاب داخلية وخارجية واسعة، ألعاب واقع افتراضي حديثة، قاعات احتفالات كبرى للأفراح والمناسبات، ومطاعم شاطئية بإطلالة بحرية خلابة، لنصنع تجارب لا تُنسى لجميع الأعمار.</>
              ) : (
                <>Located right on the tranquil waterfront of the historic Suez Canal in Ismailia, <strong>American Dream</strong> is a premier luxury entertainment and family resort. Combining expansive indoor & outdoor Play Zones, cutting-edge VR arcades, grand event celebration halls, and open-air seaside dining, we craft memorable experiences for guests of all ages.</>
              )}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {lang === 'ar' ? (
                <>
                  <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e' }}>٤ مناطق ألعاب</div>
                    <div style={{ fontSize: '0.78rem', color: '#115e59' }}>منطقة الأطفال، فن بارك، التحدي، والمغامرات</div>
                  </div>
                  <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a16207' }}>٤٥٠ فرد</div>
                    <div style={{ fontSize: '0.78rem', color: '#854d0e' }}>قاعة كبرى وأفراح على ضفاف القناة</div>
                  </div>
                  <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1' }}>قناة السويس</div>
                    <div style={{ fontSize: '0.78rem', color: '#075985' }}>إطلالة شاطئية وجلسات وقت الغروب</div>
                  </div>
                  <div style={{ background: '#fdf2f8', border: '1px solid #fce7f3', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#be185d' }}>١٠٠٪ أمان</div>
                    <div style={{ fontSize: '0.78rem', color: '#9d174d' }}>مشرفون معتمدون وتعقيم دوري مستمر</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e' }}>4 Zones</div>
                    <div style={{ fontSize: '0.78rem', color: '#115e59' }}>Kids Area, Fun Park, VR & Adventure</div>
                  </div>
                  <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a16207' }}>450 Guests</div>
                    <div style={{ fontSize: '0.78rem', color: '#854d0e' }}>Waterfront Grand Ballroom & Halls</div>
                  </div>
                  <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1' }}>Suez Canal</div>
                    <div style={{ fontSize: '0.78rem', color: '#075985' }}>Seaside Lounge & Sunset Views</div>
                  </div>
                  <div style={{ background: '#fdf2f8', border: '1px solid #fce7f3', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#be185d' }}>100% Safe</div>
                    <div style={{ fontSize: '0.78rem', color: '#9d174d' }}>Certified Supervisors & Sanitization</div>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                className="confirm-done-btn"
                style={{ flex: 1, background: '#00a8cc' }}
                onClick={() => { closeModal(); setActiveTab('events'); }}
              >
                {lang === 'ar' ? 'استكشف الحفلات والقاعات' : 'Explore Events & Halls'}
              </button>
              <button 
                type="button"
                className="confirm-done-btn"
                style={{ flex: 1, background: '#e2e8f0', color: '#334155' }}
                onClick={closeModal}
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. RESTAURANT & CAFE MENU MODAL */}
      {modalType === 'restaurant-menu' && (
        <div 
          className="mobile-modal-sheet info-sheet"
          style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="sheet-close-x" onClick={closeModal} style={{ zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff' }}>✕</button>
          <div style={{ height: '210px', width: '100%', position: 'relative' }}>
            <img 
              src="/photo/kid area pic/Image.png" 
              alt={lang === 'ar' ? 'المطعم والكافيه' : 'Restaurant & Cafe'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, #0d2847 100%)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: lang === 'ar' ? 'auto' : '24px', right: lang === 'ar' ? '24px' : 'auto' }}>
              <span style={{ background: '#f59e0b', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'مطاعم على ضفاف القناة' : 'Waterfront Dining'}
              </span>
              <h3 style={{ color: '#fff', fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 0' }}>
                {lang === 'ar' ? 'المطعم والكافيه' : 'Restaurant & Cafe'}
              </h3>
            </div>
          </div>
          <div style={{ padding: '24px 28px', color: '#1e293b' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 18px', lineHeight: 1.5 }}>
              {lang === 'ar' 
                ? 'استمتع بأشهى العصائر والمثلجات، القهوة المختصة، برجر سماش فاخر، وأطباق متنوعة مع إطلالة بانورامية على قناة السويس.' 
                : 'Enjoy handcrafted shakes, artisan coffees, gourmet smash burgers, and Mediterranean delicacies while relaxing with Suez Canal views.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              {(lang === 'ar' ? [
                { name: 'ميلك شيك فراولة عملاق مع صوص', desc: 'كريمة مخفوقة وفارماسيل كاندي وكرز', price: '٩٥ ج.م' },
                { name: 'فشار كراميل طازج عائلي', desc: 'فشار ذهبي مقرمش بالكراميل الغني', price: '٦٥ ج.م' },
                { name: 'أمريكان دريم تشيز برجر سماش', desc: 'شريحتان لحم أنجوس مع شيدر وصوص سري', price: '١٦٠ ج.م' },
                { name: 'عصير مانجو أو برتقال فريش طبيعي', desc: 'عصير فواكه طازجة طبيعية ١٠٠٪ مثلجة', price: '٧٠ ج.م' }
              ] : [
                { name: 'Monster Strawberry Sundae Shake', desc: 'Whipped cream, rainbow sprinkles & cherry on top', price: '95 EGP' },
                { name: 'Loaded Caramel Popcorn Bucket', desc: 'Fresh kettle-popped sweet golden corn bucket', price: '65 EGP' },
                { name: 'American Dream Cheesy Smash Burger', desc: 'Double Angus beef patty, cheddar & secret sauce', price: '160 EGP' },
                { name: 'Fresh Seaside Mango / Orange Cocktail', desc: 'Freshly squeezed natural tropical juice', price: '70 EGP' }
              ]).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.desc}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem', whiteSpace: 'nowrap', marginInlineStart: '12px' }}>{item.price}</div>
                </div>
              ))}
            </div>
            <button 
              type="button"
              className="confirm-done-btn"
              style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }}
              onClick={closeModal}
            >
              {lang === 'ar' ? 'حجز طاولة / اطلب الآن' : 'Reserve A Table / Order Now'}
            </button>
          </div>
        </div>
      )}

      {/* 10. SAFETY GUIDELINES MODAL */}
      {modalType === 'safety-guidelines' && (
        <div 
          className="mobile-modal-sheet info-sheet"
          style={{ maxWidth: '600px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🛡️</span>
            <h3 className="info-modal-title" style={{ margin: 0 }}>
              {lang === 'ar' ? 'قواعد وتعليمات السلامة بالحديقة' : 'Park & Event Safety Rules'}
            </h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 18px' }}>
            {lang === 'ar' 
              ? 'لضمان تجربة آمنة ومبهجة لكل طفل، ولي أمر، وزائر:' 
              : 'To guarantee a safe, happy experience for every child, parent, and guest:'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {(lang === 'ar' ? [
              'مشرفون ومدربون معتمدون: فريق سلامة متخصص متواجد في كافة مناطق اللعب.',
              'جوارب مانعة للانزلاق إلزامية: يجب ارتداء الجوارب داخل منطقة الألعاب والمطاطيات والترامبولين.',
              'بروتوكولات التعقيم: دورات تعقيم وتطهير شاملة للألعاب كل ساعتين بأعلى معايير النظافة.',
              'أمان ضفاف القناة: محيط قناة السويس مؤمّن بسياج حماية مدعم وكاميرات مراقبة على مدار الساعة.',
              'فحص الطول والسن: تطبيق إرشادات السن والطول المناسبين في مسار الحبال وسيارات الكارتينج.'
            ] : [
              'Certified Animators & Supervisors: Dedicated safety team stationed across all active play zones.',
              'Grip Socks Obligatory: Non-slip socks must be worn inside soft play, slides, and trampoline areas.',
              'Sanitization Protocols: Deep medical-grade disinfection cycles scheduled every 2 hours.',
              'Waterfront Safety: Suez Canal perimeter is secured by heavy-duty reinforced railings and 24/7 CCTV.',
              'Age & Height Checks: Safe height & weight guidelines enforced on the ropes courses and go-karts.'
            ]).map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <button className="confirm-done-btn" onClick={closeModal} style={{ background: '#00a8cc' }}>
            {lang === 'ar' ? 'موافق وفهمت التعليمات' : 'I Understand & Agree'}
          </button>
        </div>
      )}

      {/* 11. ADVENTURE TRIPS & FAST PASS MODAL */}
      {modalType === 'trip-pass' && (
        <div 
          className="mobile-modal-sheet info-sheet"
          style={{ maxWidth: '580px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-drag-handle" />
          <button className="sheet-close-x" onClick={closeModal}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <img 
              src="/photo/kid area pic/icon/cart.png" 
              alt={lang === 'ar' ? 'التذكرة السريعة' : 'Fast Pass Trips'} 
              style={{ width: '48px', height: '48px', margin: '0 auto 10px', display: 'block' }} 
            />
            <h3 className="info-modal-title" style={{ margin: '0 0 6px' }}>
              {lang === 'ar' ? 'التذكرة السريعة ورحلات المغامرة' : 'Fast Pass & Adventure Trips'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
              {lang === 'ar' 
                ? 'تخطَّ كافة طوابير الانتظار واستمتع برحلات بحرية حصرية في قناة السويس.' 
                : 'Skip every queue and experience exclusive Suez Canal boat trips.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
            <div style={{ border: '2px solid #ffd15c', background: '#fffbeb', padding: '14px 18px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>
                  {lang === 'ar' ? 'تذكرة الـ VIP السريعة لكل المناطق' : 'All-Zone VIP Fast Pass'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                  {lang === 'ar' ? 'دخول مباشر دون انتظار لكافة الألعاب والـ VR وسيارات الكارتينج' : 'Zero wait times for all rides, VR arcades & go-karts'}
                </div>
              </div>
              <div style={{ fontWeight: 900, color: '#b45309', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? '٢٥٠ ج.م' : '250 EGP'}
              </div>
            </div>
            <div style={{ border: '1px solid #bae6fd', background: '#f0f9ff', padding: '14px 18px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.95rem' }}>
                  {lang === 'ar' ? 'رحلة بحرية في قناة السويس وقت الغروب' : 'Suez Canal Sunset Cruise'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7' }}>
                  {lang === 'ar' ? 'جولة بحرية لمدة ٤٥ دقيقة مع مشروبات ومرشد سياحي' : '45-minute scenic cruise with refreshments & guide'}
                </div>
              </div>
              <div style={{ fontWeight: 900, color: '#0284c7', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? '٣٥٠ ج.م' : '350 EGP'}
              </div>
            </div>
          </div>
          <button 
            type="button"
            className="confirm-done-btn"
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }}
            onClick={(e) => {
              handleConfirmBooking(e);
            }}
          >
            {lang === 'ar' ? 'احجز تذكرة الـ VIP الآن' : 'Get VIP Pass Now'}
          </button>
        </div>
      )}

      {/* 12. MEDIA UPLOAD & ASSET MANAGER MODAL (Apidog API) */}
      {modalType === 'upload-media' && (
        <MediaUploadModal 
          isOpen={true}
          closeModal={closeModal}
          setActiveTab={setActiveTab}
          lang={lang}
        />
      )}
    </div>
  );
}
