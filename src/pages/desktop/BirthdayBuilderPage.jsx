import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  HelpCircle,
  X,
  Send,
  UserCheck,
  PartyPopper
} from 'lucide-react';
import './BirthdayBuilderPage.css';

// Audio chime synthesizer for celebratory sound without external audio assets
const playCelebrationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Notes: C5 -> E5 -> G5 -> C6 (Arpeggio celebration)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
    });
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
};

export default function BirthdayBuilderPage({ onBack, lang = 'ar', setActiveTab }) {
  const isAr = lang === 'ar';

  // Step 1: Venue Space
  const [selectedSpace, setSelectedSpace] = useState('indoor');

  // Step 2: Party Details
  const [guestCount, setGuestCount] = useState(30);
  const [partyDate, setPartyDate] = useState('2026-10-24');
  const [timeWindow, setTimeWindow] = useState('afternoon');
  const [childAgeGroup, setChildAgeGroup] = useState('7-9');

  // Step 3: Package
  const [selectedPackage, setSelectedPackage] = useState('champion');

  // Modal & Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    childName: '',
    parentName: '',
    parentPhone: '',
    theme: 'superhero',
    paymentMethod: 'card',
    notes: ''
  });

  // Pre-hydrate parent data if authenticated user exists in storage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('kids_area_current_guest');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          parentName: parsed.name || '',
          parentPhone: parsed.phone || '',
          childName: (parsed.children && parsed.children[0] && parsed.children[0].name) || ''
        }));
      }
    } catch {}
  }, []);

  // Venue Data
  const venues = [
    {
      id: 'indoor',
      title: isAr ? 'القاعة المغطاة' : 'INDOOR',
      capacity: isAr ? 'حتى ١٢٠ ضيفاً' : 'Up to 120 Guests',
      desc: isAr 
        ? 'مساحة احتفال داخلية مميزة مع ثريات كريستالية ومسرح مجهز بالكامل ونظام صوت محيطي وأجواء مكيفة فاخرة.'
        : 'Immersive indoor celebration space with crystal chandeliers, customizable stage, private sound system, and climate-controlled comfort.',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      fallbackImg: '/photo/kid area pic/Image (1).png',
      badge: isAr ? 'مشمول' : 'INCLUDED'
    },
    {
      id: 'roof',
      title: isAr ? 'الروف البانورامي' : 'ROOF',
      capacity: isAr ? 'حتى ٨٠ ضيفاً' : 'Up to 80 Guests',
      desc: isAr 
        ? 'نسيم علوي مع إطلالة ساحرة على قناة السويس وغروب الشمس وإضاءات احتفالية ساحرة وجلسات عائلية مريحة.'
        : 'Open-air breeze with panoramic sunset views over the historic Suez Canal, festoon fairy lighting, and private seaside chillout lounges.',
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      fallbackImg: '/photo/kid area pic/Image (2).png',
      badge: isAr ? 'مشمول' : 'INCLUDED'
    },
    {
      id: 'outdoor',
      title: isAr ? 'الحديقة المفتوحة' : 'OUTDOOR',
      capacity: isAr ? 'حتى ٢٥ ضيفاً' : 'Up to 25 Guests',
      desc: isAr 
        ? 'مسطحات خضراء طبيعية مضاءة بفوانيس دافئة وألعاب حركية ومساحة حرة لركض الأطفال وسط نسيم البحر.'
        : 'Lush seaside green lawn illuminated with warm fairy lights, spacious play zones for kids\' active sports, and fresh evening breezes.',
      image: '/photo/kid area pic/Image (3).png',
      fallbackImg: '/photo/kid area pic/Image.png',
      badge: isAr ? 'مشمول' : 'INCLUDED'
    }
  ];

  // Packages Data
  const packages = [
    {
      id: 'explorer',
      name: isAr ? 'مغامرة المستكشف' : 'Explorer Adventure',
      price: 7500,
      priceFormatted: 'EGP 7,500',
      desc: isAr 
        ? 'لعب وحماس لا يتوقف مخصص للأعياد المليئة بالحيوية والنشاط لأول مرة.'
        : 'Dynamic play and high-energy excitement designed for vibrant parties.',
      features: [
        isAr ? 'ساعتان دخول حر وغير محدود لمنطقة الألعاب (حتى ١٥ طفلاً)' : '2 Hours Unlimited Play Zone Passes (up to 15 kids)',
        isAr ? 'منظم حفلات ومقدم ألعاب استعراضي مخصص' : 'Dedicated Party Animator & Game Host',
        isAr ? 'قوس بالونات مع أطباق ومفارش بطابع الحفل' : 'Basic Balloon Arch & Themed Tableware',
        isAr ? 'وجبة أطفال متكاملة (برجر/ناجتس + عصير + لعبة)' : 'Kids Meal Box (Burger/Nuggets + Juice + Toy)',
        isAr ? 'تاج ملكي وهدية تذكارية لصاحب عيد الميلاد' : 'Birthday Child Royal Crown & Gift Bag'
      ]
    },
    {
      id: 'champion',
      isPopular: true,
      name: isAr ? 'تحدي الأبطال' : 'Champion Quest',
      price: 11500,
      priceFormatted: 'EGP 11,500',
      desc: isAr 
        ? 'التجربة الشاملة الأكثر تميزاً مع ألعاب الواقع الافتراضي وبوفيه فاخر.'
        : 'The ultimate all-inclusive birthday experience with VR games and premium catering.',
      features: [
        isAr ? '٣.٥ ساعات حجز مساحة خاصة ودخول مفتوح لمنطقة الألعاب' : '3.5 Hours Private Zone & Unlimited Play Zone',
        isAr ? '٢ منظم حفلات محترفين + ظهور شخصية كرتونية ماسكوت' : '2 Dedicated Master Animators + Mascot Character',
        isAr ? 'خلفية تصوير ثلاثية الأبعاد مع قوس بالونات متكامل' : 'Full Themed Backdrop & Organic Balloon Garland',
        isAr ? 'بوفيه شهي للأطفال + محطة قهوة ومخبوزات لأولياء الأمور' : 'Gourmet Buffet for Kids + Parent Coffee/Pastry Station',
        isAr ? 'تورتة عيد ميلاد من دورين مصممة خصيصاً مع شماريخ نارية' : 'Customized 2-Tier Birthday Cake with Sparklers',
        isAr ? 'كروت VIP لمنطقة ألعاب الفيديو والواقع الافتراضي (٥٠ نقطة لكل طفل)' : 'VR & Arcade VIP Cards (50 Bonus Credits per kid)'
      ]
    },
    {
      id: 'royal',
      name: isAr ? 'الملكي الفاخر VIP' : 'Royal Waterfront VIP',
      price: 16500,
      priceFormatted: 'EGP 16,500',
      desc: isAr 
        ? 'حجز حصري كامل للمنطقة مع محطات طهي حية وتصوير سينمائي احترافي.'
        : 'Exclusive private zone takeover with chef-curated live stations and VIP photography.',
      features: [
        isAr ? 'حجز حصري كامل للقاعة أو الروف لمدة ٤ ساعات' : 'Exclusive Private Hall / Roof Takeover (4 Hours)',
        isAr ? 'تصميم ثيم ثلاثي الأبعاد بالكامل لأي شخصية يختارها الطفل' : 'Full Custom Theming (Choose Any 3D Character Theme)',
        isAr ? 'مصور فوتوغرافي محترف + فيديو ريلز سينمائي للحفل' : 'Professional Photographer + Video Reel Highlights',
        isAr ? 'محطات طهي مباشرة (كريب، وافل، ميني برجر سلايدرز)' : 'Live Cooking Stations (Crepes, Waffles, Mini Sliders)',
        isAr ? 'تورتة ملكية ٣ أدوار + مدفع كونفيتي مفاجأة' : 'Custom 3-Tier Designer Cake + Confetti Cannon',
        isAr ? 'هدايا تذكارية فاخرة وبوكسات عودة خاصة لكل الضيوف' : 'Luxury Return Gifts & Personalized Goodie Bags'
      ]
    }
  ];

  // Current Selections
  const activeVenue = venues.find(v => v.id === selectedSpace) || venues[0];
  const activePackage = packages.find(p => p.id === selectedPackage) || packages[1];

  // Dynamic Financials (matching exact numbers from media_1791456350896: 11500 + 1610 = 13110)
  const basePrice = activePackage.price;
  const taxAmount = Math.round(basePrice * 0.14);
  const totalPrice = basePrice + taxAmount;
  const depositRequired = 3500;

  // Breakdown of kids and adults
  const kidsCount = Math.round(guestCount * 0.67);
  const adultsCount = guestCount - kidsCount;

  // Time window display
  const getTimeWindowDisplay = (slot) => {
    switch (slot) {
      case 'morning':
        return isAr ? 'الفترة الصباحية (١١:٠٠ ص – ٠٢:٣٠ م)' : 'Morning Session (11:00 AM – 02:30 PM)';
      case 'evening':
        return isAr ? 'الفترة المسائية (٠٨:٠٠ م – ١١:٣٠ م)' : 'Evening Session (08:00 PM – 11:30 PM)';
      case 'afternoon':
      default:
        return isAr ? 'فترة ما بعد الظهر (٠٤:٠٠ م – ٠٧:٣٠ م)' : 'Afternoon Session (04:00 PM – 07:30 PM)';
    }
  };

  // Formatted date display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return isAr ? 'السبت، ٢٤ أكتوبر ٢٠٢٦' : 'Saturday, Oct 24, 2026';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Confirmation Handler
  const handleConfirmReservation = (e) => {
    e.preventDefault();

    if (!formData.childName.trim()) {
      alert(isAr ? 'يرجى كتابة اسم صاحب عيد الميلاد' : 'Please enter the birthday child\'s name');
      return;
    }
    if (!formData.parentPhone.trim()) {
      alert(isAr ? 'يرجى كتابة رقم هاتف ولي الأمر للتأكيد' : 'Please enter parent\'s phone number for confirmation');
      return;
    }

    const bookingRef = 'BDAY-' + Math.floor(1000 + Math.random() * 9000);
    const reservationRecord = {
      id: bookingRef,
      refNumber: bookingRef,
      type: 'birthday',
      venue: activeVenue.title,
      packageName: activePackage.name,
      guests: guestCount,
      kids: kidsCount,
      adults: adultsCount,
      date: partyDate,
      dateFormatted: formatDateDisplay(partyDate),
      timeSlot: getTimeWindowDisplay(timeWindow),
      childAgeGroup,
      childName: formData.childName,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      theme: formData.theme,
      basePrice,
      taxAmount,
      totalPrice,
      depositRequired,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('kids_area_reservations') || '[]');
      existing.unshift(reservationRecord);
      localStorage.setItem('kids_area_reservations', JSON.stringify(existing));
    } catch (err) {
      console.warn('Storage save error:', err);
    }

    // Play celebration audio and fire confetti
    playCelebrationSound();
    try {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00a8cc', '#f59e0b', '#34d399', '#f43f5e', '#3b82f6']
      });
    } catch {}

    setBookingSuccessData(reservationRecord);
  };

  return (
    <div className="birthday-builder-wrapper" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="birthday-builder-container">
        
        {/* Top Bar: Back Button & Step Counter */}
        <div className="bday-top-bar">
          <button type="button" className="bday-back-btn" onClick={onBack}>
            <ArrowLeft size={18} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }} />
            <span>{isAr ? 'العودة إلى الحفلات والقاعات' : 'Back to Events & Halls'}</span>
          </button>
          
          <div className="bday-tag-badge">
            <Sparkles size={14} />
            <span>{isAr ? 'مصمم حفلات أعياد الميلاد' : 'BIRTHDAY DESIGN STUDIO'}</span>
          </div>
        </div>

        {/* Hero Header with Playful Alternating Title */}
        <header className="bday-hero-header">
          <h1 className="bday-main-title">
            {isAr ? (
              <>
                <span className="bday-letter-cyan">صمّم </span>
                <span className="bday-letter-orange">عيد </span>
                <span className="bday-letter-navy">ميلادك </span>
                <span className="bday-letter-cyan">المثالي</span>
              </>
            ) : (
              <>
                <span className="bday-letter-cyan">D</span>
                <span className="bday-letter-orange">e</span>
                <span className="bday-letter-navy">s</span>
                <span className="bday-letter-cyan">i</span>
                <span className="bday-letter-orange">g</span>
                <span className="bday-letter-navy">n</span>
                <span> </span>
                <span className="bday-letter-cyan">Y</span>
                <span className="bday-letter-orange">o</span>
                <span className="bday-letter-navy">u</span>
                <span className="bday-letter-cyan">r</span>
                <span> </span>
                <span className="bday-letter-orange">D</span>
                <span className="bday-letter-navy">r</span>
                <span className="bday-letter-cyan">e</span>
                <span className="bday-letter-orange">a</span>
                <span className="bday-letter-navy">m</span>
                <span> </span>
                <span className="bday-letter-cyan">B</span>
                <span className="bday-letter-orange">i</span>
                <span className="bday-letter-navy">r</span>
                <span className="bday-letter-cyan">t</span>
                <span className="bday-letter-orange">h</span>
                <span className="bday-letter-navy">d</span>
                <span className="bday-letter-cyan">a</span>
                <span className="bday-letter-orange">y</span>
              </>
            )}
          </h1>
          <p className="bday-main-subtitle">
            {isAr 
              ? 'من مغامرات منطقة الألعاب المليئة بالحماس إلى الديكورات المخصصة والمأكولات على البحر، صمّم تجربة عيد ميلاد لا تُنسى في ٤ خطوات بسيطة.'
              : 'From high-energy Play Zone quests to bespoke themed decorations and waterfront dining, build an unforgettable birthday experience in 4 simple steps.'}
          </p>
        </header>

        {/* Content Layout: Steps Column + Sticky Breakdown Sidebar */}
        <div className="bday-content-grid">
          
          {/* Left Column: Interactive Steps */}
          <div className="bday-steps-column">
            
            {/* ============================================================= */}
            {/* STEP 1: CHOOSE YOUR SPACE */}
            {/* ============================================================= */}
            <section className="bday-step-section" id="step-space-section">
              <h2 className="bday-step-title">
                {isAr ? '١. اختر المساحة أو القاعة' : '1. CHOOSE YOUR SPACE'}
              </h2>
              <p className="bday-step-subtitle">
                {isAr 
                  ? 'حدد الموقع الأمثل لاحتفالك السعيد. (اختر مساحة واحدة)'
                  : 'Select the perfect setting for your celebration. (Pick 1 space)'}
              </p>

              <div className="bday-venue-cards-grid">
                {venues.map((venue) => {
                  const isSelected = selectedSpace === venue.id;
                  return (
                    <div 
                      key={venue.id}
                      className={`bday-venue-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSpace(venue.id)}
                    >
                      <div className="bday-venue-header">
                        <h3 className="bday-venue-name">{venue.title}</h3>
                        <span className="bday-venue-capacity">
                          <Users size={12} />
                          {venue.capacity}
                        </span>
                      </div>

                      <p className="bday-venue-desc">{venue.desc}</p>

                      <div className="bday-venue-img-wrap">
                        <img 
                          src={venue.image} 
                          alt={venue.title} 
                          className="bday-venue-img"
                          onError={(e) => {
                            e.target.src = venue.fallbackImg;
                          }}
                        />
                        {isSelected && (
                          <div className="bday-venue-selected-badge">
                            <Check size={12} />
                            <span>{isAr ? 'مُختار' : 'Selected'}</span>
                          </div>
                        )}
                      </div>

                      <div className="bday-venue-footer">
                        <div className="bday-venue-radio">
                          <div className="bday-radio-dot">
                            {isSelected && <div className="bday-radio-dot-inner" />}
                          </div>
                          <span>
                            {isSelected 
                              ? (isAr ? 'المكان المُختار' : 'Chosen Venue') 
                              : (isAr ? 'اضغط للاختيار' : 'Click to Select')}
                          </span>
                        </div>
                        <span className="bday-venue-pill-included">{venue.badge}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ============================================================= */}
            {/* STEP 2: TELL US ABOUT YOUR PARTY */}
            {/* ============================================================= */}
            <section className="bday-step-section" id="step-party-section">
              <h2 className="bday-step-title">
                {isAr ? '٢. أخبرنا عن تفاصيل الحفلة' : '2. TELL US ABOUT YOUR PARTY'}
              </h2>
              <p className="bday-step-subtitle">
                {isAr 
                  ? 'أدخل أعداد الضيوف والمواعيد المفضلة للتحقق من التوفر الفوري.'
                  : 'Provide guest numbers and timing to check real-time availability.'}
              </p>

              <div className="bday-party-details-grid">
                
                {/* 1. Number of Guests */}
                <div className="bday-detail-box">
                  <div className="bday-detail-label-row">
                    <span className="bday-detail-label">
                      {isAr ? 'عدد الضيوف (أطفال + مرافقين)' : 'Number of Guests (Kids + Adults)'}
                    </span>
                    <span className="bday-detail-hint">{isAr ? '(الحد الأدنى ١٥ - الأقصى ١٥٠)' : '(Min 15 - Max 150)'}</span>
                  </div>

                  <div className="bday-counter-control">
                    <button 
                      type="button" 
                      className="bday-counter-btn"
                      disabled={guestCount <= 15}
                      onClick={() => setGuestCount(prev => Math.max(15, prev - 5))}
                    >
                      −
                    </button>
                    <div className="bday-counter-val">
                      {guestCount} <small>{isAr ? 'ضيفاً' : 'Guests'}</small>
                    </div>
                    <button 
                      type="button" 
                      className="bday-counter-btn"
                      disabled={guestCount >= 150}
                      onClick={() => setGuestCount(prev => Math.min(150, prev + 5))}
                    >
                      +
                    </button>
                  </div>

                  <p className="bday-box-subtext">
                    {isAr 
                      ? `يشمل تقريباً ${kidsCount} طفلاً + ${adultsCount} مرافقين`
                      : `Includes ${kidsCount} kids + ${adultsCount} adults`}
                  </p>
                </div>

                {/* 2. Party Date */}
                <div className="bday-detail-box">
                  <div className="bday-detail-label-row">
                    <span className="bday-detail-label">{isAr ? 'تاريخ الحفلة' : 'Party Date'}</span>
                    <span className="bday-detail-hint">{isAr ? 'متاح طوال الأسبوع' : 'Available all week'}</span>
                  </div>

                  <div className="bday-input-box">
                    <Calendar size={18} className="bday-input-icon" />
                    <input 
                      type="date"
                      value={partyDate}
                      onChange={(e) => setPartyDate(e.target.value)}
                      className="bday-input-field"
                    />
                  </div>

                  <p className="bday-box-subtext">
                    {formatDateDisplay(partyDate)}
                  </p>
                </div>

                {/* 3. Time Window */}
                <div className="bday-detail-box">
                  <div className="bday-detail-label-row">
                    <span className="bday-detail-label">{isAr ? 'الفترة الزمنية' : 'Time Window'}</span>
                    <span className="bday-detail-hint">{isAr ? 'جلسة ٣.٥ ساعات' : '3.5 hour session'}</span>
                  </div>

                  <div className="bday-input-box">
                    <Clock size={18} className="bday-input-icon" />
                    <select 
                      className="bday-select-field"
                      value={timeWindow}
                      onChange={(e) => setTimeWindow(e.target.value)}
                    >
                      <option value="afternoon">
                        {isAr ? 'فترة ما بعد الظهر (٠٤:٠٠ م – ٠٧:٣٠ م)' : 'Afternoon Session (04:00 PM – 07:30 PM)'}
                      </option>
                      <option value="morning">
                        {isAr ? 'الفترة الصباحية (١١:٠٠ ص – ٠٢:٣٠ م)' : 'Morning Session (11:00 AM – 02:30 PM)'}
                      </option>
                      <option value="evening">
                        {isAr ? 'الفترة المسائية / الغروب (٠٨:٠٠ م – ١١:٣٠ م)' : 'Evening Session (08:00 PM – 11:30 PM)'}
                      </option>
                    </select>
                  </div>

                  <p className="bday-box-subtext">
                    {isAr ? 'فترة احتفال قياسية مدتها ٣.٥ ساعات متواصلة' : 'Standard 3.5 hour celebration session'}
                  </p>
                </div>

                {/* 4. Birthday Child Age */}
                <div className="bday-detail-box">
                  <div className="bday-detail-label-row">
                    <span className="bday-detail-label">{isAr ? 'عمر صاحب عيد الميلاد' : 'Birthday Child Age'}</span>
                    <span className="bday-detail-hint">{isAr ? 'لتخصيص الألعاب' : 'Custom games'}</span>
                  </div>

                  <div className="bday-age-pills-row">
                    {[
                      { id: '1-3', label: isAr ? '١ – ٣ سنوات' : '1 – 3 yrs' },
                      { id: '4-6', label: isAr ? '٤ – ٦ سنوات' : '4 – 6 yrs' },
                      { id: '7-9', label: isAr ? '٧ – ٩ سنوات' : '7 – 9 yrs' },
                      { id: '10-14', label: isAr ? '١٠ – ١٤ سنة' : '10 – 14 yrs' }
                    ].map(pill => (
                      <button 
                        key={pill.id}
                        type="button"
                        className={`bday-age-pill ${childAgeGroup === pill.id ? 'active' : ''}`}
                        onClick={() => setChildAgeGroup(pill.id)}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <p className="bday-box-subtext">
                    {isAr 
                      ? 'يساعد في تخصيص برنامج الألعاب التفاعلية والهدايا'
                      : 'Tailors party games, host games, and gifts'}
                  </p>
                </div>

              </div>
            </section>

            {/* ============================================================= */}
            {/* STEP 3: CHOOSE YOUR PACKAGE */}
            {/* ============================================================= */}
            <section className="bday-step-section" id="step-package-section">
              <h2 className="bday-step-title">
                {isAr ? '٣. اختر باقة عيد الميلاد' : '3. CHOOSE YOUR PACKAGE'}
              </h2>
              <p className="bday-step-subtitle">
                {isAr 
                  ? 'باقات احتفالية مصممة خصيصاً مليئة بالإثارة والبهجة والضيافة الراقية.'
                  : 'Curated birthday packages packed with thrills, games, and treats.'}
              </p>

              <div className="bday-packages-grid">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <div 
                      key={pkg.id}
                      className={`bday-package-card ${isSelected ? 'selected' : ''}`}
                    >
                      {pkg.isPopular && (
                        <div className="bday-package-pop-badge">
                          ⭐ {isAr ? 'الأكثر طلباً ومبيعاً' : 'MOST POPULAR'}
                        </div>
                      )}

                      <h3 className="bday-package-title">{pkg.name}</h3>
                      <div className="bday-package-price">{pkg.priceFormatted}</div>
                      <p className="bday-package-desc">{pkg.desc}</p>

                      <ul className="bday-features-list">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="bday-feature-item">
                            <Check size={16} className="bday-check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <button 
                        type="button" 
                        className="bday-select-pkg-btn"
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        {isSelected 
                          ? (isAr ? '✓ الباقة المُختارة' : '✓ Selected') 
                          : (isAr ? 'اختيار هذه الباقة' : 'Select Package')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column: Live Sticky Summary Sidebar */}
          <aside className="bday-sidebar-column">
            <div className="bday-summary-card">
              
              <div className="bday-summary-header">
                <span className="bday-summary-badge">
                  {isAr ? 'الخطوة ٣ من ٣: حفل عيد ميلادك' : 'STEP 3 OF 3: YOUR BIRTHDAY'}
                </span>
                <img 
                  src="/photo/logo/logo nav bar and footer.png" 
                  alt="American Dream" 
                  className="bday-summary-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Dynamic Summary Rows */}
              <div className="bday-summary-details">
                
                {/* Space Row */}
                <div className="bday-summary-row">
                  <span className="bday-summary-key">{isAr ? 'المكان' : 'SPACE'}</span>
                  <div className="bday-summary-val-wrap">
                    <span className="bday-summary-val">{activeVenue.title}</span>
                    <button 
                      type="button" 
                      className="bday-summary-edit-btn"
                      onClick={() => scrollToSection('step-space-section')}
                    >
                      {isAr ? 'تغيير' : 'Change'}
                    </button>
                  </div>
                </div>

                {/* Guests Row */}
                <div className="bday-summary-row">
                  <span className="bday-summary-key">{isAr ? 'الضيوف' : 'GUESTS'}</span>
                  <div className="bday-summary-val-wrap">
                    <span className="bday-summary-val">
                      {guestCount} {isAr ? 'ضيفاً' : 'Guests'}
                    </span>
                    <button 
                      type="button" 
                      className="bday-summary-edit-btn"
                      onClick={() => scrollToSection('step-party-section')}
                    >
                      {isAr ? 'تعديل' : 'Edit'}
                    </button>
                  </div>
                </div>

                {/* Date Row */}
                <div className="bday-summary-row">
                  <span className="bday-summary-key">{isAr ? 'التاريخ' : 'DATE'}</span>
                  <div className="bday-summary-val-wrap">
                    <span className="bday-summary-val">{formatDateDisplay(partyDate)}</span>
                    <button 
                      type="button" 
                      className="bday-summary-edit-btn"
                      onClick={() => scrollToSection('step-party-section')}
                    >
                      {isAr ? 'تعديل' : 'Edit'}
                    </button>
                  </div>
                </div>

                {/* Time Slot Row */}
                <div className="bday-summary-row">
                  <span className="bday-summary-key">{isAr ? 'الفترة الزمنية' : 'TIME SLOT'}</span>
                  <div className="bday-summary-val-wrap">
                    <span className="bday-summary-val">
                      {timeWindow === 'morning' ? '11:00 AM – 02:30 PM' : timeWindow === 'evening' ? '08:00 PM – 11:30 PM' : '04:00 PM – 07:30 PM'}
                    </span>
                    <button 
                      type="button" 
                      className="bday-summary-edit-btn"
                      onClick={() => scrollToSection('step-party-section')}
                    >
                      {isAr ? 'تعديل' : 'Edit'}
                    </button>
                  </div>
                </div>

                {/* Selected Package Row */}
                <div className="bday-summary-row">
                  <span className="bday-summary-key">{isAr ? 'الباقة المختارة' : 'SELECTED PACKAGE'}</span>
                  <div className="bday-summary-val-wrap">
                    <span className="bday-summary-val" style={{ color: '#ffffff' }}>
                      {activePackage.name}
                    </span>
                    <button 
                      type="button" 
                      className="bday-summary-edit-btn"
                      onClick={() => scrollToSection('step-package-section')}
                    >
                      {isAr ? 'تغيير' : 'Change'}
                    </button>
                  </div>
                </div>

              </div>

              {/* 4 Feature Badges Grid */}
              <div className="bday-summary-badges-grid">
                <div className="bday-perk-badge">
                  <span>✓</span> {isAr ? 'مقدم حفلات مخصص' : 'Dedicated Host'}
                </div>
                <div className="bday-perk-badge">
                  <span>✓</span> {isAr ? 'ديكور بطابع خاص' : 'Custom Themed Decor'}
                </div>
                <div className="bday-perk-badge">
                  <span>✓</span> {isAr ? 'تورتة احتفالية دورين' : '2-Tier Cake'}
                </div>
                <div className="bday-perk-badge">
                  <span>✓</span> {isAr ? 'مرونة إعادة الجدولة' : 'Free Rescheduling'}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bday-pricing-breakdown">
                <div className="bday-price-line">
                  <span>{isAr ? 'سعر الباقة الأساسي' : 'Package Base (Up to 20 Kids)'}</span>
                  <span>EGP {basePrice.toLocaleString()}</span>
                </div>
                
                <div className="bday-price-line included">
                  <span>{isAr ? 'رسوم حجز المكان' : 'Venue Space Fee'}</span>
                  <span>{isAr ? 'مشمول مجاناً' : 'INCLUDED'}</span>
                </div>

                <div className="bday-price-line">
                  <span>{isAr ? 'ضريبة القيمة المضافة والخدمة (١٤٪)' : 'Taxes & Service (14% VAT)'}</span>
                  <span>EGP {taxAmount.toLocaleString()}</span>
                </div>

                <div className="bday-price-total-row">
                  <span className="bday-price-total-label">{isAr ? 'الإجمالي الكلي' : 'Total'}</span>
                  <span className="bday-price-total-val">EGP {totalPrice.toLocaleString()}</span>
                </div>

                <p className="bday-deposit-hint">
                  {isAr 
                    ? `العربون المطلوب لتأكيد الحجز اليوم: ٣,٥٠٠ ج.م (ويُسدد المتبقي يوم الحفل)`
                    : `Deposit required today: EGP ${depositRequired.toLocaleString()} (Balance paid on event day)`}
                </p>
              </div>

              {/* Golden Action CTA Button */}
              <button 
                type="button" 
                className="bday-continue-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <span>{isAr ? 'المتابعة لتأكيد الحجز' : 'CONTINUE TO BOOKING'}</span>
                <span>&rarr;</span>
              </button>

            </div>
          </aside>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* BOOKING MODAL & CELEBRATION MODAL */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="bday-modal-overlay" onClick={() => !bookingSuccessData && setIsModalOpen(false)}>
          <div className="bday-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {!bookingSuccessData ? (
              <>
                <div className="bday-modal-header">
                  <h3 className="bday-modal-title">
                    {isAr ? 'استكمال حجز عيد الميلاد' : 'Complete Your Birthday Booking'}
                  </h3>
                  <button 
                    type="button" 
                    className="bday-modal-close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleConfirmReservation}>
                  <div className="bday-modal-body">
                    
                    {/* Summary Banner */}
                    <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0e7490', fontSize: '0.9rem' }}>
                          {activePackage.name} • {activeVenue.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#155e75' }}>
                          {guestCount} {isAr ? 'ضيوف' : 'Guests'} • {formatDateDisplay(partyDate)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#0891b2', fontSize: '1.1rem' }}>
                        EGP {totalPrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Child Name */}
                    <div className="bday-form-group">
                      <label className="bday-form-label">
                        {isAr ? 'اسم صاحب عيد الميلاد *' : 'Birthday Child Name *'}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder={isAr ? 'مثال: آدم أحمد' : 'e.g. Adam Ahmed'}
                        className="bday-form-input"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                      />
                    </div>

                    {/* Parent Details Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="bday-form-group">
                        <label className="bday-form-label">
                          {isAr ? 'اسم ولي الأمر' : 'Parent Name'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isAr ? 'اسم ولي الأمر' : 'Parent full name'}
                          className="bday-form-input"
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        />
                      </div>

                      <div className="bday-form-group">
                        <label className="bday-form-label">
                          {isAr ? 'رقم الهاتف للتواصل *' : 'Contact Phone *'}
                        </label>
                        <input 
                          type="tel" 
                          required
                          placeholder="010XXXXXXXX"
                          className="bday-form-input"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Party Theme Selection */}
                    <div className="bday-form-group">
                      <label className="bday-form-label">
                        {isAr ? 'اختر شخصية أو ثيم الحفل' : 'Choose Party Theme'}
                      </label>
                      <select 
                        className="bday-form-select"
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      >
                        <option value="superhero">{isAr ? 'الأبطال الخارقين (Marvel & Avengers)' : 'Superheroes (Marvel & Avengers)'}</option>
                        <option value="princess">{isAr ? 'أميرات ديزني (Disney Princess)' : 'Disney Princess Fairytale'}</option>
                        <option value="space">{isAr ? 'مستكشفو الفضاء والمجرات (Space Galaxy)' : 'Space Galaxy & Astronauts'}</option>
                        <option value="safari">{isAr ? 'مغامرة الغابة وسفاري (Safari Adventure)' : 'Jungle Safari Adventure'}</option>
                        <option value="ocean">{isAr ? 'عالم البحار وقناة السويس (Underwater Dream)' : 'Underwater & Suez Canal'}</option>
                        <option value="custom">{isAr ? 'ثيم مخصص حسب الطلب' : 'Custom Theme of Choice'}</option>
                      </select>
                    </div>

                    {/* Deposit Payment Method */}
                    <div className="bday-form-group">
                      <label className="bday-form-label">
                        {isAr ? 'طريقة دفع العربون (٣,٥٠٠ ج.م)' : 'Deposit Payment Method (EGP 3,500)'}
                      </label>
                      <div className="bday-payment-methods-grid">
                        <div 
                          className={`bday-payment-pill ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        >
                          💳 {isAr ? 'بطاقة بنكية' : 'Bank Card'}
                        </div>
                        <div 
                          className={`bday-payment-pill ${formData.paymentMethod === 'instapay' ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, paymentMethod: 'instapay' })}
                        >
                          ⚡ {isAr ? 'انستاباي / فودافون كاش' : 'InstaPay / Wallet'}
                        </div>
                        <div 
                          className={`bday-payment-pill ${formData.paymentMethod === 'venue' ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, paymentMethod: 'venue' })}
                        >
                          🏢 {isAr ? 'دفع في الاستقبال' : 'Pay at Reception'}
                        </div>
                      </div>
                    </div>

                    {/* Special Requests / Notes */}
                    <div className="bday-form-group">
                      <label className="bday-form-label">
                        {isAr ? 'ملاحظات خاصة أو أغانٍ مفضلة (اختياري)' : 'Special Requests or Song List (Optional)'}
                      </label>
                      <textarea 
                        rows="2"
                        placeholder={isAr ? 'اكتب أي تفاصيل بخصوص الحساسية الغذائية أو أغنية دخول التورتة...' : 'Any dietary notes, favorite songs for cake entry...'}
                        className="bday-form-textarea"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                  </div>

                  <div className="bday-modal-footer">
                    <button 
                      type="button" 
                      className="bday-back-btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" className="bday-confirm-btn">
                      {isAr ? 'تأكيد الحجز الآن (دفع ٣,٥٠٠ ج.م عربون)' : 'Confirm Reservation (Pay EGP 3,500)'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation Card */
              <div className="bday-success-card">
                <div className="bday-success-icon-wrap">
                  <PartyPopper size={42} />
                </div>
                
                <h3 className="bday-success-title">
                  {isAr ? '🎉 تم تأكيد حجز عيد ميلاد أحلامك بنجاح!' : '🎉 Your Dream Birthday is Confirmed!'}
                </h3>
                
                <p className="bday-success-desc">
                  {isAr 
                    ? `تهانينا! حجز حفل ${bookingSuccessData.childName} في ${bookingSuccessData.venue} لباقة ${bookingSuccessData.packageName} أصبح مسجلاً رسمياً ومؤكداً.`
                    : `Congratulations! ${bookingSuccessData.childName}'s birthday party at ${bookingSuccessData.venue} with the ${bookingSuccessData.packageName} package is locked in.`}
                </p>

                <div className="bday-booking-ref-box">
                  <div className="bday-ref-label">{isAr ? 'رقم الحجز المرجعي' : 'BOOKING REFERENCE CODE'}</div>
                  <div className="bday-ref-code">{bookingSuccessData.refNumber}</div>
                </div>

                <div className="bday-success-actions">
                  {/* WhatsApp Direct Share Button */}
                  <a 
                    href={`https://wa.me/201012345678?text=${encodeURIComponent(
                      `🎉 حجز عيد ميلاد جديد في American Dream!\n` +
                      `كود الحجز: ${bookingSuccessData.refNumber}\n` +
                      `صاحب الحفل: ${bookingSuccessData.childName}\n` +
                      `المكان: ${bookingSuccessData.venue}\n` +
                      `الباقة: ${bookingSuccessData.packageName}\n` +
                      `الضيوف: ${bookingSuccessData.guests} ضيف\n` +
                      `التاريخ: ${bookingSuccessData.dateFormatted}\n` +
                      `الموعد: ${bookingSuccessData.timeSlot}\n` +
                      `العربون المطلوب: 3,500 EGP`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bday-whatsapp-btn"
                  >
                    <Send size={18} />
                    <span>{isAr ? 'إرسال تفاصيل الحجز عبر واتساب للاستقبال' : 'Send Itinerary via WhatsApp to Reception'}</span>
                  </a>

                  {/* View in Profile */}
                  <button 
                    type="button" 
                    className="bday-profile-btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      if (setActiveTab) setActiveTab('profile');
                    }}
                  >
                    <UserCheck size={18} />
                    <span>{isAr ? 'عرض الحجز في ملفي الشخصي' : 'View in My Profile'}</span>
                  </button>

                  {/* Done / Back to Events */}
                  <button 
                    type="button" 
                    className="bday-back-btn" 
                    style={{ alignSelf: 'center', marginTop: '6px' }}
                    onClick={() => {
                      setIsModalOpen(false);
                      if (onBack) onBack();
                    }}
                  >
                    <span>{isAr ? 'العودة إلى الحفلات والفعاليات' : 'Back to All Events'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
