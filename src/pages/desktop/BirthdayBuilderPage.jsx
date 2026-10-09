import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Cake, 
  Gift, 
  X,
  ChevronDown,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { isUserAuthenticated } from '../../api/authService';
import { eventService } from '../../api/eventService';
import './BirthdayBuilderPage.css';

// 1. VENUE SPACES (STEP 1)
const SPACES = [
  {
    id: 'indoor',
    titleAr: 'القاعة الداخلية الفاخرة',
    titleEn: 'INDOOR',
    capacityAr: 'حتى ١٢٠ ضيفاً',
    capacityEn: 'Up to 120 Guests',
    descAr: 'قاعة احتفالات داخلية فاخرة بثريات كريستال، ومسرح مخصص، وتجهيزات صوت وإضاءة احترافية.',
    descEn: 'Immersive indoor celebration space with crystal chandeliers, customizable stage, private sound & lighting setup.',
    img: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
    fee: 0,
    feeLabel: 'INCLUDED'
  },
  {
    id: 'roof',
    titleAr: 'الرووف البانورامي',
    titleEn: 'ROOF',
    capacityAr: 'حتى ٨٠ ضيفاً',
    capacityEn: 'Up to 80 Guests',
    descAr: 'إطلالة بانورامية ساحرة في الهواء الطلق على غروب قناة السويس مع إضاءات احتفالية دافئة.',
    descEn: 'Open-air breeze with panoramic sunset views over the historic Suez Canal, festoon fairy lighting.',
    img: '/photo/kid area pic/roof_photo_1.png',
    fee: 0,
    feeLabel: 'INCLUDED'
  },
  {
    id: 'outdoor',
    titleAr: 'الحديقة البحرية المفتوحة',
    titleEn: 'OUTDOOR',
    capacityAr: 'حتى ٥٠ ضيفاً',
    capacityEn: 'Up to 25 Guests',
    descAr: 'مسطح أخضر طبيعي مطل على القناة ومزين بالأضواء الدافئة، ومجاور لمناطق الألعاب والأنشطة.',
    descEn: "Lush seaside green lawn illuminated with warm fairy lights, spacious play zones for kids' fun.",
    img: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
    fee: 0,
    feeLabel: 'INCLUDED'
  }
];

// 2. TIME SESSIONS (STEP 2)
const TIME_SESSIONS = [
  {
    id: 'afternoon',
    labelAr: 'فترة الظهيرة والغروب (٠٤:٠٠ م – ٠٧:٣٠ م)',
    labelEn: 'Afternoon Session (04:00 PM – 07:30 PM)',
    shortEn: '04:00 PM – 07:30 PM',
    shortAr: '٠٤:٠٠ م – ٠٧:٣٠ م'
  },
  {
    id: 'morning',
    labelAr: 'الفترة الصباحية (١١:٠٠ ص – ٠٢:٣٠ م)',
    labelEn: 'Morning Session (11:00 AM – 02:30 PM)',
    shortEn: '11:00 AM – 02:30 PM',
    shortAr: '١١:٠٠ ص – ٠٢:٣٠ م'
  },
  {
    id: 'evening',
    labelAr: 'السهرة المسائية (٠٨:٠٠ م – ١١:٣٠ م)',
    labelEn: 'Evening Session (08:00 PM – 11:30 PM)',
    shortEn: '08:00 PM – 11:30 PM',
    shortAr: '٠٨:٠٠ م – ١١:٣٠ م'
  }
];

// 3. AGE GROUPS (STEP 2)
const AGE_GROUPS = [
  { id: '1-3', label: '1 - 3 yrs', labelAr: '١ - ٣ سنوات' },
  { id: '4-6', label: '4 - 6 yrs', labelAr: '٤ - ٦ سنوات' },
  { id: '7-9', label: '7 - 9 yrs', labelAr: '٧ - ٩ سنوات' },
  { id: '10-14', label: '10 - 14 yrs', labelAr: '١٠ - ١٤ سنة' }
];

