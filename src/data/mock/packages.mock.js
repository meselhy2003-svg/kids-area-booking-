/**
 * Mock Packages & Birthday Events Data
 */

export const passPackages = {
  adventure: {
    id: 'adv-pass',
    category: 'adventure',
    title: 'Adventure Pass',
    titleEn: 'Adventure Pass',
    subtitle: 'All Game Experiance',
    saveBadge: 'Save 60 EGP',
    type: 'checklist',
    price: 'EGP 100',
    priceNum: 100,
    origPrice: 'EGP 160',
    oldPrice: 160,
    img: '/photo/kid-area-pic/family-bumper-cars.png',
    features: ['BUMPER CARS', 'PUBG', 'Bubble Ball'],
    perks: ['BUMPER CARS', 'PUBG', 'Bubble Ball'],
    details: 'Full access to Bumper Cars, PUBG action simulator, and Bubble Ball arena.'
  },
  challenge: {
    id: 'chal-pass',
    category: 'challenge',
    title: 'Challenge Pass',
    titleEn: 'Challenge Pass',
    subtitle: 'Pick any 4 games',
    saveBadge: 'Save 60 EGP',
    type: 'grid',
    price: 'EGP 100',
    priceNum: 100,
    origPrice: 'EGP 160',
    oldPrice: 160,
    img: '/photo/mobile-challenge/offer-collage.png',
    features: ['VR Arena', 'Basketball Shootout', 'Laser Shooting', 'Car Racing'],
    perks: [
      { label: 'VR', icon: 'vr' },
      { label: 'Basketball', icon: 'ball' },
      { label: 'Shooting', icon: 'target' },
      { label: 'Car Racing', icon: 'wheel' }
    ],
    details: 'Choose any 4 exciting challenges: VR, Basketball, Shooting, and Racing.'
  },
  'midweek': {
    id: 'mid-pass',
    category: 'midweek',
    title: 'Single Midweek Pass',
    titleEn: 'Single Midweek Pass',
    subtitle: 'All Day Play & Crafts',
    saveBadge: 'Save 85 EGP',
    type: 'checklist',
    price: 'EGP 100',
    priceNum: 100,
    origPrice: 'EGP 185',
    oldPrice: 185,
    img: '/photo/kid-area-pic/graphic-composition.png',
    features: ['All-day entry + 1 Package', 'جبس وألوان', '2 Arcade Tokens Included'],
    perks: ['All-Day Access to All Zones', '1 VR Simulation Session Included', 'Free Grip Socks at Reception'],
    details: 'Full day access to Kids Area & Fun Park with art workshop included.'
  },
  weekend: {
    id: 'wknd-pass',
    category: 'weekend',
    title: 'Single Weekend Pass',
    titleEn: 'Single Weekend Pass',
    subtitle: 'Weekend Ultimate Joy',
    saveBadge: 'Save 85 EGP',
    type: 'checklist',
    price: 'EGP 100',
    priceNum: 100,
    origPrice: 'EGP 185',
    oldPrice: 185,
    img: '/photo/kid-area-pic/graphic-composition.png',
    features: ['All-day entry + 2 Games', '1 VR + 1 Basketball', 'Free Coloring & Party Access'],
    perks: ['Entry for 2 Adults + 2 Kids', '4 Arcade Tokens + 2 VR Sessions', 'Free Mascot & Bubble Show Access'],
    details: 'Weekend pass with 2 premium game tokens and stage party admission.'
  }
};

export const birthdayPackages = [
  {
    id: 'silver',
    nameEn: 'Sparkle Dream',
    nameAr: 'باقة الأمل الفضية',
    price: '1,500 EGP',
    priceNum: 1500,
    guests: 'Up to 10 Kids',
    featuresEn: [
      '2 Hours All-Zone Access',
      'Juice Boxes & Snack Popcorn',
      'Dedicated Party Host',
      'Digital Birthday Invitations'
    ],
    featuresAr: [
      'ساعتان دخول لجميع مناطق الألعاب',
      'علب عصير وفشار للأطفال',
      'مضيف حفلات خاص',
      'دعوات إلكترونية للحفل'
    ],
    popular: false,
    badge: 'Basic Fun'
  },
  {
    id: 'gold',
    nameEn: 'Super Star Celebration',
    nameAr: 'الباقة الذهبية الابطال',
    price: '2,800 EGP',
    priceNum: 2800,
    guests: 'Up to 20 Kids',
    featuresEn: [
      '3 Hours Unlimited Play',
      'Kids Meal (Nuggets/Pizza + Fries)',
      'Custom Theme Backdrop & Balloons',
      'Mascot Character Appearance',
      'Gift Bag for Every Child'
    ],
    featuresAr: [
      '٣ ساعات لعب لا محدود',
      'وجبات أطفال (ناجتس/بيتزا + بطاطس)',
      'تزيين بالونات وديكور ثيم خاص',
      'حضور شخصية كرتونية (ماسكوت)',
      'هدية خاصة لكل طفل'
    ],
    popular: true,
    badge: 'Most Popular ⭐'
  },
  {
    id: 'diamond',
    nameEn: 'Ultimate Dream VIP',
    nameAr: 'الباقة الماسية الـ VIP',
    price: '4,500 EGP',
    priceNum: 4500,
    guests: 'Up to 35 Kids',
    featuresEn: [
      'Full Private Area Reservation (3 Hrs)',
      'Full Meal & Drinks for All Kids',
      'Custom 2-Tier Birthday Cake',
      'Photographer & Video Highlights',
      'Face Painting & Balloon Animals',
      'VIP Surprise Gift for Birthday Child'
    ],
    featuresAr: [
      'حجز كامل للمنطقة الخاصة (٣ ساعات)',
      'وجبات كاملة ومشروبات لجميع الأطفال',
      'كعكة عيد ميلاد طبقتين حسب الطلب',
      'مصور محترف وتغطية فيديو',
      'رسم على الوجه وتشكيل بالونات',
      'هدية مفاجأة فاخرة لصاحب العيد'
    ],
    popular: false,
    badge: 'VIP Full Experience'
  }
];
