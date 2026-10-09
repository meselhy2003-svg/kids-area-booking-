import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Smile, 
  Trees, 
  Users, 
  Sun, 
  Sunset, 
  UtensilsCrossed, 
  Coffee, 
  Armchair, 
  Calendar, 
  Clock, 
  FileText, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  X, 
  Sparkles,
  Phone,
  MapPin
} from 'lucide-react';
import { isUserAuthenticated } from '../../api/authService';
import './BookTablePage.css';

// 6 DINING SECTORS / AREAS (STEP 1)
const DINING_AREAS = [
  {
    id: 'family-1',
    nameEn: 'Family 1',
    nameAr: 'العائلات ١',
    descEn: 'Close to kids soft play area, highchairs available, central location',
    descAr: 'قريب من منطقة ألعاب الأطفال مع كراسي طعام للأطفال وموقع مركزي مريح',
    icon: Smile,
    photos: [
      { src: '/photo/kid area pic/vibe_family_pizza.png', title: 'Family Dining Zone' },
      { src: '/photo/kid area pic/Family birthday party celebration with cake.png', title: 'Celebration Booth' },
      { src: '/photo/kid area pic/vibe_coffee_latte.png', title: 'Beverage Bar' },
      { src: '/photo/kid area pic/dish_pizza.png', title: 'Artisanal Pizza' }
    ]
  },
  {
    id: 'family-2',
    nameEn: 'Family 2',
    nameAr: 'العائلات ٢',
    descEn: 'Quiet family booths with garden pergola view and spacious seating',
    descAr: 'جلسات عائلية هادئة ومريحة تطل على برجولة الحديقة ومقاعد رحبة',
    icon: Trees,
    photos: [
      { src: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png', title: 'Garden Terrace' },
      { src: '/photo/kid area pic/vibe_family_pizza.png', title: 'Dining Setup' },
      { src: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png', title: 'Chef Specialties' },
      { src: '/photo/kid area pic/vibe_sunset_candle_table.png', title: 'Sunset View' }
    ]
  },
  {
    id: 'family-3',
    nameEn: 'Family 3',
    nameAr: 'العائلات ٣',
    descEn: 'Large group family long tables near outdoor green courtyard',
    descAr: 'طاولات طويلة للمجموعات والعائلات الكبيرة بالقرب من الفناء الأخضر المفتوح',
    icon: Users,
    photos: [
      { src: '/photo/kid area pic/Item 2_ Vertical Dining & Floral Setup.png', title: 'Large Group Tables' },
      { src: '/photo/kid area pic/roof_photo_3.png', title: 'Outdoor Gathering' },
      { src: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png', title: 'Courtyard Seating' },
      { src: '/photo/kid area pic/vibe_family_pizza.png', title: 'Family Feast' }
    ]
  },
  {
    id: 'roof',
    nameEn: 'Roof',
    nameAr: 'الرووف البانورامي',
    descEn: 'Panoramic sunset views of the Suez Canal promenade, open breeze',
    descAr: 'إطلالة بانورامية ساحرة على غروب قناة السويس وممشى القناة في الهواء الطلق',
    icon: Sunset,
    isPopular: true,
    photos: [
      { src: '/photo/kid area pic/roof_photo_1.png', title: 'Panoramic Terrace Pergola' },
      { src: '/photo/kid area pic/roof_photo_2.png', title: 'Sunset Candlelit Setup' },
      { src: '/photo/kid area pic/roof_photo_3.png', title: 'Seaside Family Sunset' },
      { src: '/photo/kid area pic/roof_photo_4.png', title: 'Evening Ambient Lounge' }
    ]
  },
  {
    id: 'indoor',
    nameEn: 'Indoor',
    nameAr: 'الصالون الداخلي المكيف',
    descEn: 'Climate-controlled salon & lounge with warm ambient lighting',
    descAr: 'صالون ولاونج داخلي مكيف بالكامل مع إضاءة دافئة وديكورات مريحة وراقية',
    icon: UtensilsCrossed,
    photos: [
      { src: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png', title: 'Indoor Grand Hall' },
      { src: '/photo/kid area pic/Item 2_ Vertical Dining & Floral Setup.png', title: 'Salon Dining' },
      { src: '/photo/kid area pic/vibe_coffee_latte.png', title: 'Coffee Bar' },
      { src: '/photo/kid area pic/vibe_sunset_candle_table.png', title: 'Private Lounge' }
    ]
  },
  {
    id: 'relaxation',
    nameEn: 'Relaxation Area',
    nameAr: 'منطقة الاسترخاء والكافيه',
    descEn: 'Cozy lounge banquettes, fountain soundscape, coffee & dessert specialty',
    descAr: 'أرائك لاونج وثيرة مع صوت خرير النافورة وقهوة مختصة وحلويات غربية فاخرة',
    icon: Coffee,
    photos: [
      { src: '/photo/kid area pic/vibe_coffee_latte.png', title: 'Artisan Latte' },
      { src: '/photo/kid area pic/roof_photo_4.png', title: 'Relaxation Banquettes' },
      { src: '/photo/kid area pic/dish_cake.png', title: 'Signature Cakes' },
      { src: '/photo/kid area pic/dish_cooler.png', title: 'Sunset Drinks' }
    ]
  }
];

// TABLE SIZES (STEP 2)
const TABLE_SIZES = [
  { id: '2', labelEn: '2 Seats', labelAr: 'مقعدان (شخصين)' },
  { id: '4', labelEn: '4 Seats', labelAr: '٤ مقاعد (أشخاص)' },
  { id: '6', labelEn: '6 Seats', labelAr: '٦ مقاعد' },
  { id: '8', labelEn: '8 Seats', labelAr: '٨ مقاعد' },
  { id: '10+', labelEn: '10+ Seats', labelAr: '+١٠ مقاعد' }
];

// TIME SLOTS (STEP 2)
const TIME_SLOTS = [
  { id: '1:00 PM', time: '1:00 PM', timeAr: '٠١:٠٠ م', tagEn: 'Lunch', tagAr: 'الغداء' },
  { id: '3:30 PM', time: '3:30 PM', timeAr: '٠٣:٣٠ م', tagEn: 'Late Lunch', tagAr: 'غداء متأخر' },
  { id: '6:00 PM', time: '6:00 PM', timeAr: '٠٦:٠٠ م', tagEn: '+ Sunset View', tagAr: '+ إطلالة الغروب', isSunset: true },
  { id: '7:30 PM', time: '7:30 PM', timeAr: '٠٧:٣٠ م', tagEn: 'Dinner', tagAr: 'العشاء' },
  { id: '9:00 PM', time: '9:00 PM', timeAr: '٠٩:٠٠ م', tagEn: 'Late Dinner', tagAr: 'عشاء متأخر' },
  { id: '10:30 PM', time: '10:30 PM', timeAr: '١٠:٣٠ م', tagEn: 'Lounge Hours', tagAr: 'سهرة اللاونج' }
];

export default function BookTablePage({ 
  onBack, 
  setActiveTab, 
  openModal, 
  lang = 'ar' 
}) {
  // Form Selections matching screenshot defaults
  const [selectedAreaId, setSelectedAreaId] = useState('roof');
  const [galleryTabId, setGalleryTabId] = useState('roof');
  const [selectedSeats, setSelectedSeats] = useState('4');
  const [diningDate, setDiningDate] = useState('2026-10-24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('6:00 PM');
  const [specialRequests, setSpecialRequests] = useState('');

  // Modals & Confirmation States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [bookingRef, setBookingRef] = useState('');

  const dateInputRef = useRef(null);

  // Active Area Objects
  const activeArea = DINING_AREAS.find(a => a.id === selectedAreaId) || DINING_AREAS[3];
  const galleryArea = DINING_AREAS.find(a => a.id === galleryTabId) || DINING_AREAS[3];

  // Sync Area Selection with Gallery Tab
  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setGalleryTabId(areaId);
  };

  // Formatted Date String matching screenshot "Friday, Oct 24, 2026"
  const getFormattedDate = () => {
    try {
      const d = new Date(diningDate + 'T12:00:00');
      if (isNaN(d.getTime())) return diningDate;
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch {
      return diningDate;
    }
  };

  // Submit Handler: Authenticated Check & Confetti Celebration
  const handleSubmitBooking = (e) => {
    e.preventDefault();

    // 1. Guest Interception Check
    if (!isUserAuthenticated()) {
      if (openModal) {
        openModal('auth-required', {
          action: 'table-booking',
          returnType: 'tableBooking',
          offerData: {
            title: `Table in ${activeArea.nameEn}`,
            area: activeArea.nameEn,
            seats: selectedSeats,
            time: selectedTimeSlot,
            date: getFormattedDate()
          },
          onSuccess: () => {
            const code = `AD-REST-${Math.floor(1000 + Math.random() * 9000)}`;
            setBookingRef(code);
            setShowSuccessModal(true);
            try {
              confetti({
                particleCount: 110,
                spread: 80,
                origin: { y: 0.55 },
                colors: ['#00a9c3', '#f59e0b', '#10b981', '#0c212b']
              });
            } catch {}
          }
        });
      }
      return;
    }

    // 2. Authenticated Flow
    const code = `AD-REST-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(code);
    setShowSuccessModal(true);

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#00a9c3', '#f59e0b', '#10b981', '#ffffff']
      });
    } catch {}
  };

  // Share to WhatsApp
  const handleShareToWhatsApp = () => {
    const phone = '201012345678';
    const textAr = `مرحباً مطعم وكافيه أمريكان دريم، أود تأكيد حجز الطاولة الخاص بي:%0A- كود الحجز: ${bookingRef}%0A- المنطقة: ${activeArea.nameAr}%0A- عدد المقاعد: ${selectedSeats}%0A- التاريخ: ${getFormattedDate()}%0A- الموعد: ${selectedTimeSlot}%0A- ملاحظات: ${specialRequests || 'لا توجد'}%0Aشكراً جزيلاً!`;
    const textEn = `Hello American Dream Restaurant, I would like to confirm my table reservation:%0A- Booking Ref: ${bookingRef}%0A- Area: ${activeArea.nameEn}%0A- Table: ${selectedSeats} Seats%0A- Date: ${getFormattedDate()}%0A- Time: ${selectedTimeSlot}%0A- Special Notes: ${specialRequests || 'None'}%0AThank you!`;
    const text = lang === 'ar' ? textAr : textEn;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className={`book-table-root ${lang === 'ar' ? 'lang-ar font-alexandria' : 'lang-en'}`}>
      <div className="book-table-container">

        {/* TOP BREADCRUMB / BACK BUTTON */}
        <div className="book-table-top-bar">
          <button 
            type="button" 
            className="book-table-back-btn"
            onClick={onBack || (() => setActiveTab && setActiveTab('restaurant'))}
            title={lang === 'ar' ? 'العودة إلى صفحة المطعم والكافيه' : 'Back to Restaurant & Cafe'}
          >
            {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            <span>{lang === 'ar' ? 'العودة إلى صفحة المطعم والكافيه' : 'Back to Restaurant & Cafe'}</span>
          </button>
        </div>

        {/* HERO TITLE & SUBTITLE */}
        <header className="book-table-hero-header">
          <h1 className="book-table-main-title">
            {lang === 'ar' ? (
              <>
                <span className="title-navy">احجز </span>
                <span className="title-orange">طاولتك </span>
                <span className="title-cyan">المفضلة</span>
              </>
            ) : (
              <>
                <span className="title-navy">BO</span>
                <span className="title-cyan">OK </span>
                <span className="title-orange">A </span>
                <span className="title-cyan">TA</span>
                <span className="title-navy">B</span>
                <span className="title-orange">L</span>
                <span className="title-gold">E</span>
              </>
            )}
          </h1>
          <p className="book-table-hero-subtitle">
            {lang === 'ar'
              ? 'اختر منطقتك المفضلة، حدد طاولتك، واستمتع بأجمل اللحظات.'
              : 'Choose your area, pick your table, and enjoy the moment'}
          </p>
        </header>

        {/* ========================================================================= */}
        {/* CARD 1: STEP 1 — CHOOSE YOUR AREA */}
        {/* ========================================================================= */}
        <section className="book-table-section-card">
          <div className="step-card-header">
            <div className="step-number-circle">1</div>
            <div className="step-title-group">
              <h2 className="step-card-title">
                {lang === 'ar' ? (
                  <>
                    <span className="title-navy">الخطوة الأولى — </span>
                    <span className="title-cyan">اختر </span>
                    <span className="title-orange">منطقتك </span>
                    <span className="title-cyan">المفضلة</span>
                  </>
                ) : (
                  <>
                    <span className="title-navy">STEP 1 — </span>
                    <span className="title-cyan">CHOOSE </span>
                    <span className="title-orange">YOUR </span>
                    <span className="title-cyan">AREA</span>
                  </>
                )}
              </h2>
              <p className="step-card-subtitle">
                {lang === 'ar'
                  ? 'حدد جلستك المفضلة عبر قطاعات تناول الطعام الداخلية والخارجية الخلابة'
                  : 'Select your preferred setting across our scenic indoor and outdoor dining sectors'}
              </p>
            </div>
          </div>

          {/* 6 Areas Grid (2 columns x 3 rows) */}
          <div className="dining-areas-grid">
            {DINING_AREAS.map((area) => {
              const isSelected = selectedAreaId === area.id;
              const AreaIcon = area.icon;

              return (
                <div 
                  key={area.id}
                  className={`dining-area-item ${isSelected ? 'active-area' : ''}`}
                  onClick={() => handleSelectArea(area.id)}
                >
                  <div className="area-item-top">
                    <div className="area-title-wrap">
                      <AreaIcon size={18} className={`area-icon ${isSelected ? 'active' : ''}`} />
                      <span className={`area-name ${isSelected ? 'active' : ''}`}>
                        {lang === 'ar' ? area.nameAr : area.nameEn}
                      </span>
                    </div>

                    {/* Radio Indicator */}
                    <div className={`area-radio-circle ${isSelected ? 'active' : ''}`}>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </div>

                  <p className="area-item-desc">
                    {lang === 'ar' ? area.descAr : area.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARD 2: EXPLORE AREAS & AMBIANCE */}
        {/* ========================================================================= */}
        <section className="book-table-section-card">
          <div className="ambiance-header-row">
            <div className="ambiance-title-group">
              <h2 className="ambiance-title">
                {lang === 'ar' ? (
                  <>
                    <span className="title-navy">استكشف </span>
                    <span className="title-orange">الأجواء </span>
                    <span className="title-cyan">والإطلالات</span>
                  </>
                ) : (
                  <>
                    <span className="title-navy">EXP</span>
                    <span className="title-orange">LORE </span>
                    <span className="title-cyan">AREAS </span>
                    <span className="title-navy">&amp; </span>
                    <span className="title-cyan">AMBIANCE</span>
                  </>
                )}
              </h2>
              <p className="ambiance-subtitle">
                {lang === 'ar'
                  ? 'شاهد الأجواء الحالية، وتجهيزات الطاولات، والإطلالات المائية لكل منطقة.'
                  : 'Preview current ambiance, table setups, and waterfront views for each zone.'}
              </p>
            </div>

            {/* Area Filter Tabs */}
            <div className="ambiance-tabs-list">
              {DINING_AREAS.map((area) => {
                const isActive = galleryTabId === area.id;

                return (
                  <button
                    key={area.id}
                    type="button"
                    className={`ambiance-tab-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setGalleryTabId(area.id);
                      setSelectedAreaId(area.id);
                    }}
                  >
                    <span>{lang === 'ar' ? area.nameAr : area.nameEn}</span>
                    {isActive && (
                      <span className="tab-active-label">
                        {lang === 'ar' ? ' (نشط)' : ' (Active)'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Photos 2x2 Grid */}
          <div className="ambiance-photos-grid">
            {galleryArea.photos.map((photo, idx) => (
              <div 
                key={idx} 
                className="ambiance-photo-card"
                onClick={() => setLightboxPhoto(photo)}
                title={lang === 'ar' ? 'اضغط لتكبير الصورة' : 'Click to view photo'}
              >
                <img 
                  src={photo.src} 
                  alt={photo.title} 
                  className="ambiance-img"
                  onError={(e) => {
                    e.currentTarget.src = '/photo/kid area pic/vibe_sunset_candle_table.png';
                  }}
                />
                <div className="ambiance-photo-overlay">
                  <span className="ambiance-photo-caption">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARD 3: STEP 2 — TABLE DETAILS */}
        {/* ========================================================================= */}
        <section className="book-table-section-card">
          <div className="step-card-header">
            <div className="step-number-circle">2</div>
            <div className="step-title-group">
              <h2 className="step-card-title">
                {lang === 'ar' ? (
                  <>
                    <span className="title-navy">الخطوة الثانية — </span>
                    <span className="title-cyan">تفاصيل </span>
                    <span className="title-orange">الطاولة</span>
                  </>
                ) : (
                  <>
                    <span className="title-navy">STEP 2 — </span>
                    <span className="title-cyan">TABLE </span>
                    <span className="title-navy">DET</span>
                    <span className="title-cyan">AIL</span>
                    <span className="title-orange">S</span>
                  </>
                )}
              </h2>
              <p className="step-card-subtitle">
                {lang === 'ar'
                  ? 'حدد سعة الطاولة، والتاريخ، وأفضل توقيت لتناول الطعام، وتفضيلات الضيافة.'
                  : 'Configure your party size, date, optimal dining hour, and hospitality preferences.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitBooking} className="table-details-form">
            
            {/* 1. TABLE CONFIGURATION */}
            <div className="table-form-group">
              <label className="form-group-label">
                <Armchair size={16} />
                <span>{lang === 'ar' ? 'سعة الطاولة (عدد المقاعد)' : 'Table Configuration'}</span>
              </label>

              <div className="seats-pills-row">
                {TABLE_SIZES.map((size) => {
                  const isSelected = selectedSeats === size.id;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      className={`seat-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSeats(size.id)}
                    >
                      <span>{lang === 'ar' ? size.labelAr : size.labelEn}</span>
                      {isSelected && (
                        <span className="seat-selected-badge">
                          {lang === 'ar' ? ' (محدد)' : ' (Selected)'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DINING DATE */}
            <div className="table-form-group" onClick={() => dateInputRef.current?.showPicker?.()}>
              <label className="form-group-label">
                <Calendar size={16} />
                <span>{lang === 'ar' ? 'تاريخ الحجز' : 'Dining Date'}</span>
              </label>

              <div className="dining-date-input-wrap">
                <span className="dining-date-val">{getFormattedDate()}</span>
                <Calendar size={17} className="dining-date-icon" />
                <input 
                  ref={dateInputRef}
                  type="date"
                  className="dining-native-date"
                  value={diningDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDiningDate(e.target.value)}
                />
              </div>
            </div>

            {/* 3. SELECT PREFERRED TIME */}
            <div className="table-form-group">
              <label className="form-group-label">
                <Clock size={16} />
                <span>{lang === 'ar' ? 'اختر التوقيت المفضل' : 'Select Preferred Time'}</span>
              </label>

              <div className="time-slots-grid">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={`time-slot-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                    >
                      <span className="time-main">
                        {lang === 'ar' ? slot.timeAr : slot.time}
                      </span>
                      <span className={`time-tag ${slot.isSunset ? 'sunset' : ''}`}>
                        {lang === 'ar' ? slot.tagAr : slot.tagEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. SPECIAL REQUESTS & NOTES */}
            <div className="table-form-group">
              <div className="form-label-row">
                <label className="form-group-label">
                  <FileText size={16} />
                  <span>{lang === 'ar' ? 'طلبات خاصة وملاحظات' : 'Special Requests & Notes'}</span>
                </label>
                <span className="optional-tag">{lang === 'ar' ? 'اختياري' : 'Optional'}</span>
              </div>

              <textarea 
                className="special-requests-textarea"
                rows="3"
                placeholder={lang === 'ar' 
                  ? 'كرسي أطفال، مفاجأة احتفال عيد ميلاد، تفضيل حافة القناة، ملاحظات غذائية...'
                  : 'Baby chair needed, birthday celebration surprise, canal edge preference, dietary notes...'}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="submit-btn-wrap">
              <button type="submit" className="book-table-submit-btn">
                <span>{lang === 'ar' ? 'تأكيد الحجز الآن' : 'Submit'}</span>
                {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>

          </form>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* RESERVATION CONFIRMATION SUCCESS MODAL */}
      {/* ========================================================================= */}
      {showSuccessModal && (
        <div className="book-modal-backdrop" onClick={() => setShowSuccessModal(false)}>
          <div className="book-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="book-modal-close"
              onClick={() => setShowSuccessModal(false)}
            >
              <X size={18} />
            </button>

            <div className="book-modal-header">
              <div className="book-modal-badge">
                <Sparkles size={24} color="#00a9c3" />
              </div>
              <h3 className="book-modal-title">
                {lang === 'ar' ? '🎉 تم تأكيد حجز طاولتك بنجاح!' : '🎉 Table Reservation Confirmed!'}
              </h3>
              <p className="book-modal-code">
                {lang === 'ar' ? `كود الحجز: ${bookingRef}` : `Booking Reference: ${bookingRef}`}
              </p>
            </div>

            <div className="book-modal-summary">
              <div className="book-summary-row">
                <span className="summary-lbl">{lang === 'ar' ? 'المنطقة:' : 'Dining Area:'}</span>
                <span className="summary-val highlight">{lang === 'ar' ? activeArea.nameAr : activeArea.nameEn}</span>
              </div>
              <div className="book-summary-row">
                <span className="summary-lbl">{lang === 'ar' ? 'سعة الطاولة:' : 'Table Size:'}</span>
                <span className="summary-val">{selectedSeats} {lang === 'ar' ? 'مقاعد' : 'Seats'}</span>
              </div>
              <div className="book-summary-row">
                <span className="summary-lbl">{lang === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                <span className="summary-val">{getFormattedDate()}</span>
              </div>
              <div className="book-summary-row">
                <span className="summary-lbl">{lang === 'ar' ? 'الموعد:' : 'Time Slot:'}</span>
                <span className="summary-val">{selectedTimeSlot}</span>
              </div>
              {specialRequests && (
                <div className="book-summary-row">
                  <span className="summary-lbl">{lang === 'ar' ? 'الملاحظات:' : 'Notes:'}</span>
                  <span className="summary-val">{specialRequests}</span>
                </div>
              )}
            </div>

            <div className="book-modal-actions">
              <button 
                type="button" 
                className="book-share-whatsapp-btn"
                onClick={handleShareToWhatsApp}
              >
                <Share2 size={16} />
                <span>{lang === 'ar' ? 'مشاركة تأكيد الحجز على واتساب' : 'Share Booking on WhatsApp'}</span>
              </button>

              <button 
                type="button" 
                className="book-close-done-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onBack) onBack();
                }}
              >
                <span>{lang === 'ar' ? 'تم / العودة للمطعم' : 'Done / Back to Restaurant'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightboxPhoto && (
        <div className="lightbox-backdrop" onClick={() => setLightboxPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close"
              onClick={() => setLightboxPhoto(null)}
            >
              <X size={20} />
            </button>
            <img src={lightboxPhoto.src} alt={lightboxPhoto.title} className="lightbox-img" />
            <p className="lightbox-caption">{lightboxPhoto.title}</p>
          </div>
        </div>
      )}

    </div>
  );
}
