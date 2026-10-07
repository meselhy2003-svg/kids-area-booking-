import React, { useState, useMemo } from 'react';
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
  Phone,
  Gift,
  X
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
  },
  // Additional menu items for rich category filtering
  {
    id: 'dish-grills',
    nameEn: 'Waterfront Sunset Mixed Grill Feast',
    nameAr: 'مشاوي الواجهة المائية المشكلة الفاخرة',
    descEn: 'Charcoal-grilled kebab skewers, shish tawook, grilled kofta, basmati rice & fresh Lebanese salads.',
    descAr: 'كباب وكفتة وشيش طاووق على الفحم يقدم مع أرز بسمتي فاخر ومقبلات وسلطات طازجة.',
    price: 340,
    category: 'food',
    image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
    isChefSpecial: false,
    initialQty: 0
  },
  {
    id: 'dish-smoothie-mango',
    nameEn: 'Island Breeze Mango Passion Mocktail',
    nameAr: 'كوكتيل نسيم الجزيرة بالمانجو والباشن',
    descEn: 'Fresh Ismailia mango puree, passion fruit syrup, sparkling soda & garden mint.',
    descAr: 'مانجو إسماعيلية طبيعية مع سيرب الباشن فروت وصودا منعشة وأوراق النعناع.',
    price: 75,
    category: 'drinks',
    image: '/photo/kid area pic/Image (1).png',
    isChefSpecial: false,
    initialQty: 0
  },
  {
    id: 'dish-cappuccino',
    nameEn: 'American Dream Signature Cappuccino',
    nameAr: 'كابتشينو أمريكان دريم بالرغوة الغنية',
    descEn: 'Double espresso with velvety textured steamed whole milk and fine cocoa dust.',
    descAr: 'إسبريسو دبل شوت مع رغوة حليب مخملية كثيفة ورشة كاكاو فاخر.',
    price: 65,
    category: 'cafe',
    image: '/photo/kid area pic/Image (2).png',
    isChefSpecial: false,
    initialQty: 0
  },
  {
    id: 'dish-waffle',
    nameEn: 'Belgian Golden Waffle with Nutella',
    nameAr: 'وافل بلجيكي ذهبي بنوتيلا وتوت',
    descEn: 'Crispy warm Belgian waffle loaded with Nutella drizzle, Belgian strawberries & vanilla gelato.',
    descAr: 'وافل بلجيكي مقرمش ومحشو بنوتيلا غنية، فراولة طازجة وبولة آيس كريم فانيليا.',
    price: 125,
    category: 'desserts',
    image: '/photo/kid area pic/dish_cake.png',
    isChefSpecial: false,
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

  // Notes & cutlery
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Loyalty rewards modal & discount
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [applyLoyaltyDiscount, setApplyLoyaltyDiscount] = useState(false);

  // Checkout modal flow
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'success'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'wallet'
  const [orderTrackingCode, setOrderTrackingCode] = useState('');

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

  // Loyalty discount (2250 pts = 112.50 EGP off)
  const loyaltyDiscountValue = applyLoyaltyDiscount && subtotal > 150 ? 112.50 : 0.0;
  const grandTotal = Math.max(0, subtotal + vatAmount - loyaltyDiscountValue);

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

  // Checkout submission
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert(isAr ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please provide your name and phone number');
      return;
    }

    const code = `AD-DLV-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderTrackingCode(code);
    setCheckoutStep('success');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // WhatsApp order dispatch
  const handleSendToWhatsApp = () => {
    const phone = '201012345678';
    const destination = customAddress ? customAddress : (isAr ? selectedZone.nameAr : selectedZone.nameEn);
    const itemsList = cartItems.map(i => 
      `- ${isAr ? i.nameAr : i.nameEn} (${i.qty}x) = ${i.lineTotal} EGP`
    ).join('%0A');

    const msg = isAr
      ? `طلب توصيل جديد من موقع أمريكان دريم:%0A- كود الطلب: ${orderTrackingCode}%0A- اسم العميل: ${customerName}%0A- الهاتف: ${customerPhone}%0A- العنوان: ${destination}%0A- الوجبات المطلوبة:%0A${itemsList}%0A- الإجمالي الفرعي: ${subtotal.toFixed(2)} ج.م%0A- التوصيل: مجاني (عرض ترويجي)%0A- الضريبة والخدمة (14%): ${vatAmount.toFixed(2)} ج.م%0A${loyaltyDiscountValue > 0 ? `- خصم نقاط الولاء: -${loyaltyDiscountValue.toFixed(2)} ج.م%0A` : ''}- الإجمالي الكلي: ${grandTotal.toFixed(2)} ج.م%0A- طريقة الدفع: ${paymentMethod === 'cod' ? 'نقداً عند الاستلام' : paymentMethod === 'card' ? 'فيزا / بطاقة بنكية' : 'إنستاباي / فودافون كاش'}%0A- ملاحظات وأدوات المائدة: ${deliveryNotes || 'لا يوجد'}`
      : `New Delivery Order from American Dream Website:%0A- Order Ref: ${orderTrackingCode}%0A- Name: ${customerName}%0A- Phone: ${customerPhone}%0A- Delivery Address: ${destination}%0A- Items:%0A${itemsList}%0A- Subtotal: ${subtotal.toFixed(2)} EGP%0A- Delivery: 0.00 EGP (FREE PROMO)%0A- VAT & Service (14%): ${vatAmount.toFixed(2)} EGP%0A${loyaltyDiscountValue > 0 ? `- Loyalty Discount: -${loyaltyDiscountValue.toFixed(2)} EGP%0A` : ''}- Grand TOTAL: ${grandTotal.toFixed(2)} EGP%0A- Payment: ${paymentMethod.toUpperCase()}%0A- Cutlery & Notes: ${deliveryNotes || 'None'}`;

    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className={`delivery-order-page ${isAr ? 'rtl' : ''}`}>

      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP BAR: LOYALTY POINTS & BACK NAVIGATION                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="deliv-top-bar">
        <div className="deliv-top-left">
          {/* 2250 pts Loyalty Badge */}
          <button 
            type="button" 
            className="loyalty-badge-btn" 
            title={isAr ? "نقاط ولاء أمريكان دريم" : "American Dream Loyalty Points"}
            onClick={() => setIsLoyaltyModalOpen(true)}
          >
            <span>2250 pts</span>
          </button>

          {/* Back to Dining Overview */}
          <button 
            type="button" 
            className="btn-back-to-dining"
            onClick={onBack}
          >
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{isAr ? 'العودة للمطعم والكافيه' : 'Back to Restaurant & Cafe'}</span>
          </button>
        </div>

        <div className="deliv-top-right">
          <a href="tel:19820" className="deliv-hotline-pill">
            <Phone size={14} />
            <span>{isAr ? 'الخط الساخن: 19820' : 'Hotline: 19820'}</span>
          </a>
        </div>
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
        {/* Category Pills */}
        <div className="deliv-category-pills">
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
          <div className="deliv-section-eyebrow">
            {isAr ? 'مختارات المطبخ المميزة' : 'SIGNATURE KITCHEN SELECTION'}
          </div>
          <h2 className="deliv-section-title">
            {isAr ? 'أطباق الشيف الأكثر طلباً' : "Chef's Special & Most Ordered"}
          </h2>

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

            {loyaltyDiscountValue > 0 && (
              <div className="calc-row" style={{ color: '#b45309', fontWeight: '700' }}>
                <span>{isAr ? 'خصم نقاط الولاء (2250 نقطة)' : 'Loyalty Points Discount'}</span>
                <span>-{loyaltyDiscountValue.toFixed(2)} {isAr ? 'ج.م' : 'EGP'}</span>
              </div>
            )}

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
              setCheckoutStep('form');
              setIsCheckoutModalOpen(true);
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
      {/* 6. MODAL: LOYALTY POINTS INFO & REDEMPTION                          */}
      {/* ------------------------------------------------------------------- */}
      {isLoyaltyModalOpen && (
        <div className="deliv-modal-backdrop" onClick={() => setIsLoyaltyModalOpen(false)}>
          <div className="deliv-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="deliv-modal-close" onClick={() => setIsLoyaltyModalOpen(false)}>✕</button>

            <div className="deliv-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
                <Gift size={24} />
                <h3 style={{ margin: 0 }}>{isAr ? 'مكافآت ونقاط أمريكان دريم' : 'American Dream Rewards'}</h3>
              </div>
              <p>{isAr ? 'رصيد نقاطك الحالي في حسابك' : 'Your current active rewards balance'}</p>
            </div>

            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#b45309' }}>2,250</span>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#b45309', marginLeft: '6px' }}>pts</span>
              <div style={{ fontSize: '0.85rem', color: '#92400e', marginTop: '4px' }}>
                {isAr ? 'تعادل خصماً بقيمة 112.50 ج.م على طلبك اليوم!' : 'Worth 112.50 EGP discount on your order today!'}
              </div>
            </div>

            <div className="points-discount-card">
              <div className="points-card-left">
                <span className="points-card-title">{isAr ? 'استخدام النقاط للخصم' : 'Redeem Points for Discount'}</span>
                <span className="points-card-sub">{isAr ? 'وفر 112.50 ج.م فوراً من الإجمالي' : 'Save 112.50 EGP instantly'}</span>
              </div>
              <input 
                type="checkbox" 
                id="apply-points"
                checked={applyLoyaltyDiscount}
                onChange={(e) => setApplyLoyaltyDiscount(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#d97706', cursor: 'pointer' }}
              />
            </div>

            <button 
              type="button" 
              className="btn-proceed-checkout" 
              onClick={() => setIsLoyaltyModalOpen(false)}
            >
              {isAr ? 'تطبيق والعودة للطلب' : 'Apply & Return'}
            </button>
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
