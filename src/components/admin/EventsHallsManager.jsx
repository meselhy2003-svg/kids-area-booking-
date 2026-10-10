import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Edit3, 
  PartyPopper, 
  Building2, 
  Sparkles, 
  Flame, 
  Boxes, 
  Search, 
  Eye, 
  Upload, 
  LogOut,
  Users,
  Calendar,
  Star,
  Award,
  Music,
  HeartHandshake,
  Layers
} from 'lucide-react';
import './EventsHallsManager.css';

// Project Media Library Assets matching Image 2 exactly + Event assets
const ALL_PROJECT_ASSETS = [
  // 12 Assets directly visible in reference mockup
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

  // Event Halls, Parties & Celebrations Assets
  { name: 'Luxury Event Dining Hall Architecture', path: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png' },
  { name: 'Kids Birthday Celebration Setup', path: '/photo/vibe_1_birthday.png' },
  { name: 'Floral Wedding & Engagement Decor', path: '/photo/vibe_2_floral_hd.png' },
  { name: 'Waterfront Sunset Cocktail Bar', path: '/photo/vibe_3_cocktail.png' },
  { name: 'Artisanal Catering & Chef Display', path: '/photo/vibe_4_chef.png' },
  { name: 'Canal-side Sunset Terrace Gathering', path: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png' },
  { name: 'Sunset Lakeside Evening Gathering', path: '/photo/vibe_5_sunset.png' },
  { name: 'Celebration Light & Music Party', path: '/photo/vibe_6_party.png' },
  { name: 'Event Hall Presentation 1', path: '/photo/kid area pic/Image (1).png' },
  { name: 'Event Hall Presentation 2', path: '/photo/kid area pic/Image (2).png' },
  { name: 'Event Hall Presentation 3', path: '/photo/kid area pic/Image (3).png' },
  { name: 'Event Backdrop Collage', path: '/photo/kid area pic/Cinematic Full-Width Backdrop.png' },

  // Kids & Play Assets
  { name: 'Kids Ball Pit Slides', path: '/photo/kid area pic/Kids sliding into colorful ball pit.png' },
  { name: 'Toddler Laughing in Ball Pit', path: '/photo/kid area pic/Little boy laughing in ball pit2.png' },
  { name: 'Family Bumper Cars', path: '/photo/kid area pic/Family bumper car arena.png' },
  { name: 'Illuminated Carousel', path: '/photo/kid area pic/Classic illuminated carousel ride.png' },
  { name: 'Junior GP Speedway', path: '/photo/kid area pic/Junior GP Speedway.png' }
];

// Initial Master Data for Events & Halls Dashboard
const INITIAL_EVENTS_DATA = {
  hero: {
    titleEn: 'EVENTS & HALLS',
    subtitleEn: 'Your event. Your space. Your moment. Grand ballroom & lakeside celebrations.',
    titleAr: 'الحفلات والقاعات',
    subtitleAr: 'مناسبتك. مساحتك الخاصة. لحظات تدوم على ضفاف بحيرة التمساح وقناة السويس.',
    images: [
      '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      '/photo/vibe_1_birthday.png',
      '/photo/vibe_2_floral_hd.png',
      '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      '/photo/vibe_5_sunset.png'
    ],
    activeSlideIndex: 0
  },
  categories: [
    { key: 'all', labelEn: 'All Events & Halls', labelAr: 'كل القاعات والمناسبات', icon: 'all' },
    { key: 'birthday', labelEn: 'Birthday Parties', labelAr: 'أعياد الميلاد', icon: 'party' },
    { key: 'family', labelEn: 'Family Gatherings', labelAr: 'اللقاءات العائلية', icon: 'users' },
    { key: 'halls', labelEn: 'Grand Halls & Ballrooms', labelAr: 'القاعات الكبرى', icon: 'building' },
    { key: 'vip', labelEn: 'VIP & Weddings', labelAr: 'حفلات VIP والزفاف', icon: 'sparkles' },
    { key: 'addons', labelEn: 'Entertainment & Decor', labelAr: 'الديكور والترفيه', icon: 'music' }
  ],
  featuredPackages: [
    {
      id: 'ev-feat-1',
      title: 'Grand Waterfront Ballroom & Banqueting',
      titleAr: 'قاعة أمريكان دريم الكبرى مع البوفيه الفاخر',
      subtitle: 'Up to 450 guests • Full audiovisual stage, lighting & private concierge',
      subtitleAr: 'تتسع حتى ٤٥٠ ضيفاً • مسرح متكامل بأنظمة صوت وضوء وبوفيه ملكي',
      badge: 'PREMIER HALL',
      badgeAr: 'القاعة الملكية',
      price: 6500,
      originalPrice: 8000,
      category: 'halls',
      capacity: 'Up to 450 Guests',
      capacityAr: 'حتى ٤٥٠ ضيفاً',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      features: [
        'Full Grand Ballroom Exclusive Access',
        'Concert-grade Sound & Moving Head Lighting',
        'Giant 4K LED Screen + Live Streaming',
        'VIP Welcome Lounge & Red Carpet Entry',
        'Dedicated Event Coordinator & Service Team'
      ]
    },
    {
      id: 'ev-feat-2',
      title: 'Royal Birthday Fantasy Celebration',
      titleAr: 'باقة عيد ميلاد الأحلام الملكية للأطفال',
      subtitle: 'Up to 35 kids + parents • Play Zone passes, cake & show team',
      subtitleAr: 'حتى ٣٥ طفلاً + أولياء الأمور • ألعاب مفتوحة، مراسم كيك وفريق استعراضي',
      badge: 'TOP POPULAR',
      badgeAr: 'الأكثر طلباً',
      price: 2500,
      originalPrice: 3200,
      category: 'birthday',
      capacity: 'Up to 35 Kids + Parents',
      capacityAr: 'حتى ٣٥ طفلاً + أولياء الأمور',
      image: '/photo/vibe_1_birthday.png',
      features: [
        'Custom Themed Balloon & Stage Decor',
        'Unlimited Play Zone Passes for all Kids',
        'Dedicated Mascot & Party Animators',
        'Tiered Birthday Cake Ceremony + Buffet Meals',
        'Professional Photographer & Video Clip'
      ]
    }
  ],
  packages: [
    {
      id: 'ev-pkg-1',
      category: 'birthday',
      title: 'Unforgettable Kids Birthday Pass',
      titleAr: 'حفلة عيد ميلاد الأطفال المميزة',
      subtitle: 'Themed decor, energetic Play Zone access & cake ceremony',
      subtitleAr: 'ديكورات مبهجة، تذاكر منطقة الألعاب ومراسم التورتة مع الشخصيات الكرتونية',
      price: 2500,
      originalPrice: 3000,
      badge: 'Ages 1 - 12',
      badgeAr: 'الأعمار ١ - ١٢',
      capacity: 'Up to 30 Kids',
      capacityAr: 'حتى ٣٠ طفلاً',
      image: '/photo/kid area pic/Image (1).png'
    },
    {
      id: 'ev-pkg-2',
      category: 'family',
      title: 'Private Seaside Family Gathering',
      titleAr: 'لقاء عائلي خاص على ضفاف القناة',
      subtitle: 'Private terrace lounge, Mediterranean feast & open-air lake view',
      subtitleAr: 'جلسة خاصة مطلة على بحيرة التمساح، مأكولات مشوية ومشروبات ساخنة وباردة',
      price: 3800,
      originalPrice: 4500,
      badge: 'Multi-Gen Family',
      badgeAr: 'مناسب لجميع أفراد العائلة',
      capacity: 'Up to 50 Family Members',
      capacityAr: 'حتى ٥٠ فرداً',
      image: '/photo/kid area pic/Image (2).png'
    },
    {
      id: 'ev-pkg-3',
      category: 'halls',
      title: 'Grand Gala & Graduation Hall',
      titleAr: 'قاعة الحفلات الكبرى والتخرج والخطوبة',
      subtitle: 'Versatile ballroom with stage, HD sound and banquet seating',
      subtitleAr: 'قاعة فندقية مجهزة بمسرح وشاشات عرض عملاقة وأنظمة إضاءة احترافية',
      price: 6500,
      originalPrice: 7800,
      badge: 'Up to 450 Guests',
      badgeAr: 'سعة ٤٥٠ فرداً',
      capacity: 'Up to 450 Guests',
      capacityAr: 'حتى ٤٥٠ ضيفاً',
      image: '/photo/kid area pic/Image (3).png'
    },
    {
      id: 'ev-pkg-4',
      category: 'vip',
      title: 'Sunset Floral Engagement & Reception',
      titleAr: 'حفل خطوبة واستقبال بالورود عند الغروب',
      subtitle: 'Romantic flower arch, string lighting, DJ setup & welcome mocktails',
      subtitleAr: 'كوشة وتنسيق زهور فاخر، إضاءة خافتة، دي جي احترافي ومشروبات استقبال',
      price: 5200,
      originalPrice: 6400,
      badge: 'Romantic Lake View',
      badgeAr: 'إطلالة بحرية ساحرة',
      capacity: 'Up to 150 Guests',
      capacityAr: 'حتى ١٥٠ ضيفاً',
      image: '/photo/vibe_2_floral_hd.png'
    },
    {
      id: 'ev-pkg-5',
      category: 'addons',
      title: 'Live DJ, Moving Lights & Sound Stage',
      titleAr: 'مسرح الصوت والإضاءة مع دي جي احترافي',
      subtitle: 'High-power speakers, subwoofers, laser effects & haze machine',
      subtitleAr: 'سماعات احترافية عملاقة، أجهزة ليزر، دخان وإضاءة متحركة مع دي جي',
      price: 1800,
      originalPrice: 2400,
      badge: 'Sound & Stage',
      badgeAr: 'صوت وإضاءة',
      capacity: 'All Hall Sizes',
      capacityAr: 'يناسب كل القاعات',
      image: '/photo/vibe_6_party.png'
    },
    {
      id: 'ev-pkg-6',
      category: 'addons',
      title: 'Artisanal Gourmet Open Buffet Display',
      titleAr: 'بوفيه طعام مفتوح ومشاوي على الفحم',
      subtitle: 'Chef-carved meats, international salads, warm appetizers & dessert bar',
      subtitleAr: 'أطباق لحوم ودجاج مشوي، مقبلات ساخنة وباردة، وركن الحلويات الشرقية والغربية',
      price: 4200,
      originalPrice: 5000,
      badge: 'Chef Masterpiece',
      badgeAr: 'إشراف كبار الطهاة',
      capacity: 'Per 50 Persons',
      capacityAr: 'لكل ٥٠ فرداً',
      image: '/photo/vibe_4_chef.png'
    }
  ],
  explore: [
    {
      id: 'exp-ev-1',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      caption: 'Luxury Grand Ballroom Setup'
    },
    {
      id: 'exp-ev-2',
      image: '/photo/vibe_1_birthday.png',
      caption: 'Kids Birthday Party Atmosphere'
    },
    {
      id: 'exp-ev-3',
      image: '/photo/vibe_2_floral_hd.png',
      caption: 'Floral Engagement & Wedding Decor'
    },
    {
      id: 'exp-ev-4',
      image: '/photo/vibe_3_cocktail.png',
      caption: 'Sunset Reception Mocktail Lounge'
    },
    {
      id: 'exp-ev-5',
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      caption: 'Canal-side Outdoor Terrace'
    },
    {
      id: 'exp-ev-6',
      image: '/photo/vibe_6_party.png',
      caption: 'Stage Lighting & Concert Sound'
    }
  ],
  explorer360: {
    title: 'Grand Ballroom & Event Halls 360° Virtual Tour',
    titleAr: 'جولة افتراضية 360° للقاعة الكبرى وصالات المناسبات',
    url: 'https://my.matterport.com/show/?m=american-dream-events-hall',
    enabled: true
  }
};

export default function EventsHallsManager({
  lang = 'ar',
  setLang,
  onLogout,
  onOpenOrders
}) {
  const isAr = lang === 'ar';

  // Master State with LocalStorage Persistence
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_events_halls_data_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed reading saved events halls data:', e);
    }
    return INITIAL_EVENTS_DATA;
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('packages'); // 'packages' | 'featured'

  // Hero carousel state
  const heroImages = data.hero?.images?.length ? data.hero.images : INITIAL_EVENTS_DATA.hero.images;
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

  // File ref for PC upload
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

  // Delete Hero Slide
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
          id: `exp-ev-${Date.now()}`,
          image: imagePath,
          caption: 'Event Hall Feature'
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
  const openEditItemModal = (item, isFeatured = false) => {
    setItemModalMode('edit');
    setEditingItem({
      ...item,
      isFeatured: isFeatured || activeSubTab === 'featured'
    });
    setIsItemModalOpen(true);
  };

  // Open Add Item Modal
  const openAddItemModal = () => {
    setItemModalMode('add');
    const isFeatured = activeSubTab === 'featured';
    const categoryDefault = activeCategory === 'all' ? 'birthday' : activeCategory;

    setEditingItem({
      id: `ev-${isFeatured ? 'feat' : 'pkg'}-${Date.now()}`,
      category: categoryDefault,
      title: isFeatured ? 'New Grand Event Package' : 'New Event Package',
      titleAr: isFeatured ? 'باقة مناسبات كبرى جديدة' : 'باقة حفلات جديدة',
      subtitle: isFeatured ? 'Full ballroom access + catering + sound stage' : 'Custom decor, play access & dedicated team',
      subtitleAr: isFeatured ? 'حجز القاعة بالكامل + بوفيه فاخر + مسرح صوت وإضاءة' : 'ديكور مميز، دخول مناطق الألعاب وفريق ترفيهي',
      price: isFeatured ? 4500 : 2200,
      originalPrice: isFeatured ? 5500 : 2800,
      badge: isFeatured ? 'EXCLUSIVE OFFER' : 'Special Package',
      badgeAr: isFeatured ? 'عرض حصري' : 'باقة مميزة',
      capacity: 'Up to 50 Guests',
      capacityAr: 'حتى ٥٠ ضيفاً',
      image: ALL_PROJECT_ASSETS[12]?.path || ALL_PROJECT_ASSETS[0]?.path,
      features: isFeatured ? ['Ballroom Exclusive Access', 'Audiovisual Systems', 'Open Buffet', 'Dedicated Host'] : [],
      isFeatured
    });
    setIsItemModalOpen(true);
  };

  // Save Item (Edit or Add)
  const handleSaveItem = () => {
    if (!editingItem) return;

    const isFeatured = editingItem.isFeatured || activeSubTab === 'featured';
    const targetKey = isFeatured ? 'featuredPackages' : 'packages';
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
      const isFeatured = editingItem.isFeatured || activeSubTab === 'featured';
      const targetKey = isFeatured ? 'featuredPackages' : 'packages';
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
      localStorage.setItem('ados_events_halls_data_v2', JSON.stringify(data));
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast(isAr ? '✓ تم حفظ جميع تعديلات الحفلات والقاعات بنجاح!' : '✓ Event & Halls changes saved successfully!');
    } catch (err) {
      showToast(isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes to local storage.');
    }
  };

  // Reset Changes to Defaults
  const handleCancelChanges = () => {
    const confirmPrompt = isAr 
      ? 'هل أنت متأكد من استعادة بيانات الحفلات والقاعات الافتراضية وإلغاء جميع التعديلات؟' 
      : 'Reset event and halls data back to default settings?';
    if (window.confirm(confirmPrompt)) {
      localStorage.removeItem('ados_events_halls_data_v2');
      setData(INITIAL_EVENTS_DATA);
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية.' : 'Event data reset to defaults.');
    }
  };

  // Filter packages by category & search query
  const filteredPackages = (data.packages || []).filter(pkg => {
    const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch = 
      (pkg.title && pkg.title.toLowerCase().includes(q)) ||
      (pkg.titleAr && pkg.titleAr.toLowerCase().includes(q)) ||
      (pkg.subtitle && pkg.subtitle.toLowerCase().includes(q)) ||
      (pkg.subtitleAr && pkg.subtitleAr.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const filteredFeatured = (data.featuredPackages || []).filter(feat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (feat.title && feat.title.toLowerCase().includes(q)) ||
      (feat.titleAr && feat.titleAr.toLowerCase().includes(q)) ||
      (feat.subtitle && feat.subtitle.toLowerCase().includes(q)) ||
      (feat.subtitleAr && feat.subtitleAr.toLowerCase().includes(q))
    );
  });

  // Helper for category icons
  const renderCategoryIcon = (icon) => {
    switch (icon) {
      case 'party': return <PartyPopper size={15} className="ados-zone-pill-icon" />;
      case 'users': return <Users size={15} className="ados-zone-pill-icon" />;
      case 'building': return <Building2 size={15} className="ados-zone-pill-icon" />;
      case 'sparkles': return <Sparkles size={15} className="ados-zone-pill-icon" />;
      case 'music': return <Music size={15} className="ados-zone-pill-icon" />;
      default: return <PartyPopper size={15} className="ados-zone-pill-icon" />;
    }
  };

  return (
    <div className={`events-editor-wrapper ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOPBAR                                                          */}
      {/* ------------------------------------------------------------------ */}
      <header className="ados-topbar">
        {/* Balanced spacer on left */}
        <div style={{ width: 140 }}></div>

        {/* Center Title Group */}
        <div className="ados-topbar-title-group">
          <h1 className="ados-topbar-title">
            {isAr ? 'لوحة تحكم إدارة الحفلات والقاعات' : 'Event & Halls Management'}
          </h1>
          <div className="ados-topbar-subtitle">
            {isAr ? 'مناسبتك • مساحتك الخاصة • لحظات تدوم' : 'Your Event • Your Space • Unforgettable Moments'}
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
          <nav className="ados-zone-nav events-category-nav">
            {data.categories?.map(cat => (
              <button 
                key={cat.key}
                className={`ados-zone-pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.key);
                }}
              >
                {renderCategoryIcon(cat.icon)}
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </nav>

          {/* HERO BANNER SECTION (Exact match to Play Zone hero card) */}
          <section 
            className="ados-hero-card events-hero-card"
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
                      className="events-hero-edit-texts-btn"
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
                <div className="ados-hero-stamp-badge events-stamp-badge">
                  {isAr ? (
                    <>
                      <span>أناقة</span>
                      <span>فخامة</span>
                      <span>إطلالة</span>
                      <span>البحيرة!</span>
                    </>
                  ) : (
                    <>
                      <span>ELEGANT</span>
                      <span>PREMIER</span>
                      <span>WATERFRONT</span>
                      <span>EVENTS!</span>
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

          {/* OFFERS & PACKAGES SECTION HEADER */}
          <section className="ados-offers-section">
            <div className="ados-section-header">
              <div className="ados-section-title-wrap">
                <h2 className="ados-section-title">
                  {isAr 
                    ? (activeSubTab === 'featured' ? 'العروض الملكية الكبرى للقاعات' : 'باقات الحفلات وتجهيز القاعات') 
                    : (activeSubTab === 'featured' ? 'Featured Grand Ballroom Offers' : 'Event Packages & Hall Bookings')}
                </h2>
                <span className="ados-section-title-pipe">|</span>
                <span className="ados-section-title-ar">
                  {isAr ? 'إدارة وتحرير الباقات والأسعار' : 'Event Packages & Inclusions'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Search Bar */}
                <div className="events-search-input-wrap">
                  <Search size={14} className="events-search-icon" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في الباقات...' : 'Search packages...'}
                    className="events-search-input"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      className="events-search-clear"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Add Item Button */}
                <button className="ados-add-btn" onClick={openAddItemModal}>
                  <Plus size={14} />
                  <span>{isAr ? (activeSubTab === 'featured' ? 'إضافة باقة كبرى' : 'إضافة باقة') : 'Add Package'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation (Packages vs Featured) */}
            <div className="ados-subtab-container">
              <div className="ados-subtab-group">
                <button 
                  className={`ados-subtab-btn ${activeSubTab === 'packages' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('packages')}
                >
                  <PartyPopper size={14} />
                  <span>{isAr ? `الباقات والقاعات (${data.packages?.length || 0})` : `Packages & Halls (${data.packages?.length || 0})`}</span>
                </button>
                <button 
                  className={`ados-subtab-btn ${activeSubTab === 'featured' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('featured')}
                >
                  <Building2 size={14} />
                  <span>{isAr ? `العروض الكبرى المميزة (${data.featuredPackages?.length || 0})` : `Featured Ballrooms (${data.featuredPackages?.length || 0})`}</span>
                </button>
              </div>
            </div>

            {/* CARDS DISPLAY LOGIC */}
            {/* 1. FEATURED BALLROOMS: Wide Horizontal Cards matching Challenge Pass */}
            {activeSubTab === 'featured' && (
              <div className="events-combos-container">
                {filteredFeatured.map(feat => (
                  <div key={feat.id} className="ados-wide-package-card events-wide-card">
                    {/* Media Collage */}
                    <div className="ados-wide-media-collage">
                      <img src={feat.image} alt={feat.title} className="ados-wide-media-img" />
                      <div className="ados-collage-pill-badge">
                        {isAr ? '★ الباقة الملكية المتكاملة ★' : '★ PREMIER WATERFRONT SUITE ★'}
                      </div>
                    </div>

                    {/* Info Center */}
                    <div className="ados-wide-info-body">
                      <h3 className="ados-wide-title">{isAr ? (feat.titleAr || feat.title) : feat.title}</h3>
                      <div className="ados-wide-subtitle">
                        {isAr ? (feat.subtitleAr || feat.subtitle) : (feat.subtitle || 'Premier event package')}
                      </div>

                      <div className="ados-wide-features-grid">
                        {feat.features?.map((fItem, fIdx) => (
                          <div key={fIdx} className="ados-wide-feature-item">
                            <Sparkles size={15} color="#0284c7" />
                            <span>{fItem}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ados-wide-price-row">
                        <span className="ados-wide-price-main">
                          {feat.price?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                        {feat.originalPrice && (
                          <span className="ados-wide-price-original">
                            {feat.originalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        )}
                        {feat.capacity && (
                          <span style={{ fontSize: 12, color: '#64748b', marginInlineStart: 10, fontWeight: 600 }}>
                            <Users size={13} style={{ verticalAlign: 'middle', marginInlineEnd: 4 }} />
                            {isAr ? (feat.capacityAr || feat.capacity) : feat.capacity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Actions & Badge */}
                    <div className="ados-wide-right-actions">
                      <div className="ados-save-badge-pill">
                        {isAr ? (feat.badgeAr || feat.badge || 'عرض مميز') : (feat.badge || 'Premier Offer')}
                      </div>
                      <button 
                        className="ados-card-edit-btn"
                        onClick={() => openEditItemModal(feat, true)}
                      >
                        {isAr ? 'تعديل' : 'EDIT'}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredFeatured.length === 0 && (
                  <div className="events-empty-state">
                    <p>{isAr ? 'لا توجد عروض مميزة مطابقة للبحث.' : 'No featured ballroom packages found.'}</p>
                    <button className="ados-add-btn" onClick={openAddItemModal}>
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة باقة مميزة جديدة' : 'Add New Featured Package'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. REGULAR PACKAGES & HALLS: Vertical Cards matching Tickets & Packages */}
            {activeSubTab === 'packages' && (
              <div className="ados-cards-grid-3 events-cards-grid">
                {filteredPackages.map(pkg => (
                  <div key={pkg.id} className="ados-vertical-card events-item-card">
                    {/* Thumbnail with badge */}
                    <div className="ados-card-thumb-wrap">
                      <img src={pkg.image} alt={pkg.title} className="ados-card-thumb-img" />
                      {pkg.badge && (
                        <div className="ados-card-thumb-badge">
                          {isAr ? (pkg.badgeAr || pkg.badge) : pkg.badge}
                        </div>
                      )}
                      <button 
                        type="button" 
                        className="events-card-change-img-overlay"
                        onClick={() => {
                          setEditingItem(pkg);
                          openImagePicker({ type: 'item' });
                        }}
                        title={isAr ? 'تغيير صورة الباقة' : 'Change Package Image'}
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="ados-card-content">
                      <div className="ados-card-titles-wrap">
                        <h4 className="ados-card-title-en">
                          {isAr ? (pkg.titleAr || pkg.title) : pkg.title}
                        </h4>
                        {!isAr && pkg.titleAr && (
                          <span className="ados-card-title-ar">{pkg.titleAr}</span>
                        )}
                      </div>

                      {/* Subtitle / Description */}
                      <p className="events-item-desc">
                        {isAr ? (pkg.subtitleAr || pkg.subtitle) : (pkg.subtitle || '')}
                      </p>

                      {/* Capacity Pill */}
                      {pkg.capacity && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0284c7', fontWeight: 600, marginBottom: 12 }}>
                          <Users size={13} />
                          <span>{isAr ? (pkg.capacityAr || pkg.capacity) : pkg.capacity}</span>
                        </div>
                      )}

                      {/* Footer: Price & Edit Button */}
                      <div className="ados-card-footer">
                        <div className="ados-card-price-row">
                          <span className="ados-card-price-main">
                            {pkg.price?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                          {pkg.originalPrice && (
                            <span className="ados-card-price-original">
                              {pkg.originalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                        </div>

                        <button 
                          className="ados-card-full-edit-btn"
                          onClick={() => openEditItemModal(pkg, false)}
                        >
                          {isAr ? 'تعديل' : 'EDIT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPackages.length === 0 && (
                  <div className="events-empty-state-full">
                    <p>{isAr ? 'لا توجد باقات مطابقة للتصنيف أو البحث الحالي.' : 'No packages match current category or search query.'}</p>
                    <button className="ados-add-btn" onClick={openAddItemModal}>
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة باقة جديدة' : 'Add New Package'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* EXPLORE EVENT ATMOSPHERE & HALLS SECTION */}
          <section className="ados-explore-section">
            <h3 className="ados-explore-title">
              {isAr 
                ? 'استكشف صالات وتجهيزات الحفلات بأمريكان دريم' 
                : 'Explore American Dream Event Halls & Atmosphere'}
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
                <span>{isAr ? 'جولة تفاعلية 360° للقاعات والصالات' : 'EVENT HALLS 360° VIRTUAL TOUR'}</span>
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
      {/* 3. MODAL: EDIT / ADD PACKAGE OR HALL                               */}
      {/* ------------------------------------------------------------------ */}
      {isItemModalOpen && editingItem && (
        <div className="ados-modal-backdrop" onClick={() => setIsItemModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>
                {itemModalMode === 'edit' 
                  ? (isAr ? `تعديل: ${editingItem.titleAr || editingItem.title}` : `Edit Package: ${editingItem.title}`) 
                  : (isAr ? 'إضافة باقة / قاعة جديدة' : 'Add New Event Package / Hall')}
              </h3>
              <button className="ados-modal-close-btn" onClick={() => setIsItemModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              {/* Image Preview & Change Photo */}
              <div className="ados-form-group">
                <label>{isAr ? 'صورة الباقة أو القاعة' : 'Package / Hall Photo'}</label>
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
                  <label>{isAr ? 'اسم الباقة أو القاعة (بالإنجليزية)' : 'Package Title (English)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.title || ''} 
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'اسم الباقة أو القاعة (بالعربية)' : 'Package Title (Arabic)'}</label>
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
                    value={editingItem.category || 'birthday'} 
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="ados-form-select"
                  >
                    <option value="birthday">{isAr ? 'حفلات أعياد الميلاد' : 'Birthday Parties'}</option>
                    <option value="family">{isAr ? 'اللقاءات العائلية' : 'Family Gatherings'}</option>
                    <option value="halls">{isAr ? 'القاعات الكبرى والبانكيت' : 'Grand Halls & Ballrooms'}</option>
                    <option value="vip">{isAr ? 'حفلات VIP والزفاف' : 'VIP & Weddings'}</option>
                    <option value="addons">{isAr ? 'خدمات الترفيه والديكور' : 'Entertainment & Decor'}</option>
                  </select>
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'شارة التميز (Badge)' : 'Badge Label'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.badge || ''} 
                    placeholder="e.g. Up to 450 Guests / Ages 1-99"
                    onChange={e => setEditingItem({ ...editingItem, badge: e.target.value, badgeAr: e.target.value })}
                  />
                </div>
              </div>

              {/* Capacity / Guests count */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'السعة أو عدد الأفراد (EN)' : 'Capacity / Guests (EN)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    placeholder="e.g. Up to 50 Guests"
                    value={editingItem.capacity || ''} 
                    onChange={e => setEditingItem({ ...editingItem, capacity: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'السعة أو عدد الأفراد (AR)' : 'Capacity / Guests (AR)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    placeholder="مثال: حتى ٥٠ فرداً"
                    value={editingItem.capacityAr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, capacityAr: e.target.value })}
                    dir="rtl"
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
                  <label>{isAr ? 'السعر الأصلي / قبل الخصم (ج.م)' : 'Original Price (EGP - for discount)'}</label>
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
                  <label>{isAr ? 'الوصف / المميزات (بالإنجليزية)' : 'Description / Inclusions (EN)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={3}
                    value={editingItem.subtitle || ''} 
                    onChange={e => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف / المميزات (بالعربية)' : 'Description / Inclusions (AR)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={3}
                    value={editingItem.subtitleAr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, subtitleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Inclusions features list (if featured or custom) */}
              {(editingItem.isFeatured || activeSubTab === 'featured' || Array.isArray(editingItem.features)) && (
                <div className="ados-form-group">
                  <label>{isAr ? 'المميزات المضمنة في الباقة (مفصولة بفاصلة)' : 'Included Features & Services (comma-separated)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingItem.features?.join(', ') || ''} 
                    onChange={e => setEditingItem({ 
                      ...editingItem, 
                      features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g. Grand Ballroom Access, Sound & Light Stage, Open Buffet, Photographer"
                  />
                </div>
              )}
            </div>

            <div className="ados-modal-footer">
              {itemModalMode === 'edit' ? (
                <button className="ados-btn-danger" onClick={handleDeleteItem}>
                  <Trash2 size={13} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حذف الباقة' : 'Delete'}</span>
                </button>
              ) : <div></div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsItemModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="ados-btn-primary" onClick={handleSaveItem}>
                  <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حفظ الباقة' : 'Save'}</span>
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
                justifyContent: 'space-between',
                marginBottom: 16
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
                  gap: 6,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 168, 204, 0.3)'
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
              <h3>{isAr ? 'إعداد جولة تفاعلية 360° للقاعات' : 'Configure 360° Virtual Tour'}</h3>
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
