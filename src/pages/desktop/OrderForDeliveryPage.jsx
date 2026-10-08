import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Trash2, 
  Lock, 
  Utensils, 
  Check, 
  Share2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Phone,
  Building2,
  ShieldCheck
} from 'lucide-react';
import './OrderForDeliveryPage.css';

// Initial dishes corresponding to the design screenshot + extended selections
const INITIAL_MENU_ITEMS = [
  {
    id: 'dish-burger',
    nameEn: 'Classic Gourmet Smashed Burger',
    nameAr: 'كلاسيك جورميه سماشد برجر',
    descEn: 'Double smash patties, aged melted cheddar, crisp romaine, caramelized onions & signature house relish...',
    descAr: 'شريحتان سماش لحم بقري بلدي، شيدر معتق ذائب، خس مقرمش، بصل مكرمل وصوص دريم السري المميز...',
    price: 180,
    category: 'food',
    image: '/photo/kid area pic/dish_burger.png',
    badge: true,
    isChefSpecial: true,
    initialQty: 1
  },
  {
    id: 'dish-pizza',
    nameEn: 'Artisanal Margherita Bufala Pizza',
    nameAr: 'بيتزا مارجريتا بوفالو الحرفية',
    descEn: 'Hand-stretched Neapolitan crust, San Marzano tomato coulis, fresh buffalo mozzarella, fresh sweet...',
    descAr: 'عجينة نابوليتان هشة مخبوزة على الحجر، صلصة سان مارزانو، موزاريلا بافلو طازجة وريحان عطري...',
    price: 220,
    category: 'food',
    image: '/photo/kid area pic/dish_pizza.png',
    isChefSpecial: true,
    initialQty: 1
  },
  {
    id: 'dish-latte',
    nameEn: 'Iced Salted Caramel Barista Latte',
    nameAr: 'آيسد سولتد كراميل باريستا لاتيه',
    descEn: 'Double shot specialty espresso, silky steamed oat milk, handcrafted salted caramel drizzle over crystal...',
    descAr: 'دبل شوت إسبريسو كولومبي فاخر، حليب بارد حريري، صلصة كراميل مملح ومكعبات ثلج كريستالية...',
    price: 90,
    category: 'cafe',
    image: '/photo/kid area pic/dish_latte.png',
    isChefSpecial: true,
    initialQty: 0
  },
  {
    id: 'dish-deluxe-box',
    nameEn: 'American Dream Crispy Deluxe Box',
    nameAr: 'أمريكان دريم كريسبي ديلوكس بوكس',
    descEn: 'Juicy craft burger, seasoned crinkle fries, creamy dipping sauce, and cold craft beverage in eco-...',
    descAr: 'برجر كرافت جوسي شهي، بطاطس كرينكل مقرمشة مبهرة، صوص تغميس كريمي ومشروب بارد في بوكس مميز...',
    price: 260,
    category: 'food',
    image: '/photo/kid area pic/dish_deluxe_box.png',
    isChefSpecial: true,
    initialQty: 0
  },
  {
    id: 'dish-cake',
    nameEn: 'Decadent Valrhona Fudge Cake',
    nameAr: 'كيك فادج شوكولاتة فالرونا الفاخرة',
    descEn: 'Warm layered Belgian chocolate sponge, silky dark ganache, fresh canal raspberries & mint leaves.',
    descAr: 'طبقات كيك شوكولاتة بلجيكية دافئة غنية بالجناش الحريري، توت العليق الطازج وأوراق النعناع.',
    price: 140,
    category: 'desserts',
    image: '/photo/kid area pic/dish_cake.png',
    isChefSpecial: true,
    initialQty: 1
  },
  {
    id: 'dish-cooler',
    nameEn: 'Passionfruit Mango Breeze Cooler',
    nameAr: 'باشن فروت ومانجو بريز كولر المنعش',
    descEn: 'Cold-pressed ripe mango, tangy passionfruit pulp, fresh mint leaves, crushed ice & sparkling soda.',
    descAr: 'عصير مانجو إسماعيلية طازج معصور بارداً، لب باشن فروت حامض حلو، نعناع طازج وصودا فوارة.',
    price: 95,
    category: 'drinks',
    image: '/photo/kid area pic/dish_cooler.png',
    isChefSpecial: true,
    initialQty: 0
  }
];

// Delivery Zones in Ismailia
const ISMAILIA_DELIVERY_ZONES = [
  { id: 'ferdan', nameEn: 'Ferdan District / Ismailia City', nameAr: 'حي الفردان / مدينة الإسماعيلية', time: 'Approx. 35-45 mins' },
  { id: 'promenade-1', nameEn: 'Dream Promenade / Canal Walk Gate 1', nameAr: 'ممشى دريم / بوابة القناة 1', time: 'Approx. 15-25 mins' },
  { id: 'promenade-2', nameEn: 'Dream Promenade / Waterfront Gate 2', nameAr: 'ممشى دريم / بوابة الواجهة المائية 2', time: 'Approx. 15-25 mins' },
  { id: 'university', nameEn: 'Suez Canal University District / Ring Rd', nameAr: 'حي جامعة قناة السويس / الطريق الدائري', time: 'Approx. 30-40 mins' },
  { id: 'sheikh-zayed', nameEn: 'El Sheikh Zayed / District 24', nameAr: 'الشيخ زايد / الحي الـ 24', time: 'Approx. 35-45 mins' },
  { id: 'sultan-hussein', nameEn: 'Sultan Hussein / Downtown Ismailia', nameAr: 'شارع السلطان حسين / وسط البلد', time: 'Approx. 40-50 mins' }
];

