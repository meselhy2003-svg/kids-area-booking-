import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Edit3, 
  Gamepad2, 
  Baby, 
  FerrisWheel, 
  Zap, 
  Boxes, 
  Home, 
  Ticket, 
  Search, 
  Eye, 
  Globe, 
  Instagram, 
  Facebook, 
  Calendar, 
  User, 
  Clock, 
  Sparkles,
  Upload,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Building2,
  Utensils,
  PartyPopper,
  LogOut
} from 'lucide-react';
import './DesktopDashboardPage.css';
import PlayZoneOrdersManager from './PlayZoneOrdersManager';
import { authService } from '../../api/authService';


// Curated Local Assets for quick selection & fallback
const LOCAL_ASSET_GALLERY = [
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
  { name: 'Cinematic Backdrop', path: '/photo/kid area pic/Cinematic Full-Width Backdrop.png' },
  { name: 'Resort Architecture', path: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png' }
];

// Initial Master Data for All Zones
const INITIAL_ZONES_DATA = {
  // CHALLENGE ZONE
  'challenge': {
    name: 'CHALLENGE ZONE',
    nameAr: 'منطقة التحدي',
    icon: 'gamepad',
    hero: {
      titleEn: 'CHALLENGE ZONE',
      subtitleEn: 'Challenge yourself, beat your score, and have fun',
      titleAr: 'منطقة التحدي',
      subtitleAr: 'تحدى نفسك، حطم رقمك القياسي، واستمتع باللعب',
      images: [
        '/photo/kid area pic/Graphic Composition.png',
        '/photo/kid area pic/Kid wearing VR headset in neon arcade.png',
        '/photo/kid area pic/Photo 3_ VR Arena Friends.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'ch-pkg-1',
        title: 'Challenge Pass',
        titleAr: 'تذكرة التحدي الشاملة',
        subtitle: 'Pick any 4 games',
        badge: 'Save 60 EGP',
        badgeAr: 'وفر 60 ج.م',
        price: 100,
        originalPrice: 160,
        image: '/photo/kid area pic/Photo 3_ VR Arena Friends.png',
        features: ['VR', 'Basketball', 'Shooting', 'Car Racing']
      }
    ],
    tickets: [
      { id: 'ch-tkt-1', title: 'Shooting', titleAr: 'الرماية بالليزر', price: 40, unit: '/ ticket', image: '/photo/kid area pic/Laser & Tactical Arena.png' },
      { id: 'ch-tkt-2', title: 'Basketball', titleAr: 'كرة السلة الإلكترونية', price: 40, unit: '/ ticket', image: '/photo/kid area pic/Family celebrating victory at skeeball.png' },
      { id: 'ch-tkt-3', title: 'Boxing Machine', titleAr: 'ماكينة قياس قوة اللكم', price: 40, unit: '/ ticket', image: '/photo/kid area pic/Boxing Punch Machine.png' },
      { id: 'ch-tkt-4', title: 'Ping Pong', titleAr: 'بينج بونج طاولة', price: 30, unit: '/ 30 min', image: '/photo/kid area pic/Table Tennis Ping Pong.png' },
      { id: 'ch-tkt-5', title: 'PS4', titleAr: 'بلايستيشن 4', price: 50, unit: '/ 30 min', image: '/photo/kid area pic/PS4 PlayStation Gaming.png' },
      { id: 'ch-tkt-6', title: 'Boxing Machine', titleAr: 'ماكينة اللكم التفاعلية', price: 40, unit: '/ ticket', image: '/photo/kid area pic/Boxing Punch Machine (1).png' },
      { id: 'ch-tkt-7', title: 'VR Simulator', titleAr: 'محاكي الواقع الافتراضي VR', price: 40, unit: '/ ticket', image: '/photo/kid area pic/Kid wearing VR headset in neon arcade.png' },
      { id: 'ch-tkt-8', title: 'Air Hockey', titleAr: 'هوكي الهواء السريع', price: 50, unit: '/ 30 min', image: '/photo/kid area pic/Air Hockey Table.png' },
      { id: 'ch-tkt-9', title: 'Billiards', titleAr: 'بلياردو أمريكي', price: 50, unit: '/ 30 min', image: '/photo/kid area pic/Billiards Pool Table.png' },
      { id: 'ch-tkt-10', title: 'PS4 Lounge', titleAr: 'صالة البلايستيشن VIP', price: 50, unit: '/ 30 min', image: '/photo/kid area pic/PS4 PlayStation Gaming.png' }
    ],
    explore: [
      { id: 'ch-exp-1', image: '/photo/kid area pic/High ropes suspended course.png', caption: 'High Ropes Suspension' }
    ],
    explorer360: {
      title: 'Challenge Zone 360° Virtual Experience',
      url: 'https://my.matterport.com/show/?m=challenge-zone',
      enabled: true
    }
  },

  // Kids Area
  'kids-area': {
    name: 'Kids Area',
    nameAr: 'منطقة الأطفال',
    icon: 'baby',
    hero: {
      titleEn: 'Kids Area',
      subtitleEn: 'Little Adventurers Big Smiles!',
      titleAr: 'منطقة الأطفال',
      subtitleAr: 'مغامرات صغيرة وسعادة كبيرة!',
      images: [
        '/photo/kid area pic/Kids sliding into colorful ball pit.png',
        '/photo/kid area pic/Little boy laughing in ball pit2.png',
        '/photo/kid area pic/Toddler laughing in soft ball pit.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'ka-pkg-1',
        title: 'Single Midweek',
        titleAr: 'تذكرة فردية منتصف الأسبوع',
        badge: 'SAVE 85 EGP',
        badgeAr: 'وفر 85 ج.م',
        ages: 'Ages 1 - 3',
        features: ['All-day entry + 1 Package جبس وألوان'],
        price: 100,
        originalPrice: 185,
        image: '/photo/kid area pic/Little boy laughing in ball pit2.png'
      },
      {
        id: 'ka-pkg-2',
        title: 'Sisters Midweek',
        titleAr: 'تذكرة الأختين منتصف الأسبوع',
        badge: 'SAVE 150 EGP',
        badgeAr: 'وفر 150 ج.م',
        ages: 'Ages 1 - 3',
        features: ['All-day entry for 2 kids'],
        price: 150,
        originalPrice: 300,
        image: '/photo/kid area pic/Kids sliding into colorful ball pit.png'
      },
      {
        id: 'ka-pkg-3',
        title: 'Single Weekend',
        titleAr: 'تذكرة فردية نهاية الأسبوع',
        badge: 'SAVE 35 EGP',
        badgeAr: 'وفر 35 ج.م',
        ages: 'Ages 1 - 3',
        features: ['All-day entry + 1 Package جبس وألوان', '+ Free coloring workshop + Party included'],
        price: 150,
        originalPrice: 185,
        image: '/photo/kid area pic/Toddler laughing in soft ball pit.png'
      },
      {
        id: 'ka-pkg-4',
        title: 'Sisters Weekend',
        titleAr: 'تذكرة الأختين نهاية الأسبوع',
        badge: 'SAVE 120 EGP',
        badgeAr: 'وفر 120 ج.م',
        ages: 'Ages 1 - 3',
        features: ['Entry for 2 kids + 2 Package جبس وألوان', '+ Free coloring workshop + Party included'],
        price: 250,
        originalPrice: 370,
        image: '/photo/kid area pic/Boy laughing playing with toys.png'
      }
    ],
    tickets: [],
    explore: [
      { id: 'ka-exp-1', image: '/photo/kid area pic/High ropes suspended course.png', caption: 'Ropes Bridge' }
    ],
    explorer360: {
      title: 'Kids Area 360° Virtual Dome',
      url: 'https://my.matterport.com/show/?m=kids-dome',
      enabled: true
    }
  },

  // Fun Park
  'fun-park': {
    name: 'Fun Park',
    nameAr: 'منطقة المرح',
    icon: 'ferris',
    hero: {
      titleEn: 'Fun Park',
      subtitleEn: 'A world of fun, laughter, and endless smiles',
      titleAr: 'منطقة المرح',
      subtitleAr: 'عالم من المرح والضحك والابتسامات التي لا تنتهي',
      images: [
        '/photo/kid area pic/Classic illuminated carousel ride.png',
        '/photo/kid area pic/Bumper Collision Bay.png',
        '/photo/kid area pic/Junior GP Speedway.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'fp-pkg-1',
        title: 'Single Midweek',
        titleAr: 'تذكرة فردية منتصف الأسبوع',
        badge: 'SAVE 85 EGP',
        badgeAr: 'وفر 85 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry + 1 Game(1 VR)'],
        price: 100,
        originalPrice: 185,
        image: '/photo/kid area pic/Bumper Collision Bay.png'
      },
      {
        id: 'fp-pkg-2',
        title: 'Sisters Midweek',
        titleAr: 'تذكرة الأختين منتصف الأسبوع',
        badge: 'SAVE 150 EGP',
        badgeAr: 'وفر 150 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry for 2 kids'],
        price: 150,
        originalPrice: 300,
        image: '/photo/kid area pic/Family bumper car arena.png'
      },
      {
        id: 'fp-pkg-3',
        title: 'Friends Midweek',
        titleAr: 'تذكرة الأصدقاء منتصف الأسبوع',
        badge: 'SAVE 95 EGP',
        badgeAr: 'وفر 95 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry for 3 kids'],
        price: 225,
        originalPrice: 320,
        image: '/photo/kid area pic/Classic illuminated carousel ride.png'
      },
      {
        id: 'fp-pkg-4',
        title: 'Single Weekend',
        titleAr: 'تذكرة فردية نهاية الأسبوع',
        badge: 'SAVE 35 EGP',
        badgeAr: 'وفر 35 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry + 2 Game(1 VR, 1 Basketball) + Party'],
        price: 150,
        originalPrice: 185,
        image: '/photo/kid area pic/Junior GP Speedway.png'
      },
      {
        id: 'fp-pkg-5',
        title: 'Sisters Weekend',
        titleAr: 'تذكرة الأختين نهاية الأسبوع',
        badge: 'SAVE 50 EGP',
        badgeAr: 'وفر 50 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry for 2 kids + 2 Game(1 VR, 1 Basketball) + Party'],
        price: 250,
        originalPrice: 300,
        image: '/photo/kid area pic/High-Octane Racing.png'
      },
      {
        id: 'fp-pkg-6',
        title: 'Friends Weekend',
        titleAr: 'تذكرة الأصدقاء نهاية الأسبوع',
        badge: 'SAVE 25 EGP',
        badgeAr: 'وفر 25 ج.م',
        ages: 'Ages 4 - 12',
        features: ['All-day entry for 3 kids + 3 Game(1 VR, 1 Basketball) + Party'],
        price: 375,
        originalPrice: 400,
        image: '/photo/kid area pic/Motorcycle Racing Arcade.png'
      }
    ],
    tickets: [],
    explore: [
      { id: 'fp-exp-1', image: '/photo/kid area pic/High ropes suspended course.png', caption: 'Fun Park Obstacle Area' }
    ],
    explorer360: {
      title: 'Fun Park 360° Virtual Tour',
      url: 'https://my.matterport.com/show/?m=fun-park',
      enabled: true
    }
  },

  // Adventure Zone
  'adventure': {
    name: 'ADVENTURE ZONE',
    nameAr: 'منطقة المغامرات',
    icon: 'zap',
    hero: {
      titleEn: 'ADVENTURE ZONE',
      subtitleEn: 'Dare to explore high ropes and adrenaline rushes',
      titleAr: 'منطقة المغامرات والتسلق',
      subtitleAr: 'تحدي الشجاعة، تسلق، واستمتع بتجربة فريدة',
      images: [
        '/photo/kid area pic/Young girl balancing on high rope suspension bridge.png',
        '/photo/kid area pic/High ropes suspended course.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'adv-pkg-1',
        title: 'Ropes & Climbing Pass',
        titleAr: 'تذكرة تسلق الحبال والمغامرة',
        badge: 'SAVE 50 EGP',
        badgeAr: 'وفر 50 ج.م',
        ages: 'Ages 8+',
        features: ['High ropes obstacle course', 'Zip-line ride', 'Climbing wall access'],
        price: 150,
        originalPrice: 200,
        image: '/photo/kid area pic/Young girl balancing on high rope suspension bridge.png'
      }
    ],
    tickets: [
      { id: 'adv-tkt-1', title: 'Suspension Bridge Walk', titleAr: 'جسر الحبال المعلق', price: 60, unit: '/ round', image: '/photo/kid area pic/High ropes suspended course.png' }
    ],
    explore: [
      { id: 'adv-exp-1', image: '/photo/kid area pic/Young girl balancing on high rope suspension bridge.png', caption: 'High Ropes Suspension Bridge' }
    ],
    explorer360: {
      title: 'Adventure Zone 360° Canopy Tour',
      url: 'https://my.matterport.com/show/?m=adventure-canopy',
      enabled: true
    }
  },

  // Home Page
  'home': {
    name: 'Home',
    nameAr: 'الرئيسية',
    icon: 'home',
    hero: {
      titleEn: 'AMERICAN DREAM RESORT',
      subtitleEn: "Ismailia's Ultimate Family Destination",
      titleAr: 'أمريكان دريم بارك',
      subtitleAr: 'الوجهة الترفيهية الأولى للعائلة في الإسماعيلية',
      images: [
        '/photo/kid area pic/Cinematic Full-Width Backdrop.png',
        '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'hm-pkg-1',
        title: 'All-Day Resort Pass',
        titleAr: 'تذكرة اليوم الكامل لجميع المناطق',
        badge: 'BEST VALUE',
        badgeAr: 'أفضل قيمة',
        ages: 'All Ages',
        features: ['Access to Kids Area & Fun Park', 'Challenge Zone VR Access', 'Free parking & Welcome Drink'],
        price: 350,
        originalPrice: 500,
        image: '/photo/kid area pic/Cinematic Full-Width Backdrop.png'
      }
    ],
    tickets: [],
    explore: [
      { id: 'hm-exp-1', image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png', caption: 'Resort Overview' }
    ],
    explorer360: {
      title: 'Resort Grand 360° Aerial Tour',
      url: 'https://my.matterport.com/show/?m=resort-grand',
      enabled: true
    }
  },

  // Packages Zone
  'packages': {
    name: 'PACKAGES',
    nameAr: 'الباقات والعروض',
    icon: 'boxes',
    hero: {
      titleEn: 'EXCLUSIVE PACKAGES',
      subtitleEn: 'Unlock unlimited fun with discounted bundle passes',
      titleAr: 'الباقات المميزة والعروض الشاملة',
      subtitleAr: 'وفر أكثر واستمتع بجميع الألعاب والأنشطة',
      images: [
        '/photo/kid area pic/Background.png',
        '/photo/kid area pic/Graphic Composition.png'
      ],
      activeSlideIndex: 0
    },
    subTab: 'packages',
    packages: [
      {
        id: 'pkg-all-1',
        title: 'Family Mega Bundle',
        titleAr: 'باقة العائلة الذهبية',
        badge: 'SAVE 300 EGP',
        badgeAr: 'وفر 300 ج.م',
        ages: 'Family (4 Persons)',
        features: ['Entry for 2 Adults + 2 Kids', '200 EGP Arcade credits', 'Meal voucher included'],
        price: 650,
        originalPrice: 950,
        image: '/photo/kid area pic/Family celebrating victory at skeeball.png'
      }
    ],
    tickets: [],
    explore: [
      { id: 'pkg-exp-1', image: '/photo/kid area pic/Family birthday party celebration with cake.png', caption: 'Family celebrations' }
    ],
    explorer360: {
      title: 'Resort 360° Tour',
      url: 'https://my.matterport.com/show/?m=resort-packages',
      enabled: true
    }
  }
};