// 4. BIRTHDAY PACKAGES (STEP 3)
const PACKAGES = [
  {
    id: 'explorer',
    nameAr: 'مغامرة المستكشف',
    nameEn: 'Explorer Adventure',
    basePrice: 7500,
    deposit: 2500,
    descAr: 'أجواء لعب مليئة بالحماس والنشاط مصممة للاحتفالات المبهجة والأعمار الصغيرة.',
    descEn: 'Dynamic play and high-energy excitement designed for vibrant parties.',
    featuresAr: [
      'ساعتان دخول مفتوح لكافة مناطق Play Zone',
      'منسق حفلات ومقدم استعراضات مخصص',
      'ديكورات بالونات مبهجة وتجهيز طاولات الاحتفال',
      'وجبات كيدز شهية (ناجتس/برجر + عصير طبيعي)',
      'دخول مجاني للمنتجع حتى ١٠ مرافقين بالغين'
    ],
    featuresEn: [
      '2 Hours unlimited Play Zone access',
      'Dedicated kids animator & party host',
      'Colorful themed balloons & table setup',
      'Kids meal boxes (nuggets/burger + juice)',
      'Free park entry for up to 10 adults'
    ]
  },
  {
    id: 'champion',
    nameAr: 'مغامرة الأبطال الشاملة',
    nameEn: 'Champion Quest',
    subtitleEn: 'Champion Quest (All-Inclusive)',
    subtitleAr: 'مغامرة الأبطال (باقة شاملة كل شيء)',
    basePrice: 11500,
    deposit: 3500,
    isPopular: true,
    descAr: 'التجربة الشاملة الأكثر تميزاً لأعياد الميلاد مع ألعاب الواقع الافتراضي وبوفيه الأبطال.',
    descEn: 'The ultimate all-inclusive birthday experience with VR games and premium catering.',
    featuresAr: [
      'تذاكر يوم كامل لـ Play Zone + صالة ألعاب VR',
      'اثنان من منسقي الحفلات + عرض تميمة كرتونية خاص',
      'قوس بالونات كامل وخلفية تصوير مخصصة باسم الطفل',
      'بوفيه جورميه للأطفال + تورتة احتفالية من طبقتين',
      'مشروبات وضيافة قهوة وترحيب لـ ١٥ بالغاً',
      'هدايا تذكارية وصور مطبوعة فورية لكل طفل'
    ],
    featuresEn: [
      'All-Day Play Zone + VR Arena passes',
      '2 Dedicated animators + mascot show',
      'Full balloon arch & bespoke backdrop',
      'Kids gourmet buffet + 2-tier celebration cake',
      'Welcome coffee & drinks for 15 adults',
      'Souvenir photo gifts for every child'
    ]
  },
  {
    id: 'vip',
    nameAr: 'الملكية الفاخرة على القناة (VIP)',
    nameEn: 'Royal Waterfront VIP',
    basePrice: 16500,
    deposit: 5000,
    descAr: 'حجز حصري كامل للمنطقة مع محطات طهي حي من الشيف وتغطية تصوير سينمائي احترافي.',
    descEn: 'Exclusive private zone takeover with chef-curated live stations and VIP photography.',
    featuresAr: [
      'حجز حصري خاص للمكان لمدة ٤ ساعات متواصلة',
      'ألعاب المنتجع بالكامل بدون حدود (أركيد + VR)',
      'دي جي محترف ومهندس صوت وإضاءة سينمائية',
      'محطة طهي حي للشيف وتورتة ملكية فاخرة',
      'مصور فوتوغرافي وفيديو احترافي مع ريلز للمناسبة',
      'أساور VIP الإلكترونية وحقائب هدايا فاخرة للأطفال'
    ],
    featuresEn: [
      'Exclusive 4-hour private venue takeover',
      'Unlimited all-park games (Arcade + VR)',
      'Live DJ / sound engineer + custom light show',
      'Chef live cooking station & luxury cake',
      'Professional photographer + video recap',
      'VIP wristbands & premium gift bags'
    ]
  }
];