export default function OrderForDeliveryPage({ onBack, lang = 'ar' }) {
  const isAr = lang === 'ar';

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Quantities state: initialized with exact screenshot matching items
  const [cartQuantities, setCartQuantities] = useState(() => {
    const initial = {};
    INITIAL_MENU_ITEMS.forEach(item => {
      initial[item.id] = item.initialQty || 0;
    });
    return initial;
  });

  // Delivery destination state
  const [selectedZone, setSelectedZone] = useState(ISMAILIA_DELIVERY_ZONES[0]);
  const [customAddress, setCustomAddress] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Legacy modal fallback state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'wallet'

  // Cart calculations
  const cartItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(item => (cartQuantities[item.id] || 0) > 0).map(item => ({
      ...item,
      qty: cartQuantities[item.id],
      lineTotal: item.price * cartQuantities[item.id]
    }));
  }, [cartQuantities]);

  const totalItemsCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((sum, q) => sum + (q || 0), 0);
  }, [cartQuantities]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItems]);

  const deliveryFee = 0.0; // FREE Promotion
  const vatRate = 0.14; // 14% VAT & Municipal Service
  const vatAmount = subtotal * vatRate;
  const grandTotal = Math.max(0, subtotal + vatAmount);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(dish => {
      // Category match
      let matchesCat = true;
      if (selectedCategory === 'food') {
        matchesCat = dish.category === 'food';
      } else if (selectedCategory === 'drinks') {
        matchesCat = dish.category === 'drinks' || dish.category === 'cafe';
      } else if (selectedCategory === 'desserts') {
        matchesCat = dish.category === 'desserts';
      } else if (selectedCategory === 'cafe') {
        matchesCat = dish.category === 'cafe';
      }

      // Search query match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch = (
          dish.nameEn.toLowerCase().includes(q) ||
          dish.nameAr.includes(q) ||
          dish.descEn.toLowerCase().includes(q) ||
          dish.descAr.includes(q)
        );
      }

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quantity control helpers
  const handleUpdateQty = (dishId, delta) => {
    setCartQuantities(prev => {
      const current = prev[dishId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [dishId]: next };
    });
  };

  const handleRemoveFromCart = (dishId) => {
    setCartQuantities(prev => ({ ...prev, [dishId]: 0 }));
  };

  const scrollCategoryPills = (direction) => {
    const el = document.getElementById('deliv-category-pills');
    if (el) {
      const scrollStep = 180;
      const factor = isAr 
        ? (direction === 'left' ? scrollStep : -scrollStep) 
        : (direction === 'left' ? -scrollStep : scrollStep);
      el.scrollBy({ left: factor, behavior: 'smooth' });
    }
  };

  // Page View: 'menu' | 'checkout' | 'success'
  const [pageView, setPageView] = useState('menu');

  // Delivery Checkout Form State (Matching exact design screenshot)
  const [deliveryFullName, setDeliveryFullName] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('american_dream_user_profile') || '{}');
      return p.name || '';
    } catch { return ''; }
  });
  const [deliveryPhone, setDeliveryPhone] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('american_dream_user_profile') || '{}');
      return p.phone || '';
    } catch { return ''; }
  });
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('american_dream_user_profile') || '{}');
      return p.address || '';
    } catch { return ''; }
  });
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [orderTrackingCode, setOrderTrackingCode] = useState('');

  // Auto-sync initial delivery destination if customAddress or selectedZone changed
  useEffect(() => {
    if (!deliveryAddress) {
      if (customAddress) {
        setDeliveryAddress(customAddress);
      } else if (selectedZone) {
        setDeliveryAddress(isAr ? selectedZone.nameAr : selectedZone.nameEn);
      }
    }
  }, [customAddress, selectedZone, isAr]);

  // Confirm Delivery Order from Delivery Details Page
  const handleConfirmDeliveryOrder = (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!deliveryFullName.trim()) {
      setCheckoutError(isAr ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }
    if (!deliveryPhone.trim()) {
      setCheckoutError(isAr ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Please enter your phone number');
      return;
    }
    if (!deliveryAddress.trim()) {
      setCheckoutError(isAr ? 'يرجى إدخال عنوان التوصيل بالتفصيل' : 'Please enter your delivery address');
      return;
    }

    const code = `AD-DLV-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderTrackingCode(code);

    // Save order in localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('american_dream_orders') || '[]');
      existingOrders.unshift({
        orderId: code,
        type: 'restaurant-delivery',
        date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        customerName: deliveryFullName,
        customerPhone: deliveryPhone,
        address: deliveryAddress,
        notes: deliveryNotes,
        itemsCount: totalItemsCount,
        items: cartItems.map(i => ({ name: isAr ? i.nameAr : i.nameEn, qty: i.qty, price: i.price, lineTotal: i.lineTotal })),
        total: grandTotal,
        status: 'preparing',
        statusTextAr: 'قيد التحضير في مطبخ أمريكان دريم',
        statusTextEn: 'Preparing in American Dream Kitchen',
        eta: '35–45 MIN'
      });
      localStorage.setItem('american_dream_orders', JSON.stringify(existingOrders));
    } catch {}

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#00a9c3', '#fde047', '#ffffff']
      });
    } catch {}

    setPageView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp order dispatch
  const handleSendToWhatsApp = () => {
    const phone = '201012345678';
    const itemsList = cartItems.map(i => 
      `- ${isAr ? i.nameAr : i.nameEn} (${i.qty}x) = ${i.lineTotal.toFixed(2)} EGP`
    ).join('%0A');

    const msg = isAr
      ? `طلب توصيل جديد من مطعم أمريكان دريم الإسماعيلية:%0A- كود الطلب: ${orderTrackingCode}%0A- اسم العميل: ${deliveryFullName}%0A- الهاتف: ${deliveryPhone}%0A- العنوان: ${deliveryAddress}%0A- الوجبات المطلوبة:%0A${itemsList}%0A- الإجمالي الكلي: ${grandTotal.toFixed(2)} ج.م (شامل الضريبة)%0A- وقت الوصول التقديري: 35-45 دقيقة%0A- ملاحظات: ${deliveryNotes || 'لا يوجد'}`
      : `New Delivery Order from American Dream Ismailia:%0A- Order Ref: ${orderTrackingCode}%0A- Name: ${deliveryFullName}%0A- Phone: ${deliveryPhone}%0A- Address: ${deliveryAddress}%0A- Items:%0A${itemsList}%0A- Grand TOTAL: ${grandTotal.toFixed(2)} EGP (All Taxes Included)%0A- ETA: 35-45 MIN%0A- Notes: ${deliveryNotes || 'None'}`;

    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // -------------------------------------------------------------------------
  // VIEW 1: CHECKOUT - "DELIVERY DETAILS" (Exact match to design screenshot)
  // -------------------------------------------------------------------------
  if (pageView === 'checkout') {
    return (
      <div className={`deliv-checkout-wrapper ${isAr ? 'font-alexandria lang-ar' : 'lang-en'}`}>
        <div className="deliv-details-card" dir={isAr ? 'rtl' : 'ltr'}>
          {/* Top Badge Pill */}
          <div className="deliv-badge-pill">
            <span className="deliv-badge-dot">●</span>
            <span className="deliv-badge-text">
              <span className="deliv-badge-bolt">⚡</span> 35–45 MIN • ISMAILIA ZONE
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="deliv-title-wrap">
            <h2 className="deliv-main-heading">
              {isAr ? (
                <>
                  <span className="deliv-title-white">تفاصيل </span>
                  <span className="deliv-title-yellow">التوصيل </span>
                  <span className="deliv-title-cyan">السريع</span>
                </>
              ) : (
                <>
                  <span className="deliv-title-white">D</span>
                  <span className="deliv-title-yellow">eliv</span>
                  <span className="deliv-title-white">er</span>
                  <span className="deliv-title-cyan">y</span>{' '}
                  <span className="deliv-title-white">D</span>
                  <span className="deliv-title-white">et</span>
                  <span className="deliv-title-yellow">a</span>
                  <span className="deliv-title-white">i</span>
                  <span className="deliv-title-cyan">ls</span>
                </>
              )}
            </h2>
            <p className="deliv-main-subtitle">
              {isAr 
                ? 'أين نوصّل وجباتك الطازجة المفضلة من أمريكان دريم في الإسماعيلية؟' 
                : 'Where should we bring your fresh American Dream favorites in Ismailia?'}
            </p>
          </div>

          {/* Error Message */}
          {checkoutError && (
            <div className="deliv-checkout-error">
              <span>⚠️</span>
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleConfirmDeliveryOrder} className="deliv-form-block">
            {/* Field 1: Full Name */}
            <div className="deliv-field-group">
              <div className="deliv-field-row-header">
                <label className="deliv-field-label">
                  {isAr ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <span className="deliv-field-hint">
                  {isAr ? 'مطلوب' : 'Required'}
                </span>
              </div>
              <div className="deliv-white-input-wrap">
                <User size={18} className="deliv-white-input-icon" />
                <input 
                  type="text" 
                  required
                  className="deliv-white-input"
                  placeholder={isAr ? 'مثال: عمر عبد الرحمن' : 'e.g. Omar Abdelrahman'}
                  value={deliveryFullName}
                  onChange={(e) => setDeliveryFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Field 2: Phone Number */}
            <div className="deliv-field-group">
              <div className="deliv-field-row-header">
                <label className="deliv-field-label">
                  {isAr ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <span className="deliv-field-hint">
                  {isAr ? 'لتواصل مندوب التوصيل' : 'For delivery courier call'}
                </span>
              </div>
              <div className="deliv-white-input-wrap">
                <Phone size={18} className="deliv-white-input-icon" />
                <input 
                  type="tel" 
                  required
                  className="deliv-white-input"
                  placeholder="101 234 5678"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Field 3: Delivery Address */}
            <div className="deliv-field-group">
              <div className="deliv-field-row-header">
                <label className="deliv-field-label">
                  <span style={{ color: '#f59e0b' }}>📍</span>
                  <span>{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                </label>
              </div>
              <textarea 
                required
                className="deliv-white-textarea"
                placeholder={isAr ? 'اسم الحي، الشارع، رقم العمارة، الإسماعيلية...' : 'District name, street name, building number, Ismailia...'}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            {/* Field 4: Optional Address Notes */}
            <div className="deliv-field-group">
              <div className="deliv-field-row-header">
                <label className="deliv-field-label">
                  {isAr ? 'ملاحظات إضافية للعنوان' : 'Optional Address Notes'}
                </label>
                <span className="deliv-field-hint">
                  {isAr ? '(اختياري)' : '(Optional)'}
                </span>
              </div>
              <div className="deliv-white-input-wrap">
                <Building2 size={18} className="deliv-white-input-icon" />
                <input 
                  type="text" 
                  className="deliv-white-input"
                  placeholder={isAr ? 'رقم الشقة، الدور، علامة مميزة، كود البوابة...' : 'Apartment, floor, landmark, gate code...'}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="deliv-summary-box">
              <div className="deliv-summary-left">
                <div className="deliv-summary-icon-box">
                  <ShoppingBag size={22} color="#f59e0b" />
                </div>
                <div className="deliv-summary-text-col">
                  <span className="deliv-summary-items-count">
                    {totalItemsCount} {isAr ? 'عناصر في الطلب' : 'items in order'}
                  </span>
                  <span className="deliv-summary-pay-note">
                    {isAr ? 'الدفع عند الاستلام • كاش أو فيزا' : 'Pay on arrival • Cash or Card'}
                  </span>
                </div>
              </div>

              <div className="deliv-summary-right">
                <span className="deliv-summary-due-label">
                  {isAr ? 'المبلغ المستحق' : 'TOTAL DUE'}
                </span>
                <span className="deliv-summary-due-amount">
                  {grandTotal.toFixed(2)} <span className="deliv-summary-egp">{isAr ? 'ج.م' : 'EGP'}</span>
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button type="submit" className="deliv-confirm-btn">
              <span>{isAr ? 'تأكيد الطلب ←' : 'Confirm Order →'}</span>
            </button>

            {/* Back to Cart Link */}
            <button 
              type="button" 
              className="deliv-back-link"
              onClick={() => {
                setPageView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>{isAr ? '← العودة إلى السلة' : '← Back to Cart'}</span>
            </button>
          </form>

          {/* Footer note */}
          <div className="deliv-footer-note">
            <span className="deliv-footer-secure">
              <ShieldCheck size={14} color="#00a9c3" />
              <span>
                {isAr 
                  ? 'طلب آمن ومضمون 100% • محضر طازجاً في مطبخ أمريكان دريم' 
                  : '100% secure order • Freshly prepared at American Dream Kitchen'}
              </span>
            </span>
            <span className="deliv-footer-branch">
              ISMAILIA CANAL PROMENADE BRANCH
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW 2: SUCCESS - ORDER CONFIRMATION
  // -------------------------------------------------------------------------
  if (pageView === 'success') {
    return (
      <div className={`deliv-checkout-wrapper ${isAr ? 'font-alexandria lang-ar' : 'lang-en'}`}>
        <div className="deliv-success-card" dir={isAr ? 'rtl' : 'ltr'}>
          {/* Top Badge Pill */}
          <div className="deliv-badge-pill">
            <span className="deliv-badge-dot">●</span>
            <span className="deliv-badge-text">
              <span className="deliv-badge-bolt">⚡</span> 35–45 MIN • ISMAILIA ZONE
            </span>
          </div>

          <div className="deliv-success-check-badge">✓</div>

          <h2 className="deliv-success-title">
            {isAr ? 'تم استلام طلب التوصيل بنجاح!' : 'Order Placed Successfully!'}
          </h2>

          <p className="deliv-success-desc">
            {isAr 
              ? `شكراً لك يا ${deliveryFullName}! وجباتك بقيمة ${grandTotal.toFixed(2)} ج.م قيد التحضير في مطبخ أمريكان دريم الآن، وسيتصل بك الطيار فور انطلاقه.`
              : `Thank you ${deliveryFullName}! Your fresh American Dream favorites (${grandTotal.toFixed(2)} EGP) are being prepared now and on the way.`}
          </p>

          <div className="deliv-tracking-code-pill">
            <span className="deliv-tracking-label">{isAr ? 'كود تتبع الطلب:' : 'Order Tracking Code:'}</span>
            <strong className="deliv-tracking-val">{orderTrackingCode}</strong>
          </div>

          {/* Items breakdown */}
          <div className="deliv-success-breakdown">
            {cartItems.map((item) => (
              <div key={item.id} className="deliv-success-row">
                <span>{item.qty}x {isAr ? item.nameAr : item.nameEn}</span>
                <span>{item.lineTotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
              </div>
            ))}
            <div className="deliv-success-row grand">
              <span>{isAr ? 'المجموع الكلي:' : 'Total Amount:'}</span>
              <span style={{ color: '#fde047' }}>{grandTotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>

          {/* WhatsApp Button */}
          <button 
            type="button" 
            className="btn-whatsapp-order"
            onClick={handleSendToWhatsApp}
          >
            <Share2 size={18} />
            <span>{isAr ? 'إرسال الفاتورة للمطعم عبر واتساب' : 'Send Invoice to WhatsApp'}</span>
          </button>

          {/* Back to Menu Button */}
          <button 
            type="button" 
            className="deliv-confirm-btn"
            style={{ marginTop: '4px' }}
            onClick={() => {
              setPageView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span>{isAr ? 'العودة لقائمة المطعم' : 'Return to Restaurant Menu'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`delivery-order-page ${isAr ? 'rtl' : ''}`}>

      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP BAR: BACK NAVIGATION                                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="deliv-top-bar">
        <button 
          type="button" 
          className="btn-back-to-dining"
          onClick={onBack}
        >
          {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{isAr ? 'العودة للمطعم والكافيه' : 'Back to Restaurant & Cafe'}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. HEADER: ORDER FOR DELIVERY                                       */}
      {/* ------------------------------------------------------------------- */}
      <header className="deliv-header-section">
        <h1 className="deliv-main-title">
          {isAr ? (
            <>
              <span className="title-orange">طَلَب </span>
              <span className="title-dark">التَّوْصِيل </span>
              <span className="title-orange">السَّرِيع </span>
              <span className="title-dark">وَالسَّفَرِي</span>
            </>
          ) : (
            <>
              <span className="title-orange">OR</span>
              <span className="title-dark">DER </span>
              <span className="title-orange">FOR </span>
              <span className="title-dark">DELIVERY</span>
            </>
          )}
        </h1>
        <p className="deliv-main-subtitle">
          {isAr 
            ? 'أطباق منتجعك المفضلة، تصلك ساخنة وطازجة مباشرة إلى باب منزلك في الإسماعيلية.'
            : 'Your resort favorites, delivered hot and fresh directly to your door in Ismailia.'}
        </p>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* 3. CATEGORY PILLS & SEARCH BAR ROW                                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="deliv-controls-row">
        {/* Category Pills Slider Container */}
        <div className="deliv-category-slider-wrapper">
          <button 
            type="button" 
            className="deliv-slide-btn prev"
            onClick={() => scrollCategoryPills('left')}
            title={isAr ? "السابق" : "Previous"}
            aria-label="Previous categories"
          >
            {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="deliv-category-pills" id="deliv-category-pills">
            <button 
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span>{isAr ? 'الكل' : 'ALL'}</span>
            </button>

            <button 
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'food' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('food')}
            >
              <img 
                src="/photo/kid area pic/icon/Icon (30).png" 
                alt="Food" 
                className="cat-pill-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{isAr ? 'طعام' : 'FOOD'}</span>
            </button>

            <button 
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'drinks' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('drinks')}
            >
              <img 
                src="/photo/kid area pic/icon/Icon (19).png" 
                alt="Drinks" 
                className="cat-pill-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{isAr ? 'مشروبات' : 'DRINKS'}</span>
            </button>

            <button 
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'desserts' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('desserts')}
            >
              <img 
                src="/photo/kid area pic/icon/Icon (21).png" 
                alt="Desserts" 
                className="cat-pill-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{isAr ? 'حلويات' : 'DESSERTS'}</span>
            </button>

            <button 
              type="button"
              className={`cat-pill-btn ${selectedCategory === 'cafe' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('cafe')}
            >
              <img 
                src="/photo/kid area pic/icon/Icon (26).png" 
                alt="Café" 
                className="cat-pill-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{isAr ? 'كافيه' : 'CAFÉ'}</span>
            </button>
          </div>

          <button 
            type="button" 
            className="deliv-slide-btn next"
            onClick={() => scrollCategoryPills('right')}
            title={isAr ? "التالي" : "Next"}
            aria-label="Next categories"
          >
            {isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="deliv-search-bar">
          <img 
            src="/photo/kid area pic/icon/Icon (25).png" 
            alt="Search" 
            className="deliv-search-icon"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <input 
            type="text" 
            className="deliv-search-input"
            placeholder={isAr ? 'ابحث عن الأطباق، المشروبات، أو الحلويات...' : 'Search dishes, drinks, or desserts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="deliv-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. MAIN LAYOUT: DISHES GRID (LEFT) + STICKY CART (RIGHT)            */}
      {/* ------------------------------------------------------------------- */}
      <div className="deliv-layout-grid">
        
        {/* ----------------------------------------------------------------- */}
        {/* COLUMN 1: DISHES SELECTION                                        */}
        {/* ----------------------------------------------------------------- */}
        <div className="deliv-menu-column">
          <div className="deliv-dishes-grid">
            {filteredDishes.length === 0 ? (
              <div className="deliv-empty-search">
                <Search size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <p>{isAr ? 'لم نتمكن من إيجاد أطباق تطابق بحثك.' : 'No dishes found matching your search.'}</p>
                <button 
                  type="button" 
                  className="btn-back-to-dining" 
                  style={{ margin: '8px auto 0 auto' }}
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                >
                  {isAr ? 'عرض جميع الأطباق' : 'View All Dishes'}
                </button>
              </div>
            ) : (
              filteredDishes.map((dish) => {
                const qty = cartQuantities[dish.id] || 0;

                return (
                  <div key={dish.id} className="deliv-dish-card">
                    {/* Dish Image */}
                    <div className="deliv-dish-image-wrapper">
                      <img 
                        src={dish.image} 
                        alt={isAr ? dish.nameAr : dish.nameEn} 
                        className="deliv-dish-image"
                        loading="lazy"
                      />
                      {dish.badge && (
                        <div className="dish-logo-badge" title="American Dream Signature">
                          <img 
                            src="/photo/logo/logo nav bar and footer.png" 
                            alt="Logo" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Dish Details */}
                    <div className="deliv-dish-content">
                      <h3 className="deliv-dish-title">
                        {isAr ? dish.nameAr : dish.nameEn}
                      </h3>
                      <p className="deliv-dish-desc">
                        {isAr ? dish.descAr : dish.descEn}
                      </p>

                      <div className="deliv-dish-footer">
                        <span className="deliv-dish-price">
                          {dish.price} {isAr ? 'ج.م' : 'EGP'}
                        </span>

                        {qty > 0 ? (
                          <div className="dish-qty-control-pill">
                            <button 
                              type="button" 
                              className="dish-qty-btn"
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="dish-qty-number">{qty}</span>
                            <button 
                              type="button" 
                              className="dish-qty-btn"
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            className="btn-dish-add"
                            onClick={() => handleUpdateQty(dish.id, 1)}
                          >
                            + {isAr ? 'أضف' : 'Add'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* COLUMN 2: STICKY "YOUR CART" PANEL                                */}
        {/* ----------------------------------------------------------------- */}
        <aside className="deliv-cart-sidebar">
          
          {/* Header */}
          <div className="deliv-cart-header">
            <div className="cart-title-wrap">
              <img 
                src="/photo/kid area pic/icon/Icon (27).png" 
                alt="Cart" 
                className="cart-header-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="cart-header-title">{isAr ? 'سَلَّتُك' : 'YOUR CART'}</span>
            </div>

            <span className="cart-badge-pill">
              {totalItemsCount} {isAr ? 'عناصر' : 'Items'}
            </span>
          </div>

          {/* Delivering To Destination Box */}
          <div className="deliv-dest-box">
            <div className="dest-row-top">
              <div className="dest-label-group">
                <img 
                  src="/photo/kid area pic/icon/Icon (31).png" 
                  alt="Location" 
                  className="dest-pin-icon"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="dest-label">{isAr ? 'التوصيل إلى' : 'DELIVERING TO'}</span>
              </div>

              <button 
                type="button" 
                className="btn-dest-change"
                onClick={() => setIsAddressModalOpen(true)}
              >
                {isAr ? 'تغيير' : 'Change'}
              </button>
            </div>

            <p className="dest-address-text">
              {customAddress ? customAddress : (isAr ? selectedZone.nameAr : selectedZone.nameEn)}
            </p>

            <div className="dest-time-row">
              <img 
                src="/photo/kid area pic/icon/Icon (32).png" 
                alt="Time" 
                className="dest-clock-icon"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{isAr ? 'الوصول المتوقع: 35 - 45 دقيقة' : selectedZone.time}</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="deliv-cart-items-list">
            {cartItems.length === 0 ? (
              <div className="cart-empty-message">
                <ShoppingBag size={28} color="#cbd5e1" style={{ marginBottom: '6px' }} />
                <p style={{ margin: 0 }}>{isAr ? 'سلتك فارغة حالياً' : 'Your cart is currently empty'}</p>
                <small>{isAr ? 'اختر من الأطباق اللذيذة بالأعلى' : 'Choose dishes from the menu above'}</small>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="deliv-cart-item-row">
                  <img src={item.image} alt={isAr ? item.nameAr : item.nameEn} className="cart-item-thumb" />

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{isAr ? item.nameAr : item.nameEn}</h4>
                    <div className="cart-item-unit-price">
                      {item.price} {isAr ? 'ج.م للقطعة' : 'EGP each'}
                    </div>

                    <div className="cart-item-qty-pill">
                      <button 
                        type="button" 
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQty(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="cart-qty-val">{item.qty}</span>
                      <button 
                        type="button" 
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right-actions">
                    <span className="cart-item-subtotal">
                      {item.lineTotal} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                    <button 
                      type="button" 
                      className="btn-cart-remove"
                      title={isAr ? 'حذف من السلة' : 'Remove item'}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <img 
                        src="/photo/kid area pic/icon/Icon (33).png" 
                        alt="Delete" 
                        className="cart-trash-icon"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Special Requests / Cutlery Input */}
          <div className="deliv-notes-box">
            <img 
              src="/photo/kid area pic/icon/222222481.png" 
              alt="Cutlery" 
              className="notes-cutlery-icon"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <input 
              type="text" 
              className="deliv-notes-input"
              placeholder={isAr ? 'إضافة أدوات مائدة، مناديل إضافية، أو ملاحظات...' : 'Add cutlery, extra napkins, or notes...'}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
            />
          </div>

          {/* Calculations Breakdown */}
          <div className="deliv-calc-wrap">
            <div className="calc-row">
              <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span style={{ fontWeight: '700' }}>{subtotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
            </div>

            <div className="calc-row">
              <div className="calc-label-with-badge">
                <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span className="promo-pill-badge">{isAr ? 'عرض' : 'Promotion'}</span>
              </div>
              <div>
                <span className="calc-val-strikethrough">25 {isAr ? 'ج.م' : 'EGP'}</span>
                <span className="calc-val-free">{isAr ? '0.00 ج.م (مجاناً)' : '0.00 EGP (FREE)'}</span>
              </div>
            </div>

            <div className="calc-row">
              <span>{isAr ? 'ضريبة القيمة المضافة والخدمة (14%)' : 'VAT & Municipal Service (14%)'}</span>
              <span>{vatAmount.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
            </div>


            <div className="calc-row-grand">
              <div className="grand-title-col">
                <span className="grand-title-text">{isAr ? 'الإجمالي الكلي' : 'Grand TOTAL'}</span>
                <span className="grand-tax-note">{isAr ? 'شامل كافة الضرائب' : 'ALL TAXES INCLUDED'}</span>
              </div>
              <span className="grand-total-amount">
                {grandTotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            type="button" 
            className="btn-proceed-checkout"
            disabled={cartItems.length === 0}
            onClick={() => {
              setPageView('checkout');
              setCheckoutError('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img 
              src="/photo/kid area pic/icon/Icon (28).png" 
              alt="Checkout" 
              className="checkout-lock-icon"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span>{isAr ? 'مُتَابَعَة الدَّفْع والإنْهَاء ←' : 'PROCEED TO CHECKOUT →'}</span>
          </button>
        </aside>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. MODAL: ADDRESS SELECTOR                                          */}
      {/* ------------------------------------------------------------------- */}
      {isAddressModalOpen && (
        <div className="deliv-modal-backdrop" onClick={() => setIsAddressModalOpen(false)}>
          <div className="deliv-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="deliv-modal-close" onClick={() => setIsAddressModalOpen(false)}>✕</button>

            <div className="deliv-modal-header">
              <h3>{isAr ? 'اختر عنوان التوصيل في الإسماعيلية' : 'Select Delivery Destination in Ismailia'}</h3>
              <p>{isAr ? 'نصلك أينما كنت بأقصى سرعة وطعام طازج' : 'Hot & fresh food delivered fast to your exact spot'}</p>
            </div>

            <div className="address-options-list">
              {ISMAILIA_DELIVERY_ZONES.map(zone => (
                <div 
                  key={zone.id}
                  className={`address-option-card ${selectedZone.id === zone.id && !customAddress ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedZone(zone);
                    setCustomAddress('');
                    setIsAddressModalOpen(false);
                  }}
                >
                  <div>
                    <div className="addr-opt-name">{isAr ? zone.nameAr : zone.nameEn}</div>
                    <div className="addr-opt-est">{zone.time}</div>
                  </div>
                  {selectedZone.id === zone.id && !customAddress && (
                    <Check size={18} color="#028090" />
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '10px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'أو اكتب عنوانك بالتفصيل:' : 'Or type your custom address:'}
              </label>
              <input 
                type="text" 
                className="custom-addr-input"
                placeholder={isAr ? 'الشارع / رقم العمارة / الممشى' : 'Street name, building, floor, landmark...'}
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
              />
              {customAddress && (
                <button 
                  type="button" 
                  className="btn-proceed-checkout" 
                  style={{ marginTop: '10px', padding: '10px' }}
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  {isAr ? 'تأكيد العنوان المخصص' : 'Save Custom Address'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}



      {/* ------------------------------------------------------------------- */}
      {/* 7. MODAL: CHECKOUT & ORDER CONFIRMATION FLOW                        */}
      {/* ------------------------------------------------------------------- */}
      {isCheckoutModalOpen && (
        <div className="deliv-modal-backdrop" onClick={() => setIsCheckoutModalOpen(false)}>
          <div className="deliv-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="deliv-modal-close" onClick={() => setIsCheckoutModalOpen(false)}>✕</button>

            {checkoutStep === 'form' ? (
              <form onSubmit={handleConfirmOrder} className="checkout-form-grid">
                <div className="deliv-modal-header">
                  <h3>{isAr ? 'إتمام طلب التوصيل السريع' : 'Complete Delivery Order'}</h3>
                  <p>{isAr ? 'أدخل تفاصيل التوصيل لنبدأ بتحضير وجباتك فوراً' : 'Enter your details to prepare your order immediately'}</p>
                </div>

                <div className="form-group-field">
                  <label>{isAr ? 'اسم المستلم بالكامل *' : 'Full Name *'}</label>
                  <input 
                    type="text" 
                    required 
                    className="checkout-input"
                    placeholder={isAr ? 'مثال: أحمد محمود' : 'e.g. John Doe'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group-field">
                  <label>{isAr ? 'رقم الهاتف / الواتساب للتواصل *' : 'Phone / WhatsApp Number *'}</label>
                  <input 
                    type="tel" 
                    required 
                    className="checkout-input"
                    placeholder="01012345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group-field">
                  <label>{isAr ? 'عنوان التوصيل' : 'Delivery Destination'}</label>
                  <input 
                    type="text" 
                    className="checkout-input"
                    readOnly
                    value={customAddress ? customAddress : (isAr ? selectedZone.nameAr : selectedZone.nameEn)}
                  />
                </div>

                {/* Payment Method */}
                <div className="form-group-field">
                  <label>{isAr ? 'طريقة الدفع' : 'Payment Method'}</label>
                  <div className="payment-methods-grid">
                    <div 
                      className={`payment-method-pill ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <span className="pay-icon">💵</span>
                      <span>{isAr ? 'كاش عند الاستلام' : 'Cash on Delivery'}</span>
                    </div>

                    <div 
                      className={`payment-method-pill ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <span className="pay-icon">💳</span>
                      <span>{isAr ? 'فيزا / ماستركارد' : 'Bank Card'}</span>
                    </div>

                    <div 
                      className={`payment-method-pill ${paymentMethod === 'wallet' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <span className="pay-icon">📱</span>
                      <span>{isAr ? 'إنستاباي / محفظة' : 'InstaPay / Wallet'}</span>
                    </div>
                  </div>
                </div>

                {/* Loyalty points toggle in checkout */}
                <div className="points-discount-card">
                  <div className="points-card-left">
                    <span className="points-card-title">{isAr ? 'استخدام 2,250 نقطة ولاء' : 'Apply 2,250 Loyalty Points'}</span>
                    <span className="points-card-sub">{isAr ? 'خصم 112.50 ج.م فوري من الإجمالي' : 'Save 112.50 EGP on this order'}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={applyLoyaltyDiscount}
                    onChange={(e) => setApplyLoyaltyDiscount(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#d97706', cursor: 'pointer' }}
                  />
                </div>

                {/* Final Breakdown */}
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{isAr ? 'عدد الوجبات:' : 'Meals Count:'}</span>
                    <strong>{totalItemsCount} {isAr ? 'عناصر' : 'Items'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>{subtotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{isAr ? 'التوصيل:' : 'Delivery:'}</span>
                    <span style={{ color: '#0d9488', fontWeight: '700' }}>{isAr ? 'مجاني (0.00 ج.م)' : '0.00 EGP (FREE)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{isAr ? 'الضريبة والخدمة (14%):' : 'VAT & Municipal (14%):'}</span>
                    <span>{vatAmount.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  {loyaltyDiscountValue > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontWeight: '700', marginBottom: '4px' }}>
                      <span>{isAr ? 'خصم النقاط:' : 'Points Discount:'}</span>
                      <span>-{loyaltyDiscountValue.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '1.05rem', fontWeight: '900', color: '#073b4c' }}>
                    <span>{isAr ? 'المبلغ المستحق:' : 'Total Payable:'}</span>
                    <span>{grandTotal.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                </div>

                <button type="submit" className="btn-proceed-checkout" style={{ padding: '14px 20px' }}>
                  <Check size={18} />
                  <span>{isAr ? `تأكيد طلب التوصيل (${grandTotal.toFixed(2)} ج.م)` : `CONFIRM ORDER (${grandTotal.toFixed(2)} EGP)`}</span>
                </button>
              </form>
            ) : (
              <div className="order-success-panel">
                <div className="order-success-icon-badge">✓</div>
                
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#073b4c', fontWeight: '900' }}>
                  {isAr ? 'تم استلام طلب التوصيل بنجاح!' : 'Order Placed Successfully!'}
                </h3>

                <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {isAr 
                    ? `شكراً لك يا ${customerName}! وجباتك بقيمة ${grandTotal.toFixed(2)} ج.م قيد التحضير في مطبخ أمريكان دريم الآن، وسيتصل بك الطيار فور انطلاقه.`
                    : `Thank you ${customerName}! Your order (${grandTotal.toFixed(2)} EGP) is being prepared in American Dream kitchen now.`}
                </p>

                <div className="ref-code-card">
                  <span>{isAr ? 'كود تتبع الطلب:' : 'Order Tracking Code:'}</span>
                  <strong>{orderTrackingCode}</strong>
                </div>

                <button 
                  type="button" 
                  className="btn-whatsapp-order"
                  onClick={handleSendToWhatsApp}
                >
                  <Share2 size={18} />
                  <span>{isAr ? 'إرسال الفاتورة للمطعم عبر واتساب' : 'Send Invoice to WhatsApp'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-back-to-dining"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    onBack();
                  }}
                >
                  <span>{isAr ? 'العودة لصفحة المطعم الرئيسية' : 'Return to Restaurant Home'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