export default function DesktopDashboardPage({ 
  setActiveTab, 
  openModal, 
  lang = 'ar',
  setLang 
}) {
  const isAr = lang === 'ar';

  // Master state
  const [zonesData, setZonesData] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_dashboard_master_data_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return INITIAL_ZONES_DATA;
  });

  // Current active zone tab: 'challenge' | 'kids-area' | 'fun-park' | 'adventure' | 'home' | 'packages'
  const [activeZone, setActiveZone] = useState('challenge');

  // Modals & Orders Suite state
  const [ordersInitialView, setOrdersInitialView] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h.includes('restaurant')) return 'restaurant-orders';
      if (h.includes('event')) return 'events-orders';
      if (h.includes('trip')) return 'trips-orders';
    }
    return 'playzone-orders';
  });

  // Modals state
  const [isOrdersViewOpen, setIsOrdersViewOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      return (
        h === '#playzone-orders' ||
        h === '#orders' ||
        h === '#trips-orders' ||
        h === '#restaurant-orders' ||
        h === '#events-orders'
      );
    }
    return false;
  });

  // Live order counts from backend APIs
  const [counts, setCounts] = useState({ passes: 22, trips: 5, events: 5 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pzRes, trRes, evRes] = await Promise.allSettled([
          fetch('/api/buying?limit=1').then(r => r.json()),
          fetch('/api/trips?limit=1').then(r => r.json()),
          fetch('/api/events?limit=1').then(r => r.json())
        ]);
        setCounts({
          passes: pzRes.status === 'fulfilled' && (pzRes.value.total || pzRes.value.count || pzRes.value.data?.length)
            ? (pzRes.value.total || pzRes.value.count || pzRes.value.data?.length)
            : 22,
          trips: trRes.status === 'fulfilled' && (trRes.value.total || trRes.value.count || trRes.value.trips?.length)
            ? (trRes.value.total || trRes.value.count || trRes.value.trips?.length)
            : 5,
          events: evRes.status === 'fulfilled' && (evRes.value.total || evRes.value.count || evRes.value.bookings?.length)
            ? (evRes.value.total || evRes.value.count || evRes.value.bookings?.length)
            : 5
        });
      } catch (err) {
        console.warn('Failed to load dashboard live counts:', err);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      if (h === '#playzone-orders' || h === '#orders') {
        setOrdersInitialView('playzone-orders');
        setIsOrdersViewOpen(true);
      } else if (h === '#trips-orders') {
        setOrdersInitialView('trips-orders');
        setIsOrdersViewOpen(true);
      } else if (h === '#restaurant-orders') {
        setOrdersInitialView('restaurant-orders');
        setIsOrdersViewOpen(true);
      } else if (h === '#events-orders') {
        setOrdersInitialView('events-orders');
        setIsOrdersViewOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);


  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState('edit'); // 'edit' | 'add'
  const [editingCard, setEditingCard] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Admin Logout Handler
  const handleAdminLogout = async () => {
    const confirmMsg = isAr 
      ? 'هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة الإدارة والعودة للبوابة الرئيسية؟' 
      : 'Are you sure you want to log out from the Admin Dashboard and return to the lobby?';
    if (window.confirm(confirmMsg)) {
      await authService.logout();
      if (setActiveTab) setActiveTab('lobby');
      if (typeof window !== 'undefined') {
        window.location.hash = '#lobby';
      }
    }
  };

  // File input ref for upload
  const fileInputRef = useRef(null);

  // Get current zone data
  const currentZoneData = zonesData[activeZone] || zonesData['challenge'];
  const currentHero = currentZoneData.hero;
  const currentHeroImages = currentHero?.images || ['/photo/kid area pic/Graphic Composition.png'];
  const activeSlideIndex = currentHero?.activeSlideIndex || 0;
  const currentBannerImg = currentHeroImages[activeSlideIndex] || currentHeroImages[0];
  const activeSubTab = currentZoneData.subTab || 'packages';

  // Persist master data to localStorage
  const handleSaveChanges = () => {
    try {
      localStorage.setItem('ados_dashboard_master_data_v2', JSON.stringify(zonesData));
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast(isAr ? '✓ تم حفظ جميع التعديلات بنجاح في لوحة التحكم!' : '✓ All changes saved successfully to ADOS Management Dashboard!');
    } catch (err) {
      showToast(isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes to local storage.');
    }
  };

  // Revert changes
  const handleCancelChanges = () => {
    const confirmPrompt = isAr 
      ? 'هل أنت متأكد من استعادة البيانات الافتراضية وإلغاء جميع التعديلات؟' 
      : 'Reset all changes back to saved defaults?';
    if (window.confirm(confirmPrompt)) {
      localStorage.removeItem('ados_dashboard_master_data_v2');
      setZonesData(INITIAL_ZONES_DATA);
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية.' : 'Changes reset to defaults.');
    }
  };

  // Sub-Tab Switcher
  const handleSubTabChange = (tabName) => {
    setZonesData(prev => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        subTab: tabName
      }
    }));
  };

  // Cycle Hero Carousel Dots
  const handleCarouselDotClick = (index) => {
    setZonesData(prev => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        hero: {
          ...prev[activeZone].hero,
          activeSlideIndex: index
        }
      }
    }));
  };

  // Delete current Hero Banner image
  const handleDeleteHeroBanner = () => {
    if (currentHeroImages.length <= 1) {
      alert(isAr ? 'يجب الإبقاء على صورة واحدة على الأقل لشريحة الغلاف.' : 'You must have at least one hero banner image.');
      return;
    }
    const updatedImages = currentHeroImages.filter((_, idx) => idx !== activeSlideIndex);
    setZonesData(prev => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        hero: {
          ...prev[activeZone].hero,
          images: updatedImages,
          activeSlideIndex: 0
        }
      }
    }));
    showToast(isAr ? 'تمت إزالة صورة الغلاف.' : 'Hero image removed.');
  };

  // Open Image Picker
  const openImagePicker = (target) => {
    setImagePickerTarget(target);
    setIsImagePickerOpen(true);
  };

  // Apply selected image from gallery or file
  const handleSelectImage = (imagePath) => {
    if (!imagePickerTarget) return;

    if (imagePickerTarget.type === 'hero') {
      const newImages = [...currentHeroImages];
      newImages[activeSlideIndex] = imagePath;
      setZonesData(prev => ({
        ...prev,
        [activeZone]: {
          ...prev[activeZone],
          hero: {
            ...prev[activeZone].hero,
            images: newImages
          }
        }
      }));
      showToast(isAr ? 'تم تحديث صورة الغلاف.' : 'Hero banner updated.');
    } else if (imagePickerTarget.type === 'explore') {
      const exploreList = [...(currentZoneData.explore || [])];
      if (imagePickerTarget.slotIndex !== undefined && exploreList[imagePickerTarget.slotIndex]) {
        exploreList[imagePickerTarget.slotIndex].image = imagePath;
      } else {
        exploreList.push({
          id: `exp-${Date.now()}`,
          image: imagePath,
          caption: 'Exploration Feature'
        });
      }
      setZonesData(prev => ({
        ...prev,
        [activeZone]: {
          ...prev[activeZone],
          explore: exploreList
        }
      }));
      showToast(isAr ? 'تم تحديث صورة الاستكشاف.' : 'Explore photo updated.');
    } else if (imagePickerTarget.type === 'card' && editingCard) {
      setEditingCard(prev => ({ ...prev, image: imagePath }));
    }

    setIsImagePickerOpen(false);
  };

  // Handle local file upload in Image Picker modal
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
    const exploreList = (currentZoneData.explore || []).filter((_, i) => i !== slotIdx);
    setZonesData(prev => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        explore: exploreList
      }
    }));
    showToast(isAr ? 'تم حذف الصورة من قسم الاستكشاف.' : 'Photo removed from Explore section.');
  };

  // Open Edit Card Modal
  const openEditCardModal = (card, isTicket = false) => {
    setCardModalMode('edit');
    setEditingCard({
      ...card,
      isTicket: isTicket || activeSubTab === 'tickets'
    });
    setIsCardModalOpen(true);
  };

  // Open Add Card Modal
  const openAddCardModal = () => {
    setCardModalMode('add');
    const isTicket = activeSubTab === 'tickets';
    setEditingCard({
      id: `${activeZone}-${isTicket ? 'tkt' : 'pkg'}-${Date.now()}`,
      title: isTicket ? 'New Attraction Ticket' : 'New Package Offer',
      titleAr: isTicket ? 'تذكرة نشاط جديدة' : 'عرض باقة جديدة',
      subtitle: isTicket ? '' : 'All-day access pass',
      badge: isTicket ? '' : 'SAVE 50 EGP',
      badgeAr: isTicket ? '' : 'وفر 50 ج.م',
      ages: isTicket ? '' : 'Ages 4 - 12',
      price: 50,
      originalPrice: 80,
      unit: '/ ticket',
      image: LOCAL_ASSET_GALLERY[0].path,
      features: isTicket ? [] : ['All-day entry', '1 VR Game included'],
      isTicket
    });
    setIsCardModalOpen(true);
  };

  // Save Card (Edit or Add)
  const handleSaveCard = () => {
    if (!editingCard) return;

    const isTicket = editingCard.isTicket || activeSubTab === 'tickets';
    const listKey = isTicket ? 'tickets' : 'packages';
    const list = [...(currentZoneData[listKey] || [])];

    if (cardModalMode === 'edit') {
      const idx = list.findIndex(c => c.id === editingCard.id);
      if (idx !== -1) {
        list[idx] = editingCard;
      }
    } else {
      list.push(editingCard);
    }

    setZonesData(prev => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        [listKey]: list
      }
    }));

    setIsCardModalOpen(false);
    setEditingCard(null);
    showToast(isAr ? `✓ تم حفظ ${editingCard.titleAr || editingCard.title} بنجاح.` : `✓ ${editingCard.title} saved successfully.`);
  };

  // Delete Card
  const handleDeleteCard = () => {
    if (!editingCard) return;
    const itemTitle = editingCard.titleAr || editingCard.title;
    const confirmPrompt = isAr ? `هل أنت متأكد من حذف "${itemTitle}"؟` : `Are you sure you want to delete "${itemTitle}"?`;
    if (window.confirm(confirmPrompt)) {
      const isTicket = editingCard.isTicket || activeSubTab === 'tickets';
      const listKey = isTicket ? 'tickets' : 'packages';
      const list = (currentZoneData[listKey] || []).filter(c => c.id !== editingCard.id);

      setZonesData(prev => ({
        ...prev,
        [activeZone]: {
          ...prev[activeZone],
          [listKey]: list
        }
      }));

      setIsCardModalOpen(false);
      setEditingCard(null);
      showToast(isAr ? 'تم حذف العنصر.' : 'Item deleted.');
    }
  };

  // Render Full Play Zone, Trips, Restaurant & Events Orders Management Suite
  if (isOrdersViewOpen) {
    return (
      <PlayZoneOrdersManager 
        initialView={ordersInitialView}
        onBackToDashboard={() => setIsOrdersViewOpen(false)} 
        onGoHome={() => setActiveTab && setActiveTab('home')}
        lang={lang} 
        setLang={setLang}
      />
    );
  }

  return (
    <div 
      className={`ados-dashboard-container ${isAr ? 'lang-ar' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. SIDEBAR                                                         */}
      {/* ------------------------------------------------------------------ */}
      <aside className="ados-sidebar">
        <div className="ados-sidebar-top">
          {/* Logo */}
          <button 
            className="ados-sidebar-logo-btn" 
            title={isAr ? 'العودة لموقع أمريكان دريم' : 'Return to American Dream Website'}
            onClick={() => setActiveTab('home')}
          >
            <img 
              src="/photo/logo/logo nav bar and footer.png" 
              alt="American Dream Logo" 
              className="ados-sidebar-logo" 
            />
          </button>

          {/* Web Admin Dashboard Nav Link */}
          <button 
            className="ados-sidebar-nav-link"
            onClick={() => setActiveTab('home')}
            title={isAr ? 'الانتقال إلى الموقع العام' : 'Click to view the public website'}
          >
            <span>
              <Globe size={15} color="#38bdf8" />
              {isAr ? 'الموقع العام' : 'Visit Public Website'}
            </span>
            {isAr ? <ChevronLeft size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />}
          </button>

          {/* Play Zone Passes Nav Link */}
          <button 
            className="ados-sidebar-nav-link"
            onClick={() => {
              setOrdersInitialView('playzone-orders');
              setIsOrdersViewOpen(true);
            }}
            title={isAr ? 'إدارة تذاكر وباقات البلاي زون' : 'Manage Play Zone Passes & Tickets'}
          >
            <span>
              <Ticket size={15} color="#00d2ff" />
              {isAr ? 'تذاكر البلاي زون' : 'Play Zone Passes'}
            </span>
            <span style={{ 
              marginInlineStart: 'auto', 
              background: '#00d2ff', 
              color: '#002830', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              fontSize: '11px', 
              fontWeight: 800 
            }}>
              {counts.passes}
            </span>
          </button>

          {/* School & Group Trips Nav Link */}
          <button 
            className="ados-sidebar-nav-link"
            onClick={() => {
              setOrdersInitialView('trips-orders');
              setIsOrdersViewOpen(true);
            }}
            title={isAr ? 'إدارة حجوزات الرحلات المدرسية' : 'Manage School & Group Trips'}
          >
            <span>
              <Building2 size={15} color="#38bdf8" />
              {isAr ? 'طلبات الرحلات' : 'Trips Bookings'}
            </span>
            <span style={{ 
              marginInlineStart: 'auto', 
              background: '#0284c7', 
              color: '#ffffff', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              fontSize: '11px', 
              fontWeight: 800 
            }}>
              {counts.trips}
            </span>
          </button>

          {/* Restaurant & Cafe Orders Nav Link */}
          <button 
            className="ados-sidebar-nav-link"
            onClick={() => {
              setOrdersInitialView('restaurant-orders');
              setIsOrdersViewOpen(true);
            }}
            title={isAr ? 'إدارة طلبات المطعم والكافيه وحجوزات الطاولات' : 'Manage Restaurant Orders & Table Bookings'}
          >
            <span>
              <Utensils size={15} color="#10b981" />
              {isAr ? 'طلبات المطعم والكافيه' : 'Restaurant & Cafe'}
            </span>
            <span style={{ 
              marginInlineStart: 'auto', 
              background: '#10b981', 
              color: '#ffffff', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              fontSize: '11px', 
              fontWeight: 800 
            }}>
              34
            </span>
          </button>

          {/* Event Halls & Birthdays Nav Link */}
          <button 
            className="ados-sidebar-nav-link"
            onClick={() => {
              setOrdersInitialView('events-orders');
              setIsOrdersViewOpen(true);
            }}
            title={isAr ? 'إدارة حجوزات القاعات وأعياد الميلاد' : 'Manage Event Halls & Celebrations'}
          >
            <span>
              <Sparkles size={15} color="#ec4899" />
              {isAr ? 'القاعات والمناسبات' : 'Events & Halls'}
            </span>
            <span style={{ 
              marginInlineStart: 'auto', 
              background: '#ec4899', 
              color: '#ffffff', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              fontSize: '11px', 
              fontWeight: 800 
            }}>
              {counts.events}
            </span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="ados-sidebar-footer">
          <div className="ados-sidebar-brand-script">
            {isAr ? 'العب، استكشف، معاً!' : 'Play, Explore, Together!'}
          </div>
          <div className="ados-sidebar-brand-subtitle">
            {isAr ? 'منتجع الإسماعيلية للمرح' : 'ISMAILIA FUN RESORT'}
          </div>
          <div className="ados-sidebar-socials">
            <button className="ados-sidebar-social-icon" onClick={() => window.open('https://facebook.com', '_blank')}>
              <Facebook size={14} />
            </button>
            <button className="ados-sidebar-social-icon" onClick={() => window.open('https://instagram.com', '_blank')}>
              <Instagram size={14} />
            </button>
            <button className="ados-sidebar-social-icon" onClick={() => setActiveTab('home')}>
              <Globe size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN BODY AREA                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="ados-main-area">
        {/* Topbar */}
        <header className="ados-topbar">
          <div style={{ width: 140 }}></div>
          <div className="ados-topbar-title-group">
            <h1 className="ados-topbar-title">
              {isAr ? 'لوحة تحكم إدارة أمريكان دريم' : 'ADOS Management Dashboard'}
            </h1>
            <div className="ados-topbar-subtitle">
              {isAr ? 'مرح أكثر • قيمة أعلى • ذكريات تدوم' : 'More Fun. More Value. More Memories.'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language Toggle */}
            <div className="ados-topbar-lang-toggle">
              <button 
                type="button" 
                className={`ados-lang-btn ${isAr ? 'active' : ''}`}
                onClick={() => setLang && setLang('ar')}
                title="عربي"
              >
                عربي
              </button>
              <button 
                type="button" 
                className={`ados-lang-btn ${!isAr ? 'active' : ''}`}
                onClick={() => setLang && setLang('en')}
                title="English"
              >
                EN
              </button>
            </div>

            <button 
              className="ados-orders-btn"
              onClick={() => setIsOrdersViewOpen(true)}
              title={isAr ? 'فتح إدارة طلبات البلاي زون' : 'Open Play Zone & Trips Orders Management'}
            >
              <span>{isAr ? 'طلبات البلاي زون' : 'PLAY ZONE ORDERS'}</span>
              <span className="ados-orders-count-badge">86</span>
            </button>

            <button 
              type="button"
              className="ados-logout-topbar-btn"
              onClick={handleAdminLogout}
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

        {/* Dashboard Content Container */}
        <div className="ados-content">
          {/* Zone Navigation Pills */}
          <nav className="ados-zone-nav">
            <button 
              className={`ados-zone-pill ${activeZone === 'home' ? 'active' : ''}`}
              onClick={() => setActiveZone('home')}
            >
              <Home size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'kids-area' ? 'active' : ''}`}
              onClick={() => setActiveZone('kids-area')}
            >
              <Baby size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'منطقة الأطفال' : 'Kids Area'}</span>
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'fun-park' ? 'active' : ''}`}
              onClick={() => setActiveZone('fun-park')}
            >
              <FerrisWheel size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'فن بارك' : 'Fun Park'}</span>
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveZone('challenge')}
            >
              <Gamepad2 size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'منطقة التحدي' : 'CHALLENGE ZONE'}</span>
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'adventure' ? 'active' : ''}`}
              onClick={() => setActiveZone('adventure')}
            >
              <Zap size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'منطقة المغامرات' : 'ADVENTURE ZONE'}</span>
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveZone('packages')}
            >
              <Boxes size={15} className="ados-zone-pill-icon" />
              <span>{isAr ? 'الباقات والعروض' : 'PACKAGES'}</span>
            </button>
          </nav>

          {/* Hero Banner Section */}
          <section 
            className="ados-hero-card"
            style={{ backgroundImage: `url("${currentBannerImg}")` }}
          >
            <div className="ados-hero-overlay"></div>
            <div className="ados-hero-inner">
              <div className="ados-hero-text-and-badge">
                <div className="ados-hero-text-block">
                  <h2 className="ados-hero-title-en">
                    {isAr ? (currentHero?.titleAr || currentHero?.titleEn) : currentHero?.titleEn}
                  </h2>
                  <div className="ados-hero-subtitle-en">
                    {isAr ? (currentHero?.subtitleAr || currentHero?.subtitleEn) : currentHero?.subtitleEn}
                  </div>
                  {!isAr && (
                    <>
                      <h3 className="ados-hero-title-ar">{currentHero?.titleAr}</h3>
                      <div className="ados-hero-subtitle-ar">{currentHero?.subtitleAr}</div>
                    </>
                  )}
                </div>

                {/* Stamp Badge */}
                <div className="ados-hero-stamp-badge">
                  {isAr ? (
                    <>
                      <span>العب</span>
                      <span>استكشف</span>
                      <span>تعلم</span>
                      <span>معاً!</span>
                    </>
                  ) : (
                    <>
                      <span>PLAY</span>
                      <span>EXPLORE</span>
                      <span>LEARN</span>
                      <span>TOGETHER!</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Bar: Carousel dots & Change image */}
              <div className="ados-hero-bottom-bar">
                <div className="ados-carousel-dots">
                  {currentHeroImages.map((_, dotIdx) => (
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
                    <span>{isAr ? 'تغيير أو إضافة صورة' : 'Change or Add Image'}</span>
                  </button>
                  {currentHeroImages.length > 1 && (
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

          {/* Offers & Tickets Section Header */}
          <section className="ados-offers-section">
            <div className="ados-section-header">
              <div className="ados-section-title-wrap">
                <h2 className="ados-section-title">
                  {isAr 
                    ? (activeZone === 'challenge' && activeSubTab === 'tickets' ? 'تذاكر ألعاب منطقة التحدي' : `عروض ${currentHero?.titleAr || currentZoneData.nameAr || currentZoneData.name}`)
                    : (activeZone === 'challenge' && activeSubTab === 'tickets' ? 'Challenge Zone Area Tickets' : `${currentZoneData.name} Offers`)}
                </h2>
                <span className="ados-section-title-pipe">|</span>
                <span className="ados-section-title-ar">
                  {activeZone === 'challenge' && activeSubTab === 'tickets' ? 'عروض التذاكر والأنشطة' : `عروض ${currentHero?.titleAr || 'المنطقة'}`}
                </span>
              </div>

              <button className="ados-add-btn" onClick={openAddCardModal}>
                <Plus size={14} />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>

            {/* Sub-Tab Navigation for Challenge Zone or zones with tickets */}
            {(activeZone === 'challenge' || (currentZoneData.tickets && currentZoneData.tickets.length > 0)) && (
              <div className="ados-subtab-container">
                <div className="ados-subtab-group">
                  <button 
                    className={`ados-subtab-btn ${activeSubTab === 'packages' ? 'active' : ''}`}
                    onClick={() => handleSubTabChange('packages')}
                  >
                    <Boxes size={14} />
                    <span>{isAr ? `الباقات (${currentZoneData.packages?.length || 0})` : `Packages (${currentZoneData.packages?.length || 0})`}</span>
                  </button>
                  <button 
                    className={`ados-subtab-btn ${activeSubTab === 'tickets' ? 'active' : ''}`}
                    onClick={() => handleSubTabChange('tickets')}
                  >
                    <Ticket size={14} />
                    <span>{isAr ? `التذاكر (${currentZoneData.tickets?.length || 0})` : `Tickets (${currentZoneData.tickets?.length || 0})`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* CARDS DISPLAY LOGIC */}
            {/* 1. Wide Challenge Pass Card */}
            {activeZone === 'challenge' && activeSubTab === 'packages' && currentZoneData.packages?.map(pkg => (
              <div key={pkg.id} className="ados-wide-package-card">
                {/* Media Collage */}
                <div className="ados-wide-media-collage">
                  <img src={pkg.image} alt={pkg.title} className="ados-wide-media-img" />
                  <div className="ados-collage-pill-badge">
                    {isAr ? '★ اختر أي 4 ألعاب تفاعلية ★' : '★ CHOOSE ANY 4 GAMES ★'}
                  </div>
                </div>

                {/* Info Center */}
                <div className="ados-wide-info-body">
                  <h3 className="ados-wide-title">{isAr ? (pkg.titleAr || pkg.title) : pkg.title}</h3>
                  <div className="ados-wide-subtitle">
                    {isAr ? 'اختر أي 4 ألعاب مميزة' : (pkg.subtitle || 'Pick any 4 games')}
                  </div>
                  
                  <div className="ados-wide-features-grid">
                    <div className="ados-wide-feature-item">
                      <Gamepad2 size={16} color="#0284c7" />
                      <span>{isAr ? 'واقع افتراضي VR' : 'VR'}</span>
                    </div>
                    <div className="ados-wide-feature-item">
                      <Zap size={16} color="#0284c7" />
                      <span>{isAr ? 'كرة السلة' : 'Basketball'}</span>
                    </div>
                    <div className="ados-wide-feature-item">
                      <Sparkles size={16} color="#0284c7" />
                      <span>{isAr ? 'الرماية بالليزر' : 'Shooting'}</span>
                    </div>
                    <div className="ados-wide-feature-item">
                      <Ticket size={16} color="#0284c7" />
                      <span>{isAr ? 'سباق سيارات' : 'Car Racing'}</span>
                    </div>
                  </div>

                  <div className="ados-wide-price-row">
                    <span className="ados-wide-price-main">
                      {pkg.price} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                    {pkg.originalPrice && (
                      <span className="ados-wide-price-original">
                        {pkg.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions & Badge */}
                <div className="ados-wide-right-actions">
                  <div className="ados-save-badge-pill">
                    {isAr ? (pkg.badgeAr || 'وفر 60 ج.م') : (pkg.badge || 'Save 60 EGP')}
                  </div>
                  <button 
                    className="ados-card-edit-btn"
                    onClick={() => openEditCardModal(pkg, false)}
                  >
                    {isAr ? 'تعديل' : 'EDIT'}
                  </button>
                </div>
              </div>
            ))}

            {/* 2. Challenge Zone Tickets */}
            {activeZone === 'challenge' && activeSubTab === 'tickets' && (
              <div className="ados-cards-grid-3">
                {currentZoneData.tickets?.map(tkt => (
                  <div key={tkt.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={tkt.image} alt={tkt.title} className="ados-card-thumb-img" />
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (tkt.titleAr || tkt.title) : tkt.title}
                        </h4>
                        {!isAr && tkt.titleAr && <span className="ados-card-title-ar">{tkt.titleAr}</span>}
                      </div>

                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {tkt.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          <span className="ados-card-price-unit">
                            {isAr 
                              ? (tkt.unit === '/ ticket' ? '/ تذكرة' : (tkt.unit === '/ 30 min' ? '/ 30 دقيقة' : tkt.unit))
                              : (tkt.unit || '/ ticket')}
                          </span>
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(tkt, true)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Kids Area Packages */}
            {activeZone === 'kids-area' && (
              <div className="ados-cards-grid-4">
                {currentZoneData.packages?.map(card => (
                  <div key={card.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={card.image} alt={card.title} className="ados-card-thumb-img" />
                      {card.badge && (
                        <div className="ados-card-thumb-badge">
                          {isAr ? (card.badgeAr || card.badge) : card.badge}
                        </div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (card.titleAr || card.title) : card.title}
                        </h4>
                        {!isAr && card.titleAr && <span className="ados-card-title-ar">{card.titleAr}</span>}
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{isAr ? `الأعمار ${card.ages.replace('Ages ', '')}` : card.ages}</span>
                          </div>
                        )}
                        {card.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="ados-card-detail-item">
                            <Ticket size={13} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {card.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">
                              {card.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Fun Park Packages */}
            {activeZone === 'fun-park' && (
              <div className="ados-cards-grid-3">
                {currentZoneData.packages?.map(card => (
                  <div key={card.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={card.image} alt={card.title} className="ados-card-thumb-img" />
                      {card.badge && (
                        <div className="ados-card-thumb-badge">
                          {isAr ? (card.badgeAr || card.badge) : card.badge}
                        </div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (card.titleAr || card.title) : card.title}
                        </h4>
                        {!isAr && card.titleAr && <span className="ados-card-title-ar">{card.titleAr}</span>}
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{isAr ? `الأعمار ${card.ages.replace('Ages ', '')}` : card.ages}</span>
                          </div>
                        )}
                        {card.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="ados-card-detail-item">
                            <Ticket size={13} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {card.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">
                              {card.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Generic Cards Grid for Adventure, Home, Packages */}
            {activeZone !== 'challenge' && activeZone !== 'kids-area' && activeZone !== 'fun-park' && (
              <div className="ados-cards-grid-3">
                {currentZoneData.packages?.map(card => (
                  <div key={card.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={card.image} alt={card.title} className="ados-card-thumb-img" />
                      {card.badge && (
                        <div className="ados-card-thumb-badge">
                          {isAr ? (card.badgeAr || card.badge) : card.badge}
                        </div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (card.titleAr || card.title) : card.title}
                        </h4>
                        {!isAr && card.titleAr && <span className="ados-card-title-ar">{card.titleAr}</span>}
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{isAr ? `الأعمار ${card.ages.replace('Ages ', '')}` : card.ages}</span>
                          </div>
                        )}
                        {card.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="ados-card-detail-item">
                            <Ticket size={13} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {card.price} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">
                              {card.originalPrice} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Explore Zone Section */}
          <section className="ados-explore-section">
            <h3 className="ados-explore-title">
              {isAr 
                ? `استكشف ${currentHero?.titleAr || currentZoneData.nameAr || currentZoneData.name}` 
                : `Explore ${currentZoneData.name}`}
            </h3>
            <div className="ados-explore-grid">
              {currentZoneData.explore?.map((expItem, idx) => (
                <div key={expItem.id} className="ados-explore-photo-card">
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
                  {isAr ? `المكان #${(currentZoneData.explore?.length || 0) + 1}` : `Slot #${(currentZoneData.explore?.length || 0) + 1}`}
                </div>
              </div>
            </div>
          </section>

          {/* Explore 360° Section */}
          <section className="ados-360-container">
            <div className="ados-360-card">
              <div className="ados-360-title">
                <Eye size={18} className="ados-360-title-icon" />
                <span>{isAr ? 'جولة تفاعلية 360°' : 'EXPLORE 360°'}</span>
              </div>
              <button 
                className="ados-360-action-btn"
                onClick={() => setIs360ModalOpen(true)}
              >
                <RotateCcw size={13} />
                <span>{isAr ? 'تغيير أو ربط جولة 360°' : 'Change or Add 360 EXPLORER'}</span>
              </button>
            </div>
          </section>

          {/* Bottom Save & Cancel Bar */}
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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MODAL: EDIT / ADD CARD                                          */}
      {/* ------------------------------------------------------------------ */}
      {isCardModalOpen && editingCard && (
        <div className="ados-modal-backdrop" onClick={() => setIsCardModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>
                {cardModalMode === 'edit' 
                  ? (isAr ? `تعديل: ${editingCard.titleAr || editingCard.title}` : `Edit Item: ${editingCard.title}`) 
                  : (isAr ? 'إضافة عرض / تذكرة جديدة' : 'Add New Offer / Ticket')}
              </h3>
              <button className="ados-modal-close-btn" onClick={() => setIsCardModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'الاسم بالإنجليزية' : 'Title (English)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingCard.title || ''} 
                    onChange={e => setEditingCard({ ...editingCard, title: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الاسم بالعربية' : 'Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingCard.titleAr || ''} 
                    onChange={e => setEditingCard({ ...editingCard, titleAr: e.target.value })}
                  />
                </div>
              </div>

              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'السعر (ج.م)' : 'Price (EGP)'}</label>
                  <input 
                    type="number" 
                    className="ados-form-input"
                    value={editingCard.price || ''} 
                    onChange={e => {
                      const newPrice = Number(e.target.value);
                      const orig = editingCard.originalPrice || newPrice;
                      const diff = orig - newPrice;
                      setEditingCard({
                        ...editingCard,
                        price: newPrice,
                        badge: diff > 0 ? `SAVE ${diff} EGP` : '',
                        badgeAr: diff > 0 ? `وفر ${diff} ج.م` : ''
                      });
                    }}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'السعر الأصلي (ج.م - لحساب الخصم)' : 'Original Price (EGP - for discount)'}</label>
                  <input 
                    type="number" 
                    className="ados-form-input"
                    value={editingCard.originalPrice || ''} 
                    onChange={e => {
                      const orig = Number(e.target.value);
                      const cur = editingCard.price || 0;
                      const diff = orig - cur;
                      setEditingCard({
                        ...editingCard,
                        originalPrice: orig,
                        badge: diff > 0 ? `SAVE ${diff} EGP` : '',
                        badgeAr: diff > 0 ? `وفر ${diff} ج.م` : ''
                      });
                    }}
                  />
                </div>
              </div>

              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'نص شارة الخصم' : 'Discount Badge Text'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={isAr ? (editingCard.badgeAr || editingCard.badge || '') : (editingCard.badge || '')} 
                    onChange={e => setEditingCard({ ...editingCard, badge: e.target.value, badgeAr: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الفئة العمرية / المدة' : 'Age Range / Duration'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    placeholder={isAr ? 'مثال: الأعمار 1 - 3 أو / 30 دقيقة' : 'e.g. Ages 1 - 3 or / 30 min'}
                    value={editingCard.ages || editingCard.unit || ''} 
                    onChange={e => setEditingCard({ ...editingCard, ages: e.target.value, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="ados-form-group">
                <label>{isAr ? 'صورة العنصر' : 'Card Image'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img 
                    src={editingCard.image} 
                    alt="Preview" 
                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #cbd5e1' }} 
                  />
                  <button 
                    type="button"
                    className="ados-btn-secondary"
                    onClick={() => openImagePicker({ type: 'card' })}
                  >
                    {isAr ? 'اختر صورة من المعرض...' : 'Select Photo from Gallery...'}
                  </button>
                </div>
              </div>

              <div className="ados-form-group">
                <label>{isAr ? 'المميزات المضمنة (مفصولة بفاصلة)' : 'Features / Inclusions (Comma separated)'}</label>
                <textarea 
                  className="ados-form-textarea"
                  rows={3}
                  value={Array.isArray(editingCard.features) ? editingCard.features.join(', ') : (editingCard.subtitle || '')}
                  onChange={e => {
                    const parts = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingCard({ ...editingCard, features: parts, subtitle: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="ados-modal-footer">
              {cardModalMode === 'edit' ? (
                <button className="ados-btn-danger" onClick={handleDeleteCard}>
                  <Trash2 size={13} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حذف العنصر' : 'Delete Item'}</span>
                </button>
              ) : <div></div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsCardModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="ados-btn-primary" onClick={handleSaveCard}>
                  <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حفظ العنصر' : 'Save Item'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. MODAL: IMAGE PICKER & UPLOADER                                  */}
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
                  <div style={{ color: '#64748b', fontSize: 12 }}>
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
                  {LOCAL_ASSET_GALLERY.map((asset, idx) => (
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
                        backgroundColor: 'rgba(0,0,0,0.6)',
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
      {/* 5. MODAL: 360 EXPLORER CONFIGURATION                               */}
      {/* ------------------------------------------------------------------ */}
      {is360ModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIs360ModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>{isAr ? 'إعداد الجولة الافتراضية 360°' : 'Configure 360° Virtual Experience'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIs360ModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-group">
                <label>{isAr ? 'عنوان التجربة الافتراضية 360°' : '360 Experience Title'}</label>
                <input 
                  type="text" 
                  className="ados-form-input"
                  value={currentZoneData.explorer360?.title || ''}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setZonesData(prev => ({
                      ...prev,
                      [activeZone]: {
                        ...prev[activeZone],
                        explorer360: {
                          ...prev[activeZone].explorer360,
                          title: newTitle
                        }
                      }
                    }));
                  }}
                />
              </div>

              <div className="ados-form-group">
                <label>{isAr ? 'رابط الجولة الافتراضية (Matterport)' : 'Virtual Tour / Matterport Embed URL'}</label>
                <input 
                  type="url" 
                  className="ados-form-input"
                  value={currentZoneData.explorer360?.url || ''}
                  placeholder="https://my.matterport.com/show/?m=..."
                  onChange={e => {
                    const newUrl = e.target.value;
                    setZonesData(prev => ({
                      ...prev,
                      [activeZone]: {
                        ...prev[activeZone],
                        explorer360: {
                          ...prev[activeZone].explorer360,
                          url: newUrl
                        }
                      }
                    }));
                  }}
                />
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
              }}>
                <Eye size={32} color="#00a8cc" />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#002830' }}>
                  {isAr ? 'الجولة البانورامية التفاعلية 360° نشطة' : 'Interactive 360° Panorama Active'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                  {isAr 
                    ? 'سيتمكن زوار الموقع العام من التنقل في جولة تفاعلية شاملة 360 درجة لهذه المنطقة.'
                    : 'Visitors on the public site will be able to navigate full 360-degree interactive views of this zone.'}
                </div>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <button 
                className="ados-btn-primary" 
                onClick={() => {
                  setIs360ModalOpen(false);
                  showToast(isAr ? 'تم حفظ إعدادات جولة 360°.' : '360° Explorer settings saved.');
                }}
              >
                {isAr ? 'تطبيق إعدادات 360°' : 'Apply 360° Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. TOAST NOTIFICATION                                             */}
      {/* ------------------------------------------------------------------ */}
      {toastMessage && (
        <div className="ados-toast">
          <Check size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
