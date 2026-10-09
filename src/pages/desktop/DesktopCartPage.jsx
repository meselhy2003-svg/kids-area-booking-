import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, FolderOpen, UploadCloud, X, Phone, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { isUserAuthenticated } from '../../api/authService';
import './DesktopCartPage.css';

export default function DesktopCartPage({ setActiveTab, openModal, lang = 'ar' }) {
  // 1. Initial 4 Passes matching screenshot: Total = 450 EGP / 1450 Points
  const [cartItems, setCartItems] = useState([
    {
      id: 'pass-kids-area',
      title: 'Super Explorer Pass',
      zone: 'kids-area',
      zoneLabel: 'Kids Area',
      age: 'Ages 1 - 6',
      inclusions: 'All-Day Soft Play + Ball Pit + Sensory Arena',
      priceEgp: 100,
      pricePts: 300,
      qty: 1,
      thumb: '/photo/kid area pic/Kids sliding into colorful ball pit.png'
    },
    {
      id: 'pass-fun-park',
      title: 'All-Day Thrill Pass',
      zone: 'fun-park',
      zoneLabel: 'Fun Park',
      age: 'All Ages',
      inclusions: 'Unlimited Carousel + Bumper Collision Bay',
      priceEgp: 150,
      pricePts: 500,
      qty: 1,
      thumb: '/photo/kid area pic/Classic illuminated carousel ride.png'
    },
    {
      id: 'pass-challenge',
      title: 'Tactical Arena Pass',
      zone: 'challenge',
      zoneLabel: 'Challenge Zone',
      age: 'Ages 8+',
      inclusions: 'VR Headset Battle + Air Hockey Arena',
      priceEgp: 100,
      pricePts: 350,
      qty: 1,
      thumb: '/photo/kid area pic/Kid wearing VR headset in neon arcade.png'
    },
    {
      id: 'pass-adventure',
      title: 'High Ropes Suspension Pass',
      zone: 'adventure',
      zoneLabel: 'Adventure Zone',
      age: 'Ages 6+',
      inclusions: 'High Ropes Course + Safety Harness & Guide',
      priceEgp: 100,
      pricePts: 300,
      qty: 1,
      thumb: '/photo/kid area pic/High ropes suspended course.png'
    }
  ]);

  // User Points Balance (matches 2250 pts ribbon badge)
  const [userPointsBalance, setUserPointsBalance] = useState(2250);

  // Payment Method Selection: 'points' | 'money'
  const [paymentMethod, setPaymentMethod] = useState('points');
  const [moneyMethod, setMoneyMethod] = useState('instapay'); // 'instapay' | 'vodafone'

  // Checkout Success Modal State
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastPaymentRef, setLastPaymentRef] = useState('');
  const [showAddPassesModal, setShowAddPassesModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  // Money Payment Proof Modal States
  const [showMoneyProofModal, setShowMoneyProofModal] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState(null); // { file, preview, name, size }
  const [senderPhoneOrAccount, setSenderPhoneOrAccount] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [moneyOrderSubmitted, setMoneyOrderSubmitted] = useState(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  // Dynamic Calculations
  const totalPasses = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalEgp = cartItems.reduce((acc, item) => acc + item.priceEgp * item.qty, 0);
  const subtotalPts = cartItems.reduce((acc, item) => acc + item.pricePts * item.qty, 0);
  const loyaltyBonusPts = Math.round(subtotalEgp * 0.1);
  const pointsRemaining = userPointsBalance - subtotalPts;

  // Stepper increment/decrement
  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove single item
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all items
  const clearAll = () => {
    setCartItems([]);
  };

  // Reset demo cart
  const resetDemoCart = () => {
    setCartItems([
      {
        id: 'pass-kids-area',
        title: 'Super Explorer Pass',
        zone: 'kids-area',
        zoneLabel: 'Kids Area',
        age: 'Ages 1 - 6',
        inclusions: 'All-Day Soft Play + Ball Pit + Sensory Arena',
        priceEgp: 100,
        pricePts: 300,
        qty: 1,
        thumb: '/photo/kid area pic/Kids sliding into colorful ball pit.png'
      },
      {
        id: 'pass-fun-park',
        title: 'All-Day Thrill Pass',
        zone: 'fun-park',
        zoneLabel: 'Fun Park',
        age: 'All Ages',
        inclusions: 'Unlimited Carousel + Bumper Collision Bay',
        priceEgp: 150,
        pricePts: 500,
        qty: 1,
        thumb: '/photo/kid area pic/Classic illuminated carousel ride.png'
      },
      {
        id: 'pass-challenge',
        title: 'Tactical Arena Pass',
        zone: 'challenge',
        zoneLabel: 'Challenge Zone',
        age: 'Ages 8+',
        inclusions: 'VR Headset Battle + Air Hockey Arena',
        priceEgp: 100,
        pricePts: 350,
        qty: 1,
        thumb: '/photo/kid area pic/Kid wearing VR headset in neon arcade.png'
      },
      {
        id: 'pass-adventure',
        title: 'High Ropes Suspension Pass',
        zone: 'adventure',
        zoneLabel: 'Adventure Zone',
        age: 'Ages 6+',
        inclusions: 'High Ropes Course + Safety Harness & Guide',
        priceEgp: 100,
        pricePts: 300,
        qty: 1,
        thumb: '/photo/kid area pic/High ropes suspended course.png'
      }
    ]);
  };

  // Copy account details helper
  const handleCopyAccount = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2200);
    }
  };

  // Upload payment proof receipt image
  const handleReceiptFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setUploadError('');
    const preview = URL.createObjectURL(file);
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    setUploadedReceipt({ file, preview, name: file.name, size: sizeFormatted });
  };

  // Remove uploaded receipt
  const handleRemoveReceipt = () => {
    if (uploadedReceipt?.preview) {
      URL.revokeObjectURL(uploadedReceipt.preview);
    }
    setUploadedReceipt(null);
    setUploadError('');
  };

  // Submit Money Payment Proof with Request
  const handleSubmitMoneyProof = () => {
    if (!uploadedReceipt) {
      setUploadError('Please upload your payment screenshot/receipt to submit your request.');
      return;
    }
    setIsSubmittingProof(true);
    setTimeout(() => {
      setIsSubmittingProof(false);
      const ref = `AD-WRIST-${Math.floor(100000 + Math.random() * 900000)}`;
      setLastPaymentRef(ref);
      setMoneyOrderSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  // Close Money Modal & reset if submitted
  const handleCloseMoneyModal = () => {
    setShowMoneyProofModal(false);
    if (moneyOrderSubmitted) {
      setCartItems([]);
      setMoneyOrderSubmitted(false);
      setUploadedReceipt(null);
      setSenderPhoneOrAccount('');
      setUploadError('');
    }
  };

  // Execute Payment
  const handlePayment = () => {
    if (totalPasses === 0) return;

    if (!isUserAuthenticated()) {
      if (openModal) {
        openModal('auth-required', {
          action: 'checkout',
          onSuccess: () => {
            proceedPaymentExecution();
          }
        });
      }
      return;
    }

    proceedPaymentExecution();
  };

  const proceedPaymentExecution = () => {
    if (paymentMethod === 'points') {
      if (userPointsBalance < subtotalPts) {
        alert(lang === 'ar' ? 'رصيد النقاط غير كافٍ! يرجى اختيار الدفع بالمال.' : 'Insufficient points balance! Please select "Pay with Money" or top up your wristband.');
        return;
      }
      setUserPointsBalance((prev) => prev - subtotalPts);
      const ref = `AD-WRIST-${Math.floor(100000 + Math.random() * 900000)}`;
      setLastPaymentRef(ref);
      setPaymentSuccess(true);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      // paymentMethod === 'money' -> Open Money Payment & Receipt Upload Pop Screen
      setShowMoneyProofModal(true);
      setMoneyOrderSubmitted(false);
      setUploadError('');
    }
  };

  return (
    <div className="desktop-page desktop-cart-page">
      <div className="desktop-page-container">
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER */}
        {/* ========================================================================= */}
        <section className="cart-header-section">
          <h1 className="cart-main-title">
            {lang === 'ar' ? 'سلة الحجز والتذاكر' : 'MY CART'}
          </h1>
          <p className="cart-main-subtitle">
            {lang === 'ar'
              ? 'راجع تذاكرك وباقاتك، واختر طريقة الدفع المناسبة، واحجز إسورة الدخول فوراً.'
              : 'Review your thrill passes, select payment mode, and instantly reserve your entry wristband.'}
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 2. TWO-COLUMN LAYOUT */}
        {/* ========================================================================= */}
        <div className="cart-layout-grid">
          {/* ----------------- LEFT: YOUR ORDERS ----------------- */}
          <div className="cart-orders-col">
            <div className="orders-header-bar">
              <div className="orders-title-wrap">
                <span className="orders-indicator-pill" />
                <h2 className="orders-title">
                  {lang === 'ar' ? 'طلباتك وتذاكرك' : 'Your Orders'}
                </h2>
              </div>

              <div className="orders-actions-wrap">
                {cartItems.length > 0 && (
                  <button type="button" className="orders-action-btn clear" onClick={clearAll}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>{lang === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Passes List */}
            {cartItems.length > 0 ? (
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const itemTitle = lang === 'ar' 
                    ? (item.id === 'pass-kids-area' ? 'تذكرة المستكشف الصغير'
                      : item.id === 'pass-fun-park' ? 'تذكرة المرح والإثارة'
                      : item.id === 'pass-challenge' ? 'تذكرة ساحة التحدي والآركيد'
                      : item.id === 'pass-adventure' ? 'تذكرة مسار الحبال المعلقة'
                      : item.titleAr || item.title)
                    : (item.titleEn || item.title);

                  const zoneLabel = lang === 'ar'
                    ? (item.zone === 'kids-area' ? 'منطقة الأطفال'
                      : item.zone === 'fun-park' ? 'فن بارك'
                      : item.zone === 'challenge' ? 'منطقة التحدي'
                      : item.zone === 'adventure' ? 'منطقة المغامرات'
                      : item.zoneLabel)
                    : item.zoneLabel;

                  const itemAge = lang === 'ar'
                    ? (item.age === 'Ages 1 - 6' ? 'الأعمار: ١ - ٦ سنوات'
                      : item.age === 'All Ages' ? 'لكل الأعمار'
                      : item.age === 'Ages 8+' ? 'الأعمار: ٨+ سنوات'
                      : item.age === 'Ages 6+' ? 'الأعمار: ٦+ سنوات'
                      : item.age)
                    : item.age;

                  const itemInclusions = lang === 'ar'
                    ? (item.id === 'pass-kids-area' ? 'سوفت بلاي طول اليوم + حوض الكرات + منطقة حسية'
                      : item.id === 'pass-fun-park' ? 'ركوب غير محدود للدوامة + سيارات التصادم'
                      : item.id === 'pass-challenge' ? 'معارك الواقع الافتراضي + هوكي الهواء'
                      : item.id === 'pass-adventure' ? 'مسار حبال معلق + حزام أمان ومشرف خاص'
                      : item.inclusionsAr || item.inclusions)
                    : item.inclusions;

                  return (
                    <div key={item.id} className="cart-item-card">
                      {/* Left: Thumbnail & Title */}
                      <div className="cart-item-left">
                        <div className="cart-item-thumb-wrap">
                          <img 
                            src={item.thumb} 
                            alt={itemTitle} 
                            className="cart-item-thumb" 
                            onError={(e) => { e.target.src = '/photo/kid area pic/icon/cart.png'; }}
                          />
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-badge-row">
                            <span className={`cart-item-zone-badge ${item.zone.replace('-', '')}`}>
                              {zoneLabel}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{itemAge}</span>
                          </div>
                          <h4 className="cart-item-title">{itemTitle}</h4>
                          <p className="cart-item-meta">{itemInclusions}</p>
                        </div>
                      </div>

                      {/* Right: Pricing & Controls */}
                      <div className="cart-item-right">
                        <div className="cart-item-pricing">
                          <div className="cart-item-egp-price">
                            {lang === 'ar' ? `${item.priceEgp * item.qty} ج.م` : `${item.priceEgp * item.qty} EGP`}
                          </div>
                          <div className="cart-item-pts-price">
                            {lang === 'ar' ? `${item.pricePts * item.qty} نقطة` : `${item.pricePts * item.qty} Pts`}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="cart-item-stepper">
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQty(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="cart-stepper-val">{item.qty}</span>
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQty(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="cart-item-del-btn"
                          onClick={() => removeItem(item.id)}
                          title={lang === 'ar' ? 'حذف التذكرة' : 'Remove Pass'}
                          aria-label="Remove pass"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Cart State */
              <div className="cart-empty-box">
                <img 
                  src="/photo/kid area pic/icon/cart.png" 
                  alt="Empty Cart" 
                  className="cart-empty-icon" 
                />
                <h3 className="cart-empty-title">
                  {lang === 'ar' ? 'سلة الحجز فارغة حالياً' : 'Your Cart is Currently Empty'}
                </h3>
                <p className="cart-empty-sub">
                  {lang === 'ar'
                    ? 'أضف تذاكر الألعاب، أو أساور اليوم الكامل، أو باقات الرحلات للمتابعة.'
                    : 'Add thrill passes, all-day wristbands, or group packages to proceed.'}
                </p>
                <button 
                  type="button" 
                  className="card-btn selected" 
                  style={{ maxWidth: '240px', margin: '0 auto' }}
                  onClick={resetDemoCart}
                >
                  {lang === 'ar' ? 'استعادة ٤ تذاكر (٤٥٠ ج.م)' : 'Restore 4 Passes (450 EGP)'}
                </button>
              </div>
            )}
          </div>

          {/* ----------------- RIGHT: STICKY ORDER SUMMARY ----------------- */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              {/* Header */}
              <div className="cart-sum-header">
                <img 
                  src="/photo/kid area pic/icon/Icon (14).png" 
                  alt="Order Summary" 
                  className="cart-sum-icon" 
                />
                <h3 className="cart-sum-title">
                  {lang === 'ar' ? 'ملخص الحجز والدفع' : 'ORDER SUMMARY'}
                </h3>
              </div>

              {/* Breakdown */}
              <div className="cart-sum-breakdown">
                <div className="cart-sum-row">
                  <span>
                    {lang === 'ar' ? `المجموع الفرعي (${totalPasses} تذاكر)` : `Subtotal (${totalPasses} Passes)`}
                  </span>
                  <span className="cart-sum-val gold">
                    {lang === 'ar' ? `${subtotalEgp} ج.م` : `${subtotalEgp} EGP`}
                  </span>
                </div>
                <div className="cart-sum-row">
                  <span>{lang === 'ar' ? 'الضريبة ورسوم الخدمة ⓘ' : 'Tax & Service Fee ⓘ'}</span>
                  <span className="cart-sum-val">
                    {lang === 'ar' ? 'مجاناً (مشمولة)' : '0 EGP (Included)'}
                  </span>
                </div>
                <div className="cart-sum-row">
                  <span>{lang === 'ar' ? 'نقاط مكافأة الولاء المكتسبة' : 'Loyalty Bonus Points Earned'}</span>
                  <span className="cart-sum-val bonus">
                    +{loyaltyBonusPts} {lang === 'ar' ? 'نقطة' : 'Pts'}
                  </span>
                </div>
              </div>

              {/* Dual Value Box */}
              <div className="dual-value-box">
                <div className="dual-value-top-row">
                  <div className="dual-value-item">
                    <span className="dual-val-label">
                      {lang === 'ar' ? 'الإجمالي المطلوب دفعه' : 'TOTAL AMOUNT DUE'}
                    </span>
                    <div className="dual-val-amount egp">
                      <span>{subtotalEgp}</span>
                      <span className="unit">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                  </div>

                  <div className="dual-value-item">
                    <span className="dual-val-label">
                      {lang === 'ar' ? 'أو بنقاط الحساب' : 'DUAL VALUE GUARANTEED'}
                    </span>
                    <div className="dual-val-amount pts">
                      <span>{subtotalPts}</span>
                      <span className="unit">{lang === 'ar' ? 'نقطة' : 'Points'}</span>
                    </div>
                  </div>
                </div>

                <p className="dual-val-caption">
                  {lang === 'ar'
                    ? 'يمكنك الدفع برصيد نقاطك أو إلكترونياً عبر إنستاباي ومحفظة فودافون كاش.'
                    : 'You can pay using your accumulated points or online via InstaPay & mobile wallet.'}
                </p>
              </div>

              {/* Choose Payment Method */}
              <div>
                <div className="payment-section-header">
                  <h4 className="payment-section-title">
                    {lang === 'ar' ? 'اختر طريقة الدفع' : 'CHOOSE PAYMENT METHOD'}
                  </h4>
                  <span className="payment-section-sub">
                    {lang === 'ar' ? 'حدد خياراً واحداً' : 'Select 1 option'}
                  </span>
                </div>

                <div className="payment-options-col" style={{ marginTop: '8px' }}>
                  {/* OPTION 1: PAY WITH POINTS */}
                  <div 
                    className={`payment-card ${paymentMethod === 'points' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('points')}
                  >
                    <div className="payment-card-top">
                      <div className="payment-card-info-left">
                        <div className="payment-card-icon-circle">
                          <img 
                            src="/photo/kid area pic/icon/Icon (16).png" 
                            alt="Points" 
                            className="payment-card-icon-img" 
                          />
                        </div>
                        <div className="payment-card-text">
                          <h5 className="payment-card-title">
                            {lang === 'ar' ? 'الدفع برصيد النقاط' : 'Pay with Points'}
                          </h5>
                          <span className="payment-card-subtitle">
                            {lang === 'ar' ? 'استخدم نقاط حسابك المتوفرة' : 'Use your available points'}
                          </span>
                        </div>
                      </div>

                      <div className="payment-card-radio">
                        {paymentMethod === 'points' && <div className="payment-card-radio-inner" />}
                      </div>
                    </div>

                    {/* Points Inset Box */}
                    <div className="payment-card-inset">
                      <div className="inset-points-grid">
                        <div className="inset-points-row">
                          <span>{lang === 'ar' ? 'النقاط المتوفرة:' : 'Available Points:'}</span>
                          <span className="inset-points-val">
                            {userPointsBalance.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'Points'}
                          </span>
                        </div>
                        <div className="inset-points-row">
                          <span>{lang === 'ar' ? 'النقاط المطلوبة:' : 'Points Required:'}</span>
                          <span className="inset-points-val req">
                            {subtotalPts.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'Points'}
                          </span>
                        </div>
                        <div className="inset-points-row">
                          <span>{lang === 'ar' ? 'الرصيد المتبقي:' : 'Remaining Balance:'}</span>
                          <span className="inset-points-val rem">
                            {Math.max(0, pointsRemaining).toLocaleString()} {lang === 'ar' ? 'نقطة' : 'Points'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OPTION 2: PAY WITH MONEY */}
                  <div 
                    className={`payment-card ${paymentMethod === 'money' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('money')}
                  >
                    <div className="payment-card-top">
                      <div className="payment-card-info-left">
                        <div className="payment-card-icon-circle" style={{ background: '#f59e0b' }}>
                          <img 
                            src="/photo/kid area pic/icon/Icon (15).png" 
                            alt="Money" 
                            className="payment-card-icon-img" 
                          />
                        </div>
                        <div className="payment-card-text">
                          <h5 className="payment-card-title">
                            {lang === 'ar' ? 'الدفع بالمال (إلكتروني)' : 'Pay with Money'}
                          </h5>
                          <span className="payment-card-subtitle">
                            {lang === 'ar'
                              ? 'ادفع بأمان عبر إنستاباي أو المحافظ الإلكترونية'
                              : 'Pay securely online with InstaPay or Mobile Wallet'}
                          </span>
                        </div>
                      </div>

                      <div className="payment-card-radio">
                        {paymentMethod === 'money' && <div className="payment-card-radio-inner" />}
                      </div>
                    </div>

                    {/* Money Inset Box */}
                    <div className="payment-card-inset">
                      <div className="inset-money-box">
                        <div className="inset-money-row">
                          <span>{lang === 'ar' ? 'المبلغ المطلوب دفعه:' : 'Total to Pay:'}</span>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                            {subtotalEgp} {lang === 'ar' ? 'ج.م' : 'EGP'}
                          </span>
                        </div>
                        <div className="inset-payment-badges">
                          <button 
                            type="button"
                            className={`inset-pay-badge instapay ${paymentMethod === 'money' && moneyMethod === 'instapay' ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentMethod('money');
                              setMoneyMethod('instapay');
                            }}
                          >
                            <img 
                              src="/photo/kid area pic/payment logo/instapay logo.png" 
                              alt="InstaPay Logo" 
                              className="inset-pay-logo-img" 
                            />
                            <span>{lang === 'ar' ? 'إنستاباي' : 'INSTAPAY'}</span>
                            {paymentMethod === 'money' && moneyMethod === 'instapay' && (
                              <span className="pay-badge-check">✓</span>
                            )}
                          </button>
                          <button 
                            type="button"
                            className={`inset-pay-badge vodafone ${paymentMethod === 'money' && moneyMethod === 'vodafone' ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentMethod('money');
                              setMoneyMethod('vodafone');
                            }}
                          >
                            <img 
                              src="/photo/kid area pic/payment logo/vodafone_cash_clean.png" 
                              alt="Vodafone Cash Logo" 
                              className="inset-pay-logo-img" 
                              onError={(e) => { e.currentTarget.src = '/photo/kid area pic/payment logo/vodafone cash logo.png'; }}
                            />
                            <span>{lang === 'ar' ? 'فودافون كاش' : 'VODAFONE CASH'}</span>
                            {paymentMethod === 'money' && moneyMethod === 'vodafone' && (
                              <span className="pay-badge-check">✓</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big CTA Payment Button */}
              <button 
                type="button" 
                className="cart-payment-btn"
                onClick={handlePayment}
                disabled={totalPasses === 0}
              >
                <span>{lang === 'ar' ? 'متابعة الدفع وتأكيد الحجز' : 'Payment'}</span>
              </button>
            </div>

            {/* Bottom VIP Desk Support Banner */}
            <div className="vip-desk-banner">
              <div className="vip-desk-left">
                <img 
                  src="/photo/kid area pic/icon/Icon (17).png" 
                  alt="VIP Support" 
                  className="vip-desk-icon" 
                />
                <div className="vip-desk-text">
                  <h5 className="vip-desk-title">
                    {lang === 'ar' ? 'هل تحتاج لمساعدة في الدفع؟' : 'Need Help with Checkout?'}
                  </h5>
                  <span className="vip-desk-sub">
                    {lang === 'ar' ? 'فريق خدمة العملاء متواجد لمساعدتك الآن' : 'Live guest support is available now'}
                  </span>
                </div>
              </div>

              <button 
                type="button" 
                className="vip-desk-btn"
                onClick={() => setShowVipModal(true)}
              >
                {lang === 'ar' ? 'اتصال بمكتب VIP' : 'Call VIP Desk'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PAYMENT SUCCESS & WRISTBAND CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {paymentSuccess && (
        <div className="trips-modal-backdrop" onClick={() => setPaymentSuccess(false)}>
          <div className="trips-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trips-modal-header" style={{ background: '#ecfdf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}>
                  ✓
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#065f46', fontWeight: 850 }}>
                  {lang === 'ar' ? 'تم حجز وتفعيل الإسورة بنجاح!' : 'Wristband Reserved Successfully!'}
                </h3>
              </div>
              <button className="trips-modal-close" onClick={() => setPaymentSuccess(false)}>&times;</button>
            </div>

            <div className="trips-modal-body" style={{ textAlign: 'center' }}>
              <div style={{
                background: '#f8fafc',
                border: '2px dashed #00a9c3',
                borderRadius: '16px',
                padding: '20px',
                margin: '8px 0'
              }}>
                <img 
                  src="/photo/logo/logo nav bar and footer.png" 
                  alt="Logo" 
                  style={{ height: '38px', width: 'auto', marginBottom: '10px' }} 
                />
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {lang === 'ar' ? 'إسورة الدخول الرقمية' : 'DIGITAL ENTRY WRISTBAND PASS'}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0a3342', margin: '4px 0' }}>
                  {lastPaymentRef}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  {lang === 'ar' ? 'الحالة: نشطة • دخول سريع عبر البوابة' : 'Status: Active • Fast Gate Entry'}
                </div>

                <div style={{
                  margin: '16px auto',
                  width: '140px',
                  height: '140px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  <svg viewBox="0 0 24 24" width="90" height="90" fill="#012b32">
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h3v3h-3v-3z" />
                  </svg>
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>
                    {lang === 'ar' ? 'المسح عند البوابة' : 'SCAN AT GATE'}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  {lang === 'ar' ? 'تم الدفع عبر ' : 'Paid via '}
                  <strong>
                    {paymentMethod === 'points' 
                      ? (lang === 'ar' ? `${subtotalPts} نقطة` : `${subtotalPts} Points`)
                      : (lang === 'ar' ? `${subtotalEgp} ج.م` : `${subtotalEgp} EGP`)}
                  </strong>
                  {paymentMethod === 'points' && (
                    <div style={{ color: '#088395', fontWeight: 700, marginTop: '4px' }}>
                      {lang === 'ar' ? 'الرصيد المتبقي: ' : 'Remaining Balance: '}
                      {userPointsBalance} {lang === 'ar' ? 'نقطة' : 'Points'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="trips-modal-header" style={{ background: '#f8fafc', borderRadius: '0 0 24px 24px' }}>
              <button 
                className="modal-btn outline" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => window.print()}
              >
                {lang === 'ar' ? '🖨️ طباعة الإسورة الرقمية' : '🖨️ Print Digital Pass'}
              </button>
              <button 
                className="modal-btn primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setPaymentSuccess(false)}
              >
                {lang === 'ar' ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADD MORE PASSES MODAL */}
      {/* ========================================================================= */}
      {showAddPassesModal && (
        <div className="trips-modal-backdrop" onClick={() => setShowAddPassesModal(false)}>
          <div className="trips-modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trips-modal-header">
              <h3 className="trips-modal-title">
                <span>{lang === 'ar' ? 'إضافة تذاكر وألعاب أخرى' : 'Add Extra Thrill Passes'}</span>
              </h3>
              <button className="trips-modal-close" onClick={() => setShowAddPassesModal(false)}>&times;</button>
            </div>

            <div className="trips-modal-body">
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                {lang === 'ar' ? 'اختر تذاكر إضافية لإضافتها إلى سلتك:' : 'Select additional passes to add to your order:'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    id: 'pass-arcade',
                    title: lang === 'ar' ? 'باقة توكنز الواقع الافتراضي والآركيد (٥٠ توكن)' : 'Arcade & VR Token Pack (50 Tokens)',
                    zone: 'challenge',
                    zoneLabel: lang === 'ar' ? 'آركيد' : 'Arcade',
                    priceEgp: 150,
                    pricePts: 450,
                    thumb: '/photo/kid area pic/Boxing Punch Machine.png'
                  },
                  {
                    id: 'pass-bumper',
                    title: lang === 'ar' ? 'تذكرة سيارات التصادم الحماسية' : 'Bumper Car Collision Pass',
                    zone: 'fun-park',
                    zoneLabel: lang === 'ar' ? 'فن بارك' : 'Fun Park',
                    priceEgp: 80,
                    pricePts: 250,
                    thumb: '/photo/kid area pic/Bumper Collision Bay.png'
                  },
                  {
                    id: 'pass-speedway',
                    title: lang === 'ar' ? 'حلبة سباق الكارتينج جونيور جي بي' : 'Junior GP Speedway Karting',
                    zone: 'adventure',
                    zoneLabel: lang === 'ar' ? 'المغامرات' : 'Adventure',
                    priceEgp: 120,
                    pricePts: 380,
                    thumb: '/photo/kid area pic/Junior GP Speedway.png'
                  }
                ].map((extra) => (
                  <div 
                    key={extra.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0a3342' }}>{extra.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {extra.priceEgp} {lang === 'ar' ? 'ج.م' : 'EGP'} • {extra.pricePts} {lang === 'ar' ? 'نقطة' : 'Pts'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="orders-action-btn add"
                      style={{ background: '#012b32', color: '#ffffff', borderRadius: '20px', padding: '6px 14px' }}
                      onClick={() => {
                        setCartItems((prev) => {
                          const existing = prev.find((p) => p.id === extra.id);
                          if (existing) {
                            return prev.map((p) => p.id === extra.id ? { ...p, qty: p.qty + 1 } : p);
                          }
                          return [...prev, { ...extra, age: lang === 'ar' ? 'لكل الأعمار' : 'All Ages', inclusions: lang === 'ar' ? 'تذكرة نشاط إضافي' : 'Extra Activity Pass', qty: 1 }];
                        });
                        setShowAddPassesModal(false);
                      }}
                    >
                      {lang === 'ar' ? '+ أضف إلى السلة' : '+ Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIP DESK SUPPORT MODAL */}
      {/* ========================================================================= */}
      {showVipModal && (
        <div className="trips-modal-backdrop" onClick={() => setShowVipModal(false)}>
          <div className="trips-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trips-modal-header" style={{ background: '#fef3c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src="/photo/kid area pic/icon/Icon (17).png" 
                  alt="Support" 
                  style={{ width: '22px', height: '22px' }} 
                />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#78350f', fontWeight: 850 }}>
                  {lang === 'ar' ? 'مكتب خدمة كبار الزوار (VIP)' : 'VIP Guest Services Desk'}
                </h3>
              </div>
              <button className="trips-modal-close" onClick={() => setShowVipModal(false)}>&times;</button>
            </div>

            <div className="trips-modal-body" style={{ textAlign: 'center', gap: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                {lang === 'ar'
                  ? 'فريق علاقات العملاء جاهز لمساعدتك في إتمام الدفع أو حل أي صعوبات تقنية.'
                  : 'Our guest service team is standing by to help you with checkout, payment issues, or special entry requirements.'}
              </p>

              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                  {lang === 'ar' ? 'الخط الساخن المباشر' : 'DIRECT VIP HOTLINE'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0a3342' }}>
                  {lang === 'ar' ? '٠١٠١٢٣٤٥٦٧٨' : '+20 101 234 5678'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                  {lang === 'ar' ? '● متاح يومياً من ٠٩:٠٠ ص وحتى ١١:٠٠ م' : '● Available Daily 09:00 AM - 11:00 PM'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a 
                  href="tel:+201012345678" 
                  className="modal-btn primary" 
                  style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
                >
                  {lang === 'ar' ? '📞 اتصال هاتفي' : '📞 Call Now'}
                </a>
                <a 
                  href="https://wa.me/201012345678?text=Hello%20VIP%20Desk,%20I%20need%20help%20with%20my%20cart%20checkout"
                  target="_blank"
                  rel="noreferrer"
                  className="modal-btn whatsapp" 
                  style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
                >
                  <img 
                    src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                    alt="WhatsApp" 
                    style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                  />
                  <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MONEY PAYMENT & RECEIPT PROOF UPLOAD MODAL */}
      {/* ========================================================================= */}
      {showMoneyProofModal && (
        <div className="trips-modal-backdrop" onClick={handleCloseMoneyModal}>
          <div className="trips-modal-card proof-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="proof-modal-header">
              <div className="proof-modal-header-left">
                <img 
                  src={
                    moneyMethod === 'instapay'
                      ? '/photo/kid area pic/payment logo/instapay logo.png'
                      : '/photo/kid area pic/payment logo/vodafone_cash_clean.png'
                  }
                  alt={moneyMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash'}
                  className="proof-modal-badge-icon"
                  onError={(e) => {
                    if (moneyMethod === 'vodafone') {
                      e.currentTarget.src = '/photo/kid area pic/payment logo/vodafone cash logo.png';
                    }
                  }}
                />
                <div>
                  <h3 className="proof-modal-title">
                    {moneyOrderSubmitted 
                      ? (lang === 'ar' ? 'تم إرسال طلب الدفع!' : 'Payment Request Submitted!')
                      : moneyMethod === 'instapay' 
                        ? (lang === 'ar' ? 'الدفع عبر إنستاباي' : 'Pay via InstaPay')
                        : (lang === 'ar' ? 'الدفع عبر فودافون كاش' : 'Pay via Vodafone Cash')}
                  </h3>
                  <span className="proof-modal-sub">
                    {moneyOrderSubmitted 
                      ? (lang === 'ar' ? 'جاري التحقق من الإيصال' : 'Verification in progress')
                      : (lang === 'ar' ? 'حول المبلغ بدقة وأرفق صورة الإيصال' : 'Transfer the exact amount & upload receipt')}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="proof-modal-close" 
                onClick={handleCloseMoneyModal}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Modal Body */}
            {!moneyOrderSubmitted ? (
              <div className="proof-modal-body">
                {/* Method Switcher Tabs */}
                <div className="proof-tabs-row">
                  <button
                    type="button"
                    className={`proof-tab-btn ${moneyMethod === 'instapay' ? 'active instapay' : ''}`}
                    onClick={() => setMoneyMethod('instapay')}
                  >
                    <img 
                      src="/photo/kid area pic/payment logo/instapay logo.png" 
                      alt="InstaPay" 
                      style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                    />
                    <span>{lang === 'ar' ? 'إنستاباي' : 'InstaPay'}</span>
                  </button>

                  <button
                    type="button"
                    className={`proof-tab-btn ${moneyMethod === 'vodafone' ? 'active vodafone' : ''}`}
                    onClick={() => setMoneyMethod('vodafone')}
                  >
                    <img 
                      src="/photo/kid area pic/payment logo/vodafone_cash_clean.png" 
                      alt="Vodafone Cash" 
                      style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                      onError={(e) => { e.currentTarget.src = '/photo/kid area pic/payment logo/vodafone cash logo.png'; }}
                    />
                    <span>{lang === 'ar' ? 'فودافون كاش' : 'Vodafone Cash'}</span>
                  </button>
                </div>

                {/* Amount to Pay Highlight */}
                <div className="proof-amount-card">
                  <div>
                    <span className="proof-amount-label">
                      {lang === 'ar' ? 'المبلغ المطلوب تحويله' : 'Required Transfer Amount'}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                      {totalPasses} {lang === 'ar' ? 'تذاكر • شاملة جميع الرسوم' : `pass${totalPasses !== 1 ? 'es' : ''} • All taxes included`}
                    </div>
                  </div>
                  <div className="proof-amount-val">
                    {subtotalEgp} <span className="unit">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                </div>

                {/* Account Details & One-Click Copy */}
                <div className="proof-account-card">
                  <div className="proof-account-row">
                    <span className="proof-account-label">
                      {moneyMethod === 'instapay' 
                        ? (lang === 'ar' ? 'عنوان الدفع اللحظي (IPA)' : 'InstaPay IPA / Address')
                        : (lang === 'ar' ? 'رقم محفظة فودافون كاش' : 'Vodafone Cash Wallet Number')}
                    </span>
                    <button
                      type="button"
                      className={`proof-copy-btn ${copyFeedback ? 'copied' : ''}`}
                      onClick={() =>
                        handleCopyAccount(
                          moneyMethod === 'instapay' ? 'americandream@instapay' : '01023456789'
                        )
                      }
                    >
                      {copyFeedback ? (
                        <>
                          <Check size={14} strokeWidth={2.6} />
                          <span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} strokeWidth={2.2} />
                          <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="proof-account-number">
                    {moneyMethod === 'instapay' ? 'americandream@instapay' : '010 2345 6789'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#0f766e' }}>
                    {lang === 'ar' ? 'اسم المستلم: ' : 'Recipient Name: '}
                    <strong>{lang === 'ar' ? 'أمريكان دريم كيدز إيريا' : 'American Dream Kids Area'}</strong>
                  </div>
                </div>

                {/* Transfer Steps instructions */}
                <ol className="proof-instructions-list">
                  <li>
                    {lang === 'ar' ? (
                      <>افتح تطبيق <strong>{moneyMethod === 'instapay' ? 'إنستاباي' : 'أنا فودافون أو اطلب كود المحفظة *9#'}</strong>.</>
                    ) : (
                      <>Open your <strong>{moneyMethod === 'instapay' ? 'InstaPay app' : 'Vodafone Cash (*9# / Ana Vodafone)'}</strong>.</>
                    )}
                  </li>
                  <li>
                    {lang === 'ar' ? (
                      <>حول مبلغ <strong>{subtotalEgp} ج.م</strong> بدقة إلى الحساب الموضح أعلاه.</>
                    ) : (
                      <>Transfer exactly <strong>{subtotalEgp} EGP</strong> to the account above.</>
                    )}
                  </li>
                  <li>
                    {lang === 'ar' ? 'التقط لقطة شاشة واضحة لإيصال نجاح التحويل.' : 'Take a clear screenshot of the successful transfer receipt.'}
                  </li>
                  <li>
                    {lang === 'ar' ? 'ارفع صورة الإيصال بالأسفل لإرفاقها مع طلب الحجز.' : 'Upload the screenshot below to attach it to your booking request.'}
                  </li>
                </ol>

                {/* Receipt Upload Dropzone / Preview */}
                <div className="proof-upload-section">
                  <div className="proof-upload-title">
                    <span>{lang === 'ar' ? 'إرفاق إيصال الدفع' : 'Attach Payment Receipt'}</span>
                    <span className="proof-upload-required">{lang === 'ar' ? '* مطلوب' : '* Required'}</span>
                  </div>

                  {!uploadedReceipt ? (
                    <label className="proof-dropzone">
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleReceiptFileChange}
                      />
                      <div className="proof-dropzone-icon">
                        <UploadCloud size={24} strokeWidth={2.2} />
                      </div>
                      <div className="proof-dropzone-prompt">
                        {lang === 'ar' ? 'اضغط لرفع صورة أو لقطة شاشة إيصال الدفع' : 'Click to Upload Payment Image / Screenshot'}
                      </div>
                      <span className="proof-dropzone-hint">
                        {lang === 'ar' ? 'يدعم PNG, JPG, JPEG, WEBP (الحد الأقصى ١٠ ميجابايت)' : 'Supports PNG, JPG, JPEG, WEBP (Max 10MB)'}
                      </span>
                      <span className="proof-browse-btn">
                        <FolderOpen size={16} strokeWidth={2.2} />
                        <span>{lang === 'ar' ? 'اختيار ملف' : 'Browse File'}</span>
                      </span>
                    </label>
                  ) : (
                    <div className="proof-preview-card">
                      <div className="proof-preview-img-wrap">
                        <img 
                          src={uploadedReceipt.preview} 
                          alt="Receipt Preview" 
                          className="proof-preview-img" 
                        />
                      </div>
                      <div className="proof-preview-details">
                        <span className="proof-preview-filename" title={uploadedReceipt.name}>
                          {uploadedReceipt.name}
                        </span>
                        <span className="proof-preview-filesize">{uploadedReceipt.size}</span>
                        <span className="proof-preview-tag">
                          <Check size={13} strokeWidth={2.6} />
                          <span>{lang === 'ar' ? 'الإيصال جاهز للإرسال' : 'Receipt Ready to Submit'}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="proof-remove-btn"
                        onClick={handleRemoveReceipt}
                        title={lang === 'ar' ? 'حذف الإيصال' : 'Remove receipt'}
                        aria-label="Remove receipt"
                      >
                        <X size={15} strokeWidth={2.4} />
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <div style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertCircle size={15} strokeWidth={2.2} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Optional Sender phone / wallet number */}
                <div>
                  <label 
                    style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: 800, 
                      color: '#0a3342', 
                      display: 'block', 
                      marginBottom: '6px' 
                    }}
                  >
                    {lang === 'ar' ? 'رقم الهاتف أو اسم الحساب المحول منه (اختياري):' : 'Sender Phone or Account Name (Optional):'}
                  </label>
                  <input
                    type="text"
                    className="proof-sender-input"
                    placeholder={
                      moneyMethod === 'instapay'
                        ? (lang === 'ar' ? 'مثال: yourname@instapay أو 010xxxxxxxx' : 'e.g. yourname@instapay or 010xxxxxxxx')
                        : (lang === 'ar' ? 'مثال: 010xxxxxxxx (محفظة فودافون كاش الخاصة بك)' : 'e.g. 010xxxxxxxx (Your Vodafone Cash Wallet)')
                    }
                    value={senderPhoneOrAccount}
                    onChange={(e) => setSenderPhoneOrAccount(e.target.value)}
                  />
                </div>

                {/* Submit Request CTA Button */}
                <button
                  type="button"
                  className="proof-submit-cta-btn"
                  onClick={handleSubmitMoneyProof}
                  disabled={isSubmittingProof || !uploadedReceipt}
                >
                  {isSubmittingProof ? (
                    <span>{lang === 'ar' ? 'جاري إرسال الطلب...' : 'Submitting Request...'}</span>
                  ) : (
                    <>
                      <span>{lang === 'ar' ? 'إرسال الطلب مع إيصال الدفع' : 'Submit Request with Payment'}</span>
                      <ArrowRight size={17} strokeWidth={2.4} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Success / Submitted Confirmation Screen */
              <div className="proof-modal-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 900,
                  margin: '0 auto 12px'
                }}>
                  ✓
                </div>

                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#012b32' }}>
                  {lang === 'ar' ? 'تم إرسال طلب الدفع بنجاح!' : 'Payment Request Submitted!'}
                </h3>
                <p style={{ margin: '6px 0 16px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                  {lang === 'ar' ? (
                    <>
                      تم إرسال إيصال التحويل بمبلغ <strong>{subtotalEgp} ج.م</strong> عبر{' '}
                      <strong>{moneyMethod === 'instapay' ? 'إنستاباي' : 'فودافون كاش'}</strong> إلى الكاشير للتحقق الفوري.
                    </>
                  ) : (
                    <>
                      Your transfer proof for <strong>{subtotalEgp} EGP</strong> via{' '}
                      <strong>{moneyMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash'}</strong> has been sent to our cashier team for instant verification.
                    </>
                  )}
                </p>

                {/* Booking Reference Card */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px dashed #00a9c3',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'رقم مرجع الطلب' : 'Request Reference Number'}
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0a3342', letterSpacing: '0.04em' }}>
                    {lastPaymentRef}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 750 }}>
                    {lang === 'ar' ? 'الحالة: قيد التحقق (عادة خلال ٢-٥ دقائق)' : 'Status: Pending Verification (Usually 2-5 mins)'}
                  </span>
                </div>

                {uploadedReceipt?.preview && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f1f5f9',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}>
                    <img 
                      src={uploadedReceipt.preview} 
                      alt="Uploaded proof" 
                      style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0, fontSize: '0.76rem', color: '#475569' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {uploadedReceipt.name}
                      </div>
                      <div>{uploadedReceipt.size} • {lang === 'ar' ? 'مرفق مع الطلب' : 'Attached to order'}</div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="modal-btn primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleCloseMoneyModal}
                >
                  {lang === 'ar' ? 'تم • العودة لمنطقة الألعاب' : 'Done & Back to Park'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
