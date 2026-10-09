import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Camera, Download, Copy, Check, FileImage } from 'lucide-react';
import { isUserAuthenticated } from '../../api/authService';
import './DesktopTripsPage.css';

export default function DesktopTripsPage({ setActiveTab, openModal, lang = 'ar' }) {
  // 1. Selected Offer Card State
  const [selectedOfferId, setSelectedOfferId] = useState('full-dream');

  // 2. Organization Details State
  const [orgName, setOrgName] = useState('Manarat Al-Mostaqbal Language School');
  const [orgType, setOrgType] = useState('School');
  const [contactName, setContactName] = useState('Omar Abdelrahman');
  const [phone, setPhone] = useState('+20 101 234 5678');

  // 3. Group Details State
  const [students, setStudents] = useState(45);
  const [supervisors, setSupervisors] = useState(3);
  const [isSupervisorsManual, setIsSupervisorsManual] = useState(false);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState(['6-9', '10-12']);

  // 4. Scheduling & Timing State
  const [tripDate, setTripDate] = useState('2024-10-20');
  const [shift, setShift] = useState('morning'); // 'morning' | 'evening'
  const [arrivalTime, setArrivalTime] = useState('09:30 AM');

  // 5. Booking & Quotation Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('review'); // 'review' | 'quotation' | 'whatsapp'
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [quoteRefNumber] = useState(() => `AD-TRIP-${Math.floor(1000 + Math.random() * 9000)}`);

  // 6. Screenshot Capture State & Ref
  const quotePaperRef = useRef(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-calculate complimentary supervisors (1 per 15 students)
  useEffect(() => {
    if (!isSupervisorsManual) {
      const calculated = Math.max(1, Math.floor(students / 15));
      setSupervisors(calculated);
    }
  }, [students, isSupervisorsManual]);

  // Adjust arrival times when shift changes
  useEffect(() => {
    if (shift === 'morning') {
      setArrivalTime('09:30 AM');
    } else {
      setArrivalTime('03:30 PM');
    }
  }, [shift]);

  // Offers Data matching the user's design
  const tripOffers = [
    {
      id: 'full-dream',
      title: lang === 'ar' ? 'يوم الحلم الكامل' : 'FULL DREAM DAY',
      desc: lang === 'ar'
        ? 'تجربة شاملة طوال اليوم عبر جميع مناطق الألعاب مع وجبة غداء كاملة ومرشد مخصص للمجموعة.'
        : 'Comprehensive all-day experience across all 4 zones with lunch and dedicated group host.',
      price: 380,
      badge: lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular',
      inclusions: lang === 'ar' ? [
        'دخول مفتوح لجميع مناطق الألعاب (فن بارك، التحدي والمغامرات)',
        'وجبة غداء ساخنة متكاملة (سندوتشات أو وجبة أطفال + عصير)',
        'مرشد سياحي وترفيهي مرافق طوال اليوم + صورة تذكارية جماعية',
        'إشراف أمني مستمر وتواجد مسعفين مجهزين'
      ] : [
        'Play Zone Unlimited Access (Fun Park, Challenge & Adventure)',
        'Full Hot Lunch Meal (Sandwich options or Kids Meal + Juice)',
        'Dedicated Experience Guide & Welcome Group Photo Souvenir',
        'Continuous Safety Supervision & First Aid Station Access'
      ],
      summaryInclusions: lang === 'ar' ? [
        'تذاكر منطقة الأطفال + فن بارك + التحدي',
        'وجبة كومبو للأطفال + مقعد مخصص بالمطعم',
        'طاولة استراحة خاصة بالحديقة + مرشد مخصص',
        'كوبون خصم زيارة قادمة لكل طالب'
      ] : [
        'Kids Area + Fun Park + Challenge Passes',
        'Kids Combo Meal + Restaurant Seat',
        'Garden Lounge Table + Dedicated Host',
        'Student Return Discount Pass'
      ]
    },
    {
      id: 'play-dine',
      title: lang === 'ar' ? 'لعب ووجبة لذيذة' : 'PLAY & DINE',
      desc: lang === 'ar'
        ? 'باقة متوازنة تجمع بين ألعاب مختارة ووجبة شهية، مثالية للرحلات الصباحية أو المسائية.'
        : 'A balanced package with exciting play and a delicious meal, perfect for morning or afternoon trips.',
      price: 290,
      badge: lang === 'ar' ? 'أفضل قيمة' : 'Best Value',
      inclusions: lang === 'ar' ? [
        'دخول منطقتي ألعاب من اختياركم (فن بارك أو التحدي أو المغامرات)',
        'وجبة كومبو للأطفال + عصير طازج أو مشروب منعش',
        'مشرف مخصص لتنظيم الدخول وتناول الوجبات',
        'مسابقات جماعية وألعاب حماسية مع جوائز وهدايا'
      ] : [
        'Play Zone Access (Choose 2 Zones: Fun Park, Challenge or Adventure)',
        'Kids Combo Meal & Fresh Juice / Soft Drink',
        'Dedicated Area Host to coordinate arrival and meal',
        'Group Activities & Team-Building Games (with prizes)'
      ],
      summaryInclusions: lang === 'ar' ? [
        'تذاكر دخول منطقتي ألعاب مختارة',
        'وجبة كومبو + عصير طازج أو مشروب',
        'مشرف مخصص وتنظيم مواعيد الوجبات',
        'مسابقات جماعية وجوائز تشجيعية'
      ] : [
        '2 Selected Play Zones Entry Passes',
        'Kids Combo Meal + Fresh Juice / Soft Drink',
        'Dedicated Area Host & Meal Coordination',
        'Group Team-Building Games & Prizes'
      ]
    },
    {
      id: 'play-zone',
      title: lang === 'ar' ? 'تجربة الألعاب الترفيهية' : 'PLAY ZONE EXPERIENCE',
      desc: lang === 'ar'
        ? 'طاقة وحماس بدون توقف! دخول كامل ومفتوح لمناطق الألعاب والأنشطة بدون وجبات.'
        : 'Pure play and energy burn! Full access to games and activities without catering.',
      price: 210,
      badge: lang === 'ar' ? 'اقتصادية وممتعة' : 'Budget Friendly',
      inclusions: lang === 'ar' ? [
        'دخول يوم كامل لجميع مناطق الألعاب الثلاث',
        'صورة جماعية تذكارية للمدرسة أو المؤسسة',
        'مرشد استقبال لتنظيم الحضور وتعليمات السلامة',
        'أساور دخول منسقة لسلامة الأطفال'
      ] : [
        'Full Day Play Zone access across all 3 play zones',
        'Group photo souvenir for the school / organization',
        'Dedicated Group Host for check-in & orientation',
        'Coordinated System and Return Zone Safety Passes'
      ],
      summaryInclusions: lang === 'ar' ? [
        'دخول غير محدود لـ ٣ مناطق ألعاب',
        'صورة تذكارية للمجموعة',
        'مرشد استقبال وإرشادات سلامة',
        'أساور دخول خاصة بالرحلة'
      ] : [
        'Unlimited Play Zone Access across 3 Zones',
        'Commemorative Group Photo Souvenir',
        'Dedicated Check-in Host & Safety Briefing',
        'Coordinated Return Wristbands'
      ]
    }
  ];

  const currentOffer = tripOffers.find((o) => o.id === selectedOfferId) || tripOffers[0];
  const totalPrice = students * currentOffer.price;

  // Age group toggle
  const toggleAgeGroup = (groupId) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  // Format date helper (e.g. 2024-10-20 -> "20 Oct 2024")
  const formatTripDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle final booking submission
  const handleProceedBooking = () => {
    if (!isUserAuthenticated()) {
      if (openModal) {
        openModal('auth-required', {
          action: 'booking',
          onSuccess: () => {
            setIsBookingModalOpen(true);
            setBookingConfirmed(false);
            setModalTab('review');
          }
        });
      }
      return;
    }

    setIsBookingModalOpen(true);
    setBookingConfirmed(false);
    setModalTab('review');
  };

  // Capture Quotation Screenshot
  const handleCaptureScreenshot = async (autoDownload = false) => {
    if (!quotePaperRef.current) return null;
    setIsCapturingScreenshot(true);
    try {
      const canvas = await html2canvas(quotePaperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshotDataUrl(dataUrl);

      if (autoDownload) {
        const link = document.createElement('a');
        link.download = `American-Dream-Trip-${quoteRefNumber}.png`;
        link.href = dataUrl;
        link.click();
      }
      return dataUrl;
    } catch (err) {
      console.error('Error generating quotation screenshot:', err);
      return null;
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  // Copy Screenshot Image to Clipboard
  const handleCopyScreenshot = async () => {
    if (!quotePaperRef.current) return;
    setIsCapturingScreenshot(true);
    try {
      const canvas = await html2canvas(quotePaperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (blob && navigator?.clipboard?.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2200);
        }
      });
    } catch (err) {
      console.error('Error copying screenshot:', err);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  // Handle confirm reservation with screenshot
  const handleConfirmReservation = () => {
    if (!isUserAuthenticated()) {
      setIsBookingModalOpen(false);
      if (openModal) {
        openModal('auth-required', {
          action: 'booking',
          onSuccess: () => {
            setIsBookingModalOpen(true);
            setBookingConfirmed(true);
            setModalTab('quotation');
            triggerConfetti();
          }
        });
      }
      return;
    }

    setBookingConfirmed(true);
    setModalTab('quotation');
    triggerConfetti();
    setTimeout(() => {
      handleCaptureScreenshot(true);
    }, 250);
  };

  // Send reservation via WhatsApp (with screenshot notice)
  const handleSendWhatsApp = async () => {
    if (!screenshotDataUrl && quotePaperRef.current) {
      await handleCaptureScreenshot(true);
    }
    const text = encodeURIComponent(
      lang === 'ar'
        ? `مرحباً أمريكان دريم الإسماعيلية!\n\nأود حجز رحلة جماعية:\n` +
          `• الجهة: ${orgName} (${orgType})\n` +
          `• المنسق المسؤول: ${contactName} (${phone})\n` +
          `• الباقة المختارة: ${currentOffer.title} (${currentOffer.price} ج.م/طالب)\n` +
          `• الحضور: ${students} طالب + ${supervisors} مشرفين\n` +
          `• الموعد: ${formatTripDate(tripDate)} (${shift === 'morning' ? 'فترة صباحية' : 'فترة مسائية'}، الوصول الساعة ${arrivalTime})\n` +
          `• التكلفة التقديرية: ${totalPrice.toLocaleString()} ج.م\n` +
          `• رقم مرجع العرض: ${quoteRefNumber}\n\n📸 (مرفق لقطة شاشة عرض السعر المعتمد). نرجو تأكيد الحجز وإتاحة الموعد.`
        : `Hello American Dream Ismailia!\n\nI would like to book a group trip:\n` +
          `• Organization: ${orgName} (${orgType})\n` +
          `• Coordinator: ${contactName} (${phone})\n` +
          `• Package: ${currentOffer.title} (${currentOffer.price} EGP/student)\n` +
          `• Attendees: ${students} Students + ${supervisors} Supervisors\n` +
          `• Date: ${formatTripDate(tripDate)} (${shift === 'morning' ? 'Morning Shift' : 'Evening Shift'}, Arrival at ${arrivalTime})\n` +
          `• Estimated Total: EGP ${totalPrice.toLocaleString()}\n` +
          `• Quotation Ref: ${quoteRefNumber}\n\n📸 (Booking Quotation Screenshot image is attached). Please confirm our booking and availability.`
    );
    window.open(`https://wa.me/201012345678?text=${text}`, '_blank');
  };

  return (
    <div className="desktop-page desktop-trips-page">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section 
        className="trips-hero-section"
        style={{ backgroundImage: `url('/photo/kid area pic/trip hero.png')` }}
      >
        <div className="trips-hero-overlay" />

        <div className="trips-hero-content">
          {/* Top Pill Badge */}
          <div className="trips-top-pill">
            <img 
              src="/photo/kid area pic/icon/Icon (11)144.png" 
              alt="Group" 
              className="trips-top-pill-icon"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span>
              {lang === 'ar' ? 'الحد الأدنى للمجموعة: ٣٠ طفلاً' : 'MINIMUM GROUP: 30 CHILDREN'}
            </span>
          </div>

          {/* Main Hero Title with Exact Signature Letter Colors */}
          <h1 className="trips-hero-title">
            {lang === 'ar' ? (
              <>
                <span className="t-navy">خطط </span>
                <span className="t-teal">ليومك </span>
                <span className="t-yellow">المثالي </span>
                <br />
                <span className="t-navy">في </span>
                <span className="t-teal">أمريكان </span>
                <span className="t-yellow">دريم</span>
              </>
            ) : (
              <>
                <span className="t-navy">PLAN </span>
                <span className="t-navy">Y</span>
                <span className="t-navy">O</span>
                <span className="t-yellow">U</span>
                <span className="t-navy">R </span>
                <span className="t-teal">PERFECT </span>
                <span className="t-navy">D</span>
                <span className="t-yellow">A</span>
                <span className="t-yellow">Y </span>
                <span className="t-navy">AT</span>
                <br />
                <span className="t-navy">AME</span>
                <span className="t-teal">RIC</span>
                <span className="t-navy">AN </span>
                <span className="t-navy">DR</span>
                <span className="t-yellow">EA</span>
                <span className="t-navy">M</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="trips-hero-subtitle">
            {lang === 'ar'
              ? 'اجمع مدرستك أو حضانتك أو مجموعتك ليوم حافل بالألعاب الحركية، والوجبات اللذيذة، والإطلالة البحرية، وذكريات تدوم للأبد.'
              : 'Bring your school, nursery, or company group for an exhilarating day of active games, chef-crafted meals, water-view thrills, and unforgettable childhood moments.'}
          </p>

          {/* 3 Hero Feature Badges */}
          <div className="trips-hero-features">
            <div className="trips-feature-pill">
              <img 
                src="/photo/kid area pic/icon/Iconddfff.png" 
                alt="Supervisor Guide" 
                className="trips-feature-icon"
              />
              <span>{lang === 'ar' ? 'مشرف مرافق لكل مجموعة' : 'Supervisor Guide Included'}</span>
            </div>

            <div className="trips-feature-pill">
              <img 
                src="/photo/kid area pic/icon/Icon (12)dadd.png" 
                alt="Custom Meal" 
                className="trips-feature-icon"
              />
              <span>{lang === 'ar' ? 'باقات وجبات مخصصة' : 'Custom Meal Packages'}</span>
            </div>

            <div className="trips-feature-pill">
              <img 
                src="/photo/kid area pic/icon/Icon (12).png" 
                alt="Private Reserved Lounges" 
                className="trips-feature-icon"
              />
              <span>{lang === 'ar' ? 'استراحات خاصة محجوزة' : 'Private Reserved Lounges'}</span>
            </div>
          </div>

          {/* Explore / Scroll Down Button */}
          <button 
            type="button" 
            className="trips-hero-scroll-btn"
            onClick={() => {
              const target = document.getElementById('trips-offers-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label={lang === 'ar' ? 'استكشف باقات الرحلات' : 'Explore Trip Offers'}
            title={lang === 'ar' ? 'استكشف باقات الرحلات' : 'Explore Trip Offers'}
          >
            <span>{lang === 'ar' ? 'استكشف باقات الرحلات' : 'Explore Trip Offers'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5" />
              <path d="M7 6l5 5 5-5" />
            </svg>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE YOUR TRIP OFFERS SECTION */}
      {/* ========================================================================= */}
      <section className="trips-offers-section" id="trips-offers-section">
        <div className="desktop-section-container">
          <div className="trips-section-header">
            <h2 className="trips-section-title">
              {lang === 'ar' ? 'اختر باقة رحلتك' : 'CHOOSE YOUR TRIP OFFERS'}
            </h2>
            <p className="trips-section-sub">
              {lang === 'ar'
                ? 'باقات متكاملة تضمن أعلى درجات المتعة والتنظيم بأفضل تكلفة مدروسة.'
                : 'Choose from our curated trip packages, each crafted to provide the best combination of fun, food, and hassle-free coordination.'}
            </p>
          </div>

          <div className="trips-offers-grid">
            {tripOffers.map((offer) => {
              const isSelected = offer.id === selectedOfferId;
              return (
                <div
                  key={offer.id}
                  className={`trip-offer-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedOfferId(offer.id)}
                >
                  {/* Radio Selection Indicator */}
                  <div className="card-radio-row">
                    <div className="card-radio-circle">
                      {isSelected && <div className="card-radio-inner" />}
                    </div>
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="card-title">{offer.title}</h3>
                  <p className="card-desc">{offer.desc}</p>

                  {/* Inclusions Box */}
                  <div className="card-inclusions-box">
                    <div className="card-inclusions-label">
                      {lang === 'ar' ? 'مشتملات الباقة:' : 'PACKAGE INCLUSIONS:'}
                    </div>
                    <ul className="card-inclusions-list">
                      {offer.inclusions.map((item, idx) => (
                        <li key={idx} className="card-inclusion-item">
                          <img 
                            src="/photo/kid area pic/icon/Icon (3).png" 
                            alt="Check" 
                            className="card-inclusion-icon"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Tag Footer */}
                  <div className="card-price-row">
                    <div>
                      <div className="card-price-label">
                        {lang === 'ar' ? 'تبدأ من' : 'Starting From'}
                      </div>
                      <div className="card-price-value">
                        {lang === 'ar' ? `${offer.price} ج.م` : `EGP ${offer.price}`}
                        <span className="card-price-unit">
                          {lang === 'ar' ? ' / طالب' : ' / student'}
                        </span>
                      </div>
                    </div>
                    <span className="card-badge">{offer.badge}</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`card-btn ${isSelected ? 'selected' : 'ghost'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOfferId(offer.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <span>{lang === 'ar' ? 'الباقة المختارة' : 'Selected Offer'}</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </>
                    ) : (
                      <span>{lang === 'ar' ? 'اختيار هذه الباقة' : 'Choose Offer'}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUILD YOUR TRIP SECTION */}
      {/* ========================================================================= */}
      <section className="trips-builder-section" id="build-your-trip">
        <div className="desktop-section-container">
          <div className="trips-section-header">
            <h2 className="trips-section-title">
              {lang === 'ar' ? 'صمم رحلتك واحسب التكلفة' : 'BUILD YOUR TRIP'}
            </h2>
            <p className="trips-section-sub">
              {lang === 'ar'
                ? 'حدد بيانات مدرستك، وأعداد الطلاب، والموعد المناسب لحساب التكلفة وعرض السعر فوراً.'
                : 'Customize your group details, timings, and requirements below for an instant quote and booking confirmation.'}
            </p>
          </div>

          <div className="trips-builder-layout">
            {/* ----------------- LEFT: 3-STEP FORM ----------------- */}
            <div className="trips-steps-col">
              {/* STEP 1: ORGANIZATION DETAILS */}
              <div className="trip-step-card">
                <div className="step-header">
                  <div className="step-icon-wrap">
                    <img 
                      src="/photo/kid area pic/icon/Icon (14).png" 
                      alt="Step 1" 
                      className="step-header-icon"
                    />
                  </div>
                  <div className="step-title-wrap">
                    <h4 className="step-title">
                      {lang === 'ar' ? '١. بيانات المدرسة أو المنظمة' : '1. Organization Details'}
                    </h4>
                    <p className="step-sub">
                      {lang === 'ar'
                        ? 'اكتب اسم الجهة ونوعها وبيانات المنسق المسؤول'
                        : 'Provide your institution name, type and primary coordinator contact'}
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'ar' ? 'اسم المنظمة / المدرسة *' : 'Organization / School Name *'}
                  </label>
                  <div className="input-with-icon">
                    <img 
                      src="/photo/kid area pic/icon/Icon (14)dddddddd.png" 
                      alt="School" 
                      className="input-icon"
                    />
                    <input 
                      type="text" 
                      className="trips-text-input" 
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: مدرسة منارة المستقبل للغات' : 'e.g. Manarat Al-Mostaqbal Language School'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {lang === 'ar' ? 'نوع الجهة *' : 'Organization Type *'}
                  </label>
                  <div className="org-type-pills">
                    {(lang === 'ar'
                      ? ['مدرسة', 'حضانة', 'مركز رعاية', 'نادي شباب', 'أخرى']
                      : ['School', 'Nursery', 'Daycare', 'Youth Club', 'Other']
                    ).map((type, idx) => {
                      const englishTypes = ['School', 'Nursery', 'Daycare', 'Youth Club', 'Other'];
                      const isSelected = orgType === englishTypes[idx] || orgType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          className={`org-type-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setOrgType(type)}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="trips-input-row">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'ar' ? 'اسم منسق الرحلة المسؤول *' : 'Contact Person / Coordinator *'}
                    </label>
                    <div className="input-with-icon">
                      <img 
                        src="/photo/kid area pic/icon/Icon (17).png" 
                        alt="Contact" 
                        className="input-icon"
                      />
                      <input 
                        type="text" 
                        className="trips-text-input" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: عمر عبد الرحمن' : 'e.g. Omar Abdelrahman'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp No. *'}
                    </label>
                    <div className="input-with-icon">
                      <img 
                        src="/photo/kid area pic/icon/Icon (19).png" 
                        alt="Phone" 
                        className="input-icon"
                      />
                      <input 
                        type="tel" 
                        className="trips-text-input" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: ٠١٠١٢٣٤٥٦٧٨' : 'e.g. +20 101 234 5678'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: GROUP DETAILS */}
              <div className="trip-step-card">
                <div className="step-header">
                  <div className="step-icon-wrap">
                    <img 
                      src="/photo/kid area pic/icon/Icon (14)adadada.png" 
                      alt="Step 2" 
                      className="step-header-icon"
                    />
                  </div>
                  <div className="step-title-wrap">
                    <h4 className="step-title">
                      {lang === 'ar' ? '٢. أعداد المجموعة والأعمار' : '2. Tell Us About Your Group'}
                    </h4>
                    <p className="step-sub">
                      {lang === 'ar'
                        ? 'حدد عدد الطلاب والمشرفين والفئات العمرية المشاركة'
                        : 'Select the number of students and supervisors who will attend'}
                    </p>
                  </div>
                </div>

                <div className="steppers-row">
                  {/* Students Counter */}
                  <div className="stepper-card">
                    <div className="stepper-header">
                      <span className="stepper-label">
                        {lang === 'ar' ? 'عدد الطلاب *' : 'NUMBER OF STUDENTS *'}
                      </span>
                      <span className="stepper-badge">
                        {lang === 'ar' ? 'الحد الأدنى ١٥' : 'Min 15 kids'}
                      </span>
                    </div>
                    <div className="stepper-sub">
                      {lang === 'ar' ? 'المشاركون الأساسيون' : 'Paying attendees'}
                    </div>
                    <div className="stepper-control">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => setStudents((s) => Math.max(15, s - 5))}
                        disabled={students <= 15}
                        aria-label="Decrease students"
                      >
                        -
                      </button>
                      <div className="stepper-value-wrap">
                        <span className="stepper-value">{students}</span>
                        <span className="stepper-unit">
                          {lang === 'ar' ? 'طالب' : 'STUDENTS'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => setStudents((s) => s + 5)}
                        aria-label="Increase students"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Supervisors Counter */}
                  <div className="stepper-card">
                    <div className="stepper-header">
                      <span className="stepper-label">
                        {lang === 'ar' ? 'المشرفين' : 'SUPERVISORS'}
                      </span>
                      <span className="stepper-badge">
                        {lang === 'ar' ? '١ مجاناً / ١٥' : '1 : 15 Included'}
                      </span>
                    </div>
                    <div className="stepper-sub">
                      {lang === 'ar' ? 'دخول مجاني للمشرفين' : 'Free entry for teachers'}
                    </div>
                    <div className="stepper-control">
                      <button
                        type="button"
                        className="stepper-btn subtle"
                        onClick={() => {
                          setIsSupervisorsManual(true);
                          setSupervisors((s) => Math.max(1, s - 1));
                        }}
                        disabled={supervisors <= 1}
                        aria-label="Decrease supervisors"
                      >
                        -
                      </button>
                      <div className="stepper-value-wrap">
                        <span className="stepper-value">{supervisors}</span>
                        <span className="stepper-unit">
                          {lang === 'ar' ? 'مشرف' : 'SUPERVISORS'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="stepper-btn subtle"
                        onClick={() => {
                          setIsSupervisorsManual(true);
                          setSupervisors((s) => s + 1);
                        }}
                        aria-label="Increase supervisors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Age Groups Selection */}
                <div className="form-group">
                  <label className="form-label">
                    {lang === 'ar' ? 'الفئات العمرية للطلاب' : 'Student Age Group(s)'}
                    <span className="form-label-note">
                      {lang === 'ar' ? ' (يمكن اختيار أكثر من مرحلة)' : ' (Select all that apply)'}
                    </span>
                  </label>
                  <div className="age-group-pills">
                    {[
                      { id: '3-5', label: lang === 'ar' ? '٣-٥ سنوات (رياض الأطفال / حضانة)' : '3-5 Years (Kindergarten)' },
                      { id: '6-9', label: lang === 'ar' ? '٦-٩ سنوات (ابتدائي - مرحلة أولى)' : '6-9 Years (Primary Lower)' },
                      { id: '10-12', label: lang === 'ar' ? '١٠-١٢ سنة (ابتدائي - مرحلة عليا)' : '10-12 Years (Primary Upper)' },
                      { id: '13-15', label: lang === 'ar' ? '١٣-١٥ سنة (إعدادي)' : '13-15 Years (Prep / Middle)' },
                      { id: '16+', label: lang === 'ar' ? '١٦+ سنة (ثانوي)' : '16+ Years (Secondary)' }
                    ].map((group) => {
                      const isActive = selectedAgeGroups.includes(group.id);
                      return (
                        <button
                          key={group.id}
                          type="button"
                          className={`age-group-btn ${isActive ? 'active' : ''}`}
                          onClick={() => toggleAgeGroup(group.id)}
                        >
                          {isActive && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          <span>{group.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP 3: SCHEDULE & TIMING */}
              <div className="trip-step-card">
                <div className="step-header">
                  <div className="step-icon-wrap">
                    <img 
                      src="/photo/kid area pic/icon/Icon (20).png" 
                      alt="Step 3" 
                      className="step-header-icon"
                    />
                  </div>
                  <div className="step-title-wrap">
                    <h4 className="step-title">
                      {lang === 'ar' ? '٣. الموعد والتوقيت' : '3. When Are You Coming?'}
                    </h4>
                    <p className="step-sub">
                      {lang === 'ar'
                        ? 'حدد تاريخ الزيارة والفترة المفضلة لحضور المجموعة'
                        : 'Select your preferred date and time slot for your visit'}
                    </p>
                  </div>
                </div>

                <div className="trips-input-row">
                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'ar' ? 'تاريخ الرحلة المطلوب *' : 'Preferred Trip Date *'}
                    </label>
                    <div className="input-with-icon">
                      <img 
                        src="/photo/kid area pic/icon/Icon (21).png" 
                        alt="Calendar" 
                        className="input-icon"
                      />
                      <input 
                        type="date" 
                        className="trips-text-input" 
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {lang === 'ar' ? 'فترة الرحلة *' : 'Trip Shift / Time Slot *'}
                    </label>
                    <div className="shift-options-row">
                      <button
                        type="button"
                        className={`shift-option-btn ${shift === 'morning' ? 'active' : ''}`}
                        onClick={() => setShift('morning')}
                      >
                        <span className="shift-time">09:00 AM - 02:00 PM</span>
                        <span className="shift-name">
                          {lang === 'ar' ? 'فترة صباحية (الأفضل للمدارس)' : 'Morning Shift (Best for Schools)'}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`shift-option-btn ${shift === 'evening' ? 'active' : ''}`}
                        onClick={() => setShift('evening')}
                      >
                        <span className="shift-time">03:00 PM - 08:00 PM</span>
                        <span className="shift-name">
                          {lang === 'ar' ? 'فترة مسائية' : 'Evening Shift (Afternoon)'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Arrival Time */}
                <div className="form-group">
                  <label className="form-label">
                    {lang === 'ar' ? 'وقت الوصول المتوقع' : 'Estimated Arrival Time'}
                  </label>
                  <div className="arrival-pills-row">
                    {(shift === 'morning'
                      ? ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM']
                      : ['03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']
                    ).map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`arrival-pill-btn ${arrivalTime === time ? 'active' : ''}`}
                        onClick={() => setArrivalTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- RIGHT: STICKY TRIP SUMMARY ----------------- */}
            <div className="trips-summary-col">
              <div className="trip-summary-card">
                {/* Header */}
                <div className="summary-card-header">
                  <div className="summary-header-left">
                    <img 
                      src="/photo/kid area pic/icon/c vsscscscscsdcsc.png" 
                      alt="Summary Document" 
                      className="summary-header-icon"
                    />
                    <h4 className="summary-header-title">
                      {lang === 'ar' ? 'ملخص حجز الرحلة' : 'YOUR TRIP SUMMARY'}
                    </h4>
                  </div>
                  <div className="summary-live-badge">
                    <span className="summary-live-dot" />
                    <span>{lang === 'ar' ? 'عرض سعر فوري' : 'Live Quote'}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="summary-card-body">
                  {/* Selected Package */}
                  <div className="summary-block">
                    <div className="summary-block-label">
                      {lang === 'ar' ? 'الباقة المختارة' : 'SELECTED PACKAGE'}
                    </div>
                    <div className="summary-pkg-name">{currentOffer.title}</div>
                    <div className="summary-pkg-sub">{currentOffer.desc}</div>
                  </div>

                  {/* Date & Group Size */}
                  <div className="summary-info-grid">
                    <div className="summary-info-box">
                      <div className="summary-info-box-label">
                        {lang === 'ar' ? 'تاريخ الرحلة' : 'TRIP DATE'}
                      </div>
                      <div className="summary-info-box-val">{formatTripDate(tripDate)}</div>
                    </div>
                    <div className="summary-info-box">
                      <div className="summary-info-box-label">
                        {lang === 'ar' ? 'حجم المجموعة' : 'GROUP SIZE'}
                      </div>
                      <div className="summary-info-box-val">
                        {students} {lang === 'ar' ? 'طالب' : 'Students'}
                      </div>
                    </div>
                  </div>

                  {/* Supervisors */}
                  <div className="summary-row-box">
                    <span className="summary-row-label">
                      {lang === 'ar' ? 'المشرفين' : 'SUPERVISORS'}
                    </span>
                    <span className="summary-row-val">
                      <span>
                        {supervisors} {lang === 'ar' ? 'مشرفين مجاناً' : 'Free Included'}
                      </span>
                      <span className="summary-tiny-badge">
                        {lang === 'ar' ? '١ مجاناً / ١٥ طالباً' : '1 Free / 15 Kids'}
                      </span>
                    </span>
                  </div>

                  {/* Time Slot */}
                  <div className="summary-row-box">
                    <span className="summary-row-label">
                      {lang === 'ar' ? 'الفترة' : 'TIME SLOT'}
                    </span>
                    <span className="summary-row-val">
                      {shift === 'morning'
                        ? (lang === 'ar' ? 'صباحية (٠٩:٠٠ ص - ٠٢:٠٠ م)' : '09:00 AM - 02:00 PM (Morning)')
                        : (lang === 'ar' ? 'مسائية (٠٣:٠٠ م - ٠٨:٠٠ م)' : '03:00 PM - 08:00 PM (Evening)')}
                    </span>
                  </div>

                  {/* Included Services */}
                  <div className="summary-block">
                    <div className="summary-block-label">
                      {lang === 'ar' ? 'الخدمات المشمولة' : 'INCLUDED SERVICES'}
                    </div>
                    <ul className="summary-checklist">
                      {currentOffer.summaryInclusions.map((item, idx) => (
                        <li key={idx} className="summary-checklist-item">
                          <svg className="summary-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Date & Time Confirmation */}
                  <div className="summary-row-box">
                    <span className="summary-row-label">
                      {lang === 'ar' ? 'الموعد والوصول' : 'DATE & TIME'}
                    </span>
                    <span className="summary-row-val">
                      {formatTripDate(tripDate)} {lang === 'ar' ? 'في' : 'at'} {arrivalTime}
                    </span>
                  </div>

                  {/* Price Calculation Box */}
                  <div className="summary-price-box">
                    <div className="summary-calc-row">
                      <span>{lang === 'ar' ? 'سعر الطالب' : 'Price per Student'}</span>
                      <span className="summary-calc-val">
                        {lang === 'ar' ? `${currentOffer.price} ج.م` : `EGP ${currentOffer.price}`}
                      </span>
                    </div>
                    <div className="summary-calc-row">
                      <span>{lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</span>
                      <span className="summary-calc-val">x {students}</span>
                    </div>
                    <div className="summary-calc-row">
                      <span>{lang === 'ar' ? 'المشرفين' : 'Supervisors'}</span>
                      <span className="summary-calc-val" style={{ color: '#10b981' }}>
                        {lang === 'ar' ? `مجاناً (${supervisors} مشمولين)` : `FREE (${supervisors} Included)`}
                      </span>
                    </div>

                    <div className="summary-price-divider" />

                    <div className="summary-total-row">
                      <span className="summary-total-label">
                        {lang === 'ar' ? 'التكلفة الإجمالية التقديرية' : 'Estimated Total'}
                      </span>
                      <span className="summary-total-val">
                        {lang === 'ar' ? `${totalPrice.toLocaleString()} ج.م` : `EGP ${totalPrice.toLocaleString()}`}
                      </span>
                    </div>

                    <p className="summary-disclaimer">
                      {lang === 'ar'
                        ? 'السعر يشمل جميع الضرائب وأساور الدخول والوجبات والمرشد المرافق.'
                        : 'Price is inclusive of all taxes, entry wristbands, meal tokens & group host.'}
                    </p>
                  </div>

                  {/* Big CTA Button */}
                  <button 
                    className="summary-cta-btn"
                    onClick={handleProceedBooking}
                  >
                    <span>{lang === 'ar' ? 'متابعة وتأكيد الحجز' : 'PROCEED TO BOOKING'}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1={lang === 'ar' ? '19' : '5'} y1="12" x2={lang === 'ar' ? '5' : '19'} y2="12" />
                      <polyline points={lang === 'ar' ? '12 19 5 12 12 5' : '12 5 19 12 12 19'} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE BOOKING & QUOTATION MODAL */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="trips-modal-backdrop" onClick={() => setIsBookingModalOpen(false)}>
          <div className="trips-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="trips-modal-header">
              <h3 className="trips-modal-title">
                <img 
                  src="/photo/logo/logo nav bar and footer.png" 
                  alt="Logo" 
                  style={{ height: '32px', width: 'auto' }} 
                />
                <span>
                  {lang === 'ar' ? 'حجز رحلات المدارس والمجموعات' : 'School & Group Trip Reservation'}
                </span>
              </h3>
              <button 
                className="trips-modal-close" 
                onClick={() => setIsBookingModalOpen(false)}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close Modal'}
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="trips-modal-tabs">
              <button 
                className={`trips-tab-btn ${modalTab === 'review' ? 'active' : ''}`}
                onClick={() => setModalTab('review')}
              >
                {lang === 'ar' ? '١. مراجعة البيانات' : '1. Review Details'}
              </button>
              <button 
                className={`trips-tab-btn ${modalTab === 'quotation' ? 'active' : ''}`}
                onClick={() => setModalTab('quotation')}
              >
                {lang === 'ar' ? '٢. عرض السعر المعتمد (صورة)' : '2. Official Quotation (Screenshot)'}
              </button>
              <button 
                className={`trips-tab-btn ${modalTab === 'whatsapp' ? 'active' : ''}`}
                onClick={() => setModalTab('whatsapp')}
              >
                {lang === 'ar' ? '٣. تأكيد عبر واتساب' : '3. WhatsApp Confirmation'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="trips-modal-body">
              {bookingConfirmed && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}>
                      ✓
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', color: '#065f46', fontSize: '1rem', fontWeight: 800 }}>
                        {lang === 'ar'
                          ? 'تم تأكيد طلب الحجز مع لقطة الشاشة بنجاح!'
                          : 'Reservation Request Confirmed with Screenshot!'}
                      </h4>
                      <p style={{ margin: 0, color: '#047857', fontSize: '0.84rem' }}>
                        {lang === 'ar'
                          ? `رقم المرجع: ${quoteRefNumber}. تم إصدار لقطة شاشة عرض السعر الرسمي لـ ${contactName} (${phone}).`
                          : `Reference ID: ${quoteRefNumber}. Official Quotation Screenshot generated for ${contactName} (${phone}).`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="modal-btn outline"
                      style={{ fontSize: '0.78rem', padding: '8px 14px', background: '#ffffff', color: '#065f46', borderColor: '#10b981' }}
                      onClick={() => handleCaptureScreenshot(true)}
                      disabled={isCapturingScreenshot}
                    >
                      <Download size={14} />
                      <span>
                        {isCapturingScreenshot
                          ? (lang === 'ar' ? 'جاري التقاط...' : 'Capturing...')
                          : (lang === 'ar' ? 'تحميل الصورة' : 'Download Screenshot')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="modal-btn whatsapp"
                      style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                      onClick={handleSendWhatsApp}
                    >
                      <img 
                        src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                        alt="WhatsApp" 
                        style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                      />
                      <span>{lang === 'ar' ? 'إرسال عبر واتساب' : 'Send with WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: REVIEW DETAILS */}
              {modalTab === 'review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    <div className="quote-details-box">
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        {lang === 'ar' ? 'المؤسسة' : 'INSTITUTION'}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a3342' }}>{orgName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>{orgType}</div>
                    </div>

                    <div className="quote-details-box">
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        {lang === 'ar' ? 'المنسق المسؤول' : 'COORDINATOR'}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a3342' }}>{contactName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>{phone}</div>
                    </div>

                    <div className="quote-details-box">
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        {lang === 'ar' ? 'الموعد' : 'SCHEDULE'}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a3342' }}>
                        {formatTripDate(tripDate)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        {shift === 'morning'
                          ? (lang === 'ar' ? 'صباحية (٠٩:٠٠ - ١٤:٠٠)' : 'Morning (09:00 - 14:00)')
                          : (lang === 'ar' ? 'مسائية (١٥:٠٠ - ٢٠:٠٠)' : 'Evening (15:00 - 20:00)')}{' '}
                        • {lang === 'ar' ? 'الوصول' : 'Arrival'} {arrivalTime}
                      </div>
                    </div>

                    <div className="quote-details-box">
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        {lang === 'ar' ? 'الأعداد' : 'HEADCOUNT'}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a3342' }}>
                        {students} {lang === 'ar' ? 'طالب' : 'Students'} + {supervisors}{' '}
                        {lang === 'ar' ? 'مشرف مجاناً' : 'Free Supervisors'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        {lang === 'ar' ? 'الأعمار:' : 'Ages:'} {selectedAgeGroups.join(', ') || (lang === 'ar' ? 'أعمار متنوعة' : 'Mixed Ages')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a3342' }}>
                        {lang === 'ar' ? 'الباقة:' : 'Package:'} {currentOffer.title}
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#088395' }}>
                        {lang === 'ar' ? `${totalPrice.toLocaleString()} ج.م` : `EGP ${totalPrice.toLocaleString()}`}
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: lang === 'ar' ? 0 : '18px', paddingRight: lang === 'ar' ? '18px' : 0, color: '#475569', fontSize: '0.84rem' }}>
                      {currentOffer.inclusions.map((inc, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: OFFICIAL QUOTATION SCREENSHOT */}
              {modalTab === 'quotation' && (
                <div>
                  <div className="quote-screenshot-toolbar">
                    <div className="quote-toolbar-tag">
                      <Camera size={16} strokeWidth={2.2} />
                      <span>
                        {lang === 'ar' ? 'بطاقة لقطة شاشة عرض السعر الرسمي' : 'Official Booking Screenshot Card'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="quote-screenshot-action-btn"
                        onClick={handleCopyScreenshot}
                        disabled={isCapturingScreenshot}
                      >
                        {copySuccess ? (
                          <>
                            <Check size={14} strokeWidth={2.5} />
                            <span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} strokeWidth={2.2} />
                            <span>{lang === 'ar' ? 'نسخ الصورة' : 'Copy Image'}</span>
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="quote-screenshot-action-btn primary"
                        onClick={() => handleCaptureScreenshot(true)}
                        disabled={isCapturingScreenshot}
                      >
                        <Download size={14} strokeWidth={2.2} />
                        <span>
                          {isCapturingScreenshot
                            ? (lang === 'ar' ? 'جاري الالتقاط...' : 'Capturing...')
                            : (lang === 'ar' ? 'تحميل الصورة (PNG)' : 'Download Screenshot (PNG)')}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="quote-paper" ref={quotePaperRef} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="quote-header">
                      <div>
                        <img 
                          src="/photo/logo/logo nav bar and footer.png" 
                          alt="American Dream Ismailia" 
                          className="quote-logo" 
                        />
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          {lang === 'ar' ? 'طريق البلاجات، الإسماعيلية، مصر' : 'Suez Canal Promenade, Ismailia, Egypt'}
                        </div>
                      </div>
                      <div className="quote-meta">
                        <div className="quote-ref">
                          {lang === 'ar' ? `عرض سعر رسمي: #${quoteRefNumber}` : `QUOTATION SCREENSHOT: #${quoteRefNumber}`}
                        </div>
                        <div className="quote-date">
                          {lang === 'ar' ? `التاريخ: ${new Date().toLocaleDateString('ar-EG')}` : `Date: ${new Date().toLocaleDateString('en-GB')}`}
                        </div>
                        <div className="quote-date">
                          {lang === 'ar' ? `ساري حتى: ${formatTripDate(tripDate)}` : `Valid Until: ${formatTripDate(tripDate)}`}
                        </div>
                      </div>
                    </div>

                    <div className="quote-details-grid">
                      <div className="quote-details-box">
                        <strong>{lang === 'ar' ? 'بيانات الجهة:' : 'Client Details:'}</strong>
                        <div>{lang === 'ar' ? 'المؤسسة:' : 'Institution:'} {orgName}</div>
                        <div>{lang === 'ar' ? 'المنسق:' : 'Coordinator:'} {contactName}</div>
                        <div>{lang === 'ar' ? 'الهاتف:' : 'Contact:'} {phone}</div>
                      </div>
                      <div className="quote-details-box">
                        <strong>{lang === 'ar' ? 'جدول الزيارة:' : 'Trip Schedule:'}</strong>
                        <div>{lang === 'ar' ? 'تاريخ الزيارة:' : 'Visit Date:'} {formatTripDate(tripDate)}</div>
                        <div>
                          {lang === 'ar' ? 'الفترة:' : 'Time Shift:'}{' '}
                          {shift === 'morning'
                            ? (lang === 'ar' ? 'فترة صباحية (٠٩:٠٠ - ١٤:٠٠)' : 'Morning Shift (09:00 - 14:00)')
                            : (lang === 'ar' ? 'فترة مسائية (١٥:٠٠ - ٢٠:٠٠)' : 'Evening Shift (15:00 - 20:00)')}
                        </div>
                        <div>{lang === 'ar' ? 'وقت الوصول:' : 'Target Arrival:'} {arrivalTime}</div>
                      </div>
                    </div>

                    <table className="quote-table">
                      <thead>
                        <tr>
                          <th>{lang === 'ar' ? 'بيان البند والخدمة' : 'Item Description'}</th>
                          <th>{lang === 'ar' ? 'العدد' : 'Qty'}</th>
                          <th>{lang === 'ar' ? 'السعر' : 'Rate'}</th>
                          <th>{lang === 'ar' ? 'الإجمالي' : 'Amount'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>{currentOffer.title}</strong>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              {lang === 'ar'
                                ? 'دخول كامل + وجبات + مرشد خاص + أساور أمان'
                                : 'Full access + meal tokens + guide host + safety passes'}
                            </div>
                          </td>
                          <td>{students}</td>
                          <td>{lang === 'ar' ? `${currentOffer.price} ج.م` : `EGP ${currentOffer.price}`}</td>
                          <td>{lang === 'ar' ? `${(students * currentOffer.price).toLocaleString()} ج.م` : `EGP ${(students * currentOffer.price).toLocaleString()}`}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{lang === 'ar' ? 'تذاكر المشرفين المرافقين (مجاناً)' : 'Complimentary Supervisors Pass'}</strong>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              {lang === 'ar'
                                ? 'استراحة خاصة وضيافة للمشرفين والمدرسين'
                                : 'Dedicated lounge seating & hospitality access'}
                            </div>
                          </td>
                          <td>{supervisors}</td>
                          <td>{lang === 'ar' ? '٠ ج.م' : 'EGP 0'}</td>
                          <td>{lang === 'ar' ? 'مجاناً' : 'FREE'}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>{lang === 'ar' ? 'رسوم الأمان والسلامة' : 'Safety & Sanitation Fee'}</strong>
                          </td>
                          <td>1</td>
                          <td>{lang === 'ar' ? '٠ ج.م' : 'EGP 0'}</td>
                          <td>{lang === 'ar' ? 'مشمولة' : 'INCLUDED'}</td>
                        </tr>
                        <tr className="quote-total-row">
                          <td colSpan="3" style={{ textAlign: lang === 'ar' ? 'left' : 'right', paddingRight: lang === 'ar' ? 0 : '20px', paddingLeft: lang === 'ar' ? '20px' : 0 }}>
                            {lang === 'ar' ? 'الإجمالي النهائي (ج.م):' : 'Grand Total (EGP):'}
                          </td>
                          <td>{lang === 'ar' ? `${totalPrice.toLocaleString()} ج.م` : `EGP ${totalPrice.toLocaleString()}`}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="quote-footer">
                      <div>
                        {lang === 'ar'
                          ? 'عرض سعر رسمي معتمد • صادر من مكتب رحلات أمريكان دريم الإسماعيلية'
                          : 'Official Booking Screenshot • Verified by American Dream Group Desk'}
                      </div>
                      <div>
                        {lang === 'ar' ? 'توقيع الإدارة والاعتماد: _______________________' : 'Authorized Signature: _______________________'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP DISPATCH */}
              {modalTab === 'whatsapp' && (
                <div style={{
                  background: '#f0fdf4',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#25d366',
                    color: '#ffffff',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}>
                    <img 
                      src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                      alt="WhatsApp" 
                      style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                    />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: '0 0 6px 0' }}>
                    {lang === 'ar' ? 'حجز فوري وتأكيد عبر واتساب' : 'Instant WhatsApp Reservation'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#15803d', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                    {lang === 'ar'
                      ? 'تواصل مباشرة مع مكتب حجوزات الرحلات على واتساب. سيتم مشاركة لقطة شاشة عرض السعر وبيانات حجزك فوراً!'
                      : 'Connect directly with our Group Bookings Desk on WhatsApp. Your customized quotation screenshot and details will be shared automatically!'}
                  </p>
                  <button 
                    className="modal-btn whatsapp" 
                    style={{ margin: '0 auto', padding: '12px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    onClick={handleSendWhatsApp}
                  >
                    <img 
                      src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                      alt="WhatsApp" 
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    />
                    <span>{lang === 'ar' ? 'فتح محادثة واتساب' : 'Open WhatsApp Chat'}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1={lang === 'ar' ? '19' : '5'} y1="12" x2={lang === 'ar' ? '5' : '19'} y2="12" />
                      <polyline points={lang === 'ar' ? '12 19 5 12 12 5' : '12 5 19 12 12 19'} />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="trips-modal-header" style={{ borderRadius: '0 0 24px 24px', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {lang === 'ar' ? 'عرض السعر التقديري:' : 'Estimated Quote:'}{' '}
                <strong style={{ color: '#088395' }}>
                  {lang === 'ar' ? `${totalPrice.toLocaleString()} ج.م` : `EGP ${totalPrice.toLocaleString()}`}
                </strong>
              </div>

              <div className="modal-actions-row" style={{ border: 'none', padding: 0 }}>
                {modalTab === 'quotation' && (
                  <button 
                    className="modal-btn outline" 
                    onClick={() => handleCaptureScreenshot(true)}
                    disabled={isCapturingScreenshot}
                  >
                    <Camera size={16} />
                    <span>
                      {isCapturingScreenshot
                        ? (lang === 'ar' ? 'جاري الالتقاط...' : 'Capturing...')
                        : (lang === 'ar' ? 'تحميل الصورة' : 'Download Screenshot')}
                    </span>
                  </button>
                )}
                
                <button className="modal-btn whatsapp" onClick={handleSendWhatsApp}>
                  <img 
                    src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                    alt="WhatsApp" 
                    style={{ width: '18px', height: '18px', objectFit: 'contain', display: 'inline-block' }}
                  />
                  <span>{lang === 'ar' ? 'إرسال إلى واتساب' : 'Send to WhatsApp'}</span>
                </button>

                {!bookingConfirmed ? (
                  <button className="modal-btn primary" onClick={handleConfirmReservation}>
                    {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Reservation'}
                  </button>
                ) : (
                  <button className="modal-btn primary" onClick={() => setIsBookingModalOpen(false)}>
                    {lang === 'ar' ? 'تم' : 'Done'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
