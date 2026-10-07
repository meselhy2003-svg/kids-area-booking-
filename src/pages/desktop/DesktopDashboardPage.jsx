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
  ChevronRight
} from 'lucide-react';
import './DesktopDashboardPage.css';

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

// Initial Master Data for All Zones matching the 4 Screenshots precisely
const INITIAL_ZONES_DATA = {
  // Screenshot 1 & 3: CHALLENGE ZONE
  'challenge': {
    name: 'CHALLENGE ZONE',
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
    subTab: 'packages', // 'packages' | 'tickets'
    packages: [
      {
        id: 'ch-pkg-1',
        title: 'Challenge Pass',
        titleAr: 'تذكرة التحدي الشاملة',
        subtitle: 'Pick any 4 games',
        badge: 'Save 60 EGP',
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

  // Screenshot 2: Kids Area
  'kids-area': {
    name: 'Kids Area',
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

  // Screenshot 4: Fun Park
  'fun-park': {
    name: 'Fun Park',
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

// Initial Orders Data
const INITIAL_ORDERS = [
  { id: 'ORD-1092', customer: 'Ahmed El-Sayed', phone: '01012345678', zone: 'Kids Area', item: 'Single Midweek Pass', qty: 2, total: '200 EGP', date: 'Today, 14:30', status: 'Confirmed' },
  { id: 'ORD-1091', customer: 'Sara Mahmoud', phone: '01287654321', zone: 'Fun Park', item: 'Sisters Midweek Package', qty: 1, total: '150 EGP', date: 'Today, 13:15', status: 'Completed' },
  { id: 'ORD-1090', customer: 'Mohamed Karim', phone: '01198765432', zone: 'Challenge Zone', item: 'Challenge Pass (4 Games)', qty: 3, total: '300 EGP', date: 'Yesterday, 19:40', status: 'Confirmed' },
  { id: 'ORD-1089', customer: 'Nouran Adel', phone: '01555543210', zone: 'Challenge Zone', item: 'Air Hockey (30 min)', qty: 2, total: '100 EGP', date: 'Yesterday, 18:20', status: 'Completed' },
  { id: 'ORD-1088', customer: 'Tamer Hosny', phone: '01066778899', zone: 'Kids Area', item: 'Sisters Weekend', qty: 1, total: '250 EGP', date: '2 days ago', status: 'Pending' }
];

export default function DesktopDashboardPage({ setActiveTab, openModal, lang = 'ar' }) {
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

  // Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_playzone_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  // Modals state
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState('edit'); // 'edit' | 'add'
  const [editingCard, setEditingCard] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { type: 'hero' | 'explore' | 'card', slotIndex?: number }
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // File input ref for upload
  const fileInputRef = useRef(null);

  // Orders filter & search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderZoneFilter, setOrderZoneFilter] = useState('All');

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
      // Trigger canvas confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('✓ All changes saved successfully to ADOS Management Dashboard!');
    } catch (err) {
      showToast('Error saving changes to local storage.');
    }
  };

  // Revert changes
  const handleCancelChanges = () => {
    if (window.confirm('Reset all changes back to saved defaults?')) {
      localStorage.removeItem('ados_dashboard_master_data_v2');
      setZonesData(INITIAL_ZONES_DATA);
      showToast('Changes reset to defaults.');
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
      alert('You must have at least one hero banner image.');
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
    showToast('Hero image removed.');
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
      // Update hero image
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
      showToast('Hero banner updated.');
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
      showToast('Explore photo updated.');
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
    showToast('Photo removed from Explore section.');
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
    showToast(`✓ ${editingCard.title} saved successfully.`);
  };

  // Delete Card
  const handleDeleteCard = () => {
    if (!editingCard) return;
    if (window.confirm(`Are you sure you want to delete "${editingCard.title}"?`)) {
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
      showToast('Item deleted.');
    }
  };

  // Add Mock Order in Orders Modal
  const handleAddMockOrder = () => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: 'VIP Guest',
      phone: '010' + Math.floor(10000000 + Math.random() * 90000000),
      zone: currentZoneData.name,
      item: 'All-Day Pass & VR Tokens',
      qty: 1,
      total: '250 EGP',
      date: 'Just now',
      status: 'Confirmed'
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('ados_playzone_orders', JSON.stringify(updated));
    } catch (e) {}
    showToast(`Order #${newOrder.id} generated.`);
  };

  // Toggle Order Status
  const handleToggleOrderStatus = (orderId) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        const nextStatus = ord.status === 'Confirmed' ? 'Completed' : ord.status === 'Completed' ? 'Pending' : 'Confirmed';
        return { ...ord, status: nextStatus };
      }
      return ord;
    });
    setOrders(updated);
    try {
      localStorage.setItem('ados_playzone_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  // Delete Order
  const handleDeleteOrder = (orderId) => {
    const updated = orders.filter(ord => ord.id !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem('ados_playzone_orders', JSON.stringify(updated));
    } catch (e) {}
    showToast('Order removed.');
  };

  // Filtered orders list
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.customer.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          ord.phone.includes(orderSearch);
    const matchesZone = orderZoneFilter === 'All' || ord.zone.toLowerCase().includes(orderZoneFilter.toLowerCase());
    return matchesSearch && matchesZone;
  });

  return (
    <div className="ados-dashboard-container">
      {/* ------------------------------------------------------------------ */}
      {/* 1. LEFT SIDEBAR                                                   */}
      {/* ------------------------------------------------------------------ */}
      <aside className="ados-sidebar">
        <div className="ados-sidebar-top">
          {/* Logo */}
          <button 
            className="ados-sidebar-logo-btn" 
            title="Return to American Dream Website"
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
            title="Click to view the public website"
          >
            <span>
              <Globe size={15} color="#38bdf8" />
              Web Admin Dashboard
            </span>
            <ChevronRight size={14} color="#94a3b8" />
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="ados-sidebar-footer">
          <div className="ados-sidebar-brand-script">Play, Explore, Together!</div>
          <div className="ados-sidebar-brand-subtitle">ISMAILIA FUN RESORT</div>
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
            <h1 className="ados-topbar-title">ADOS Management Dashboard</h1>
            <div className="ados-topbar-subtitle">More Fun. More Value. More Memories.</div>
          </div>
          <button 
            className="ados-orders-btn"
            onClick={() => setIsOrdersModalOpen(true)}
          >
            PLAY ZONE ORDERS
            <span className="ados-orders-count-badge">{orders.length}</span>
          </button>
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
              Home
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'kids-area' ? 'active' : ''}`}
              onClick={() => setActiveZone('kids-area')}
            >
              <Baby size={15} className="ados-zone-pill-icon" />
              Kids Area
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'fun-park' ? 'active' : ''}`}
              onClick={() => setActiveZone('fun-park')}
            >
              <FerrisWheel size={15} className="ados-zone-pill-icon" />
              Fun Park
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveZone('challenge')}
            >
              <Gamepad2 size={15} className="ados-zone-pill-icon" />
              CHALLENGE ZONE
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'adventure' ? 'active' : ''}`}
              onClick={() => setActiveZone('adventure')}
            >
              <Zap size={15} className="ados-zone-pill-icon" />
              ADVENTURE ZONE
            </button>
            <button 
              className={`ados-zone-pill ${activeZone === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveZone('packages')}
            >
              <Boxes size={15} className="ados-zone-pill-icon" />
              PACKAGES
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
                  <h2 className="ados-hero-title-en">{currentHero?.titleEn}</h2>
                  <div className="ados-hero-subtitle-en">{currentHero?.subtitleEn}</div>
                  <h3 className="ados-hero-title-ar">{currentHero?.titleAr}</h3>
                  <div className="ados-hero-subtitle-ar">{currentHero?.subtitleAr}</div>
                </div>

                {/* Orange Stamp Badge */}
                <div className="ados-hero-stamp-badge">
                  <span>PLAY</span>
                  <span>EXPLORE</span>
                  <span>LEARN</span>
                  <span>TOGETHER!</span>
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
                    Change or Add Image
                  </button>
                  {currentHeroImages.length > 1 && (
                    <button 
                      className="ados-hero-delete-btn"
                      onClick={handleDeleteHeroBanner}
                      title="Delete Current Slide"
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
                  {activeZone === 'challenge' && activeSubTab === 'tickets' ? 'Challenge Zone Area Tickets' : `${currentZoneData.name} Offers`}
                </h2>
                <span className="ados-section-title-pipe">|</span>
                <span className="ados-section-title-ar">
                  {activeZone === 'challenge' && activeSubTab === 'tickets' ? 'عروض منطقة تذاكر' : `عروض ${currentHero?.titleAr || 'المنطقة'}`}
                </span>
              </div>

              <button className="ados-add-btn" onClick={openAddCardModal}>
                <Plus size={14} />
                Add
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
                    Packages ({currentZoneData.packages?.length || 0})
                  </button>
                  <button 
                    className={`ados-subtab-btn ${activeSubTab === 'tickets' ? 'active' : ''}`}
                    onClick={() => handleSubTabChange('tickets')}
                  >
                    <Ticket size={14} />
                    Tickets ({currentZoneData.tickets?.length || 0})
                  </button>
                </div>
              </div>
            )}

            {/* CARDS DISPLAY LOGIC: */}
            {/* 1. Wide Challenge Pass Card (Screenshot 1) */}
            {activeZone === 'challenge' && activeSubTab === 'packages' && currentZoneData.packages?.map(pkg => (
              <div key={pkg.id} className="ados-wide-package-card">
                {/* Media Collage */}
                <div className="ados-wide-media-collage">
                  <img src={pkg.image} alt={pkg.title} className="ados-wide-media-img" />
                  <div className="ados-collage-pill-badge">★ CHOOSE ANY 4 GAMES ★</div>
                </div>

                {/* Info Center */}
                <div className="ados-wide-info-body">
                  <h3 className="ados-wide-title">{pkg.title}</h3>
                  <div className="ados-wide-subtitle">{pkg.subtitle || 'Pick any 4 games'}</div>
                  
                  <div className="ados-wide-features-grid">
                    <div className="ados-wide-feature-item">
                      <Gamepad2 size={16} color="#0284c7" />
                      VR
                    </div>
                    <div className="ados-wide-feature-item">
                      <Zap size={16} color="#0284c7" />
                      Basketball
                    </div>
                    <div className="ados-wide-feature-item">
                      <Sparkles size={16} color="#0284c7" />
                      Shooting
                    </div>
                    <div className="ados-wide-feature-item">
                      <Ticket size={16} color="#0284c7" />
                      Car Racing
                    </div>
                  </div>

                  <div className="ados-wide-price-row">
                    <span className="ados-wide-price-main">EGP {pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="ados-wide-price-original">EGP {pkg.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Right Actions & Badge */}
                <div className="ados-wide-right-actions">
                  <div className="ados-save-badge-pill">{pkg.badge || 'Save 60 EGP'}</div>
                  <button 
                    className="ados-card-edit-btn"
                    onClick={() => openEditCardModal(pkg, false)}
                  >
                    EDIT
                  </button>
                </div>
              </div>
            ))}

            {/* 2. Challenge Zone Tickets (10 Cards Grid - Screenshot 3) */}
            {activeZone === 'challenge' && activeSubTab === 'tickets' && (
              <div className="ados-cards-grid-3">
                {currentZoneData.tickets?.map(tkt => (
                  <div key={tkt.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={tkt.image} alt={tkt.title} className="ados-card-thumb-img" />
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">{tkt.title}</h4>
                        {tkt.titleAr && <span className="ados-card-title-ar">{tkt.titleAr}</span>}
                      </div>

                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">EGP {tkt.price}</span>
                          <span className="ados-card-price-unit">{tkt.unit || '/ ticket'}</span>
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(tkt, true)}
                        >
                          EDIT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Kids Area (4 Cards Grid - Screenshot 2) */}
            {activeZone === 'kids-area' && (
              <div className="ados-cards-grid-4">
                {currentZoneData.packages?.map(card => (
                  <div key={card.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={card.image} alt={card.title} className="ados-card-thumb-img" />
                      {card.badge && (
                        <div className="ados-card-thumb-badge">{card.badge}</div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">{card.title}</h4>
                        <span className="ados-card-title-ar">{card.titleAr}</span>
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{card.ages}</span>
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
                          <span className="ados-card-price-main">EGP {card.price}</span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">EGP {card.originalPrice}</span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          EDIT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Fun Park (6 Cards Grid - Screenshot 4) */}
            {activeZone === 'fun-park' && (
              <div className="ados-cards-grid-3">
                {currentZoneData.packages?.map(card => (
                  <div key={card.id} className="ados-vertical-card">
                    <div className="ados-card-thumb-wrap">
                      <img src={card.image} alt={card.title} className="ados-card-thumb-img" />
                      {card.badge && (
                        <div className="ados-card-thumb-badge">{card.badge}</div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">{card.title}</h4>
                        <span className="ados-card-title-ar">{card.titleAr}</span>
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{card.ages}</span>
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
                          <span className="ados-card-price-main">EGP {card.price}</span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">EGP {card.originalPrice}</span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          EDIT
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
                        <div className="ados-card-thumb-badge">{card.badge}</div>
                      )}
                    </div>
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">{card.title}</h4>
                        {card.titleAr && <span className="ados-card-title-ar">{card.titleAr}</span>}
                      </div>

                      <div className="ados-card-details-list">
                        {card.ages && (
                          <div className="ados-card-detail-item">
                            <User size={13} />
                            <span>{card.ages}</span>
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
                          <span className="ados-card-price-main">EGP {card.price}</span>
                          {card.originalPrice && (
                            <span className="ados-card-price-original">EGP {card.originalPrice}</span>
                          )}
                        </div>
                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditCardModal(card, false)}
                        >
                          EDIT
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
            <h3 className="ados-explore-title">Explore {currentZoneData.name}</h3>
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
                      Change Image
                    </button>
                    <button 
                      className="ados-explore-trash-btn"
                      onClick={() => handleDeleteExplore(idx)}
                      title="Remove Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Photo Slot #2 */}
              <div 
                className="ados-explore-add-slot"
                onClick={() => openImagePicker({ type: 'explore' })}
              >
                <div className="ados-explore-add-icon-circle">
                  <Plus size={18} />
                </div>
                <div className="ados-explore-add-text">+ Add Photo</div>
                <div className="ados-explore-add-subtext">Slot #{(currentZoneData.explore?.length || 0) + 1}</div>
              </div>
            </div>
          </section>

          {/* Explore 360° Section */}
          <section className="ados-360-container">
            <div className="ados-360-card">
              <div className="ados-360-title">
                <Eye size={18} className="ados-360-title-icon" />
                EXPLORE 360°
              </div>
              <button 
                className="ados-360-action-btn"
                onClick={() => setIs360ModalOpen(true)}
              >
                <RotateCcw size={13} />
                Change or Add 360 EXPLORER
              </button>
            </div>
          </section>

          {/* Bottom Save & Cancel Bar */}
          <div className="ados-bottom-bar">
            <button className="ados-cancel-btn" onClick={handleCancelChanges}>
              Cancel
            </button>
            <button className="ados-save-btn" onClick={handleSaveChanges}>
              <Check size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MODAL: EDIT / ADD CARD                                          */}
      {/* ------------------------------------------------------------------ */}
      {isCardModalOpen && editingCard && (
        <div className="ados-modal-backdrop" onClick={() => setIsCardModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()}>
            <div className="ados-modal-header">
              <h3>{cardModalMode === 'edit' ? `Edit Item: ${editingCard.title}` : 'Add New Offer / Ticket'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIsCardModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>Title (English)</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingCard.title || ''} 
                    onChange={e => setEditingCard({ ...editingCard, title: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>Title (Arabic)</label>
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
                  <label>Price (EGP)</label>
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
                        badge: diff > 0 ? `SAVE ${diff} EGP` : ''
                      });
                    }}
                  />
                </div>
                <div className="ados-form-group">
                  <label>Original Price (EGP - for discount)</label>
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
                        badge: diff > 0 ? `SAVE ${diff} EGP` : ''
                      });
                    }}
                  />
                </div>
              </div>

              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>Discount Badge Text</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingCard.badge || ''} 
                    onChange={e => setEditingCard({ ...editingCard, badge: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>Age Range / Duration</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    placeholder="e.g. Ages 1 - 3 or / 30 min"
                    value={editingCard.ages || editingCard.unit || ''} 
                    onChange={e => setEditingCard({ ...editingCard, ages: e.target.value, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="ados-form-group">
                <label>Card Image</label>
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
                    Select Photo from Gallery...
                  </button>
                </div>
              </div>

              <div className="ados-form-group">
                <label>Features / Inclusions (Comma separated)</label>
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
                  <Trash2 size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Delete Item
                </button>
              ) : <div></div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsCardModalOpen(false)}>
                  Cancel
                </button>
                <button className="ados-btn-primary" onClick={handleSaveCard}>
                  <Check size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Save Item
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
          <div className="ados-modal-window ados-modal-window-wide" onClick={e => e.stopPropagation()}>
            <div className="ados-modal-header">
              <h3>Choose Photo Asset or Upload</h3>
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
                  <div style={{ fontWeight: 700, color: '#002830', fontSize: 14 }}>Upload a new photo from your PC</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>PNG, JPG or WEBP formats supported</div>
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
                  Browse File
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
                  Or select from project media library:
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. MODAL: PLAY ZONE ORDERS                                         */}
      {/* ------------------------------------------------------------------ */}
      {isOrdersModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIsOrdersModalOpen(false)}>
          <div className="ados-modal-window ados-modal-window-wide" onClick={e => e.stopPropagation()}>
            <div className="ados-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ticket size={20} color="#00a8cc" />
                <h3>Play Zone Live Bookings & Orders</h3>
              </div>
              <button className="ados-modal-close-btn" onClick={() => setIsOrdersModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              {/* Filter & Search Bar */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                  <Search size={15} style={{ position: 'absolute', left: 10, top: 12, color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="Search by customer, phone, or order #..."
                    className="ados-form-input"
                    style={{ paddingLeft: 32 }}
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="ados-form-select" 
                  style={{ width: 170 }}
                  value={orderZoneFilter}
                  onChange={e => setOrderZoneFilter(e.target.value)}
                >
                  <option value="All">All Zones</option>
                  <option value="Kids Area">Kids Area</option>
                  <option value="Fun Park">Fun Park</option>
                  <option value="Challenge Zone">Challenge Zone</option>
                  <option value="Adventure Zone">Adventure Zone</option>
                </select>

                <button 
                  className="ados-btn-primary" 
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={handleAddMockOrder}
                >
                  <Plus size={14} />
                  Add Mock Order
                </button>
              </div>

              {/* Orders Table */}
              <div className="ados-orders-table-wrap">
                <table className="ados-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Zone</th>
                      <th>Package / Item</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          No orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(ord => (
                        <tr key={ord.id}>
                          <td style={{ fontWeight: 700, color: '#002830' }}>{ord.id}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{ord.customer}</div>
                            <div style={{ color: '#64748b', fontSize: 11 }}>{ord.phone}</div>
                          </td>
                          <td>{ord.zone}</td>
                          <td>
                            {ord.item}
                            <span style={{ color: '#64748b', fontSize: 11, marginLeft: 4 }}>x{ord.qty}</span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#002830' }}>{ord.total}</td>
                          <td style={{ color: '#64748b' }}>{ord.date}</td>
                          <td>
                            <span 
                              className={`ados-status-pill ${
                                ord.status === 'Confirmed' ? 'ados-status-confirmed' :
                                ord.status === 'Completed' ? 'ados-status-completed' :
                                'ados-status-pending'
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleToggleOrderStatus(ord.id)}
                              title="Click to toggle status"
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleDeleteOrder(ord.id)}
                              title="Delete Order"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div style={{ color: '#64748b', fontSize: 12 }}>
                Showing {filteredOrders.length} orders
              </div>
              <button className="ados-btn-secondary" onClick={() => setIsOrdersModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. MODAL: 360 EXPLORER CONFIGURATION                               */}
      {/* ------------------------------------------------------------------ */}
      {is360ModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIs360ModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()}>
            <div className="ados-modal-header">
              <h3>Configure 360° Virtual Experience</h3>
              <button className="ados-modal-close-btn" onClick={() => setIs360ModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-group">
                <label>360 Experience Title</label>
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
                <label>Virtual Tour / Matterport Embed URL</label>
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
                  Interactive 360° Panorama Active
                </div>
                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                  Visitors on the public site will be able to navigate full 360-degree interactive views of this zone.
                </div>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <button 
                className="ados-btn-primary" 
                onClick={() => {
                  setIs360ModalOpen(false);
                  showToast('360° Explorer settings saved.');
                }}
              >
                Apply 360° Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. TOAST NOTIFICATION                                             */}
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