export default function BirthdayBuilderPage({ 
  onBack, 
  setActiveTab, 
  openModal, 
  lang = 'ar' 
}) {
  // Form Selections
  const [selectedSpace, setSelectedSpace] = useState('indoor');
  const [guestCount, setGuestCount] = useState(30);
  const [partyDate, setPartyDate] = useState('2026-10-24');
  const [selectedSession, setSelectedSession] = useState('afternoon');
  const [selectedAge, setSelectedAge] = useState('7-9');
  const [selectedPackage, setSelectedPackage] = useState('champion');
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Client Details & Live Availability State
  const [celebrantName, setCelebrantName] = useState('');
  const [parentName, setParentName] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('american_dream_user_profile') || '{}');
      return p.name || '';
    } catch { return ''; }
  });
  const [parentPhone, setParentPhone] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('american_dream_user_profile') || '{}');
      return p.phone || '';
    } catch { return ''; }
  });
  const [isSlotAvailable, setIsSlotAvailable] = useState(true);
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [serverBookingCode, setServerBookingCode] = useState(null);

  // Real-time backend space and session availability check
  useEffect(() => {
    let isCurrent = true;
    async function verifySlot() {
      setIsCheckingSlot(true);
      try {
        const res = await eventService.checkEventAvailability(selectedSpace, partyDate, selectedSession);
        if (isCurrent && res && typeof res.isAvailable === 'boolean') {
          setIsSlotAvailable(res.isAvailable);
        }
      } catch (e) {
        if (isCurrent) setIsSlotAvailable(true);
      } finally {
        if (isCurrent) setIsCheckingSlot(false);
      }
    }
    verifySlot();
    return () => { isCurrent = false; };
  }, [selectedSpace, partyDate, selectedSession]);

  // Section Refs for Quick Navigation links (Change / Edit)
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const dateInputRef = useRef(null);

  // Active Data Helpers
  const activeSpaceData = SPACES.find(s => s.id === selectedSpace) || SPACES[0];
  const activeSessionData = TIME_SESSIONS.find(s => s.id === selectedSession) || TIME_SESSIONS[0];
  const activePackageData = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[1];

  // Dynamic Calculations (Matches exact math in screenshot)
  // Screenshot has: 30 Guests -> 20 Kids + 10 Adults
  const kidsCount = Math.min(guestCount, Math.round(guestCount * (2 / 3)));
  const adultsCount = guestCount - kidsCount;

  // Pricing (14% VAT)
  const basePrice = activePackageData.basePrice;
  const vat = Math.round(basePrice * 0.14);
  const totalPrice = basePrice + vat;
  const depositRequired = activePackageData.deposit;

  // Formatted Date String matching screenshot "Saturday, Oct 24, 2026"
  const getFormattedDate = () => {
    try {
      const d = new Date(partyDate + 'T12:00:00');
      if (isNaN(d.getTime())) return partyDate;
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch {
      return partyDate;
    }
  };

  // Guests Stepper handlers
  const handleDecrementGuests = () => {
    setGuestCount(prev => Math.max(15, prev - 5));
  };

  const handleIncrementGuests = () => {
    setGuestCount(prev => Math.min(150, prev + 5));
  };

  // Scroll Helpers
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Flow Handler: "CONTINUE TO BOOKING ->"
  const handleContinueBooking = () => {
    // 1. Guest Interception Check
    if (!isUserAuthenticated()) {
      if (openModal) {
        openModal('auth-required', {
          action: 'birthday-booking',
          returnType: 'birthdayBooking',
          offerData: {
            title: activePackageData.nameEn,
            priceNum: totalPrice,
            deposit: depositRequired,
            space: activeSpaceData.titleEn,
            guests: guestCount
          },
          onSuccess: () => {
            setShowConfirmationModal(true);
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.55 },
                colors: ['#f59e0b', '#00a9c3', '#10b981', '#ffffff']
              });
            } catch {}
          }
        });
      }
      return;
    }

    // 2. Authenticated: Celebration Confetti & Confirmation
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#00a9c3', '#10b981', '#ffffff', '#fbbf24']
      });
    } catch {}

    setShowConfirmationModal(true);
  };

  return (
    <div className={`birthday-builder-root ${lang === 'ar' ? 'lang-ar font-alexandria' : 'lang-en'}`}>
      <div className="birthday-builder-container">
        
        {/* TOP BREADCRUMB & BACK BUTTON */}
        <div className="birthday-top-bar">
          <button 
            type="button" 
            className="birthday-back-btn"
            onClick={onBack || (() => setActiveTab && setActiveTab('events'))}
            title={lang === 'ar' ? 'العودة إلى الحفلات والقاعات' : 'Back to Events & Halls'}
          >
            {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            <span>{lang === 'ar' ? 'العودة إلى الحفلات والقاعات' : 'Back to Events & Halls'}</span>
          </button>
        </div>

        {/* HERO TITLE & SUBTITLE */}
        <header className="birthday-hero-header">
          <h1 className="birthday-main-title">
            {lang === 'ar' ? (
              <>
                <span className="title-navy">صمّم </span>
                <span className="title-orange">عيد ميلاد </span>
                <span className="title-cyan">أحلامك</span>
              </>
            ) : (
              <>
                <span className="title-navy">Design </span>
                <span className="title-orange">Your </span>
                <span className="title-cyan">Dream </span>
                <span className="title-teal">Birthday</span>
              </>
            )}
          </h1>
          <p className="birthday-hero-subtitle">
            {lang === 'ar'
              ? 'من مغامرات مناطق الألعاب الحماسية إلى الديكورات المخصصة والعشاء على ضفاف القناة، صمّم تجربة عيد ميلاد لا تُنسى في خطوات بسيطة.'
              : 'From high-energy Play Zone quests to bespoke themed decorations and waterfront dining, build an unforgettable birthday experience in 4 simple steps.'}
          </p>
        </header>

        {/* TWO-COLUMN LAYOUT: FORM ON LEFT, STICKY BREAKDOWN ON RIGHT */}
        <div className="birthday-layout-grid">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: THE 3 INTERACTIVE STEPS */}
          {/* ========================================================================= */}
          <div className="birthday-steps-column">

            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: CHOOSE YOUR SPACE */}
            {/* --------------------------------------------------------------------- */}
            <section ref={step1Ref} className="birthday-step-section">
              <div className="birthday-step-header">
                <span className="birthday-step-badge">STEP 1</span>
                <h2 className="birthday-step-title">
                  {lang === 'ar' ? (
                    <>
                      <span className="title-cyan">١. اختر </span>
                      <span className="title-orange">المساحة </span>
                      <span className="title-navy">المثالية</span>
                    </>
                  ) : (
                    <>
                      <span className="title-cyan">1. CHOOSE </span>
                      <span className="title-orange">YOUR </span>
                      <span className="title-navy">SPACE</span>
                    </>
                  )}
                </h2>
                <p className="birthday-step-subtitle">
                  {lang === 'ar'
                    ? 'اختر المكان المثالي لاحتفالك. (اختر مكاناً واحداً)'
                    : 'Select the perfect setting for your celebration. (Pick 1 space)'}
                </p>
              </div>

              {/* 3 Spaces Cards Grid */}
              <div className="birthday-spaces-grid">
                {SPACES.map((space) => {
                  const isSelected = selectedSpace === space.id;

                  return (
                    <div 
                      key={space.id}
                      className={`birthday-space-card ${isSelected ? 'active-space' : ''}`}
                      onClick={() => setSelectedSpace(space.id)}
                    >
                      {/* Image Thumbnail with Selected Pill */}
                      <div className="birthday-space-img-wrap">
                        <img 
                          src={space.img} 
                          alt={lang === 'ar' ? space.titleAr : space.titleEn}
                          className="birthday-space-img"
                          onError={(e) => {
                            e.currentTarget.src = '/photo/events/vibe_1_birthday.png';
                          }}
                        />
                        {isSelected && (
                          <div className="birthday-space-selected-pill">
                            <Check size={13} strokeWidth={3} />
                            <span>{lang === 'ar' ? 'تم الاختيار' : 'Selected'}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="birthday-space-body">
                        <h3 className="birthday-space-title">
                          {lang === 'ar' ? space.titleAr : space.titleEn}
                        </h3>

                        {/* Capacity */}
                        <div className="birthday-space-capacity">
                          <Users size={15} />
                          <span>{lang === 'ar' ? space.capacityAr : space.capacityEn}</span>
                        </div>

                        {/* Description */}
                        <p className="birthday-space-desc">
                          {lang === 'ar' ? space.descAr : space.descEn}
                        </p>

                        {/* Bottom Selection Strip */}
                        <div className="birthday-space-bottom">
                          <div className="birthday-space-radio">
                            <span className={`radio-dot ${isSelected ? 'active' : ''}`} />
                            <span className={`radio-label ${isSelected ? 'active' : ''}`}>
                              {isSelected 
                                ? (lang === 'ar' ? 'المكان المختار' : 'Chosen Venue') 
                                : (lang === 'ar' ? 'اضغط للاختيار' : 'Click to Select')}
                            </span>
                          </div>
                          <span className="birthday-space-included">
                            {lang === 'ar' ? 'مشمول' : space.feeLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: TELL US ABOUT YOUR PARTY */}
            {/* --------------------------------------------------------------------- */}
            <section ref={step2Ref} className="birthday-step-section">
              <div className="birthday-step-header">
                <span className="birthday-step-badge">STEP 2</span>
                <h2 className="birthday-step-title">
                  {lang === 'ar' ? (
                    <>
                      <span className="title-cyan">٢. أخبرنا </span>
                      <span className="title-orange">عن تفاصيل </span>
                      <span className="title-teal">الحفلة</span>
                    </>
                  ) : (
                    <>
                      <span className="title-cyan">2. TELL </span>
                      <span className="title-orange">US </span>
                      <span className="title-navy">ABOUT </span>
                      <span className="title-cyan">YOUR </span>
                      <span className="title-teal">PARTY</span>
                    </>
                  )}
                </h2>
                <p className="birthday-step-subtitle">
                  {lang === 'ar'
                    ? 'حدد أعداد الضيوف والمواعيد للتحقق من التوافر اللحظي.'
                    : 'Provide guest numbers and timing to check real-time availability.'}
                </p>
              </div>

              {/* 2x2 Interactive Inputs Grid */}
              <div className="birthday-details-grid">
                
                {/* 1. GUESTS STEPPER */}
                <div className="birthday-input-card">
                  <div className="birthday-input-card-top">
                    <label className="birthday-input-label">
                      {lang === 'ar' ? 'عدد الضيوف (الأطفال + البالغين)' : 'Number of Guests (Kids + Adults)'}
                    </label>
                    <span className="birthday-input-hint">
                      {lang === 'ar' ? 'الحد الأدنى ١٥ - الأقصى ١٥٠' : 'Min 15 - Max 150'}
                    </span>
                  </div>

                  <div className="birthday-stepper-wrap">
                    <button 
                      type="button" 
                      className="birthday-stepper-btn"
                      onClick={handleDecrementGuests}
                      disabled={guestCount <= 15}
                      aria-label="Decrease Guests"
                    >
                      –
                    </button>
                    <span className="birthday-stepper-value">
                      {guestCount} {lang === 'ar' ? 'ضيوف' : 'Guests'}
                    </span>
                    <button 
                      type="button" 
                      className="birthday-stepper-btn"
                      onClick={handleIncrementGuests}
                      disabled={guestCount >= 150}
                      aria-label="Increase Guests"
                    >
                      +
                    </button>
                  </div>

                  <span className="birthday-input-subtext">
                    {lang === 'ar'
                      ? `يشمل ${kidsCount} أطفال + ${adultsCount} بالغين`
                      : `Includes ${kidsCount} kids + ${adultsCount} adults`}
                  </span>
                </div>

                {/* 2. PARTY DATE */}
                <div className="birthday-input-card" onClick={() => dateInputRef.current?.showPicker?.()}>
                  <div className="birthday-input-card-top">
                    <label className="birthday-input-label">
                      {lang === 'ar' ? 'تاريخ الحفلة' : 'Party Date'}
                    </label>
                  </div>

                  <div className="birthday-date-picker-wrap">
                    <Calendar size={18} className="birthday-date-icon" />
                    <span className="birthday-date-display">{getFormattedDate()}</span>
                    <Calendar size={16} className="birthday-date-picker-icon" />
                    {/* Native date input for full calendar interaction */}
                    <input 
                      ref={dateInputRef}
                      type="date"
                      className="birthday-native-date-input"
                      value={partyDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPartyDate(e.target.value)}
                    />
                  </div>

                  <span className="birthday-input-subtext">
                    {lang === 'ar' ? 'متاح طوال أيام الأسبوع ونهاية الأسبوع' : 'Available on weekends and weekdays'}
                  </span>
                </div>

                {/* 3. TIME WINDOW */}
                <div className="birthday-input-card">
                  <div className="birthday-input-card-top">
                    <label className="birthday-input-label">
                      {lang === 'ar' ? 'فترة الاحتفال' : 'Time Window'}
                    </label>
                  </div>

                  <div 
                    className="birthday-time-selector"
                    onClick={() => setShowSessionDropdown(!showSessionDropdown)}
                  >
                    <Clock size={18} className="birthday-time-icon" />
                    <span className="birthday-time-value">
                      {lang === 'ar' ? activeSessionData.labelAr : activeSessionData.labelEn}
                    </span>
                    <ChevronDown size={16} className="birthday-dropdown-arrow" />

                    {/* Dropdown Options */}
                    {showSessionDropdown && (
                      <div className="birthday-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        {TIME_SESSIONS.map((sess) => (
                          <div 
                            key={sess.id}
                            className={`birthday-dropdown-item ${selectedSession === sess.id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedSession(sess.id);
                              setShowSessionDropdown(false);
                            }}
                          >
                            <span>{lang === 'ar' ? sess.labelAr : sess.labelEn}</span>
                            {selectedSession === sess.id && <Check size={14} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="birthday-input-subtext" style={{ margin: 0 }}>
                      {lang === 'ar' ? 'مدة الجلسة القياسية ٣.٥ ساعات من الاحتفال والبهجة' : 'Standard 3.5 hour celebration session'}
                    </span>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: isCheckingSlot ? '#f1f5f9' : isSlotAvailable ? '#ecfdf5' : '#fef2f2',
                      color: isCheckingSlot ? '#64748b' : isSlotAvailable ? '#059669' : '#dc2626',
                      border: `1px solid ${isCheckingSlot ? '#e2e8f0' : isSlotAvailable ? '#a7f3d0' : '#fecaca'}`
                    }}>
                      {isCheckingSlot ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{lang === 'ar' ? 'فحص الإتاحة...' : 'Checking...'}</span>
                        </>
                      ) : isSlotAvailable ? (
                        <>
                          <CheckCircle size={12} />
                          <span>{lang === 'ar' ? 'الموعد متاح للحجز' : 'Space Available'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          <span>{lang === 'ar' ? 'محجوز، اختر فترة أخرى' : 'Slot Booked'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. BIRTHDAY CHILD AGE */}
                <div className="birthday-input-card">
                  <div className="birthday-input-card-top">
                    <label className="birthday-input-label">
                      {lang === 'ar' ? 'عمر صاحب عيد الميلاد' : 'Birthday Child Age'}
                    </label>
                  </div>

                  <div className="birthday-age-pills">
                    {AGE_GROUPS.map((group) => {
                      const isActive = selectedAge === group.id;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          className={`birthday-age-pill ${isActive ? 'active' : ''}`}
                          onClick={() => setSelectedAge(group.id)}
                        >
                          {lang === 'ar' ? group.labelAr : group.label}
                        </button>
                      );
                    })}
                  </div>

                  <span className="birthday-input-subtext">
                    {lang === 'ar'
                      ? 'لتخصيص الألعاب المناسبة والأنشطة الترفيهية والهدايا'
                      : 'Tailors party games, host games, and gifts'}
                  </span>
                </div>

              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: CHOOSE YOUR PACKAGE */}
            {/* --------------------------------------------------------------------- */}
            <section ref={step3Ref} className="birthday-step-section">
              <div className="birthday-step-header">
                <span className="birthday-step-badge">STEP 3</span>
                <h2 className="birthday-step-title">
                  {lang === 'ar' ? (
                    <>
                      <span className="title-cyan">٣. اختر </span>
                      <span className="title-orange">باقة </span>
                      <span className="title-navy">عيد الميلاد</span>
                    </>
                  ) : (
                    <>
                      <span className="title-cyan">3. CHOOSE </span>
                      <span className="title-orange">YOUR </span>
                      <span className="title-cyan">PACKAGE</span>
                    </>
                  )}
                </h2>
                <p className="birthday-step-subtitle">
                  {lang === 'ar'
                    ? 'باقات أعياد ميلاد مميزة مليئة بالإثارة والألعاب والضيافة الراقية.'
                    : 'Curated birthday packages packed with thrills, games, and treats.'}
                </p>
              </div>

              {/* 3 Packages Cards */}
              <div className="birthday-packages-grid">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;

                  return (
                    <div 
                      key={pkg.id}
                      className={`birthday-pkg-card ${isSelected ? 'active-pkg' : ''}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {/* Package Title & Price */}
                      <div className="birthday-pkg-header">
                        <h3 className={`birthday-pkg-name ${isSelected ? 'active' : ''}`}>
                          {lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                        </h3>
                        <div className={`birthday-pkg-price ${isSelected ? 'active' : ''}`}>
                          <span className="currency">EGP</span>
                          <span className="amount">{pkg.basePrice.toLocaleString()}</span>
                        </div>
                        <p className="birthday-pkg-desc">
                          {lang === 'ar' ? pkg.descAr : pkg.descEn}
                        </p>
                      </div>

                      {/* Included Features */}
                      <div className="birthday-pkg-features">
                        <span className={`birthday-pkg-features-title ${isSelected ? 'active' : ''}`}>
                          {isSelected 
                            ? (lang === 'ar' ? 'مشمول في هذه الباقة:' : 'INCLUDED IN PACKAGE')
                            : (lang === 'ar' ? 'ما تشمله الباقة:' : "WHAT'S INCLUDED")}
                        </span>
                        <ul className="birthday-pkg-list">
                          {(lang === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feat, idx) => (
                            <li key={idx} className="birthday-pkg-item">
                              <span className={`feature-check ${isSelected ? 'active' : ''}`}>
                                <Check size={13} strokeWidth={2.8} />
                              </span>
                              <span className="feature-text">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Package Button */}
                      <button 
                        type="button" 
                        className={`birthday-pkg-select-btn ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackage(pkg.id);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check size={16} strokeWidth={2.5} />
                            <span>{lang === 'ar' ? 'تم اختيار الباقة' : 'Selected'}</span>
                            <Check size={16} strokeWidth={2.5} />
                          </>
                        ) : (
                          <span>{lang === 'ar' ? 'اختيار هذه الباقة' : 'Select Package'}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LIVE SUMMARY CARD (YOUR BIRTHDAY) */}
          {/* ========================================================================= */}
          <aside className="birthday-summary-column">
            <div className="birthday-summary-card">
              
              {/* Top Badges */}
              <div className="birthday-summary-top-badges">
                <span className="summary-step-pill">STEP 3 OF 3</span>
                <span className="summary-instant-badge">
                  <span className="instant-pulse-dot" />
                  <span>{lang === 'ar' ? 'تأكيد فوري' : 'Instant Confirmation'}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="birthday-summary-title-wrap">
                <h3 className="birthday-summary-title">
                  <span className="word-orange">{lang === 'ar' ? 'عيد ' : 'YOUR '}</span>
                  <span className="word-cyan">{lang === 'ar' ? 'ميلادك' : 'BIRTHDAY'}</span>
                </h3>
                <p className="birthday-summary-sub">
                  {lang === 'ar' ? 'تفاصيل باقتك المخصصة لحظياً' : 'Live breakdown of your celebration'}
                </p>
              </div>

              {/* Breakdown Rows with Quick Edit / Change buttons */}
              <div className="birthday-summary-rows">
                
                {/* Space Row */}
                <div className="birthday-summary-row">
                  <div className="summary-row-left">
                    <span className="summary-row-label">
                      <MapPin size={13} /> {lang === 'ar' ? 'المساحة' : 'SPACE'}
                    </span>
                    <span className="summary-row-value">
                      {lang === 'ar' ? activeSpaceData.titleAr : activeSpaceData.titleEn}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="summary-change-btn"
                    onClick={() => scrollToSection(step1Ref)}
                  >
                    {lang === 'ar' ? 'تغيير' : 'Change'}
                  </button>
                </div>

                {/* Guests Row */}
                <div className="birthday-summary-row">
                  <div className="summary-row-left">
                    <span className="summary-row-label">
                      <Users size={13} /> {lang === 'ar' ? 'الضيوف' : 'GUESTS'}
                    </span>
                    <span className="summary-row-value">
                      {guestCount} {lang === 'ar' ? 'ضيفاً' : 'Guests'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="summary-change-btn"
                    onClick={() => scrollToSection(step2Ref)}
                  >
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>

                {/* Date Row */}
                <div className="birthday-summary-row">
                  <div className="summary-row-left">
                    <span className="summary-row-label">
                      <Calendar size={13} /> {lang === 'ar' ? 'التاريخ' : 'DATE'}
                    </span>
                    <span className="summary-row-value">
                      {getFormattedDate()}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="summary-change-btn"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                  >
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>

                {/* Time Slot Row */}
                <div className="birthday-summary-row">
                  <div className="summary-row-left">
                    <span className="summary-row-label">
                      <Clock size={13} /> {lang === 'ar' ? 'الموعد' : 'TIME SLOT'}
                    </span>
                    <span className="summary-row-value">
                      {lang === 'ar' ? activeSessionData.shortAr : activeSessionData.shortEn}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="summary-change-btn"
                    onClick={() => scrollToSection(step2Ref)}
                  >
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>

                {/* Selected Package Row */}
                <div className="birthday-summary-row">
                  <div className="summary-row-left">
                    <span className="summary-row-label">
                      <Gift size={13} /> {lang === 'ar' ? 'الباقة المختارة' : 'SELECTED PACKAGE'}
                    </span>
                    <span className="summary-row-value highlight-package">
                      {lang === 'ar' ? (activePackageData.subtitleAr || activePackageData.nameAr) : (activePackageData.subtitleEn || activePackageData.nameEn)}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="summary-change-btn"
                    onClick={() => scrollToSection(step3Ref)}
                  >
                    {lang === 'ar' ? 'تغيير' : 'Change'}
                  </button>
                </div>

              </div>

              {/* 4 Feature Badges */}
              <div className="birthday-summary-pills">
                <span className="summary-pill">
                  <Check size={12} strokeWidth={2.5} />
                  <span>{lang === 'ar' ? 'مقدم برامج مخصص' : 'Dedicated Host'}</span>
                </span>
                <span className="summary-pill">
                  <Check size={12} strokeWidth={2.5} />
                  <span>{lang === 'ar' ? 'ديكور بالونات خاص' : 'Custom Themed Decor'}</span>
                </span>
                <span className="summary-pill">
                  <Check size={12} strokeWidth={2.5} />
                  <span>{lang === 'ar' ? 'تورتة احتفالية طبقتين' : '2-Tier Cake'}</span>
                </span>
                <span className="summary-pill">
                  <Check size={12} strokeWidth={2.5} />
                  <span>{lang === 'ar' ? 'مرونة إعادة الجدولة' : 'Free Rescheduling'}</span>
                </span>
              </div>

              {/* Pricing Breakdown */}
              <div className="birthday-summary-pricing">
                <div className="pricing-line">
                  <span>{lang === 'ar' ? 'سعر الباقة الأساسي (حتى ٢٠ طفلاً):' : 'Package Base (Up to 20 Kids)'}</span>
                  <span className="pricing-num">EGP {basePrice.toLocaleString()}</span>
                </div>
                <div className="pricing-line">
                  <span>{lang === 'ar' ? 'رسوم حجز المساحة:' : 'Venue Space Fee'}</span>
                  <span className="pricing-included">{lang === 'ar' ? 'مشمول' : 'INCLUDED'}</span>
                </div>
                <div className="pricing-line">
                  <span>{lang === 'ar' ? 'الضريبة والخدمة (١٤٪):' : 'Taxes & Service (14% VAT)'}</span>
                  <span className="pricing-num">EGP {vat.toLocaleString()}</span>
                </div>

                <div className="pricing-divider" />

                {/* Total Row */}
                <div className="pricing-total-line">
                  <span className="total-label">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="total-amount">EGP {totalPrice.toLocaleString()}</span>
                </div>

                <p className="pricing-deposit-note">
                  {lang === 'ar'
                    ? `مبلغ التأكيد المطلوب دفعه اليوم: ${depositRequired.toLocaleString()} ج.م (يُسدد المتبقي يوم المناسبة)`
                    : `Deposit required today: EGP ${depositRequired.toLocaleString()} (Balance paid on event day)`}
                </p>
              </div>

              {/* Continue to Booking CTA Button */}
              <button 
                type="button" 
                className="birthday-continue-btn"
                onClick={handleContinueBooking}
              >
                <span>{lang === 'ar' ? 'المتابعة لتأكيد الحجز' : 'CONTINUE TO BOOKING'}</span>
                {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>

            </div>
          </aside>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONFIRMATION / BOOKING MODAL */}
      {/* ========================================================================= */}
      {showConfirmationModal && (
        <div className="birthday-modal-backdrop" onClick={() => setShowConfirmationModal(false)}>
          <div className="birthday-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="birthday-modal-close"
              onClick={() => setShowConfirmationModal(false)}
            >
              <X size={18} />
            </button>

            <div className="birthday-modal-header">
              <div className="birthday-modal-celebration-badge">
                <Sparkles size={24} color="#f59e0b" />
              </div>
              <h3 className="birthday-modal-title">
                {lang === 'ar' ? '🎉 تفاصيل حجز عيد ميلادك المميز' : '🎉 Your Dream Birthday Reservation'}
              </h3>
              <p className="birthday-modal-subtitle">
                {lang === 'ar' 
                  ? 'تم تجهيز وتخصيص كافة اختياراتك بنجاح! راجع التفاصيل قبل تأكيد الحجز.'
                  : 'All your customized celebration choices have been secured!'}
              </p>
            </div>

            <div className="birthday-modal-summary-box">
              {/* Optional Contact & Celebrant Customization */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#9a3412', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اسم صاحب عيد الميلاد:' : "Birthday Child's Name:"}
                  </label>
                  <input
                    type="text"
                    value={celebrantName}
                    onChange={(e) => setCelebrantName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: يوسف' : 'e.g. Youssef'}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      fontSize: '0.82rem',
                      background: '#fffaf5'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#9a3412', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'رقم الهاتف للتأكيد (واتساب): *' : 'Contact Phone (WhatsApp): *'}
                  </label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder={lang === 'ar' ? '010XXXXXXXX' : '+20 10X XXX XXXX'}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      fontSize: '0.82rem',
                      background: '#fffaf5'
                    }}
                  />
                </div>
              </div>

              <div className="modal-summary-item">
                <span className="item-label">{lang === 'ar' ? 'المكان والقاعة:' : 'Venue Space:'}</span>
                <span className="item-val">{lang === 'ar' ? activeSpaceData.titleAr : activeSpaceData.titleEn}</span>
              </div>
              <div className="modal-summary-item">
                <span className="item-label">{lang === 'ar' ? 'الباقة المختارة:' : 'Package:'}</span>
                <span className="item-val highlight">{lang === 'ar' ? activePackageData.nameAr : activePackageData.nameEn}</span>
              </div>
              <div className="modal-summary-item">
                <span className="item-label">{lang === 'ar' ? 'تاريخ الحفلة:' : 'Date:'}</span>
                <span className="item-val">{getFormattedDate()}</span>
              </div>
              <div className="modal-summary-item">
                <span className="item-label">{lang === 'ar' ? 'الفترة:' : 'Session Time:'}</span>
                <span className="item-val">{lang === 'ar' ? activeSessionData.shortAr : activeSessionData.shortEn}</span>
              </div>
              <div className="modal-summary-item">
                <span className="item-label">{lang === 'ar' ? 'إجمالي الضيوف:' : 'Total Guests:'}</span>
                <span className="item-val">{guestCount} ({kidsCount} kids + {adultsCount} adults)</span>
              </div>
              <div className="modal-summary-item total-item">
                <span className="item-label">{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                <span className="item-val">EGP {totalPrice.toLocaleString()}</span>
              </div>
              <div className="modal-summary-item deposit-item">
                <span className="item-label">{lang === 'ar' ? 'مقدم التأكيد اليوم:' : 'Deposit Required Today:'}</span>
                <span className="item-val">EGP {depositRequired.toLocaleString()}</span>
              </div>
            </div>

            <div className="birthday-modal-actions">
              <button 
                type="button" 
                className="birthday-modal-confirm-btn"
                disabled={isSubmittingBooking}
                onClick={async () => {
                  setIsSubmittingBooking(true);
                  let finalCode = serverBookingCode;
                  let finalId = null;
                  try {
                    const bookingRes = await eventService.bookEvent({
                      contactName: parentName || celebrantName || 'Birthday Guest',
                      contactPhone: parentPhone || '01012345678',
                      eventType: 'birthday',
                      space: selectedSpace,
                      birthdayDetails: {
                        celebrantName: celebrantName || '',
                        celebrantAge: selectedAge,
                        packageId: selectedPackage,
                        packageName: activePackageData.nameEn
                      },
                      totalGuests: guestCount,
                      kidsCount,
                      adultsCount,
                      eventDate: partyDate,
                      session: selectedSession,
                      sessionTime: activeSessionData.shortEn,
                      basePrice,
                      depositRequired
                    });
                    if (bookingRes?.booking?.bookingCode) {
                      finalCode = bookingRes.booking.bookingCode;
                      finalId = bookingRes.booking._id;
                      setServerBookingCode(finalCode);
                    }
                  } catch (err) {
                    console.warn('Booking reservation fallback:', err);
                  } finally {
                    setIsSubmittingBooking(false);
                  }

                  setShowConfirmationModal(false);
                  if (openModal) {
                    openModal('booking', {
                      type: lang === 'ar' ? 'حجز عيد ميلاد' : 'Birthday Celebration',
                      name: `${activePackageData.nameEn} (${activeSpaceData.titleEn})`,
                      price: `EGP ${totalPrice.toLocaleString()}`,
                      priceNum: totalPrice,
                      discount: `Deposit: EGP ${depositRequired.toLocaleString()}`,
                      guests: `${guestCount} Guests (${kidsCount} Kids)`,
                      date: partyDate,
                      session: activeSessionData.shortEn,
                      bookingCode: finalCode || 'BD-PENDING',
                      bookingId: finalId
                    });
                  }
                }}
              >
                {isSubmittingBooking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{lang === 'ar' ? 'جاري تأكيد الحجز...' : 'Securing Reservation...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'ar' ? `تأكيد ودفع العربون (${depositRequired.toLocaleString()} ج.م)` : `Confirm & Pay Deposit (EGP ${depositRequired.toLocaleString()})`}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="birthday-modal-cart-btn"
                onClick={() => {
                  setShowConfirmationModal(false);
                  if (setActiveTab) {
                    setActiveTab('cart');
                  }
                }}
              >
                <ShoppingBag size={17} />
                <span>{lang === 'ar' ? 'المتابعة إلى سلة المشتريات' : 'Proceed to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
