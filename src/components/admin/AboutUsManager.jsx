import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Edit3, 
  Building2, 
  Sparkles, 
  Layers, 
  Search, 
  Eye, 
  Upload, 
  LogOut,
  Users,
  Award,
  ShieldCheck,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Compass,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import './AboutUsManager.css';

// Project Media Library Assets matching Image 2 reference screenshot + Resort highlights
const ALL_PROJECT_ASSETS = [
  // 12 Assets directly visible in the reference mockup
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

  // Resort Architecture, Landscape & Hospitality Assets
  { name: 'American Dream Resort Grand Architecture', path: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png' },
  { name: 'Canal-side Sunset Terrace & Dining', path: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png' },
  { name: 'Lake Timsah Sunset Vista', path: '/photo/vibe_5_sunset.png' },
  { name: 'Cinematic Resort Backdrop', path: '/photo/kid area pic/Cinematic Full-Width Backdrop.png' },
  { name: 'Luxury Event Dining Hall', path: '/photo/kid area pic/Image (1).png' },
  { name: 'Waterfront Sunset Cocktail Lounge', path: '/photo/vibe_3_cocktail.png' },
  { name: 'Floral Celebration & Wedding Setup', path: '/photo/vibe_2_floral_hd.png' },
  { name: 'Kids Birthday Party Atmosphere', path: '/photo/vibe_1_birthday.png' },
  { name: 'Artisanal Gourmet Kitchen', path: '/photo/vibe_4_chef.png' },
  { name: 'Festival Lights & Sound Stage', path: '/photo/vibe_6_party.png' },
  { name: 'Young Adventurer High Ropes', path: '/photo/kid area pic/Young girl balancing on high rope suspension bridge.png' },
  { name: 'Kids Ball Pit Slides', path: '/photo/kid area pic/Kids sliding into colorful ball pit.png' },
  { name: 'Toddler Laughing in Ball Pit', path: '/photo/kid area pic/Little boy laughing in ball pit2.png' },
  { name: 'Classic Illuminated Carousel', path: '/photo/kid area pic/Classic illuminated carousel ride.png' },
  { name: 'Junior GP Speedway', path: '/photo/kid area pic/Junior GP Speedway.png' },
  { name: 'Family Bumper Cars', path: '/photo/kid area pic/Family bumper car arena.png' }
];

// Initial Master Data for About Us Dashboard
const INITIAL_ABOUT_DATA = {
  hero: {
    titleEn: 'ABOUT AMERICAN DREAM RESORT',
    subtitleEn: 'The premier family entertainment, adventure & lakeside leisure destination in Ismailia.',
    titleAr: 'عن منتجع أمريكان دريم الترفيهي',
    subtitleAr: 'الوجهة الأولى للمرح والمغامرة العائلية والضيافة الفاخرة على ضفاف بحيرة التمساح.',
    images: [
      '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      '/photo/vibe_5_sunset.png',
      '/photo/kid area pic/Cinematic Full-Width Backdrop.png',
      '/photo/kid area pic/Graphic Composition.png'
    ],
    activeSlideIndex: 0
  },
  categories: [
    { key: 'all', labelEn: 'All Overview', labelAr: 'نظرة شاملة', icon: 'layers' },
    { key: 'story', labelEn: 'Our Story & Heritage', labelAr: 'قصتنا وهويتنا', icon: 'building' },
    { key: 'vision', labelEn: 'Vision & Mission', labelAr: 'الرؤية والرسالة', icon: 'award' },
    { key: 'values', labelEn: 'Core Values & Safety', labelAr: 'القيم ومعايير الأمان', icon: 'shield' },
    { key: 'contact', labelEn: 'Location & Working Hours', labelAr: 'الموقع وساعات العمل', icon: 'clock' },
    { key: 'stats', labelEn: 'Key Statistics', labelAr: 'إحصائيات المنتجع', icon: 'star' }
  ],
  featuredCards: [
    {
      id: 'ab-feat-1',
      title: 'American Dream Ismailia: Where Memories Are Made',
      titleAr: 'أمريكان دريم الإسماعيلية: حيث تصنع أسعد الذكريات',
      subtitle: 'Established with a passionate vision to offer families across Egypt a world-class lakeside amusement resort, gourmet waterfront dining, and thrilling high-tech gaming.',
      subtitleAr: 'تأسس المنتجع برؤية طموحة لتقديم أضخم مدينة ترفيهية شاطئية للعائلات بمصر، تجمع بين روعة ألعاب الحركة، المطاعم الفاخرة، والواقع الافتراضي على بحيرة التمساح.',
      badge: 'OUR STORY',
      badgeAr: 'قصة نجاحنا',
      category: 'story',
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      statNumber: '2022',
      statLabel: 'Founded in Ismailia',
      statLabelAr: 'سنة التأسيس بالإسماعيلية',
      features: [
        '50,000+ sqm of waterfront fun, attractions and dining',
        '4 Dedicated entertainment zones for all age groups',
        'Panoramic direct views over Lake Timsah & Suez Canal',
        '100% Certified European safety standards & hygiene protocols',
        'Fully equipped event ballrooms & kids birthday party suites'
      ]
    },
    {
      id: 'ab-feat-2',
      title: 'Our Vision: Egypt’s Leading Family Leisure Resort',
      titleAr: 'رؤيتنا: الوجهة العائلية الترفيهية الرائدة في مصر',
      subtitle: 'Empowering family joy, safe play, and premium hospitality through continuous innovation and world-standard attractions.',
      subtitleAr: 'إثراء أوقات العائلات بلحظات الفرح الحقيقي والأمان الكامل والضيافة الراقية عبر الابتكار المستمر والتجهيزات العالمية.',
      badge: 'OUR VISION',
      badgeAr: 'رؤيتنا ورسالتنا',
      category: 'vision',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      statNumber: '100%',
      statLabel: 'Safety & Happiness Commitment',
      statLabelAr: 'التزام تام بالأمان وإسعاد الزوار',
      features: [
        'To continuously innovate with next-generation interactive VR & AR attractions',
        'To create accessible, affordable and memorable experiences for every Egyptian family',
        'To maintain zero-compromise child safety with certified supervisors in every zone',
        'To host regional celebrations, concerts and corporate retreats in Ismailia'
      ]
    }
  ],
  items: [
    {
      id: 'ab-item-1',
      category: 'values',
      title: 'Uncompromising Safety Standards',
      titleAr: 'معايير أمان معتمدة ١٠٠٪',
      subtitle: 'All rides, trampolines, high ropes and ball pits are certified and inspected daily by trained safety engineers.',
      subtitleAr: 'فحص يومي شامل لجميع الألعاب والمسارات المعلقة وحمامات الكرات بإشراف مهندسي سلامة متخصصين.',
      badge: 'SAFETY 100%',
      badgeAr: 'أمان معتمد',
      tagline: 'Zero Compromise Safety',
      taglineAr: 'أعلى معايير السلامة الأوروبية',
      image: '/photo/kid area pic/High ropes suspended course.png'
    },
    {
      id: 'ab-item-2',
      category: 'values',
      title: 'Family-First Hospitality & Comfort',
      titleAr: 'ضيافة عائلية متكاملة',
      subtitle: 'Spacious air-conditioned lounges, baby care rooms, wheelchair accessibility and attentive guest service teams.',
      subtitleAr: 'صالات مكيفة، استراحات عائلية، غرف رعاية للرضع، وتسهيلات لأصحاب الهمم مع فريق خدمة ضيوف ودود.',
      badge: 'HOSPITALITY',
      badgeAr: 'ضيافة فندقية',
      tagline: 'All-Ages Comfort',
      taglineAr: 'راحة ورفاهية لكل أفراد الأسرة',
      image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png'
    },
    {
      id: 'ab-item-3',
      category: 'story',
      title: 'Prime Lake Timsah Waterfront Location',
      titleAr: 'موقع استراتيجي على بحيرة التمساح',
      subtitle: 'Direct coastal access with panoramic sunset views, refreshing sea breezes and private marina access.',
      subtitleAr: 'إطلالة شاطئية ساحرة ومباشرة على بحيرة التمساح مع أجواء غروب خلابة وممشى سياحي خاص.',
      badge: 'LAKESIDE',
      badgeAr: 'إطلالة شاطئية',
      tagline: 'Canal & Lake Front',
      taglineAr: 'كورنيش بحيرة التمساح',
      image: '/photo/vibe_5_sunset.png'
    },
    {
      id: 'ab-item-4',
      category: 'stats',
      title: 'Over 50+ Interactive Attractions',
      titleAr: 'أكثر من ٥٠ لعبة وتجربة تفاعلية',
      subtitle: 'Spanning VR sims, tactical laser tag, arcade classics, bumper cars, toddlers ball pits and high ropes course.',
      subtitleAr: 'تتنوع بين ألعاب الواقع الافتراضي، الليزر تاغ، الآركيد، سيارات التصادم، وحلبات المغامرات المعلقة.',
      badge: '50+ RIDES',
      badgeAr: '٥٠+ لعبة',
      tagline: '4 Mega Fun Zones',
      taglineAr: '٤ مناطق ترفيهية ضخمة',
      image: '/photo/kid area pic/Laser & Tactical Arena.png'
    },
    {
      id: 'ab-item-5',
      category: 'stats',
      title: '15,000+ Happy Families Hosted',
      titleAr: 'أكثر من ١٥ ألف عائلة سعيدة',
      subtitle: 'Over 15,000 satisfied families and 500+ successful birthday and corporate events hosted since launch.',
      subtitleAr: 'سجل حافل باستقبال آلاف العائلات وتنظيم أكثر من ٥٠٠ حفل عيد ميلاد ومناسبة خاصة بنجاح باهر.',
      badge: 'TOP RATED',
      badgeAr: 'الأعلى تقييماً',
      tagline: '4.9★ Guest Rating',
      taglineAr: 'تقييم ٤.٩ نجوم',
      image: '/photo/kid area pic/Family celebrating victory at skeeball.png'
    },
    {
      id: 'ab-item-6',
      category: 'contact',
      title: 'Resort Location & Operating Hours',
      titleAr: 'عنوان المنتجع ومواعيد العمل الرسمية',
      subtitle: 'Al Balagh Beach Road, Lake Timsah Coast, Ismailia. Open daily 10:00 AM – 11:30 PM (Weekends until 1:00 AM).',
      subtitleAr: 'طريق شاطئ البلاغ، كورنيش بحيرة التمساح، الإسماعيلية. يومياً من ١٠ صباحاً حتى ١١:٣٠ مساءً (العطلات حتى ١ صباحاً).',
      badge: 'OPEN DAILY',
      badgeAr: 'يومياً للجميع',
      tagline: 'Hotline: 19876',
      taglineAr: 'الخط الساخن: ١٩٨٧٦',
      image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png'
    },
    {
      id: 'ab-item-7',
      category: 'contact',
      title: 'Direct Contact & Social Channels',
      titleAr: 'قنوات التواصل المباشر والحجز',
      subtitle: 'Phone: +20 100 000 0000 | WhatsApp Support | info@americandream.eg | Facebook & Instagram @americandreamismailia',
      subtitleAr: 'هاتف: ٠١٠٠٠٠٠٠٠٠٠ | واتساب مباشر | info@americandream.eg | فيسبوك وإنستغرام @americandreamismailia',
      badge: '24/7 SUPPORT',
      badgeAr: 'دعم سريع',
      tagline: 'Fast Response',
      taglineAr: 'خدمة عملاء فورية',
      image: '/photo/kid area pic/dish_burger.png'
    }
  ],
  explore: [
    { id: 'ab-exp-1', image: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png', caption: 'Luxury Resort Architecture' },
    { id: 'ab-exp-2', image: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png', caption: 'Canal-side Sunset Terrace' },
    { id: 'ab-exp-3', image: '/photo/vibe_5_sunset.png', caption: 'Lake Timsah Sunset Vista' },
    { id: 'ab-exp-4', image: '/photo/kid area pic/High ropes suspended course.png', caption: 'Adventure High Ropes Course' },
    { id: 'ab-exp-5', image: '/photo/kid area pic/Laser & Tactical Arena.png', caption: 'Tactical Laser Arena' },
    { id: 'ab-exp-6', image: '/photo/kid area pic/Classic illuminated carousel ride.png', caption: 'Illuminated Carousel' }
  ],
  explorer360: {
    title: 'American Dream Resort 360° Virtual Panoramic Tour',
    url: 'https://my.matterport.com/show/?m=american-dream-resort',
    enabled: true
  }
};

export default function AboutUsManager({ lang = 'ar', setLang, onLogout, onOpenOrders }) {
  const isAr = lang === 'ar';

  // Load from local storage or defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('ados_about_us_content_v2');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn('Could not read about us from storage:', err);
    }
    return INITIAL_ABOUT_DATA;
  });

  // Active Category filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Subtab: 'featured' vs 'cards'
  const [activeSubTab, setActiveSubTab] = useState('featured');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Active Hero Slide Index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState('edit'); // 'edit' | 'add'
  const [editingItem, setEditingItem] = useState(null);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState({
    titleEn: '',
    subtitleEn: '',
    titleAr: '',
    subtitleAr: ''
  });

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { type: 'hero' | 'item' | 'explore', slotIndex?: number }

  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fileInputRef = useRef(null);

  // Current hero images array
  const heroImages = data.hero?.images?.length ? data.hero.images : INITIAL_ABOUT_DATA.hero.images;
  const currentBannerImg = heroImages[activeSlideIndex] || heroImages[0];

  // Auto carousel slide change if idle
  const handleCarouselDotClick = (dotIdx) => {
    setActiveSlideIndex(dotIdx);
  };

  // Delete current hero banner slide
  const handleDeleteHeroBanner = () => {
    if (heroImages.length <= 1) {
      showToast(isAr ? 'لا يمكن حذف آخر صورة متبقية للغلاف.' : 'Cannot delete the only hero slide.');
      return;
    }
    const confirmPrompt = isAr ? 'هل أنت متأكد من حذف هذه الشريحة من الغلاف؟' : 'Delete this hero slide?';
    if (window.confirm(confirmPrompt)) {
      const updatedImages = heroImages.filter((_, idx) => idx !== activeSlideIndex);
      setData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          images: updatedImages
        }
      }));
      setActiveSlideIndex(0);
      showToast(isAr ? 'تم حذف شريحة الغلاف.' : 'Hero slide removed.');
    }
  };

  // Open Image Picker Modal
  const openImagePicker = (target) => {
    setImagePickerTarget(target);
    setIsImagePickerOpen(true);
  };

  // Select image from Project Media Library or uploaded file
  const handleSelectImage = (imagePath) => {
    if (!imagePickerTarget) return;

    if (imagePickerTarget.type === 'hero') {
      const updated = [...heroImages];
      if (imagePickerTarget.isNew) {
        updated.push(imagePath);
        setActiveSlideIndex(updated.length - 1);
      } else {
        updated[activeSlideIndex] = imagePath;
      }
      setData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          images: updated
        }
      }));
      showToast(isAr ? 'تم تحديث صورة الغلاف.' : 'Hero banner updated.');
    } else if (imagePickerTarget.type === 'item' && editingItem) {
      setEditingItem(prev => ({ ...prev, image: imagePath }));
    } else if (imagePickerTarget.type === 'explore') {
      const exploreList = [...(data.explore || [])];
      if (imagePickerTarget.slotIndex !== undefined && exploreList[imagePickerTarget.slotIndex]) {
        exploreList[imagePickerTarget.slotIndex].image = imagePath;
      } else {
        exploreList.push({
          id: `ab-exp-${Date.now()}`,
          image: imagePath,
          caption: 'Resort Architecture'
        });
      }
      setData(prev => ({
        ...prev,
        explore: exploreList
      }));
      showToast(isAr ? 'تم تحديث صورة الاستكشاف.' : 'Explore photo updated.');
    }

    setIsImagePickerOpen(false);
  };

  // Handle local PC file upload
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

  // Open Edit Card Modal
  const openEditItemModal = (item, isFeatured = false) => {
    setItemModalMode('edit');
    setIsEditingFeatured(isFeatured);
    setEditingItem({
      ...item,
      features: item.features ? [...item.features] : []
    });
    setIsItemModalOpen(true);
  };

  // Open Add Card Modal
  const openAddItemModal = () => {
    setItemModalMode('add');
    const isFeatured = activeSubTab === 'featured';
    setIsEditingFeatured(isFeatured);
    setEditingItem({
      id: `ab-${Date.now()}`,
      title: '',
      titleAr: '',
      subtitle: '',
      subtitleAr: '',
      badge: isFeatured ? 'FEATURED' : 'HIGHLIGHT',
      badgeAr: isFeatured ? 'مميز' : 'أبرز الملامح',
      category: activeCategory !== 'all' ? activeCategory : 'story',
      statNumber: isFeatured ? '100%' : '',
      statLabel: isFeatured ? 'Quality Standard' : '',
      statLabelAr: isFeatured ? 'معيار الجودة' : '',
      tagline: isFeatured ? '' : 'Resort Feature',
      taglineAr: isFeatured ? '' : 'ميزة المنتجع',
      image: ALL_PROJECT_ASSETS[0].path,
      features: isFeatured ? ['Premier Resort Feature', 'European Safety Certified'] : []
    });
    setIsItemModalOpen(true);
  };

  // Save Add/Edit Item
  const handleSaveItemModal = () => {
    if (!editingItem.title && !editingItem.titleAr) {
      alert(isAr ? 'يرجى كتابة عنوان العنصر.' : 'Please enter item title.');
      return;
    }

    const targetKey = isEditingFeatured ? 'featuredCards' : 'items';
    const list = [...(data[targetKey] || [])];

    if (itemModalMode === 'edit') {
      const idx = list.findIndex(i => i.id === editingItem.id);
      if (idx !== -1) {
        list[idx] = editingItem;
      }
      showToast(isAr ? 'تم حفظ التعديلات بنجاح.' : 'Item updated successfully.');
    } else {
      list.unshift(editingItem);
      showToast(isAr ? 'تمت إضافة العنصر الجديد بنجاح.' : 'New item added successfully.');
    }

    setData(prev => ({
      ...prev,
      [targetKey]: list
    }));

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  // Delete Card Item
  const handleDeleteItem = () => {
    if (!editingItem) return;
    const confirmPrompt = isAr 
      ? `هل أنت متأكد من حذف "${editingItem.titleAr || editingItem.title}"؟` 
      : `Delete "${editingItem.title}"?`;
    if (window.confirm(confirmPrompt)) {
      const targetKey = isEditingFeatured ? 'featuredCards' : 'items';
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
      localStorage.setItem('ados_about_us_content_v2', JSON.stringify(data));
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast(isAr ? '✓ تم حفظ جميع تعديلات (من نحن) بنجاح!' : '✓ About Us changes saved successfully!');
    } catch (err) {
      showToast(isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Error saving changes to local storage.');
    }
  };

  // Reset Changes to Defaults
  const handleCancelChanges = () => {
    const confirmPrompt = isAr 
      ? 'هل أنت متأكد من استعادة بيانات من نحن الافتراضية وإلغاء جميع التعديلات؟' 
      : 'Reset About Us data back to default settings?';
    if (window.confirm(confirmPrompt)) {
      localStorage.removeItem('ados_about_us_content_v2');
      setData(INITIAL_ABOUT_DATA);
      showToast(isAr ? 'تمت استعادة البيانات الافتراضية.' : 'About Us data reset to defaults.');
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
      (item.subtitleAr && item.subtitleAr.toLowerCase().includes(q)) ||
      (item.tagline && item.tagline.toLowerCase().includes(q)) ||
      (item.taglineAr && item.taglineAr.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const filteredFeatured = (data.featuredCards || []).filter(feat => {
    const matchesCategory = activeCategory === 'all' || feat.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    return (
      matchesCategory && (
        (feat.title && feat.title.toLowerCase().includes(q)) ||
        (feat.titleAr && feat.titleAr.toLowerCase().includes(q)) ||
        (feat.subtitle && feat.subtitle.toLowerCase().includes(q)) ||
        (feat.subtitleAr && feat.subtitleAr.toLowerCase().includes(q))
      )
    );
  });

  // Helper for category icons
  const renderCategoryIcon = (icon) => {
    switch (icon) {
      case 'building': return <Building2 size={15} className="ados-zone-pill-icon" />;
      case 'award': return <Award size={15} className="ados-zone-pill-icon" />;
      case 'shield': return <ShieldCheck size={15} className="ados-zone-pill-icon" />;
      case 'clock': return <Clock size={15} className="ados-zone-pill-icon" />;
      case 'star': return <Star size={15} className="ados-zone-pill-icon" />;
      case 'layers': return <Layers size={15} className="ados-zone-pill-icon" />;
      default: return <Sparkles size={15} className="ados-zone-pill-icon" />;
    }
  };

  return (
    <div className={`about-editor-wrapper ${isAr ? 'lang-ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOPBAR                                                          */}
      {/* ------------------------------------------------------------------ */}
      <header className="ados-topbar">
        {/* Left Badge Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="about-topbar-indicator">
            <Building2 size={15} />
            <span>{isAr ? 'إدارة محتوى من نحن' : 'About Us CMS'}</span>
          </div>
        </div>

        {/* Center Title Group */}
        <div className="ados-topbar-title-group">
          <h1 className="ados-topbar-title">
            {isAr ? 'لوحة تحكم إدارة أمريكان دريم' : 'ADOS Management Dashboard'}
          </h1>
          <div className="ados-topbar-subtitle">
            {isAr ? 'من نحن • هويتنا ورسالتنا • قيم وتجارب المنتجع' : 'About Us • Identity & Vision • Resort Story & Values'}
          </div>
        </div>

        {/* Right Controls: Language & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
      {/* 2. BODY CONTENT: EXACT MATCH TO PLAY ZONE & RESTAURANT DASHBOARDS   */}
      {/* ------------------------------------------------------------------ */}
      <div className="ados-content">
        {/* CATEGORY NAVIGATION PILLS (Exact match to Play Zone nav) */}
        <nav className="ados-zone-nav about-category-nav">
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
          className="ados-hero-card about-hero-card"
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
                    className="about-hero-edit-texts-btn"
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
              <div className="ados-hero-stamp-badge about-stamp-badge">
                {isAr ? (
                  <>
                    <span>شغف</span>
                    <span>عائلة</span>
                    <span>أمان</span>
                    <span>تميز!</span>
                  </>
                ) : (
                  <>
                    <span>PASSION</span>
                    <span>FAMILY</span>
                    <span>SAFETY</span>
                    <span>EXCELLENCE!</span>
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
                  ? (activeSubTab === 'featured' ? 'أبرز مميزات ورؤية المنتجع' : 'جميع بطاقات قصة وقيم المنتجع') 
                  : (activeSubTab === 'featured' ? 'Featured Highlights & Vision' : 'All Story, Values & Contact Cards')}
              </h2>
              <span className="ados-section-title-pipe">|</span>
              <span className="ados-section-title-ar">
                {isAr ? 'إدارة وتحرير محتوى من نحن' : 'About Us Overview & Identity'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Search Bar */}
              <div className="about-search-input-wrap">
                <Search size={14} className="about-search-icon" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في بطاقات من نحن...' : 'Search About Us items...'}
                  className="about-search-input"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="about-search-clear"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Add Item Button */}
              <button className="ados-add-btn" onClick={openAddItemModal}>
                <Plus size={14} />
                <span>{isAr ? (activeSubTab === 'featured' ? 'إضافة بطاقة رئيسية' : 'إضافة بطاقة جديدة') : 'Add Item'}</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab Navigation (Featured Highlights vs All Cards) */}
          <div className="ados-subtab-container">
            <button 
              className={`ados-subtab-pill ${activeSubTab === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('featured')}
            >
              <BookmarkCheck size={14} />
              <span>{isAr ? 'أبرز مميزات ورؤية المنتجع' : 'Featured Highlights & Vision'}</span>
            </button>
            <button 
              className={`ados-subtab-pill ${activeSubTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('cards')}
            >
              <Layers size={14} />
              <span>{isAr ? 'جميع البطاقات والقيم والموقع' : 'All Story, Values & Contact Cards'}</span>
            </button>
          </div>

          {/* 1. FEATURED WIDE CARDS */}
          {activeSubTab === 'featured' && (
            <div className="about-featured-grid">
              {filteredFeatured.map(feat => (
                <div key={feat.id} className="about-featured-card">
                  <div className="about-featured-img-side">
                    <img src={feat.image} alt={feat.title} />
                    {feat.badge && (
                      <span className="about-featured-badge">
                        {isAr ? (feat.badgeAr || feat.badge) : feat.badge}
                      </span>
                    )}
                  </div>
                  <div className="about-featured-content-side">
                    <div className="about-featured-header">
                      <div className="about-featured-titles">
                        <h3>{isAr ? (feat.titleAr || feat.title) : feat.title}</h3>
                        {!isAr && feat.titleAr && <span className="about-featured-title-ar">{feat.titleAr}</span>}
                      </div>
                      <button 
                        className="ados-card-full-edit-btn"
                        onClick={() => openEditItemModal(feat, true)}
                      >
                        {isAr ? 'تعديل' : 'EDIT'}
                      </button>
                    </div>

                    <p className="about-featured-desc">
                      {isAr ? (feat.subtitleAr || feat.subtitle) : feat.subtitle}
                    </p>

                    {feat.features && feat.features.length > 0 && (
                      <div className="about-featured-features">
                        {feat.features.map((featItem, fIdx) => (
                          <div key={fIdx} className="about-featured-feature-item">
                            <CheckCircle2 size={13} className="about-feature-check" />
                            <span>{featItem}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="about-featured-footer">
                      {feat.statNumber && (
                        <div className="about-stat-pill">
                          <span className="about-stat-number">{feat.statNumber}</span>
                          <span className="about-stat-label">
                            {isAr ? (feat.statLabelAr || feat.statLabel) : (feat.statLabel || feat.statLabelAr)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredFeatured.length === 0 && (
                <div className="about-empty-state-full">
                  <p>{isAr ? 'لا توجد بطاقات مميزة مطابقة للتصنيف أو البحث الحالي.' : 'No featured cards match current category or search query.'}</p>
                  <button className="ados-add-btn" onClick={openAddItemModal}>
                    <Plus size={14} />
                    <span>{isAr ? 'إضافة بطاقة رئيسية' : 'Add Featured Card'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. REGULAR CARDS GRID (3-column layout matching Play Zone) */}
          {activeSubTab === 'cards' && (
            <div className="ados-cards-grid-3">
              {filteredItems.map(item => (
                <div key={item.id} className="ados-vertical-card about-card-item">
                  {/* Thumbnail Wrap */}
                  <div className="ados-card-thumb-wrap">
                    <img src={item.image} alt={item.title} className="ados-card-thumb-img" />
                    {item.badge && (
                      <div className="ados-card-thumb-badge">
                        {isAr ? (item.badgeAr || item.badge) : item.badge}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="ados-card-content">
                    <div className="ados-card-titles-wrap">
                      <h4 className="ados-card-title-en">
                        {isAr ? (item.titleAr || item.title) : item.title}
                      </h4>
                      {!isAr && item.titleAr && <span className="ados-card-title-ar">{item.titleAr}</span>}
                    </div>

                    {/* Subtitle / Description */}
                    <p className="about-item-desc">
                      {isAr ? (item.subtitleAr || item.subtitle) : (item.subtitle || '')}
                    </p>

                    {/* Tagline / Metric */}
                    {item.tagline && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0284c7', fontWeight: 600, marginBottom: 12 }}>
                        <Sparkles size={13} />
                        <span>{isAr ? (item.taglineAr || item.tagline) : item.tagline}</span>
                      </div>
                    )}

                    {/* Footer: Tagline / Edit Button */}
                    <div className="ados-card-footer">
                      <div className="ados-card-price-row">
                        <span className="about-category-badge">
                          {data.categories.find(c => c.key === item.category)?.labelEn || item.category}
                        </span>
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
                <div className="about-empty-state-full">
                  <p>{isAr ? 'لا توجد عناصر مطابقة للتصنيف أو البحث الحالي.' : 'No items match current category or search query.'}</p>
                  <button className="ados-add-btn" onClick={openAddItemModal}>
                    <Plus size={14} />
                    <span>{isAr ? 'إضافة بطاقة جديدة' : 'Add New Card'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* EXPLORE RESORT ATMOSPHERE & ARCHITECTURE SECTION */}
        <section className="ados-explore-section">
          <h3 className="ados-explore-title">
            {isAr 
              ? 'استكشف معالم وتجهيزات منتجع أمريكان دريم' 
              : 'Explore American Dream Resort Atmosphere & Architecture'}
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
              <span>{isAr ? 'جولة تفاعلية 360° لكامل أرجاء المنتجع' : 'RESORT 360° VIRTUAL PANORAMIC TOUR'}</span>
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
      {/* 3. MODAL: EDIT / ADD CARD OR HIGHLIGHT                             */}
      {/* ------------------------------------------------------------------ */}
      {isItemModalOpen && editingItem && (
        <div className="ados-modal-backdrop" onClick={() => setIsItemModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>
                {itemModalMode === 'edit' 
                  ? (isAr ? `تعديل: ${editingItem.titleAr || editingItem.title}` : `Edit Item: ${editingItem.title}`) 
                  : (isAr ? 'إضافة بطاقة جديدة' : 'Add New About Us Item')}
              </h3>
              <button className="ados-modal-close-btn" onClick={() => setIsItemModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              {/* Image Preview & Change Photo */}
              <div className="ados-form-group">
                <label>{isAr ? 'صورة البطاقة' : 'Card Photo'}</label>
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
                  <label>{isAr ? 'العنوان (بالإنجليزية)' : 'Title (English)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.title} 
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'العنوان (بالعربية)' : 'Title (Arabic)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.titleAr} 
                    onChange={e => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Subtitle / Description EN & AR */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف والتفاصيل (EN)' : 'Description (EN)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingItem.subtitle} 
                    onChange={e => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'الوصف والتفاصيل (AR)' : 'Description (AR)'}</label>
                  <textarea 
                    className="ados-form-textarea"
                    rows={2}
                    value={editingItem.subtitleAr} 
                    onChange={e => setEditingItem({ ...editingItem, subtitleAr: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'التصنيف' : 'Category'}</label>
                  <select 
                    className="ados-form-select"
                    value={editingItem.category} 
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="story">{isAr ? 'قصتنا وهويتنا (Story)' : 'Our Story & Heritage'}</option>
                    <option value="vision">{isAr ? 'الرؤية والرسالة (Vision)' : 'Vision & Mission'}</option>
                    <option value="values">{isAr ? 'القيم ومعايير الأمان (Values)' : 'Core Values & Safety'}</option>
                    <option value="contact">{isAr ? 'الموقع والتواصل (Contact)' : 'Location & Contact'}</option>
                    <option value="stats">{isAr ? 'إحصائيات المنتجع (Stats)' : 'Key Statistics'}</option>
                  </select>
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'شارة البطاقة (Badge EN)' : 'Card Badge (EN)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={editingItem.badge || ''} 
                    placeholder="e.g. SAFETY 100%, LAKESIDE"
                    onChange={e => setEditingItem({ ...editingItem, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Tagline / Stat Label */}
              <div className="ados-form-row">
                <div className="ados-form-group">
                  <label>{isAr ? 'ملاحظة مميزة / رقم (EN)' : 'Tagline / Metric (EN)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={isEditingFeatured ? (editingItem.statNumber || '') : (editingItem.tagline || '')} 
                    placeholder={isEditingFeatured ? 'e.g. 2022 or 100%' : 'e.g. Zero Compromise'}
                    onChange={e => {
                      if (isEditingFeatured) {
                        setEditingItem({ ...editingItem, statNumber: e.target.value });
                      } else {
                        setEditingItem({ ...editingItem, tagline: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="ados-form-group">
                  <label>{isAr ? 'ملاحظة مميزة / نص (AR)' : 'Tagline / Label (AR)'}</label>
                  <input 
                    type="text" 
                    className="ados-form-input"
                    value={isEditingFeatured ? (editingItem.statLabelAr || '') : (editingItem.taglineAr || '')} 
                    placeholder={isEditingFeatured ? 'سنة التأسيس بالإسماعيلية' : 'أعلى معايير السلامة'}
                    onChange={e => {
                      if (isEditingFeatured) {
                        setEditingItem({ ...editingItem, statLabelAr: e.target.value });
                      } else {
                        setEditingItem({ ...editingItem, taglineAr: e.target.value });
                      }
                    }}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* If Featured: Inclusions / Bullet features */}
              {isEditingFeatured && (
                <div className="ados-form-group">
                  <label>{isAr ? 'عناصر وقوائم التميز (Bullet Points)' : 'Featured Bullet Points'}</label>
                  {(editingItem.features || []).map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input 
                        type="text" 
                        className="ados-form-input"
                        value={feat}
                        onChange={e => {
                          const updated = [...editingItem.features];
                          updated[fIdx] = e.target.value;
                          setEditingItem({ ...editingItem, features: updated });
                        }}
                      />
                      <button 
                        type="button"
                        className="ados-btn-danger"
                        style={{ padding: '6px 12px' }}
                        onClick={() => {
                          const updated = editingItem.features.filter((_, idx) => idx !== fIdx);
                          setEditingItem({ ...editingItem, features: updated });
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    className="ados-btn-secondary"
                    style={{ fontSize: 12, padding: '6px 14px', marginTop: 4 }}
                    onClick={() => {
                      setEditingItem({
                        ...editingItem,
                        features: [...(editingItem.features || []), 'New highlight feature']
                      });
                    }}
                  >
                    <Plus size={13} style={{ marginInlineEnd: 4 }} />
                    <span>{isAr ? 'إضافة نقطة ميزة' : 'Add Bullet Feature'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="ados-modal-footer">
              <div>
                {itemModalMode === 'edit' && (
                  <button className="ados-btn-danger" onClick={handleDeleteItem}>
                    <Trash2 size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                    <span>{isAr ? 'حذف العنصر' : 'Delete Item'}</span>
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ados-btn-secondary" onClick={() => setIsItemModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="ados-btn-primary" onClick={handleSaveItemModal}>
                  <Check size={14} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
                  <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
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
              <h3>{isAr ? 'تعديل نصوص غلاف (من نحن)' : 'Edit About Us Hero Text'}</h3>
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
      {/* 5. MODAL: IMAGE PICKER & UPLOADER (Exact match to reference image) */}
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
                        padding: '4px 6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
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
      {/* 6. MODAL: 360° TOUR SETTINGS                                       */}
      {/* ------------------------------------------------------------------ */}
      {is360ModalOpen && (
        <div className="ados-modal-backdrop" onClick={() => setIs360ModalOpen(false)}>
          <div className="ados-modal-window" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="ados-modal-header">
              <h3>{isAr ? 'إعدادات الجولة الافتراضية 360°' : '360° Virtual Tour Settings'}</h3>
              <button className="ados-modal-close-btn" onClick={() => setIs360ModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ados-modal-body">
              <div className="ados-form-group">
                <label>{isAr ? 'عنوان تجربة 360°' : '360 Experience Title'}</label>
                <input 
                  type="text" 
                  className="ados-form-input"
                  value={data.explorer360?.title || ''}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setData(prev => ({
                      ...prev,
                      explorer360: {
                        ...prev.explorer360,
                        title: newTitle
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
                  value={data.explorer360?.url || ''}
                  placeholder="https://my.matterport.com/show/?m=..."
                  onChange={e => {
                    const newUrl = e.target.value;
                    setData(prev => ({
                      ...prev,
                      explorer360: {
                        ...prev.explorer360,
                        url: newUrl
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
                  {isAr ? 'الجولة البانورامية التفاعلية 360° نشطة' : 'Resort 360° Panorama Active'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                  {isAr 
                    ? 'سيتمكن زوار الموقع العام من التنقل في جولة تفاعلية شاملة 360 درجة لجميع مرافق المنتجع.'
                    : 'Visitors on the public website can experience full 360-degree interactive exploration of resort amenities.'}
                </div>
              </div>
            </div>

            <div className="ados-modal-footer">
              <div></div>
              <button 
                className="ados-btn-primary" 
                onClick={() => {
                  setIs360ModalOpen(false);
                  showToast(isAr ? 'تم حفظ إعدادات جولة 360°.' : '360° Tour settings updated.');
                }}
              >
                {isAr ? 'تطبيق الإعدادات' : 'Apply Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. TOAST NOTIFICATION                                              */}
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
