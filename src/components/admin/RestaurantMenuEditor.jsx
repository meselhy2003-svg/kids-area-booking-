import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Edit3, 
  Utensils, 
  Coffee, 
  Sparkles, 
  Flame, 
  Boxes, 
  Search, 
  Eye, 
  Upload, 
  LogOut,
  ShoppingBag,
  Star,
  ChevronDown,
  Layers,
  ArrowRight,
  PartyPopper,
  Filter
} from 'lucide-react';
import './RestaurantMenuEditor.css';

// Project Media Library Assets matching Image 2 exactly
const ALL_PROJECT_ASSETS = [
  // 12 Assets directly visible in the user's reference screenshot (Image 2)
  { name: 'Arcade VR Experience', path: '/photo/kid area pic/Kid wearing VR headset in neon arcade.png' },
  { name: 'VR Friends Arena', path: '/photo/kid area pic/Photo 3_ VR Arena Friends.png' },
  { name: 'Arcade Graphic Composition', path: '/photo/kid area pic/Graphic Composition.png' },
  { name: 'Laser & Tactical Arena', path: '/photo/kid area pic/Laser & Tactical Arena.png' },
  { name: 'Skeeball Fun Arena', path: '/photo/kid area pic/Family celebrating victory at skeeball.png' },
  { name: 'Boxing Machine', path: '/photo/kid area pic/Boxing Punch Machine.png' },
  { name: 'Boxing Machine 2', path: '/photo/kid area pic/Boxing Punch Machine (1).png' },
  { name: 'Ping Pong Table', path: '/photo/kid area pic/Table Tennis Ping Pong.png' },
  { name: 'PS4 Gaming Station', path: '/photo/kid area pic/PS4 PlayStation Gaming.png' },
  { name: 'Air Hockey Table', path: '/photo/kid area pic/Air Hockey Table.png' },
  { name: 'Billiards Pool Table', path: '/photo/kid area pic/Billiards Pool Table.png' },
  { name: 'High Ropes Suspension', path: '/photo/kid area pic/High ropes suspended course.png' },
  
  // Food, Drinks & Restaurant Lake Assets
  { name: 'Brioche Cheeseburger Meal', path: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png' },
  { name: 'Canal-side Sunset Dinner Terrace', path: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png' },
  { name: 'Artisanal Chef Kitchen', path: '/photo/vibe_4_chef.png' },
  { name: 'Lake Sunset Cocktail & Mocktail Bar', path: '/photo/vibe_3_cocktail.png' },
  { name: 'Stone-Baked Quattro Formaggi Pizza', path: '/photo/kid area pic/mosaic-card-2.png' },
  { name: 'Island Breeze Mango Mocktail', path: '/photo/kid area pic/Image (1).png' },
  { name: 'Iced Caramel Macchiato & Latte', path: '/photo/kid area pic/Image (2).png' },
  { name: 'Gourmet Dish Presentation', path: '/photo/kid area pic/dish_burger.png' },
  { name: 'Lake Timsah Sunset Gathering', path: '/photo/vibe_5_sunset.png' },
  { name: 'Luxury Event Dining Hall', path: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png' },
  { name: 'Golden Crispy Chicken Nuggets', path: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80' },
  { name: 'Kids Mini Cheeseburger', path: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { name: 'Mozzarella Cheese Pizza Slice', path: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fresh Mango Sunshine Smoothie', path: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80' },
  { name: 'Berry Blast Milkshake', path: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80' },
  { name: 'Rainbow Ice Cream Sundae', path: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80' },
  { name: 'Caramel Butter Popcorn Bucket', path: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=80' },

  // Additional Play Zone & Adventure Assets
  { name: 'Ropes Bridge Girl', path: '/photo/kid area pic/Young girl balancing on high rope suspension bridge.png' },
  { name: 'Kids Ball Pit Slides', path: '/photo/kid area pic/Kids sliding into colorful ball pit.png' },
  { name: 'Toddler in Ball Pit', path: '/photo/kid area pic/Little boy laughing in ball pit2.png' },
  { name: 'Soft Ball Pit Play', path: '/photo/kid area pic/Toddler laughing in soft ball pit.png' },
  { name: 'Boy with Toys', path: '/photo/kid area pic/Boy laughing playing with toys.png' },
  { name: 'Bumper Collision Bay', path: '/photo/kid area pic/Bumper Collision Bay.png' },
  { name: 'Family Bumper Cars', path: '/photo/kid area pic/Family bumper car arena.png' },
  { name: 'Illuminated Carousel', path: '/photo/kid area pic/Classic illuminated carousel ride.png' },
  { name: 'Junior GP Speedway', path: '/photo/kid area pic/Junior GP Speedway.png' },
  { name: 'High-Octane Racing', path: '/photo/kid area pic/High-Octane Racing.png' },
  { name: 'Motorcycle Racing Arcade', path: '/photo/kid area pic/Motorcycle Racing Arcade.png' },
  { name: 'Cinematic Backdrop', path: '/photo/kid area pic/Cinematic Full-Width Backdrop.png' }
];

// Initial Master Data for Restaurant & Cafe Dashboard
const INITIAL_RESTAURANT_DATA = {
  hero: {
    titleEn: 'RESTAURANT & CAFE',
    subtitleEn: 'Good food. Great moments. Lakeside gourmet dining & refreshers.',
    titleAr: 'المطعم والكافيه',
    subtitleAr: 'طعام رائع. لحظات لا تُنسى. أشهى المأكولات والمشروبات على ضفاف القناة.',
    images: [
      '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png',
      '/photo/kid area pic/mosaic-card-2.png',
      '/photo/vibe_4_chef.png'
    ],
    activeSlideIndex: 0
  },
  categories: [
    { key: 'all', labelEn: 'All Menu', labelAr: 'كل القائمة', icon: 'all' },
    { key: 'meals', labelEn: 'Meals & Burgers', labelAr: 'الوجبات والبرجر', icon: 'utensils' },
    { key: 'grills', labelEn: 'Grills & Specialties', labelAr: 'المشاوي والأطباق', icon: 'flame' },
    { key: 'pizza', labelEn: 'Stone-Baked Pizza', labelAr: 'البيتزا الحجرية', icon: 'sparkles' },
    { key: 'drinks', labelEn: 'Juices & Smoothies', labelAr: 'العصائر والسموذي', icon: 'coffee' },
    { key: 'coffee', labelEn: 'Specialty Coffee', labelAr: 'القهوة والكافيه', icon: 'coffee' },
    { key: 'sweets', labelEn: 'Desserts & Ice Cream', labelAr: 'الحلويات والآيس كريم', icon: 'party' },
    { key: 'combos', labelEn: 'Family Combos & Offers', labelAr: 'العروض والكومبو', icon: 'boxes' }
  ],
  combos: [
    {
      id: 'rest-combo-1',
      title: 'Family Sunset Feast Combo',
      titleAr: 'كومبو وليمة الغروب العائلية',
      subtitle: 'Feeds 4-5 persons • Best value selection',
      subtitleAr: 'تكفي ٤-٥ أفراد • الاختيار الأوفر للعائلات',
      badge: 'SAVE 120 EGP',
      badgeAr: 'وفر 120 ج.م',
      price: 490,
      originalPrice: 610,
      category: 'combos',
      image: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png',
      features: [
        '2 Artisanal Brioche Cheeseburgers',
        '1 Large Stone-Baked Quattro Pizza',
        '2 Large Crispy Fries + Dips',
        '4 Fresh Mango Smoothies or Sodas'
      ]
    },
    {
      id: 'rest-combo-2',
      title: 'Kids Happy Adventure Meal Combo',
      titleAr: 'كومبو وجبة المغامرة السعيدة للأطفال',
      subtitle: 'Kid burger or nuggets + drink + surprise dessert',
      subtitleAr: 'برجر أو ناجتس + عصير طازج + حلوى المفاجأة',
      badge: 'POPULAR CHOICE',
      badgeAr: 'الأكثر طلباً',
      price: 165,
      originalPrice: 210,
      category: 'combos',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
      features: [
        '6 Pcs Golden Chicken Nuggets or Mini Burger',
        'Crispy Smile Fries Basket',
        '100% Natural Fresh Mango Sunshine Juice',
        '1 Scoop Rainbow Ice Cream Sundae'
      ]
    }
  ],
  items: [
    {
      id: 'rest-item-1',
      category: 'meals',
      title: 'Artisanal Brioche Cheeseburger Meal',
      titleAr: 'وجبة برجر البريوش بالجبنة الفاخرة',
      subtitle: 'Beef patty, melted cheddar, crispy shoestring fries & signature sauce',
      subtitleAr: 'برجر لحم مشوي طازج مع جبن الشيدر الذائب، بطاطس مقرمشة وصوص خاص',
      price: 185,
      originalPrice: 220,
      badge: 'Chef Special',
      badgeAr: 'اختيار الشيف',
      unit: '/ meal',
      rating: 4.9,
      image: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png'
    },
    {
      id: 'rest-item-2',
      category: 'grills',
      title: 'Waterfront Sunset Mixed Grill',
      titleAr: 'مشاوي الواجهة المائية المشكلة',
      subtitle: 'Kebab skewers, shish tawook, grilled kofta, basmati rice & fresh salads',
      subtitleAr: 'كباب وكفتة وشيش طاووق متبل على الفحم يقدم مع أرز بسمتي وسلطات طازجة',
      price: 340,
      originalPrice: 390,
      badge: 'Lakeside Special',
      badgeAr: 'خاص بالبحيرة',
      unit: '/ platter',
      rating: 5.0,
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png'
    },
    {
      id: 'rest-item-3',
      category: 'pizza',
      title: 'Italian Stone-Baked Quattro Formaggi',
      titleAr: 'بيتزا الأجبان الأربعة الحجرية',
      subtitle: 'Thin crust pizza with mozzarella, parmesan, gorgonzola & basil',
      subtitleAr: 'عجينة إيطالية هشة ومقرمشة مع مزيج 4 أجبان فاخرة وصلصة طماطم',
      price: 175,
      originalPrice: 210,
      badge: 'Authentic',
      badgeAr: 'إيطالي أصيل',
      unit: '/ pizza',
      rating: 4.8,
      image: '/photo/kid area pic/mosaic-card-2.png'
    },
    {
      id: 'rest-item-4',
      category: 'drinks',
      title: 'Island Breeze Mango Mocktail',
      titleAr: 'كوكتيل نسيم الجزيرة بالمانجو',
      subtitle: 'Fresh Ismailia mango puree, passion fruit syrup & sparkling soda',
      subtitleAr: 'مانجو إسماعيلية طازجة مع باشن فروت وصودا منعشة وأوراق النعناع',
      price: 70,
      originalPrice: 85,
      badge: 'Refreshing',
      badgeAr: 'منعش ولذيذ',
      unit: '/ glass',
      rating: 4.9,
      image: '/photo/kid area pic/Image (1).png'
    },
    {
      id: 'rest-item-5',
      category: 'coffee',
      title: 'Iced Caramel Macchiato & Latte',
      titleAr: 'آيسد كراميل ماكياتو ولاتيه إسباني',
      subtitle: 'Double espresso shots, chilled steamed milk & caramel drizzle',
      subtitleAr: 'إسبريسو فاخر مع حليب بارد وصلصة كراميل غنية ومثلجة',
      price: 65,
      originalPrice: 80,
      badge: 'Barista Pick',
      badgeAr: 'اختيار الباريستا',
      unit: '/ cup',
      rating: 4.8,
      image: '/photo/kid area pic/Image (2).png'
    },
    {
      id: 'rest-item-6',
      category: 'meals',
      title: 'Super Kid Chicken Nuggets',
      titleAr: 'وجبة ناجتس الدجاج الأبطال',
      subtitle: '6 pcs golden nuggets + french fries + apple juice',
      subtitleAr: '٦ قطع ناجتس مقرمشة + بطاطس مقلية + عصير تفاح',
      price: 120,
      originalPrice: 145,
      badge: 'Kids Favorite',
      badgeAr: 'محبوب الأطفال',
      unit: '/ meal',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-7',
      category: 'meals',
      title: 'Mini Dream Cheeseburger',
      titleAr: 'ميني تشيز برجر دريم للأطفال',
      subtitle: 'Juicy beef mini patty + cheese + crispy fries',
      subtitleAr: 'برجر لحم بقري طازج + جبنة + بطاطس مقرمشة',
      price: 135,
      originalPrice: 160,
      badge: 'Best Seller',
      badgeAr: 'الأكثر مبيعاً',
      unit: '/ meal',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-8',
      category: 'pizza',
      title: 'Cheesy Kids Mozzarella Pizza Slice',
      titleAr: 'شريحة بيتزا الموزاريلا للأطفال',
      subtitle: 'Rich mozzarella cheese pizza slice with fresh tomato sauce',
      subtitleAr: 'شريحة بيتزا بجبن الموزاريلا الغنية وصلصة الطماطم',
      price: 95,
      originalPrice: 110,
      badge: 'Crispy & Cheesy',
      badgeAr: 'مقرمشة ولذيذة',
      unit: '/ slice',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-9',
      category: 'drinks',
      title: 'Fresh Mango Sunshine Smoothie',
      titleAr: 'سموذي المانجو الطازج',
      subtitle: '100% real fresh mango juice topped with vanilla drizzle',
      subtitleAr: 'عصير مانجو طازج ١٠٠٪ مع لمسة فانيليا',
      price: 65,
      originalPrice: 80,
      badge: '100% Natural',
      badgeAr: 'طبيعي ١٠٠٪',
      unit: '/ glass',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-10',
      category: 'drinks',
      title: 'Berry Blast Milkshake',
      titleAr: 'ميلك شيك التوت البري',
      subtitle: 'Creamy strawberry & blueberry blend with whipped cream',
      subtitleAr: 'مزيج الفراولة والتوت البري مع الكريمة المخفوقة',
      price: 75,
      originalPrice: 90,
      badge: 'Sweet Treat',
      badgeAr: 'طعم كريمي',
      unit: '/ cup',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-11',
      category: 'sweets',
      title: 'Rainbow Ice Cream Sundae',
      titleAr: 'آيس كريم رينبو صنداي',
      subtitle: '3 scoops vanilla, chocolate & strawberry with sprinkles',
      subtitleAr: '٣ بولات آيس كريم متنوعة مع السكر الملون والشوكولاتة',
      price: 70,
      originalPrice: 85,
      badge: 'Kids Hit',
      badgeAr: 'مبهج للأطفال',
      unit: '/ cup',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-item-12',
      category: 'sweets',
      title: 'Caramel Butter Popcorn Bucket',
      titleAr: 'دلو بوب كورن بالكراميل والزبدة',
      subtitle: 'Freshly popped warm popcorn with rich caramel coating',
      subtitleAr: 'فشار طازج وساخن بصلصة الكراميل الغنية والزبدة المقرمشة',
      price: 55,
      originalPrice: 70,
      badge: 'Cinema Style',
      badgeAr: 'طعم السينما',
      unit: '/ bucket',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=80'
    }
  ],
  explore: [
    {
      id: 'exp-res-1',
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      caption: 'Canal-side Sunset Dinner Terrace'
    },
    {
      id: 'exp-res-2',
      image: '/photo/vibe_4_chef.png',
      caption: 'Artisanal Open Kitchen & Grills'
    },
    {
      id: 'exp-res-3',
      image: '/photo/vibe_3_cocktail.png',
      caption: 'Lake View Mocktail & Coffee Bar'
    },
    {
      id: 'exp-res-4',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      caption: 'Indoor Family Dining & Lounge'
    },
    {
      id: 'exp-res-5',
      image: '/photo/vibe_5_sunset.png',
      caption: 'Waterfront Sunset Promenade Dining'
    }
  ],
  explorer360: {
    title: 'Restaurant & Terrace 360° Virtual Experience',
    titleAr: 'جولة تفاعلية 360° لصالة المطعم وتراس البحيرة',
    url: 'https://my.matterport.com/show/?m=american-dream-restaurant',
    enabled: true
  }
};

export default function RestaurantMenuEditor({
  lang = 'ar',
  setLang,
  onLogout,
  onOpenOrders
}) {
  const isAr = lang === 'ar';

  // Master Restaurant State with LocalStorage Persistence
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_restaurant_menu_data_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed reading saved restaurant menu data:', e);
    }
    return INITIAL_RESTAURANT_DATA;
  });

  // Category filter state
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('items'); // 'items' | 'combos'

  // Hero carousel state
  const heroImages = data.hero?.images?.length ? data.hero.images : INITIAL_RESTAURANT_DATA.hero.images;
  const activeSlideIndex = typeof data.hero?.activeSlideIndex === 'number' ? data.hero.activeSlideIndex : 0;
  const currentBannerImg = heroImages[activeSlideIndex] || heroImages[0];

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState('edit'); // 'edit' | 'add'
  const [editingItem, setEditingItem] = useState(null);

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState({
    titleEn: data.hero?.titleEn || '',
    subtitleEn: data.hero?.subtitleEn || '',
    titleAr: data.hero?.titleAr || '',
    subtitleAr: data.hero?.subtitleAr || ''
  });

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { type: 'hero' | 'explore' | 'item', slotIndex?: number }
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Hero Carousel Dot Click
  const handleCarouselDotClick = (index) => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        activeSlideIndex: index
      }
    }));
  };

  // Delete Hero Banner Slide
  const handleDeleteHeroBanner = () => {
    if (heroImages.length <= 1) {
      alert(isAr ? 'يجب الإبقاء على صورة واحدة على الأقل لشريحة الغلاف.' : 'You must have at least one hero banner image.');
      return;
    }
    const updatedImages = heroImages.filter((_, idx) => idx !== activeSlideIndex);
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: updatedImages,
        activeSlideIndex: 0
      }
    }));
    showToast(isAr ? 'تمت إزالة صورة الغلاف.' : 'Hero image removed.');
  };

  // Open Image Picker
  const openImagePicker = (target) => {
    setImagePickerTarget(target);
    setIsImagePickerOpen(true);
  };

  // Apply selected image
  const handleSelectImage = (imagePath) => {
    if (!imagePickerTarget) return;

    if (imagePickerTarget.type === 'hero') {
      const newImages = [...heroImages];
      newImages[activeSlideIndex] = imagePath;
      setData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          images: newImages
        }
      }));
      showToast(isAr ? 'تم تحديث صورة الغلاف.' : 'Hero banner updated.');
    } else if (imagePickerTarget.type === 'explore') {
      const exploreList = [...(data.explore || [])];
      if (imagePickerTarget.slotIndex !== undefined && exploreList[imagePickerTarget.slotIndex]) {
        exploreList[imagePickerTarget.slotIndex].image = imagePath;
      } else {
        exploreList.push({
          id: `exp-res-${Date.now()}`,
          image: imagePath,
          caption: 'Restaurant & Dining Feature'
        });
      }
      setData(prev => ({
        ...prev,
        explore: exploreList
      }));
      showToast(isAr ? 'تم تحديث صورة الأجواء.' : 'Atmosphere photo updated.');
    } else if (imagePickerTarget.type === 'item' && editingItem) {
      setEditingItem(prev => ({ ...prev, image: imagePath }));
    }

    setIsImagePickerOpen(false);
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        handleSelectImage(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Explore Photo
  const handleDeleteExplore = (slotIdx) => {
    const exploreList = (data.explore || []).filter((_, i) => i !== slotIdx);
    setData(prev => ({
      ...prev,
      explore: exploreList
    }));
    showToast(isAr ? 'تم حذف الصورة من قسم الاستكشاف.' : 'Photo removed from Explore section.');
  };

  // Open Edit Item Modal
  const openEditItemModal = (item, isCombo = false) => {
    setItemModalMode('edit');
    setEditingItem({
      ...item,
      isCombo: isCombo || item.category === 'combos'
    });
    setIsItemModalOpen(true);
  };

  // Open Add Item Modal
  const openAddItemModal = () => {
    setItemModalMode('add');
    const isCombo = activeSubTab === 'combos';
    const categoryDefault = isCombo ? 'combos' : (activeCategory === 'all' ? 'meals' : activeCategory);

    setEditingItem({
      id: `rest-${isCombo ? 'combo' : 'item'}-${Date.now()}`,
      category: categoryDefault,
      title: isCombo ? 'New Family Combo' : 'New Dish / Drink',
      titleAr: isCombo ? 'كومبو عائلي جديد' : 'صنف طعام أو مشروب جديد',
      subtitle: isCombo ? 'Includes main dish, fries, drinks & dessert' : 'Fresh gourmet ingredients',
      subtitleAr: isCombo ? 'يشمل الأطباق الرئيسية، البطاطس، المشروبات وحلوى' : 'مكونات طازجة وفاخرة بأيدي أمهر الطهاة',
      price: isCombo ? 250 : 95,
      originalPrice: isCombo ? 320 : 120,
      badge: isCombo ? 'SAVE 70 EGP' : 'New Dish',
      badgeAr: isCombo ? 'وفر 70 ج.م' : 'صنف جديد',
      unit: isCombo ? '/ combo' : '/ meal',
      rating: 5.0,
      image: ALL_PROJECT_ASSETS[12]?.path || ALL_PROJECT_ASSETS[0]?.path,
      features: isCombo ? ['Main Dish', 'Fries Basket', 'Cold Drink', 'Surprise Treat'] : [],
      isCombo
    });
    setIsItemModalOpen(true);
  };

  // Save Item (Edit or Add)
  const handleSaveItem = () => {
    if (!editingItem) return;

    const isCombo = editingItem.isCombo || editingItem.category === 'combos';
    const targetKey = isCombo ? 'combos' : 'items';
    const list = [...(data[targetKey] || [])];

    if (itemModalMode === 'edit') {
      const idx = list.findIndex(i => i.id === editingItem.id);
      if (idx !== -1) {
        list[idx] = editingItem;
      }
    } else {
      list.unshift(editingItem);
    }

    setData(prev => ({
      ...prev,
      [targetKey]: list
    }));

    setIsItemModalOpen(false);
    setEditingItem(null);
    showToast(isAr ? `✓ تم حفظ "${editingItem.titleAr || editingItem.title}" بنجاح!` : `✓ "${editingItem.title}" saved successfully!`);
  };

  // Delete Item
  const handleDeleteItem = () => {
    if (!editingItem) return;
    const itemTitle = editingItem.titleAr || editingItem.title;
    const confirmPrompt = isAr ? `هل أنت متأكد من حذف "${itemTitle}"؟` : `Are you sure you want to delete "${itemTitle}"?`;
    if (window.confirm(confirmPrompt)) {
      const isCombo = editingItem.isCombo || editingItem.category === 'combos';
      const targetKey = isCombo ? 'combos' : 'items';
      const list = (data[targetKey] || []).filter(i => i.id !== editingItem.id);

      setData(prev => ({
        ...prev,
        [targetKey]: list
      }));

      setIsItemModalOpen(false);
      setEditingItem(null);
      showToast(isAr ? 'تم حذف العنصر بنجاح.' : 'Item deleted successfully.');
    }
  };

  // Save Hero Banner Texts
  const handleSaveHeroTexts = () => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        titleEn: editingHero.titleEn,
        subtitleEn: editingHero.subtitleEn,
        titleAr: editingHero.titleAr,
        subtitleAr: editingHero.subtitleAr
      }
    }));
    setIsHeroModalOpen(false);
    showToast(isAr ? 'تم حفظ نصوص الغلاف.' : 'Hero texts updated.');
  };

  // Save Master Data to LocalStorage
  const handleSaveChanges = () => {
    try {
      localStorage.setItem('ados_restaurant_menu_data_v2', JSON.stringify(data));
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast(isAr ? '✓ تم حفظ جميع تعديلات المطعم والكافيه بنجاح!' : '✓ Restaurant & Cafe changes saved successfully!');
    } catch (err) {
      showToast(isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes to local storage.');
    }
  };

  // Reset Changes to Defaults
  const handleCancelChanges = () => {
    const confirmPrompt = isAr 
      ? 'هل أنت متأكد من استعادة بيانات المطعم الافتراضية وإلغاء جميع التعديلات؟' 
      : 'Reset restaurant data back to default settings?';
    if (window.confirm(confirmPrompt)) {
      localStorage.removeItem('ados_restaurant_menu_data_v2');
      setData(INITIAL_RESTAURANT_DATA);
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية.' : 'Restaurant data reset to defaults.');
    }
  };

  // Filter items by category & search query
  const filteredItems = (data.items || []).filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.titleAr && item.titleAr.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.subtitleAr && item.subtitleAr.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const filteredCombos = (data.combos || []).filter(combo => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (combo.title && combo.title.toLowerCase().includes(q)) ||
      (combo.titleAr && combo.titleAr.toLowerCase().includes(q)) ||
      (combo.subtitle && combo.subtitle.toLowerCase().includes(q)) ||
      (combo.subtitleAr && combo.subtitleAr.toLowerCase().includes(q))
    );
  });

  // Helper for category icons
  const renderCategoryIcon = (icon) => {
    switch (icon) {
      case 'utensils': return <Utensils size={15} className="ados-zone-pill-icon" />;
      case 'flame': return <Flame size={15} className="ados-zone-pill-icon" />;
      case 'sparkles': return <Sparkles size={15} className="ados-zone-pill-icon" />;
      case 'coffee': return <Coffee size={15} className="ados-zone-pill-icon" />;
      case 'party': return <PartyPopper size={15} className="ados-zone-pill-icon" />;
      case 'boxes': return <Boxes size={15} className="ados-zone-pill-icon" />;
      default: return <Utensils size={15} className="ados-zone-pill-icon" />;
    }
  };

  return (
    <div className={`rest-editor-wrapper ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOPBAR                                                          */}
      {/* ------------------------------------------------------------------ */}
      <header className="ados-topbar">
        {/* Balanced spacer on left */}
        <div style={{ width: 140 }}></div>

        {/* Center Title Group */}
        <div className="ados-topbar-title-group">
          <h1 className="ados-topbar-title">
            {isAr ? 'لوحة تحكم إدارة المطعم والكافيه' : 'Restaurant & Cafe Management'}
          </h1>
          <div className="ados-topbar-subtitle">
            {isAr ? 'أشهى المأكولات • تجارب طعام استثنائية • إطلالة ساحرة' : 'Delicious Gourmet Food • Lakeside Dining • Great Moments'}
          </div>
        </div>

        {/* Right Controls: Language & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="ados-topbar-lang-toggle font-alexandria">
            <button 
              type="button" 
              className={`ados-lang-btn font-alexandria ${isAr ? 'active' : ''}`}
              onClick={() => setLang && setLang('ar')}
              title="عربي"
            >
              عربي
            </button>
            <button 
              type="button" 
              className={`ados-lang-btn font-alexandria ${!isAr ? 'active' : ''}`}
              onClick={() => setLang && setLang('en')}
              title="English"
            >
              EN
            </button>
          </div>

          <button 
            type="button"
            className="ados-logout-topbar-btn"
            onClick={onLogout}
            title={isAr ? 'تسجيل الخروج' : 'Log Out'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={15} />
            <span>{isAr ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. BODY CONTENT                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="ados-content">
          {/* CATEGORY NAVIGATION PILLS (Exact match to Play Zone nav) */}
          <nav className="ados-zone-nav rest-category-nav">
            {data.categories?.map(cat => (
              <button 
                key={cat.key}
                className={`ados-zone-pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.key);
                  if (cat.key === 'combos') {
                    setActiveSubTab('combos');
                  } else if (activeSubTab === 'combos') {
                    setActiveSubTab('items');
                  }
                }}
              >
                {renderCategoryIcon(cat.icon)}
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </nav>

          {/* HERO BANNER SECTION (Exact match to Play Zone hero card) */}
          <section 
            className="ados-hero-card rest-hero-card"
            style={{ backgroundImage: `url("${currentBannerImg}")` }}
          >
            <div className="ados-hero-overlay"></div>
            <div className="ados-hero-inner">
              <div className="ados-hero-text-and-badge">
                <div className="ados-hero-text-block">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 className="ados-hero-title-en">
                      {isAr ? (data.hero?.titleAr || data.hero?.titleEn) : data.hero?.titleEn}
                    </h2>
                    <button 
                      type="button" 
                      className="rest-hero-edit-texts-btn"
                      onClick={() => {
                        setEditingHero({
                          titleEn: data.hero?.titleEn || '',
                          subtitleEn: data.hero?.subtitleEn || '',
                          titleAr: data.hero?.titleAr || '',
                          subtitleAr: data.hero?.subtitleAr || ''
                        });
                        setIsHeroModalOpen(true);
                      }}
                      title={isAr ? 'تعديل نصوص الغلاف' : 'Edit Hero Text'}
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>

                  <div className="ados-hero-subtitle-en">
                    {isAr ? (data.hero?.subtitleAr || data.hero?.subtitleEn) : data.hero?.subtitleEn}
                  </div>

                  {!isAr && data.hero?.titleAr && (
                    <>
                      <h3 className="ados-hero-title-ar">{data.hero?.titleAr}</h3>
                      <div className="ados-hero-subtitle-ar">{data.hero?.subtitleAr}</div>
                    </>
                  )}
                </div>

                {/* Stamp Badge */}
                <div className="ados-hero-stamp-badge rest-stamp-badge">
                  {isAr ? (
                    <>
                      <span>طازج</span>
                      <span>شهي</span>
                      <span>إطلالة</span>
                      <span>البحيرة!</span>
                    </>
                  ) : (
                    <>
                      <span>FRESH</span>
                      <span>GOURMET</span>
                      <span>LAKESIDE</span>
                      <span>DINING!</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Hero Bar: Carousel dots & Image Change Button */}
              <div className="ados-hero-bottom-bar">
                <div className="ados-carousel-dots">
                  {heroImages.map((_, dotIdx) => (
                    <button 
                      key={dotIdx}
                      className={`ados-carousel-dot ${dotIdx === activeSlideIndex ? 'active' : ''}`}
                      onClick={() => handleCarouselDotClick(dotIdx)}
                      title={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <div className="ados-hero-actions">
                  <button 
                    className="ados-change-img-btn"
                    onClick={() => openImagePicker({ type: 'hero' })}
                  >
                    <RotateCcw size={13} />
                    <span>{isAr ? 'تغيير أو إضافة صورة غلاف' : 'Change or Add Hero Image'}</span>
                  </button>
                  {heroImages.length > 1 && (
                    <button 
                      className="ados-hero-delete-btn"
                      onClick={handleDeleteHeroBanner}
                      title={isAr ? 'حذف الشريحة الحالية' : 'Delete Current Slide'}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* OFFERS & MENU ITEMS SECTION HEADER */}
          <section className="ados-offers-section">
            <div className="ados-section-header">
              <div className="ados-section-title-wrap">
                <h2 className="ados-section-title">
                  {isAr 
                    ? (activeSubTab === 'combos' ? 'عروض وباقات الكومبو العائلية' : 'قائمة المأكولات والمشروبات') 
                    : (activeSubTab === 'combos' ? 'Family Combos & Value Offers' : 'Restaurant & Cafe Menu Items')}
                </h2>
                <span className="ados-section-title-pipe">|</span>
                <span className="ados-section-title-ar">
                  {isAr ? 'إدارة وتحرير الأصناف' : 'Menu Content & Pricing'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Search Bar */}
                <div className="rest-search-input-wrap">
                  <Search size={14} className="rest-search-icon" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في الأصناف...' : 'Search items...'}
                    className="rest-search-input"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      className="rest-search-clear"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Add Item Button */}
                <button className="ados-add-btn" onClick={openAddItemModal}>
                  <Plus size={14} />
                  <span>{isAr ? (activeSubTab === 'combos' ? 'إضافة كومبو' : 'إضافة صنف') : 'Add Item'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation (Items vs Combos) */}
            <div className="ados-subtab-container">
              <div className="ados-subtab-group">
                <button 
                  className={`ados-subtab-btn ${activeSubTab === 'items' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('items')}
                >
                  <Utensils size={14} />
                  <span>{isAr ? `الأصناف الفردية (${data.items?.length || 0})` : `Menu Items (${data.items?.length || 0})`}</span>
                </button>
                <button 
                  className={`ados-subtab-btn ${activeSubTab === 'combos' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('combos')}
                >
                  <Boxes size={14} />
                  <span>{isAr ? `العروض والكومبو (${data.combos?.length || 0})` : `Family Combos (${data.combos?.length || 0})`}</span>
                </button>
              </div>
            </div>

            {/* CARDS DISPLAY LOGIC */}
            {/* 1. COMBOS: Wide Horizontal Cards matching Challenge Pass */}
            {activeSubTab === 'combos' && (
              <div className="rest-combos-container">
                {filteredCombos.map(combo => (
                  <div key={combo.id} className="ados-wide-package-card rest-wide-combo-card">
                    {/* Media Collage */}
                    <div className="ados-wide-media-collage">
                      <img src={combo.image} alt={combo.title} className="ados-wide-media-img" />
                      <div className="ados-collage-pill-badge">
                        {isAr ? '★ وجبة التوفير العائلية ★' : '★ FAMILY VALUE OFFER ★'}
                      </div>
                    </div>

                    {/* Info Center */}
                    <div className="ados-wide-info-body">
                      <h3 className="ados-wide-title">{isAr ? (combo.titleAr || combo.title) : combo.title}</h3>
                      <div className="ados-wide-subtitle">
                        {isAr ? (combo.subtitleAr || combo.subtitle) : (combo.subtitle || 'Best value combo')}
                      </div>

                      <div className="ados-wide-features-grid">
                        {combo.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="ados-wide-feature-item">
                            <Sparkles size={15} color="#0284c7" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ados-wide-price-row">
                        <span className="ados-wide-price-main">
                          {combo.price} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                        {combo.originalPrice && (
                          <span className="ados-wide-price-original">
                            {combo.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Actions & Badge */}
                    <div className="ados-wide-right-actions">
                      <div className="ados-save-badge-pill">
                        {isAr ? (combo.badgeAr || combo.badge || 'وفر مع دريم') : (combo.badge || 'Special Offer')}
                      </div>
                      <button 
                        className="ados-card-edit-btn"
                        onClick={() => openEditItemModal(combo, true)}
                      >
                        {isAr ? 'تعديل' : 'EDIT'}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredCombos.length === 0 && (
                  <div className="rest-empty-state">
                    <p>{isAr ? 'لا توجد عروض كومبو مطابقة للبحث.' : 'No combos found.'}</p>
                    <button className="ados-add-btn" onClick={openAddItemModal}>
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة كومبو جديد' : 'Add New Combo'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. REGULAR MENU ITEMS: Vertical Cards matching Play Zone Tickets & Packages */}
            {activeSubTab === 'items' && (
              <div className="ados-cards-grid-4 rest-cards-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="ados-vertical-card rest-item-card">
                    {/* Thumbnail with badge */}
                    <div className="ados-card-thumb-wrap">
                      <img src={item.image} alt={item.title} className="ados-card-thumb-img" />
                      {item.badge && (
                        <div className="ados-card-thumb-badge">
                          {isAr ? (item.badgeAr || item.badge) : item.badge}
                        </div>
                      )}
                      <button 
                        type="button" 
                        className="rest-card-change-img-overlay"
                        onClick={() => {
                          setEditingItem(item);
                          openImagePicker({ type: 'item' });
                        }}
                        title={isAr ? 'تغيير صورة الصنف' : 'Change Item Image'}
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (item.titleAr || item.title) : item.title}
                        </h4>
                        {!isAr && item.titleAr && (
                          <span className="ados-card-title-ar">{item.titleAr}</span>
                        )}
                      </div>

                      {/* Subtitle / Description */}
                      <p className="rest-item-desc">
                        {isAr ? (item.subtitleAr || item.subtitle) : (item.subtitle || '')}
                      </p>

                      {/* Footer: Price & Edit Button */}
                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {item.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          {item.originalPrice && (
                            <span className="ados-card-price-original">
                              {item.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                        </div>

                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditItemModal(item, false)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="rest-empty-state-full">
                    <p>{isAr ? 'لا توجد أصناف مطابقة للتصنيف أو البحث الحالي.' : 'No menu items match current category or search query.'}</p>
                    <button className="ados-add-btn" onClick={openAddItemModal}>
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة صنف جديد' : 'Add New Item'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* EXPLORE RESTAURANT ATMOSPHERE SECTION (Exact match to Explore Zone) */}
          <section className="ados-explore-section">
            <h3 className="ados-explore-title">
              {isAr 
                ? 'استكشف صالة وأجواء المطعم والبحيرة' 
                : 'Explore American Dream Dining Atmosphere & Terrace'}
            </h3>
            <div className="ados-explore-grid">
              {data.explore?.map((expItem, idx) => (
                <div key={expItem.id || idx} className="ados-explore-photo-card">
                  <img src={expItem.image} alt={expItem.caption} className="ados-explore-photo-thumb" />
                  <div className="ados-explore-photo-actions">
                    <button 
                      className="ados-explore-change-btn"
                      onClick={() => openImagePicker({ type: 'explore', slotIndex: idx })}
                    >
                      <RotateCcw size={12} />
                      <span>{isAr ? 'تغيير الصورة' : 'Change Image'}</span>
                    </button>
                    <button 
                      className="ados-explore-trash-btn"
                      onClick={() => handleDeleteExplore(idx)}
                      title={isAr ? 'حذف الصورة' : 'Remove Photo'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Photo Slot */}
              <div 
                className="ados-explore-add-slot"
                onClick={() => openImagePicker({ type: 'explore' })}
              >
                <div className="ados-explore-add-icon-circle">
                  <Plus size={18} />
                </div>
                <div className="ados-explore-add-text">{isAr ? '+ إضافة صورة' : '+ Add Photo'}</div>
                <div className="ados-explore-add-subtext">
                  {isAr ? `المكان #${(data.explore?.length || 0) + 1}` : `Slot #${(data.explore?.length || 0) + 1}`}
                </div>
              </div>
            </div>
          </section>

          {/* EXPLORE 360° SECTION */}
          <section className="ados-360-container">
            <div className="ados-360-card">
              <div className="ados-360-title">
                <Eye size={18} className="ados-360-title-icon" />
                <span>{isAr ? 'جولة تفاعلية 360° لصالة المطعم' : 'RESTAURANT 360° VIRTUAL TOUR'}</span>
              </div>
              <button 
                className="ados-360-action-btn"
                onClick={() => setIs360ModalOpen(true)}
              >
                <RotateCcw size={13} />
                <span>{isAr ? 'تغيير أو ربط جولة 360°' : 'Change or Add 360 TOUR'}</span>
              </button>
            </div>
          </section>

          {/* BOTTOM SAVE & CANCEL BAR */}
          <div className="ados-bottom-bar">
            <button className="ados-cancel-btn" onClick={handleCancelChanges}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button className="ados-save-btn" onClick={handleSaveChanges}>
              <Check size={16} />
              <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MODAL: EDIT / ADD ITEM OR COMBO                                 */}
      {/* ------------------------------------------------------------------ */}
      {isItemModalOpen && editingItem && (
        <div className="ados-modal-backdrop" onClick={() => setIsItemModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>
                {itemModalMode === 'edit' 
                  ? (isAr ? `تعديل: ${editingItem.titleAr || editingItem.title}` : `Edit Item: ${editingItem.title}`) 
                  : (isAr ? 'إضافة صنف / عرض جديد' : 'Add New Dish / Offer')}
              </h3>
              <button className="ados-modal-close-btn" onClick={() => setIsItemModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              {/* Item Photo Row */}
              <div className="ados-form-group">
                <label>{isAr ? 'صورة الصنف' : 'Item Photo'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img 
                    src={editingItem.image} 
                    alt="Preview" 
                    style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 8, border: '1px solid #cbd5e1' }} 
                  />
                  <button 
                    type="button"
                    className="ados-btn-secondary"
                    onClick={() => openImagePicker({ type: 'item' })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <RotateCcw size={13} />
                    <span>{isAr ? 'تغيير أو اختيار صورة...' : 'Change Photo...'}</span>
                  </button>
                </div>
              </div>

              {/* Title EN & AR */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'اسم الصنف (بالإنجليزية)' : 'Item Title (English)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.title || ''} 
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'اسم الصنف (بالعربية)' : 'Item Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.titleAr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'التصنيف' : 'Category'}</label>
                  <select 
                    value={editingItem.category || 'meals'} 
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="ados-form-select"
                  >
                    <option value="meals">{isAr ? 'الوجبات والبرجر' : 'Meals & Burgers'}</option>
                    <option value="grills">{isAr ? 'المشاوي والأطباق' : 'Grills & Specialties'}</option>
                    <option value="pizza">{isAr ? 'البيتزا الإيطالية الحجرية' : 'Stone-Baked Pizza'}</option>
                    <option value="drinks">{isAr ? 'العصائر والسموذي' : 'Juices & Smoothies'}</option>
                    <option value="coffee">{isAr ? 'القهوة والكافيه' : 'Specialty Coffee'}</option>
                    <option value="sweets">{isAr ? 'الحلويات والآيس كريم' : 'Desserts & Sweets'}</option>
                    <option value="combos">{isAr ? 'العروض والكومبو' : 'Family Combos'}</option>
                  </select>
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'شارة التميز (Badge)' : 'Badge Label'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.badge || ''} 
                    placeholder="e.g. Chef Special / SAVE 50 EGP"
                    onChange={e => setEditingItem({ ...editingItem, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'السعر الحالي (ج.م)' : 'Current Price (EGP)'}</label>
                  <input 
                    type="number" 
                    className="ados-form-input"
                    value={editingItem.price ?? ''} 
                    onChange={e => {
                      const newPrice = Number(e.target.value);
                      const orig = editingItem.originalPrice || newPrice;
                      const diff = orig - newPrice;
                      setEditingItem({
                        ...editingItem,
                        price: newPrice,
                        badge: diff > 0 ? `SAVE ${diff} EGP` : (editingItem.badge || ''),
                        badgeAr: diff > 0 ? `وفر ${diff} ج.م` : (editingItem.badgeAr || '')
                      });
                    }}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'السعر الأصلي (ج.م - لحساب الخصم)' : 'Original Price (EGP - for discount)'}</label>
                  <input 
                    type="number" 
                    className="ados-form-input"
                    value={editingItem.originalPrice ?? ''} 
                    onChange={e => {
                      const orig = Number(e.target.value);
                      const cur = editingItem.price || 0;
                      const diff = orig - cur;
                      setEditingItem({
                        ...editingItem,
                        originalPrice: orig,
                        badge: diff > 0 ? `SAVE ${diff} EGP` : (editingItem.badge || ''),
                        badgeAr: diff > 0 ? `وفر ${diff} ج.م` : (editingItem.badgeAr || '')
                      });
                    }}
                  />
                </div>
              </div>

              {/* Subtitle / Description EN & AR */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف / المكونات (بالإنجليزية)' : 'Description / Features (EN)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={3}
                    value={editingItem.subtitle || ''} 
                    onChange={e => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف / المكونات (بالعربية)' : 'Description / Features (AR)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={3}
                    value={editingItem.subtitleAr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, subtitleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Combo Features (if combo) */}
              {(editingItem.isCombo || editingItem.category === 'combos') && (
                <div className="ados-form-group">
                  <label>{isAr ? 'عناصر الكومبو المشمولة (مفصولة بفاصلة)' : 'Included Combo Features (comma-separated)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingItem.features?.join(', ') || ''} 
                    onChange={e => setEditingItem({ 
                      ...editingItem, 
                      features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g. 2 Brioche Burgers, 1 Large Pizza, 2 Crispy Fries, 4 Drinks"
                  />
                </div>
              )}
            </div>

            <div className="ados-modal-footer">
              {itemModalMode === 'edit' ? (
                <button className="ados-btn-danger" onClick={handleDeleteItem}>
                  <Trash2 size={13} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حذف العنصر' : 'Delete Item'}</span>
                </button>
              ) : <div></div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsItemModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="ados-btn-primary" onClick={handleSaveItem}>
                  <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حفظ العنصر' : 'Save Item'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. MODAL: EDIT HERO BANNER TEXTS                                   */}
      {/* ------------------------------------------------------------------ */}
      {isHeroModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIsHeroModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>{isAr ? 'تعديل نصوص شريحة الغلاف الرئيسية' : 'Edit Main Hero Texts'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIsHeroModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'العنوان الرئيسي (EN)' : 'Main Title (EN)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingHero.titleEn} 
                    onChange={e => setEditingHero({ ...editingHero, titleEn: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'العنوان الرئيسي (AR)' : 'Main Title (AR)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingHero.titleAr} 
                    onChange={e => setEditingHero({ ...editingHero, titleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف الترويجي (EN)' : 'Promo Subtitle (EN)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingHero.subtitleEn} 
                    onChange={e => setEditingHero({ ...editingHero, subtitleEn: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف الترويجي (AR)' : 'Promo Subtitle (AR)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingHero.subtitleAr} 
                    onChange={e => setEditingHero({ ...editingHero, subtitleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsHeroModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="ados-btn-primary" onClick={handleSaveHeroTexts}>
                  <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حفظ النصوص' : 'Save Texts'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. MODAL: IMAGE PICKER & UPLOADER (Exact match to Image 2)          */}
      {/* ------------------------------------------------------------------ */}
      {isImagePickerOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIsImagePickerOpen(false)}>
          <div className="ados-modal-window ados-modal-window-wide" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>{isAr ? 'اختيار صورة أو رفع ملف جديد' : 'Choose Photo Asset or Upload'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIsImagePickerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              {/* File upload prompt */}
              <div style={{
                border: '2px dashed #93c5fd',
                borderRadius: 12,
                padding: '16px 20px',
                backgroundColor: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#002830', fontSize: 14 }}>
                    {isAr ? 'رفع صورة جديدة من جهاز الكمبيوتر' : 'Upload a new photo from your PC'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                    {isAr ? 'يدعم ملفات PNG أو JPG أو WEBP' : 'PNG, JPG or WEBP formats supported'}
                  </div>
                </div>
                <label style={{
                  backgroundColor: '#00a8cc',
                  color: 'white',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Upload size={14} />
                  <span>{isAr ? 'استعراض الملفات' : 'Browse File'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    ref={fileInputRef}
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#334155' }}>
                  {isAr ? 'أو اختر من مكتبة صور المشروع:' : 'Or select from project media library:'}
                </div>
                <div className="ados-image-picker-grid">
                  {ALL_PROJECT_ASSETS.map((asset, idx) => (
                    <div 
                      key={idx} 
                      className="ados-image-picker-item"
                      title={asset.name}
                      onClick={() => handleSelectImage(asset.path)}
                    >
                      <img src={asset.path} alt={asset.name} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        insetInline: 0,
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        color: 'white',
                        fontSize: 10,
                        padding: '2px 4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {asset.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <button className="ados-btn-secondary" onClick={() => setIsImagePickerOpen(false)}>
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. MODAL: 360° VIRTUAL TOUR URL                                    */}
      {/* ------------------------------------------------------------------ */}
      {is360ModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIs360ModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>{isAr ? 'إعداد جولة تفاعلية 360° للمطعم' : 'Configure 360° Virtual Tour'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIs360ModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-group">
                <label>{isAr ? 'عنوان الجولة (بالإنجليزية)' : 'Tour Title (EN)'}</label>
                <input 
                  type="text" 
                  className="ados-form-input"
                  value={data.explorer360?.title || ''} 
                  onChange={e => setData(prev => ({
                    ...prev,
                    explorer360: { ...prev.explorer360, title: e.target.value }
                  }))}
                />
              </div>

              <div className="ados-form-group">
                <label>{isAr ? 'رابط الجولة 360° (Matterport أو YouTube 360)' : '360° Tour URL (Matterport, iStaging, etc.)'}</label>
                <input 
                  type="url" 
                  className="ados-form-input"
                  value={data.explorer360?.url || ''} 
                  onChange={e => setData(prev => ({
                    ...prev,
                    explorer360: { ...prev.explorer360, url: e.target.value }
                  }))}
                  placeholder="https://my.matterport.com/show/?m=..."
                />
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <button className="ados-btn-primary" onClick={() => {
                setIs360ModalOpen(false);
                showToast(isAr ? 'تم تحديث رابط الجولة 360°.' : '360 tour updated.');
              }}>
                <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                <span>{isAr ? 'حفظ' : 'Done'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. TOAST NOTIFICATION FEEDBACK                                     */}
      {/* ------------------------------------------------------------------ */}
      {toastMessage && (
        <div className="ados-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
