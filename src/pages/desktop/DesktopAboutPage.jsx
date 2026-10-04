import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { getTranslations } from '../../data/translations';
import './DesktopAboutPage.css';

export default function DesktopAboutPage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);

  // Form State
  const [fullName, setFullName] = useState(lang === 'ar' ? 'عمر عبد الرحمن' : 'Omar Abdelrahman');
  const [phoneNumber, setPhoneNumber] = useState('+20 101 234 5678');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryRef] = useState(() => `AD-INQ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Form Submit Handler
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      alert(lang === 'ar' ? 'يرجى كتابة الاسم ورقم الهاتف للتواصل.' : 'Please provide your name and contact phone number.');
      return;
    }

    setFormSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="desktop-page desktop-about-page">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section 
        className="about-hero-section"
        style={{
          backgroundImage: `url('/photo/kid area pic/Hero Background with warm cinematic overlay (about us ).png')`
        }}
      >
        <div className="about-hero-overlay" />

        <div className="about-hero-content">
          {lang === 'ar' ? (
            <h1 className="about-hero-title font-alexandria">
              <span className="t-white">العب</span>
              <span className="t-yellow"> . </span>
              <span className="t-teal">استمتع</span>
              <span className="t-yellow"> . </span>
              <span className="t-white">احتفل</span>
            </h1>
          ) : (
            <h1 className="about-hero-title">
              <span className="t-white">Play</span>
              <span className="t-yellow">.</span>{' '}
              <span className="t-white">D</span>
              <span className="t-teal">i</span>
              <span className="t-white">ne</span>
              <span className="t-yellow">.</span>{' '}
              <span className="t-white">Celeb</span>
              <span className="t-yellow">r</span>
              <span className="t-white">a</span>
              <span className="t-teal">t</span>
              <span className="t-white">e</span>
              <span className="t-yellow">.</span>
            </h1>
          )}

          <p className="about-hero-subtitle">
            {t.about.heroSubtitle}
          </p>

          <div className="about-hero-actions">
            <button 
              type="button" 
              className="about-hero-btn primary"
              onClick={() => scrollTo('what-we-offer')}
            >
              <span>{t.about.exploreBtn}</span>
              <span className="arrow-icon">↓</span>
            </button>

            <button 
              type="button" 
              className="about-hero-btn ghost"
              onClick={() => scrollTo('contact-section')}
            >
              <span>{t.about.contactBtn}</span>
              <span>✉</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHAT WE OFFER SECTION */}
      {/* ========================================================================= */}
      <section className="about-offer-section" id="what-we-offer">
        <div className="desktop-page-container">
          <div className="about-section-header">
            {lang === 'ar' ? (
              <h2 className="about-section-title font-alexandria">
                <span className="w-teal">ما</span>
                <span className="w-navy">ذا </span>
                <span className="w-teal">نق</span>
                <span className="w-navy">د</span>
                <span className="w-teal">م</span>
              </h2>
            ) : (
              <h2 className="about-section-title">
                <span className="w-teal">Wh</span>
                <span className="w-navy">at </span>
                <span className="w-teal">We </span>
                <span className="w-navy">Off</span>
                <span className="w-teal">er</span>
              </h2>
            )}
            <p className="about-section-sub">
              {t.about.whatWeOfferSub}
            </p>
          </div>

          <div className="about-offer-grid">
            {/* Card 1: Play Zone */}
            <div 
              className="about-offer-card"
              onClick={() => setActiveTab('kids-area')}
            >
              <div className="about-card-img-wrap">
                <img 
                  src="/photo/kid area pic/Image (1).png" 
                  alt={t.about.cards.playZoneTitle} 
                  className="about-card-img" 
                />
                <span className="about-card-badge">
                  {lang === 'ar' ? '⚡ نشاط وحماس' : '⚡ Active'}
                </span>
              </div>
              <div className="about-card-body">
                <h3 className="about-card-title">{t.about.cards.playZoneTitle}</h3>
                <p className="about-card-desc">
                  {t.about.cards.playZoneDesc}
                </p>
                <div className="about-card-link">
                  <span>{lang === 'ar' ? 'استكشف' : 'EXPLORE'}</span>
                  <span>{lang === 'ar' ? '←' : '→'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Restaurant */}
            <div 
              className="about-offer-card"
              onClick={() => openModal('restaurant-menu')}
            >
              <div className="about-card-img-wrap">
                <img 
                  src="/photo/kid area pic/Image (2).png" 
                  alt={t.about.cards.restaurantTitle} 
                  className="about-card-img" 
                />
                <span className="about-card-badge">
                  {lang === 'ar' ? '🍴 مأكولات شهية' : '🍴 Gourmet'}
                </span>
              </div>
              <div className="about-card-body">
                <h3 className="about-card-title">{t.about.cards.restaurantTitle}</h3>
                <p className="about-card-desc">
                  {t.about.cards.restaurantDesc}
                </p>
                <div className="about-card-link">
                  <span>{lang === 'ar' ? 'استكشف' : 'EXPLORE'}</span>
                  <span>{lang === 'ar' ? '←' : '→'}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Trips */}
            <div 
              className="about-offer-card"
              onClick={() => setActiveTab('trips')}
            >
              <div className="about-card-img-wrap">
                <img 
                  src="/photo/kid area pic/trip hero.png" 
                  alt={t.about.cards.tripsTitle} 
                  className="about-card-img" 
                />
                <span className="about-card-badge">
                  {lang === 'ar' ? '🚌 رحلات جماعية' : '🚌 Group Trips'}
                </span>
              </div>
              <div className="about-card-body">
                <h3 className="about-card-title">{t.about.cards.tripsTitle}</h3>
                <p className="about-card-desc">
                  {t.about.cards.tripsDesc}
                </p>
                <div className="about-card-link">
                  <span>{lang === 'ar' ? 'استكشف' : 'EXPLORE'}</span>
                  <span>{lang === 'ar' ? '←' : '→'}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Events & Halls */}
            <div 
              className="about-offer-card"
              onClick={() => setActiveTab('events')}
            >
              <div className="about-card-img-wrap">
                <img 
                  src="/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png" 
                  alt={t.about.cards.eventsTitle} 
                  className="about-card-img" 
                />
                <span className="about-card-badge">
                  {lang === 'ar' ? '🎉 حفلات وقاعات' : '🎉 Events'}
                </span>
              </div>
              <div className="about-card-body">
                <h3 className="about-card-title">{t.about.cards.eventsTitle}</h3>
                <p className="about-card-desc">
                  {t.about.cards.eventsDesc}
                </p>
                <div className="about-card-link">
                  <span>{lang === 'ar' ? 'استكشف' : 'EXPLORE'}</span>
                  <span>{lang === 'ar' ? '←' : '→'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT OUR CUSTOMERS SAY SECTION (DARK TEAL CONTAINER) */}
      {/* ========================================================================= */}
      <section className="about-reviews-section">
        <div className="desktop-page-container">
          <div className="about-reviews-top-row">
            <div className="about-reviews-header-left">
              <h2 className="about-reviews-title">
                {lang === 'ar' ? (
                  <>
                    <span>آراء </span>
                    <span className="r-teal">وتجارب </span>
                    <span className="r-yellow">الزوار</span>
                  </>
                ) : (
                  <>
                    <span>Wh</span>
                    <span className="r-teal">at </span>
                    <span>Our </span>
                    <span className="r-teal">Cu</span>
                    <span>stome</span>
                    <span className="r-yellow">rs </span>
                    <span>Say</span>
                  </>
                )}
              </h2>
              <p className="about-reviews-sub">
                {lang === 'ar'
                  ? 'شهادات حقيقية من العائلات وزوار عطلة نهاية الأسبوع ومنظمي المناسبات الخاصة.'
                  : 'Real feedback from families, weekend visitors, and private event hosts.'}
              </p>
            </div>

            {/* Google Rating Badge */}
            <div className="google-reviews-badge">
              <div className="google-g-icon">G</div>
              <div className="google-rating-text">
                <div className="google-rating-top">
                  <span>{lang === 'ar' ? '٤.٩' : '4.9'}</span>
                  <span className="google-stars">★★★★★</span>
                </div>
                <span className="google-reviews-count">
                  {lang === 'ar' ? 'بناءً على أكثر من ١,٤٢٠ تقييم من جوجل' : 'Based on 1,420+ Google Reviews'}
                </span>
              </div>
              <button 
                type="button" 
                className="google-read-all"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowReviewsModal(true)}
              >
                <span>{lang === 'ar' ? 'عرض الكل' : 'READ ALL'}</span>
                <span>{lang === 'ar' ? '↖' : '↗'}</span>
              </button>
            </div>
          </div>

          {/* 3 Testimonials Grid */}
          <div className="about-reviews-grid">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <div>
                <div className="testimonial-top-row">
                  <span className="testimonial-stars">★★★★★</span>
                  <span className="testimonial-date">
                    {lang === 'ar' ? 'منذ أسبوعين' : '2 weeks ago'}
                  </span>
                </div>
                <p className="testimonial-quote">
                  {lang === 'ar'
                    ? '"أكثر مكان ألعاب للأطفال أماناً ونظافة زرناه في مدن القناة. المشرفون يتابعون كل طفل بكل اهتمام، وقعدة أولياء الأمور مريحة وتمنح راحة بال تامة أثناء الاستمتاع بالقهوة."'
                    : '"The safest and most impeccably clean kids\' play facility we have visited in the canal cities. The staff monitors every child attentively, and the parents\' seating area gives complete peace of mind while enjoying good espresso."'}
                </p>
              </div>

              <div className="testimonial-user-row">
                <div className="testimonial-avatar teal">{lang === 'ar' ? 'م' : 'M'}</div>
                <div className="testimonial-user-meta">
                  <h4 className="testimonial-name">
                    {lang === 'ar' ? 'محمود السيد' : 'Mahmoud El-Sayed'}
                  </h4>
                  <span className="testimonial-badge">
                    {lang === 'ar' ? '✓ زيارة عائلية مؤكدة' : '✓ Verified Family Visit'}
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <div>
                <div className="testimonial-top-row">
                  <span className="testimonial-stars">★★★★★</span>
                  <span className="testimonial-date">
                    {lang === 'ar' ? 'منذ شهر' : '1 month ago'}
                  </span>
                </div>
                <p className="testimonial-quote">
                  {lang === 'ar'
                    ? '"أجواء غروب الشمس على ضفاف القناة لا مثيل لها. الاستمتاع بالمشروبات المميزة ورؤية السفن تعبر قناة السويس وقت الغروب سحر خالص. أنصح بشدة بالآيس كراميل لاتيه والوافل."'
                    : '"Unmatched sunset vibes on the canal terrace. Having specialty drinks while watching the ships traverse the Suez Canal at twilight is pure magic. Highly recommend their signature iced caramel latte and waffle bites."'}
                </p>
              </div>

              <div className="testimonial-user-row">
                <div className="testimonial-avatar peach">{lang === 'ar' ? 'ن' : 'N'}</div>
                <div className="testimonial-user-meta">
                  <h4 className="testimonial-name">
                    {lang === 'ar' ? 'نوران منصور' : 'Nouran Mansour'}
                  </h4>
                  <span className="testimonial-badge">
                    {lang === 'ar' ? '✓ من سكان الإسماعيلية وزائرة دائمة' : '✓ Local Resident & Regular'}
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <div>
                <div className="testimonial-top-row">
                  <span className="testimonial-stars">★★★★★</span>
                  <span className="testimonial-date">
                    {lang === 'ar' ? 'منذ ٣ أسابيع' : '3 weeks ago'}
                  </span>
                </div>
                <p className="testimonial-quote">
                  {lang === 'ar'
                    ? '"أقمنا حفل تخرج ابنتنا في التراس العلوي المطل على القناة. فريق الضيافة جهز البوفيه والإضاءة وهندسة الصوت بمنتهى الاحترافية. جميع الحضور أشادوا بالمكان وحسن الاستقبال."'
                    : '"We hosted our daughter\'s graduation banquet on the Rooftop Terrace. The hospitality team handled catering, ambient lighting, and acoustic audio seamlessly. All our guests complimented the setting and warm service."'}
                </p>
              </div>

              <div className="testimonial-user-row">
                <div className="testimonial-avatar gold">{lang === 'ar' ? 'ط' : 'T'}</div>
                <div className="testimonial-user-meta">
                  <h4 className="testimonial-name">
                    {lang === 'ar' ? 'طارق حسن' : 'Tarek Hassan'}
                  </h4>
                  <span className="testimonial-badge">
                    {lang === 'ar' ? '✓ حجز مناسبة خاصة' : '✓ Private Event Host'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. GET IN TOUCH / CONTACT SECTION */}
      {/* ========================================================================= */}
      <section className="about-contact-section" id="contact-section">
        <div className="desktop-page-container">
          <div className="about-contact-layout">
            {/* Left: Contact Info */}
            <div className="contact-info-col">
              <span className="contact-pill-tag">
                {lang === 'ar' ? 'تواصل معنا' : 'GET IN TOUCH'}
              </span>

              <h2 className="contact-main-heading">
                {lang === 'ar' ? (
                  <>
                    <span>يسعدنا </span>
                    <span className="c-teal">دائماً </span>
                    <span className="c-yellow">سماع </span>
                    <span>صوتك</span>
                  </>
                ) : (
                  <>
                    <span>We'd </span>
                    <span className="c-teal">Lo</span>
                    <span>ve </span>
                    <span className="c-yellow">to </span>
                    <span className="c-teal">He</span>
                    <span>ar </span>
                    <span>From </span>
                    <span>You</span>
                  </>
                )}
              </h2>

              <p className="contact-intro-desc">
                {lang === 'ar'
                  ? 'سواء كنت تخطط لاحتفال خاص، أو رحلة مدرسية، أو لديك أي استفسار عن الباقات والعروض، فريقنا في خدمتك دائماً.'
                  : 'Whether booking a private celebration, organizing a school visit, or inquiring about seasonal park packages, our concierge team is on hand to assist.'}
              </p>

              <div className="contact-details-list">
                {/* Park Location */}
                <div className="contact-detail-item">
                  <div className="contact-icon-circle">
                    <img 
                      src="/photo/kid area pic/icon/Icon (18).png" 
                      alt="Location" 
                      className="contact-icon-img" 
                    />
                  </div>
                  <div className="contact-text-wrap">
                    <h4 className="contact-item-title">
                      {lang === 'ar' ? 'موقع المكان' : 'Park Location'}
                    </h4>
                    <span className="contact-item-val">
                      {lang === 'ar'
                        ? 'الإسماعيلية - طريق البلاجات على ضفاف قناة السويس، الكيلو ٤.٥'
                        : 'Suez Canal Waterfront Promenade, Km 4.5, Ismailia Governorate, Egypt'}
                    </span>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="contact-detail-item">
                  <div className="contact-icon-circle">
                    <img 
                      src="/photo/kid area pic/icon/Icon (19).png" 
                      alt="Phone" 
                      className="contact-icon-img" 
                    />
                  </div>
                  <div className="contact-text-wrap">
                    <h4 className="contact-item-title">
                      {lang === 'ar' ? 'الهاتف والواتساب' : 'Phone & WhatsApp'}
                    </h4>
                    <span className="contact-item-val">
                      {lang === 'ar' ? 'اتصال: ٠٦٤ ٣٢٠ ٤٠٠٠' : 'Call: +20 (064) 320 4000'}
                    </span>
                    <span className="contact-item-val">
                      {lang === 'ar' ? 'واتساب: ٠١٠٢ ٤٥٨ ٩٩١٢' : 'WhatsApp: +20 102 458 9912'}
                    </span>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="contact-detail-item">
                  <div className="contact-icon-circle">
                    <img 
                      src="/photo/kid area pic/icon/Icon (20).png" 
                      alt="Hours" 
                      className="contact-icon-img" 
                    />
                  </div>
                  <div className="contact-text-wrap">
                    <h4 className="contact-item-title">
                      {lang === 'ar' ? 'مواعيد العمل' : 'Opening Hours'}
                    </h4>
                    <span className="contact-item-val">
                      {lang === 'ar' ? 'الأحد - الأربعاء: ١٠:٠٠ ص - ١١:٠٠ م' : 'Sun - Wed: 10:00 AM - 11:00 PM'}
                    </span>
                    <span className="contact-item-val">
                      {lang === 'ar' ? 'الخميس - السبت (العطلات): ١٠:٠٠ ص - منتصف الليل' : 'Thu - Sat (Peak): 10:00 AM - Midnight'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Community Icons */}
              <div className="community-socials-wrap">
                <div className="community-socials-label">
                  {lang === 'ar' ? 'تابعنا على مواقع التواصل' : 'FOLLOW OUR COMMUNITY'}
                </div>
                <div className="community-socials-row">
                  <button 
                    type="button" 
                    className="social-circle-btn" 
                    title={lang === 'ar' ? 'فيسبوك' : 'Official Facebook'}
                    onClick={() => window.open('https://facebook.com', '_blank')}
                  >
                    <img src="/photo/kid area pic/icon/Icon (21).png" alt="Facebook" className="social-icon-img" />
                  </button>
                  <button 
                    type="button" 
                    className="social-circle-btn" 
                    title={lang === 'ar' ? 'انستغرام' : 'Instagram Photos & Stories'}
                    onClick={() => window.open('https://instagram.com', '_blank')}
                  >
                    <img src="/photo/kid area pic/icon/Icon (22).png" alt="Instagram" className="social-icon-img" />
                  </button>
                  <button 
                    type="button" 
                    className="social-circle-btn" 
                    title={lang === 'ar' ? 'تيك توك' : 'TikTok Highlights'}
                    onClick={() => window.open('https://tiktok.com', '_blank')}
                  >
                    <img src="/photo/kid area pic/icon/Icon (23).png" alt="TikTok" className="social-icon-img" />
                  </button>
                  <button 
                    type="button" 
                    className="social-circle-btn" 
                    title={lang === 'ar' ? 'يوتيوب' : 'YouTube Video Tours'}
                    onClick={() => window.open('https://youtube.com', '_blank')}
                  >
                    <img src="/photo/kid area pic/icon/Icon (24).png" alt="YouTube" className="social-icon-img" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-card">
              <h3 className="form-card-title">
                {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
              </h3>
              <p className="form-card-sub">
                {lang === 'ar'
                  ? 'لديك سؤال أو ترغب في حجز مناسبة؟ املأ البيانات وسنتواصل معك خلال ٢٤ ساعة.'
                  : 'Have a question or custom booking inquiry? Fill out the short form below and we will get back to you within 24 hours.'}
              </p>

              {formSubmitted ? (
                <div style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    margin: '0 auto 12px'
                  }}>
                    ✓
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#065f46', fontSize: '1.15rem', fontWeight: 850 }}>
                    {lang === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message Sent Successfully!'}
                  </h4>
                  <p style={{ margin: '0 0 16px 0', color: '#047857', fontSize: '0.86rem' }}>
                    {lang === 'ar'
                      ? `رقم المرجع: ${inquiryRef}. سيتواصل معك فريق العلاقات العامة على ${phoneNumber} قريباً.`
                      : `Inquiry Reference: ${inquiryRef}. Our guest relations team will contact you on ${phoneNumber} shortly.`}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="modal-btn outline"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setFormSubmitted(false)}
                    >
                      {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another'}
                    </button>
                    <button
                      type="button"
                      className="modal-btn whatsapp"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        const txt = encodeURIComponent(
                          lang === 'ar'
                            ? `مرحباً أمريكان دريم!\n\nرقم المرجع: ${inquiryRef}\nالاسم: ${fullName}\nالهاتف: ${phoneNumber}\nالرسالة: ${message || 'استفسار عام'}`
                            : `Hello American Dream!\n\nInquiry Ref: ${inquiryRef}\nName: ${fullName}\nPhone: ${phoneNumber}\nMessage: ${message || 'General Inquiry'}`
                        );
                        window.open(`https://wa.me/201024589912?text=${txt}`, '_blank');
                      }}
                    >
                      <img 
                        src="/photo/kid area pic/payment logo/toppng.com-icon-whatsapp-white-color-free-download-626x626.png" 
                        alt="WhatsApp" 
                        style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                      />
                      <span>{lang === 'ar' ? 'المتابعة عبر واتساب' : 'Open in WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input 
                    type="text"
                    className="form-input-field"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: عمر عبد الرحمن' : 'e.g. Omar Abdelrahman'}
                    required
                  />

                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input 
                    type="tel"
                    className="form-input-field"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: ٠١٠١٢٣٤٥٦٧٨' : 'e.g. +20 1012345678'}
                    required
                  />

                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الرسالة أو الاستفسار' : 'Message'}
                  </label>
                  <textarea 
                    className="form-textarea-field"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب تفاصيل مناسبتك أو استفسارك...' : 'Tell us about your event, inquiry, or visit questions...'}
                    rows={4}
                  />

                  <button type="submit" className="form-submit-btn">
                    <span>{lang === 'ar' ? 'إرسال الرسالة' : 'SEND MESSAGE'}</span>
                    <span>{lang === 'ar' ? '←' : '→'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. GOOGLE REVIEWS MODAL */}
      {/* ========================================================================= */}
      {showReviewsModal && (
        <div className="trips-modal-backdrop" onClick={() => setShowReviewsModal(false)}>
          <div className="trips-modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trips-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="google-g-icon">G</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0a3342', fontWeight: 850 }}>
                    {lang === 'ar' ? 'تقييمات زوار أمريكان دريم على جوجل' : 'Google Verified Guest Reviews'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {lang === 'ar'
                      ? 'تقييم ٤.٩ ★★★★★ بناءً على أكثر من ١,٤٢٠ تقييماً'
                      : '4.9 ★★★★★ rating based on 1,420+ reviews'}
                  </span>
                </div>
              </div>
              <button className="trips-modal-close" onClick={() => setShowReviewsModal(false)}>&times;</button>
            </div>

            <div className="trips-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {[
                {
                  name: lang === 'ar' ? 'محمود السيد' : 'Mahmoud El-Sayed',
                  time: lang === 'ar' ? 'منذ أسبوعين' : '2 weeks ago',
                  stars: '★★★★★',
                  text: lang === 'ar' 
                    ? 'أكثر مكان ألعاب للأطفال أماناً ونظافة زرناه في مدن القناة. المشرفون يتابعون كل طفل بكل اهتمام، وقعدة أولياء الأمور مريحة وتمنح راحة بال تامة.'
                    : 'The safest and most impeccably clean kids\' play facility we have visited in the canal cities. The staff monitors every child attentively.'
                },
                {
                  name: lang === 'ar' ? 'نوران منصور' : 'Nouran Mansour',
                  time: lang === 'ar' ? 'منذ شهر' : '1 month ago',
                  stars: '★★★★★',
                  text: lang === 'ar'
                    ? 'أجواء غروب الشمس على ضفاف القناة لا مثيل لها. الاستمتاع بالمشروبات المميزة ورؤية السفن تعبر قناة السويس وقت الغروب سحر خالص.'
                    : 'Unmatched sunset vibes on the canal terrace. Having specialty drinks while watching the ships traverse the Suez Canal at twilight is pure magic.'
                },
                {
                  name: lang === 'ar' ? 'طارق حسن' : 'Tarek Hassan',
                  time: lang === 'ar' ? 'منذ ٣ أسابيع' : '3 weeks ago',
                  stars: '★★★★★',
                  text: lang === 'ar'
                    ? 'أقمنا حفل تخرج ابنتنا في التراس العلوي المطل على القناة. فريق الضيافة جهز البوفيه والإضاءة وهندسة الصوت بمنتهى الاحترافية.'
                    : 'We hosted our daughter\'s graduation banquet on the Rooftop Terrace. The hospitality team handled catering and ambient lighting seamlessly.'
                },
                {
                  name: lang === 'ar' ? 'د. سارة فاروق' : 'Dr. Sarah Farouk',
                  time: lang === 'ar' ? 'منذ ٥ أيام' : '5 days ago',
                  stars: '★★★★★',
                  text: lang === 'ar'
                    ? 'عطلة نهاية أسبوع رائعة للعائلة. قضى الأطفال ٤ ساعات متواصلة بأمان وسعادة في منطقة الأطفال وفن بارك.'
                    : 'Excellent weekend retreat for the family. The kids spent 4 continuous hours safely in the Kids Area and Fun Park.'
                }
              ].map((rev, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0a3342' }}>{rev.name}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{rev.time}</span>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '0.82rem' }}>{rev.stars}</div>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569' }}>{rev.text}</p>
                </div>
              ))}
            </div>

            <div className="trips-modal-header" style={{ background: '#f8fafc', borderRadius: '0 0 24px 24px' }}>
              <button 
                type="button" 
                className="modal-btn primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowReviewsModal(false)}
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
