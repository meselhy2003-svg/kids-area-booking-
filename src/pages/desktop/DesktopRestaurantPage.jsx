import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Check, 
  ShoppingBag, 
  Utensils, 
  Coffee, 
  ChevronRight, 
  Share2, 
  X, 
  Sparkles,
  ArrowRight,
  Flame,
  Star
} from 'lucide-react';
import { getTranslations } from '../../data/translations';
import { mockMenuItems } from '../../data/mock/menu.mock';
import OrderForDeliveryPage from './OrderForDeliveryPage';
import BookTablePage from './BookTablePage';
import './DesktopRestaurantPage.css';

export default function DesktopRestaurantPage({ setActiveTab, openModal, lang = 'ar' }) {
  const t = getTranslations(lang);
  const r = t.restaurantPage || {};

  // Page View State: 'overview' | 'delivery' | 'book-table'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('book-table')) return 'book-table';
      if (window.location.hash.includes('delivery')) return 'delivery';
    }
    return 'overview';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('book-table')) {
        setCurrentView('book-table');
      } else if (window.location.hash.includes('delivery')) {
        setCurrentView('delivery');
      } else if (window.location.hash === '#restaurant') {
        setCurrentView('overview');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Modals State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Table Booking Form State
  const [bookingStep, setBookingStep] = useState('form'); // 'form' | 'success'
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('06:00 PM');
  const [guestCount, setGuestCount] = useState(4);
  const [selectedZone, setSelectedZone] = useState('terrace');
  const [occasion, setOccasion] = useState('casual');
  const [bookingRef, setBookingRef] = useState('');

  // Delivery Form State
  const [deliveryStep, setDeliveryStep] = useState('form');
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryRef, setDeliveryRef] = useState('');

  // Digital Menu State
  const [activeMenuCategory, setActiveMenuCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  // Quick delivery order items state
  const [orderItems, setOrderItems] = useState([
    { id: 'b1', nameEn: 'Artisan Brioche Cheeseburger Meal', nameAr: 'وجبة برجر البريوش الفاخر', price: 185, qty: 1 },
    { id: 'p1', nameEn: 'Stone-Baked Mozzarella Pizza', nameAr: 'بيتزا مارجريتا إيطالية حجرية', price: 160, qty: 1 },
    { id: 'd1', nameEn: 'Fresh Mango Sunshine Smoothie', nameAr: 'سموذي مانجو الواحة الطازج', price: 65, qty: 2 }
  ]);

  // Extended Menu Data with Real Restaurant Photos
  const extendedMenu = [
    {
      id: 101,
      category: 'burgers',
      nameEn: 'Artisanal Brioche Cheeseburger Meal',
      nameAr: 'وجبة برجر البريوش بالجبنة الفاخرة',
      descEn: 'Freshly grilled beef patty, melted cheddar, crispy shoestring fries & signature sauce',
      descAr: 'برجر لحم مشوي طازج مع جبن الشيدر الذائب، بطاطس مقرمشة وصوص أمريكان دريم الخاص',
      price: 185,
      rating: 4.9,
      image: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png'
    },
    {
      id: 102,
      category: 'grills',
      nameEn: 'Waterfront Sunset Mixed Grill',
      nameAr: 'مشاوي الواجهة المائية المشكلة',
      descEn: 'Tender kebab skewers, shish tawook, grilled kofta, basmati rice & fresh salads',
      descAr: 'كباب وكفتة وشيش طاووق متبل على الفحم يقدم مع أرز بسمتي وسلطات طازجة',
      price: 340,
      rating: 5.0,
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png'
    },
    {
      id: 103,
      category: 'pizza',
      nameEn: 'Italian Stone-Baked Quattro Formaggi',
      nameAr: 'بيتزا الأجبان الأربعة الحجرية',
      descEn: 'Authentic thin crust pizza with mozzarella, parmesan, gorgonzola & fresh basil',
      descAr: 'عجينة إيطالية هشة ومقرمشة مع مزيج 4 أجبان فاخرة وصلصة الطماطم الإيطالية',
      price: 175,
      rating: 4.8,
      image: '/photo/kid area pic/mosaic-card-2.png'
    },
    {
      id: 104,
      category: 'drinks',
      nameEn: 'Island Breeze Mango Mocktail',
      nameAr: 'كوكتيل نسيم الجزيرة بالمانجو',
      descEn: 'Fresh Ismailia mango puree, passion fruit syrup, sparkling soda & mint',
      descAr: 'مانجو إسماعيلية طازجة مع باشن فروت وصودا منعشة وأوراق النعناع',
      price: 70,
      rating: 4.9,
      image: '/photo/kid area pic/Image (1).png'
    },
    {
      id: 105,
      category: 'coffee',
      nameEn: 'Iced Caramel Macchiato & Latte',
      nameAr: 'آيسد كراميل ماكياتو ولاتيه إسباني',
      descEn: 'Premium double espresso shots, chilled steamed milk & golden buttery caramel drizzle',
      descAr: 'إسبريسو فاخر مع حليب بارد وصلصة كراميل غنية ومثلجة على ضفاف القناة',
      price: 65,
      rating: 4.8,
      image: '/photo/kid area pic/Image (2).png'
    },
    ...mockMenuItems
  ];

  // Helper to show notification toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  // Smooth scroll to experiences
  const handleScrollToExperiences = () => {
    const el = document.getElementById('dining-experiences');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Table Booking Page
  const handleOpenBooking = () => {
    setCurrentView('book-table');
    if (typeof window !== 'undefined') {
      window.location.hash = 'restaurant-book-table';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Table Booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      showToast(lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please enter name and phone number');
      return;
    }

    const code = `AD-REST-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(code);
    setBookingStep('success');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(lang === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Table reserved successfully!');
  };

  // Share Booking to WhatsApp
  const handleShareBookingToWhatsApp = () => {
    const phone = '201012345678';
    const textAr = `مرحباً مطعم أمريكان دريم، أود تأكيد حجز الطاولة الخاص بي:%0A- كود الحجز: ${bookingRef}%0A- الاسم: ${guestName}%0A- التاريخ: ${bookingDate}%0A- الموعد: ${timeSlot}%0A- عدد الأفراد: ${guestCount}%0A- الجلسة: ${selectedZone}%0Aشكراً جزيلاً!`;
    const textEn = `Hello American Dream Restaurant, I would like to confirm my table reservation:%0A- Ref Code: ${bookingRef}%0A- Name: ${guestName}%0A- Date: ${bookingDate}%0A- Time: ${timeSlot}%0A- Guests: ${guestCount}%0A- Area: ${selectedZone}%0AThank you!`;
    const text = lang === 'ar' ? textAr : textEn;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Open Delivery View (Order for Delivery page)
  const handleOpenDelivery = () => {
    setCurrentView('delivery');
    if (typeof window !== 'undefined') {
      window.location.hash = 'restaurant-delivery';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update item quantity in delivery order
  const handleUpdateItemQty = (id, delta) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Calculate Order Total
  const orderSubtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = orderSubtotal > 0 ? 25 : 0;
  const orderTotal = orderSubtotal + deliveryFee;

  // Confirm Delivery Order
  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    if (!deliveryName || !deliveryPhone || !deliveryAddress) {
      showToast(lang === 'ar' ? 'يرجى ملء جميع بيانات التوصيل' : 'Please fill all delivery details');
      return;
    }

    const code = `AD-DLV-${Math.floor(1000 + Math.random() * 9000)}`;
    setDeliveryRef(code);
    setDeliveryStep('success');

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    showToast(lang === 'ar' ? 'تم استلام طلب التوصيل بنجاح!' : 'Delivery order placed successfully!');
  };

  // Share Delivery Order to WhatsApp
  const handleShareDeliveryToWhatsApp = () => {
    const phone = '201012345678';
    const itemsList = orderItems.filter(i => i.qty > 0).map(i => `- ${lang === 'ar' ? i.nameAr : i.nameEn} (${i.qty}x) = ${i.price * i.qty} ج.م`).join('%0A');
    const textAr = `طلب توصيل جديد من موقع أمريكان دريم:%0A- كود الطلب: ${deliveryRef}%0A- العميل: ${deliveryName}%0A- الهاتف: ${deliveryPhone}%0A- العنوان: ${deliveryAddress}%0A- الوجبات:%0A${itemsList}%0A- الإجمالي: ${orderTotal} ج.م%0Aملاحظات: ${deliveryNotes || 'لا يوجد'}`;
    window.open(`https://wa.me/${phone}?text=${textAr}`, '_blank');
  };

  // Add Item from Digital Menu to Cart
  const handleAddItemToCart = (item) => {
    setCartCount(prev => prev + 1);
    showToast(`${lang === 'ar' ? 'تمت إضافة' : 'Added'} ${lang === 'ar' ? item.nameAr : item.nameEn} ${lang === 'ar' ? 'إلى طلبك!' : 'to order!'}`);
  };

  // Filtered menu
  const filteredMenuItems = activeMenuCategory === 'all'
    ? extendedMenu
    : extendedMenu.filter(item => item.category === activeMenuCategory);

  // Vibes mosaic photos data
  const vibesGallery = [
    {
      id: 'vibe-1',
      src: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      titleEn: 'Canal-Side Sunset Dinner Terrace',
      titleAr: 'تراس العشاء على ضفاف القناة عند الغروب',
      subtitleEn: 'Warm string lights, grilled feasts, and serene water views',
      subtitleAr: 'أضواء دافئة ومشاوي شهية وإطلالة هادئة على المياه',
      type: 'row1-large'
    },
    {
      id: 'vibe-2',
      src: '/photo/kid area pic/vibe_sunset_candle_table.png',
      titleEn: 'Waterfront Sunset Candlelit Table',
      titleAr: 'جلسة رومانسية على الواجهة المائية',
      subtitleEn: 'Candlelight, floral elegance, and passing yachts',
      subtitleAr: 'شموع وورود وأجواء فاخرة أمام اليخوت المارة',
      type: 'row1-medium'
    },
    {
      id: 'vibe-3',
      src: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png',
      titleEn: 'Artisanal Brioche Burger & Fries',
      titleAr: 'برجر البريوش المقرمش الفاخر',
      subtitleEn: 'Craft box takeaway presentation for delicious on-the-go moments',
      subtitleAr: 'بوكس سفري أنيق مصمم لألذ اللحظات',
      type: 'row2-card'
    },
    {
      id: 'vibe-4',
      src: '/photo/kid area pic/vibe_family_pizza.png',
      titleEn: 'Family Smiles & Shared Feasts',
      titleAr: 'لمّة العائلة وضحكات السعادة',
      subtitleEn: 'Stone-baked pizza, appetizers, and warm gatherings',
      subtitleAr: 'بيتزا طازجة ومقبلات وجلسات عائلية دافئة',
      type: 'row2-card'
    },
    {
      id: 'vibe-5',
      src: '/photo/kid area pic/vibe_coffee_latte.png',
      titleEn: 'Sunset Coffee & Seaside Drinks',
      titleAr: 'قهوة وعصائر منعشة عند الغروب',
      subtitleEn: 'Chilled iced lattes and hot cappuccino by the breeze',
      subtitleAr: 'آيسد لاتيه وكابتشينو منعش مع نسيم البحر',
      type: 'row2-card'
    }
  ];

  if (currentView === 'book-table') {
    return (
      <BookTablePage 
        onBack={() => {
          setCurrentView('overview');
          if (typeof window !== 'undefined') {
            window.location.hash = 'restaurant';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setActiveTab={setActiveTab}
        openModal={openModal}
        lang={lang}
      />
    );
  }

  if (currentView === 'delivery') {
    return (
      <OrderForDeliveryPage 
        onBack={() => {
          setCurrentView('overview');
          if (typeof window !== 'undefined') {
            window.location.hash = 'restaurant';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />
    );
  }

  return (
    <div className={`restaurant-page ${lang === 'ar' ? 'font-alexandria' : ''}`}>
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION */}
      {/* ========================================================================= */}
      <section 
        className="restaurant-hero"
        style={{
          backgroundImage: `url('/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png')`
        }}
      >
        <div className="restaurant-hero-overlay" />

        <div className="restaurant-hero-content">
          {/* Badge Pill */}
          <div className="restaurant-hero-badge">
            <img 
              src="/photo/kid area pic/icon/Icon (12)dadd.png" 
              alt="Restaurant" 
              className="restaurant-hero-badge-icon" 
            />
            <span>{lang === 'ar' ? 'المطعم والكافيه' : 'RESTAURANT & CAFE'}</span>
          </div>

          {/* Main Title */}
          <h1 className="restaurant-hero-title">
            {lang === 'ar' ? (
              <>
                <span>طعام رائع. </span>
                <span className="title-accent">لحظات لا تُنسى.</span>
              </>
            ) : (
              <>
                <span>Good food. </span>
                <span className="title-accent">Great moments.</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="restaurant-hero-subtitle">
            {r.heroDesc || (
              lang === 'ar' 
                ? 'استمتع بأشهى المأكولات، ومشروباتك المفضلة، وأجواء الواجهة المائية الهادئة في أمريكان دريم الإسماعيلية'
                : 'Enjoy delicious food, your favorite drinks, and a relaxing waterfront atmosphere at American Dream Ismailia'
            )}
          </p>

          {/* Action Buttons */}
          <div className="restaurant-hero-buttons">
            <button 
              className="btn-primary-teal"
              onClick={handleScrollToExperiences}
            >
              <span>{r.exploreBtn || (lang === 'ar' ? 'استكشف خيارات الطعام ↓' : 'Explore Dining Options ↓')}</span>
            </button>

            <button 
              className="btn-glass-outline"
              onClick={handleOpenBooking}
            >
              <img 
                src="/photo/kid area pic/icon/Icon (26).png" 
                alt="Book a Table" 
                className="btn-icon-table"
              />
              <span>{r.bookTableBtn || (lang === 'ar' ? 'احجز طاولة' : 'Book a Table')}</span>
            </button>
          </div>

          {/* Feature Badges below buttons */}
          <div className="restaurant-hero-features">
            <div className="hero-feature-item">
              <img 
                src="/photo/kid area pic/icon/Icon (25).png" 
                alt="Artisanal Kitchen" 
                className="hero-feature-icon" 
              />
              <span>{lang === 'ar' ? 'مطبخ حرفي فاخر' : 'Artisanal Kitchen'}</span>
            </div>
            <div className="hero-feature-item">
              <img 
                src="/photo/kid area pic/icon/222222481.png" 
                alt="Family & Group Friendly" 
                className="hero-feature-icon" 
              />
              <span>{lang === 'ar' ? 'مناسب للعائلات والمجموعات' : 'Family & Group Friendly'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE HOW YOU WANT TO ENJOY SECTION */}
      {/* ========================================================================= */}
      <section id="dining-experiences" className="restaurant-experiences-section">
        <div className="experiences-container">
          
          {/* Section Header */}
          <div className="experiences-header">
            <span className="experiences-eyebrow">
              {r.sectionTag || (lang === 'ar' ? 'تجارب تناول الطعام' : 'DINING EXPERIENCES')}
            </span>

            <h2 className="experiences-title">
              {lang === 'ar' ? (
                <>
                  <span className="color-cyan">اختر الطريقة </span>
                  <span className="color-orange">التي تفضلها </span>
                  <span className="color-dark">للاستمتاع</span>
                </>
              ) : (
                <>
                  <span className="color-cyan">Ch</span>
                  <span className="color-orange">oo</span>
                  <span className="color-dark">se </span>
                  <span className="color-dark">How </span>
                  <span className="color-cyan">You </span>
                  <span className="color-dark">Want </span>
                  <span className="color-orange">to </span>
                  <span className="color-cyan">Enjoy</span>
                </>
              )}
            </h2>

            <p className="experiences-subtitle">
              {r.sectionDesc || (
                lang === 'ar'
                  ? 'سواء كنت تسترخي على طول الممشى الكبير أو تتذوق الأطباق الطازجة في أي مكان على ضفاف القناة.'
                  : 'Whether relaxing along the grand promenade or savoring fresh cuisine anywhere along the canal.'
              )}
            </p>
          </div>

          {/* 3 Experience Cards Grid */}
          <div className="experiences-cards-grid">
            
            {/* CARD 1: DELIVERY */}
            <div className="experience-card">
              <div className="card-image-wrapper">
                <img 
                  src="/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png"
                  alt={lang === 'ar' ? 'خدمة التوصيل' : 'Delivery'}
                  className="card-image"
                />
                <span className="card-badge badge-dark">
                  {lang === 'ar' ? 'توصيل / سفري' : 'DELIVERY/TAKEAWAY'}
                </span>
              </div>

              <div className="card-body">
                <span className="card-category-tag tag-cyan">
                  {lang === 'ar' ? 'راحة وسرعة' : 'CONVENIENCE'}
                </span>
                <h3 className="card-title">
                  {lang === 'ar' ? 'خدمة التوصيل' : 'DELIVERY'}
                </h3>
                <p className="card-description">
                  {lang === 'ar' 
                    ? 'اطلب طعامك المفضل واستمتع به أينما كنت على طول واجهة الإسماعيلية المائية أو في منزلك مباشرة.'
                    : 'Order your favorite food and enjoy it wherever you are along the Ismailia waterfront or right at home.'}
                </p>
                <button 
                  className="card-btn card-btn-teal"
                  onClick={handleOpenDelivery}
                >
                  <span>{lang === 'ar' ? 'اطلب الآن ←' : 'ORDER NOW →'}</span>
                </button>
              </div>
            </div>

            {/* CARD 2: ORDER AT AMERICAN DREAM */}
            <div className="experience-card">
              <div className="card-image-wrapper">
                <img 
                  src="/photo/kid area pic/vibe_family_pizza.png"
                  alt={lang === 'ar' ? 'الطلب داخل الحديقة' : 'Order at American Dream'}
                  className="card-image"
                />
                <span className="card-badge badge-teal">
                  {lang === 'ar' ? 'تناول الطعام بالحديقة' : 'IN-PARK DINE'}
                </span>
              </div>

              <div className="card-body">
                <span className="card-category-tag tag-cyan">
                  {lang === 'ar' ? 'جلسات عائلية' : 'PARK DINING'}
                </span>
                <h3 className="card-title">
                  {lang === 'ar' ? 'الطلب داخل أمريكان دريم' : 'ORDER AT AMERICAN DREAM'}
                </h3>
                <p className="card-description">
                  {lang === 'ar'
                    ? 'اطلب أثناء تواجدك في أمريكان دريم واستمتع بوجبتك بسلاسة وبدون انتظار أثناء زيارتك.'
                    : "Order while you're at American Dream and enjoy your meal seamlessly during your visit without waiting."}
                </p>
                <button 
                  className="card-btn card-btn-darkteal"
                  onClick={() => setIsMenuModalOpen(true)}
                >
                  <Utensils size={17} />
                  <span>{lang === 'ar' ? 'تصفح المنيو / اطلب هنا' : 'DINE IN / VIEW MENU'}</span>
                </button>
              </div>
            </div>

            {/* CARD 3: BOOK A TABLE */}
            <div className="experience-card">
              <div className="card-image-wrapper">
                <img 
                  src="/photo/kid area pic/vibe_sunset_candle_table.png"
                  alt={lang === 'ar' ? 'حجز طاولة' : 'Book a Table'}
                  className="card-image"
                />
                <span className="card-badge badge-gold">
                  {lang === 'ar' ? 'جلسات VIP' : 'VIP Seating'}
                </span>
              </div>

              <div className="card-body">
                <span className="card-category-tag tag-gold">
                  {lang === 'ar' ? 'تراس الواجهة المائية' : 'WATERFRONT TERRACE'}
                </span>
                <h3 className="card-title">
                  {lang === 'ar' ? 'حجز طاولة' : 'BOOK A TABLE'}
                </h3>
                <p className="card-description">
                  {lang === 'ar'
                    ? 'احجز طاولتك بجوار القناة مباشرة لمشاهدة السفن العابرة وعيش تجربة استثنائية لا تُنسى.'
                    : 'Reserve your seaside table overlooking passing canal ships and indulge in an unforgettable culinary experience.'}
                </p>
                <button 
                  className="card-btn card-btn-gold"
                  onClick={handleOpenBooking}
                >
                  <Calendar size={17} />
                  <span>{lang === 'ar' ? 'احجز طاولة الآن' : 'BOOK A TABLE'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VIBES SECTION (MOSAIC PHOTO GALLERY) */}
      {/* ========================================================================= */}
      <section className="restaurant-vibes-section">
        <div className="vibes-container">
          
          {/* Header Row */}
          <div className="vibes-header-row">
            <div className="vibes-header-left">
              <h3 className="vibes-title">
                <span className="vibe-v">V</span>
                <span className="vibe-i">I</span>
                <span className="vibe-b">B</span>
                <span className="vibe-e">E</span>
                <span className="vibe-s">S</span>
              </h3>
              <p className="vibes-subtitle">
                {r.vibesDesc || (lang === 'ar' ? 'طعام رائع، صحبة جميلة، ولحظات لا تُنسى.' : 'Good food, good company, good moments.')}
              </p>
            </div>

          </div>

          {/* Mosaic Gallery Layout */}
          <div className="vibes-mosaic-grid">
            
            {/* ROW 1: Large Wide Left (60%) + Medium Right (40%) */}
            <div className="vibes-mosaic-row-1">
              {/* Photo 1 (Large Sunset Terrace) */}
              <div 
                className="vibe-item-card row1-large"
                onClick={() => setLightboxItem(vibesGallery[0])}
              >
                <img 
                  src={vibesGallery[0].src} 
                  alt={lang === 'ar' ? vibesGallery[0].titleAr : vibesGallery[0].titleEn} 
                  className="vibe-img"
                  loading="lazy"
                />
                <div className="vibe-card-overlay">
                  <span className="vibe-card-caption">
                    {lang === 'ar' ? vibesGallery[0].titleAr : vibesGallery[0].titleEn}
                  </span>
                </div>
              </div>

              {/* Photo 2 (Seaside Candlelit Table) */}
              <div 
                className="vibe-item-card row1-medium"
                onClick={() => setLightboxItem(vibesGallery[1])}
              >
                <img 
                  src={vibesGallery[1].src} 
                  alt={lang === 'ar' ? vibesGallery[1].titleAr : vibesGallery[1].titleEn} 
                  className="vibe-img"
                  loading="lazy"
                />
                <div className="vibe-card-overlay">
                  <span className="vibe-card-caption">
                    {lang === 'ar' ? vibesGallery[1].titleAr : vibesGallery[1].titleEn}
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2: Three Balanced Columns (Burger + Family + Coffee) */}
            <div className="vibes-mosaic-row-2">
              {/* Photo 3 (Cheeseburger Craft Box) */}
              <div 
                className="vibe-item-card row2-card"
                onClick={() => setLightboxItem(vibesGallery[2])}
              >
                <img 
                  src={vibesGallery[2].src} 
                  alt={lang === 'ar' ? vibesGallery[2].titleAr : vibesGallery[2].titleEn} 
                  className="vibe-img"
                  loading="lazy"
                />
                <div className="vibe-card-overlay">
                  <span className="vibe-card-caption">
                    {lang === 'ar' ? vibesGallery[2].titleAr : vibesGallery[2].titleEn}
                  </span>
                </div>
              </div>

              {/* Photo 4 (Family Gathering Pizza) */}
              <div 
                className="vibe-item-card row2-card"
                onClick={() => setLightboxItem(vibesGallery[3])}
              >
                <img 
                  src={vibesGallery[3].src} 
                  alt={lang === 'ar' ? vibesGallery[3].titleAr : vibesGallery[3].titleEn} 
                  className="vibe-img"
                  loading="lazy"
                />
                <div className="vibe-card-overlay">
                  <span className="vibe-card-caption">
                    {lang === 'ar' ? vibesGallery[3].titleAr : vibesGallery[3].titleEn}
                  </span>
                </div>
              </div>

              {/* Photo 5 (Seaside Coffee Cups & Sunset Drinks) */}
              <div 
                className="vibe-item-card row2-card"
                onClick={() => setLightboxItem(vibesGallery[4])}
              >
                <img 
                  src={vibesGallery[4].src} 
                  alt={lang === 'ar' ? vibesGallery[4].titleAr : vibesGallery[4].titleEn} 
                  className="vibe-img"
                  loading="lazy"
                />
                <div className="vibe-card-overlay">
                  <span className="vibe-card-caption">
                    {lang === 'ar' ? vibesGallery[4].titleAr : vibesGallery[4].titleEn}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TABLE RESERVATION MODAL */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="restaurant-modal-backdrop" onClick={() => setIsBookingModalOpen(false)}>
          <div className="restaurant-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="restaurant-modal-header">
              <div className="modal-header-text">
                <h3>{lang === 'ar' ? 'حجز طاولة في المطعم والكافيه' : 'Book a Restaurant Table'}</h3>
                <p>{lang === 'ar' ? 'اختر موعدك واستمتع بأجمل إطلالة على قناة السويس' : 'Reserve your seaside table overlooking the Suez Canal'}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsBookingModalOpen(false)}>✕</button>
            </div>

            <div className="restaurant-modal-body">
              {bookingStep === 'form' ? (
                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *</label>
                      <input 
                        type="text" 
                        required
                        className="form-input" 
                        placeholder={lang === 'ar' ? 'مثال: أحمد عبد الرحمن' : 'e.g. John Doe'}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>{lang === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *</label>
                      <input 
                        type="tel" 
                        required
                        className="form-input" 
                        placeholder={lang === 'ar' ? 'مثال: 01012345678' : '+20 101 234 5678'}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'تاريخ الحجز' : 'Date'} *</label>
                      <input 
                        type="date" 
                        required
                        className="form-input" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>{lang === 'ar' ? 'الموعد المفضل' : 'Preferred Time'} *</label>
                      <select 
                        className="form-select"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                      >
                        <option value="01:30 PM">{lang === 'ar' ? 'الغداء - 01:30 مساءً' : 'Lunch - 01:30 PM'}</option>
                        <option value="03:30 PM">{lang === 'ar' ? 'بعد الظهر - 03:30 مساءً' : 'Afternoon - 03:30 PM'}</option>
                        <option value="05:30 PM">{lang === 'ar' ? 'غروب الشمس الذهبي (VIP) - 05:30 مساءً' : 'Sunset Golden Hour (VIP) - 05:30 PM'}</option>
                        <option value="08:00 PM">{lang === 'ar' ? 'العشاء المسائي - 08:00 مساءً' : 'Evening Dinner - 08:00 PM'}</option>
                        <option value="10:30 PM">{lang === 'ar' ? 'سهرة مسائية - 10:30 مساءً' : 'Late Evening - 10:30 PM'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'ar' ? 'عدد الأفراد' : 'Number of Guests'}</label>
                    <div className="counter-control">
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <span className="counter-val">{guestCount} {lang === 'ar' ? 'أفراد' : 'Guests'}</span>
                      <button 
                        type="button" 
                        className="counter-btn"
                        onClick={() => setGuestCount(prev => Math.min(25, prev + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'ar' ? 'منطقة الجلوس المفضلة' : 'Preferred Seating Zone'}</label>
                    <div className="pill-radio-group">
                      <button 
                        type="button"
                        className={`pill-radio-btn ${selectedZone === 'terrace' ? 'selected' : ''}`}
                        onClick={() => setSelectedZone('terrace')}
                      >
                        🌊 {lang === 'ar' ? 'تراس الواجهة المائية (VIP)' : 'Waterfront Terrace (VIP)'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${selectedZone === 'promenade' ? 'selected' : ''}`}
                        onClick={() => setSelectedZone('promenade')}
                      >
                        🌴 {lang === 'ar' ? 'الممشى المفتوح' : 'Open-Air Promenade'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${selectedZone === 'indoor' ? 'selected' : ''}`}
                        onClick={() => setSelectedZone('indoor')}
                      >
                        ❄️ {lang === 'ar' ? 'الصالة المكيفة الداخلية' : 'Indoor AC Lounge'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${selectedZone === 'pergola' ? 'selected' : ''}`}
                        onClick={() => setSelectedZone('pergola')}
                      >
                        🛋️ {lang === 'ar' ? 'برجولة العائلة' : 'Family Pergola'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'ar' ? 'المناسبة (اختياري)' : 'Occasion (Optional)'}</label>
                    <div className="pill-radio-group">
                      <button 
                        type="button"
                        className={`pill-radio-btn ${occasion === 'birthday' ? 'selected' : ''}`}
                        onClick={() => setOccasion('birthday')}
                      >
                        🎂 {lang === 'ar' ? 'عيد ميلاد' : 'Birthday'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${occasion === 'anniversary' ? 'selected' : ''}`}
                        onClick={() => setOccasion('anniversary')}
                      >
                        💐 {lang === 'ar' ? 'ذكرى سنوية' : 'Anniversary'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${occasion === 'family' ? 'selected' : ''}`}
                        onClick={() => setOccasion('family')}
                      >
                        👨‍👩‍👧‍👦 {lang === 'ar' ? 'عائلة وأصدقاء' : 'Family & Friends'}
                      </button>
                      <button 
                        type="button"
                        className={`pill-radio-btn ${occasion === 'casual' ? 'selected' : ''}`}
                        onClick={() => setOccasion('casual')}
                      >
                        🍽️ {lang === 'ar' ? 'عشاء عادي' : 'Casual Dining'}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="card-btn card-btn-teal" style={{ marginTop: '12px' }}>
                    <Check size={18} />
                    <span>{lang === 'ar' ? 'تأكيد الحجز الآن' : 'Confirm Reservation'}</span>
                  </button>
                </form>
              ) : (
                <div className="confirmation-success-wrap">
                  <div className="success-icon-badge">✓</div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0b2533', margin: '0' }}>
                    {lang === 'ar' ? 'تم تأكيد حجز الطاولة بنجاح!' : 'Table Reserved Successfully!'}
                  </h3>
                  <p style={{ color: '#64748b', margin: '0' }}>
                    {lang === 'ar' 
                      ? `أهلاً بك يا ${guestName}، تم حفظ حجزك لـ ${guestCount} أفراد في ${selectedZone === 'terrace' ? 'تراس الواجهة المائية' : 'المطعم'} في موعد ${timeSlot}.`
                      : `Welcome ${guestName}, your reservation for ${guestCount} guests in ${selectedZone} at ${timeSlot} is confirmed.`}
                  </p>

                  <div className="ref-code-box">
                    <span>{lang === 'ar' ? 'رقم مرجع الحجز الخاص بك:' : 'Your Reservation Code:'}</span>
                    <strong>{bookingRef}</strong>
                  </div>

                  <button className="btn-whatsapp-share" onClick={handleShareBookingToWhatsApp}>
                    <Share2 size={18} />
                    <span>{lang === 'ar' ? 'إرسال تفاصيل الحجز للمطعم عبر واتساب' : 'Send Booking Details via WhatsApp'}</span>
                  </button>

                  <button 
                    className="card-btn card-btn-teal"
                    style={{ maxWidth: '280px', marginTop: '8px' }}
                    onClick={() => setIsBookingModalOpen(false)}
                  >
                    <span>{lang === 'ar' ? 'تم، إغلاق' : 'Done, Close'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DELIVERY & TAKEAWAY MODAL */}
      {/* ========================================================================= */}
      {isDeliveryModalOpen && (
        <div className="restaurant-modal-backdrop" onClick={() => setIsDeliveryModalOpen(false)}>
          <div className="restaurant-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="restaurant-modal-header">
              <div className="modal-header-text">
                <h3>{lang === 'ar' ? 'طلب التوصيل والسفري' : 'Delivery & Takeaway Order'}</h3>
                <p>{lang === 'ar' ? 'طعام ساخن وطازج يصلك أينما كنت في الإسماعيلية' : 'Freshly prepared food delivered to you in Ismailia'}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsDeliveryModalOpen(false)}>✕</button>
            </div>

            <div className="restaurant-modal-body">
              {deliveryStep === 'form' ? (
                <form onSubmit={handleConfirmDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'اسم العميل' : 'Customer Name'} *</label>
                      <input 
                        type="text" 
                        required
                        className="form-input" 
                        placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Your Name'}
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
                      <input 
                        type="tel" 
                        required
                        className="form-input" 
                        placeholder={lang === 'ar' ? 'رقم الموبايل' : 'Mobile number'}
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'ar' ? 'عنوان التوصيل في الإسماعيلية' : 'Delivery Address'} *</label>
                    <input 
                      type="text" 
                      required
                      className="form-input" 
                      placeholder={lang === 'ar' ? 'الشارع / المنطقة / بوابة ممشى دريم' : 'Street / Area / Dream Promenade Gate'}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>

                  {/* Selected items with quick quantity counters */}
                  <div className="form-group">
                    <label>{lang === 'ar' ? 'الوجبات المختارة للطلب' : 'Selected Meals'}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {orderItems.map(item => (
                        <div 
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0b2533' }}>
                              {lang === 'ar' ? item.nameAr : item.nameEn}
                            </div>
                            <div style={{ color: '#028090', fontSize: '0.84rem', fontWeight: '800' }}>
                              {item.price} {lang === 'ar' ? 'ج.م' : 'EGP'}
                            </div>
                          </div>

                          <div className="counter-control">
                            <button type="button" className="counter-btn" onClick={() => handleUpdateItemQty(item.id, -1)}>-</button>
                            <span className="counter-val">{item.qty}</span>
                            <button type="button" className="counter-btn" onClick={() => handleUpdateItemQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                      <span>{lang === 'ar' ? 'سعر الوجبات:' : 'Subtotal:'}</span>
                      <span>{orderSubtotal} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                      <span>{lang === 'ar' ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span>
                      <span>{deliveryFee} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', color: '#0b2533', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                      <span>{lang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                      <span style={{ color: '#028090' }}>{orderTotal} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                  </div>

                  <button type="submit" className="card-btn card-btn-teal" disabled={orderSubtotal === 0}>
                    <ShoppingBag size={18} />
                    <span>{lang === 'ar' ? `تأكيد الطلب (${orderTotal} ج.م)` : `Confirm Order (${orderTotal} EGP)`}</span>
                  </button>
                </form>
              ) : (
                <div className="confirmation-success-wrap">
                  <div className="success-icon-badge">✓</div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0b2533', margin: '0' }}>
                    {lang === 'ar' ? 'تم استلام طلب التوصيل بنجاح!' : 'Order Placed Successfully!'}
                  </h3>
                  <p style={{ color: '#64748b', margin: '0' }}>
                    {lang === 'ar' 
                      ? `شكراً لك يا ${deliveryName}، طلبك بقيمة ${orderTotal} ج.م قيد التحضير وسيتواصل معك الطيار فور الانطلاق.`
                      : `Thank you ${deliveryName}, your order (${orderTotal} EGP) is being prepared and will be delivered shortly.`}
                  </p>

                  <div className="ref-code-box">
                    <span>{lang === 'ar' ? 'رقم تتبع الطلب:' : 'Order Tracking Code:'}</span>
                    <strong>{deliveryRef}</strong>
                  </div>

                  <button className="btn-whatsapp-share" onClick={handleShareDeliveryToWhatsApp}>
                    <Share2 size={18} />
                    <span>{lang === 'ar' ? 'إرسال الفاتورة والتفاصيل للمطعم عبر واتساب' : 'Send Order to WhatsApp'}</span>
                  </button>

                  <button 
                    className="card-btn card-btn-teal"
                    style={{ maxWidth: '280px', marginTop: '8px' }}
                    onClick={() => setIsDeliveryModalOpen(false)}
                  >
                    <span>{lang === 'ar' ? 'تم، إغلاق' : 'Done, Close'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DIGITAL MENU MODAL */}
      {/* ========================================================================= */}
      {isMenuModalOpen && (
        <div className="restaurant-modal-backdrop" onClick={() => setIsMenuModalOpen(false)}>
          <div className="restaurant-modal-dialog wide" onClick={(e) => e.stopPropagation()}>
            <div className="restaurant-modal-header">
              <div className="modal-header-text">
                <h3>{lang === 'ar' ? 'قائمة طعام ومشروبات أمريكان دريم' : 'American Dream Food & Drinks Menu'}</h3>
                <p>{lang === 'ar' ? 'أشهى المأكولات الطازجة والمشروبات المنعشة' : 'Fresh gourmet meals, stone-baked pizzas & mocktails'}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsMenuModalOpen(false)}>✕</button>
            </div>

            <div className="restaurant-modal-body">
              {/* Categories Navigation Bar */}
              <div className="menu-categories-bar">
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('all')}
                >
                  {lang === 'ar' ? '🍽️ الكل' : '🍽️ All'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'burgers' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('burgers')}
                >
                  {lang === 'ar' ? '🍔 البرجر والسندوتشات' : '🍔 Burgers'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'pizza' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('pizza')}
                >
                  {lang === 'ar' ? '🍕 البيتزا الإيطالية' : '🍕 Pizzas'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'grills' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('grills')}
                >
                  {lang === 'ar' ? '🥩 المشاوي' : '🥩 Grills'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'drinks' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('drinks')}
                >
                  {lang === 'ar' ? '🍹 العصائر والسموذي' : '🍹 Mocktails'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'coffee' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('coffee')}
                >
                  {lang === 'ar' ? '☕ القهوة والمشروبات الساخنة' : '☕ Coffee'}
                </button>
                <button 
                  className={`menu-cat-btn ${activeMenuCategory === 'sweets' ? 'active' : ''}`}
                  onClick={() => setActiveMenuCategory('sweets')}
                >
                  {lang === 'ar' ? '🍨 الحلويات والآيس كريم' : '🍨 Sweets'}
                </button>
              </div>

              {/* Items Grid */}
              <div className="menu-items-grid">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="menu-item-card">
                    <img src={item.image} alt={lang === 'ar' ? item.nameAr : item.nameEn} className="menu-item-img" />
                    <div className="menu-item-info">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 className="menu-item-name">{lang === 'ar' ? item.nameAr : item.nameEn}</h4>
                          <span style={{ fontSize: '0.78rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={12} fill="#eab308" /> {item.rating}
                          </span>
                        </div>
                        <p className="menu-item-desc">{lang === 'ar' ? item.descAr : item.descEn}</p>
                      </div>
                      <div className="menu-item-bottom">
                        <span className="menu-item-price">{item.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                        <button 
                          className="btn-add-item"
                          onClick={() => handleAddItemToCart(item)}
                        >
                          + {lang === 'ar' ? 'أضف للطلب' : 'Add to Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FULLSCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightboxItem && (
        <div className="lightbox-backdrop" onClick={() => setLightboxItem(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setLightboxItem(null)}>✕</button>
            <img src={lightboxItem.src} alt={lang === 'ar' ? lightboxItem.titleAr : lightboxItem.titleEn} className="lightbox-img" />
            <div className="lightbox-caption">
              <div>{lang === 'ar' ? lightboxItem.titleAr : lightboxItem.titleEn}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '400', marginTop: '4px' }}>
                {lang === 'ar' ? lightboxItem.subtitleAr : lightboxItem.subtitleEn}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="restaurant-toast">
          <Sparkles size={18} color="#2ad0ed" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
