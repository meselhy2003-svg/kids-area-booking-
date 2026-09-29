/**
 * Mock Tickets, Passes & Offers Data
 * Used across Mobile and Desktop views for Kids Area, Fun Park, Challenge & Adventure.
 */

export const kidsAreaOffers = [
  {
    id: 'single-midweek',
    zone: 'kids-area',
    titleEn: 'Single Midweek',
    titleAr: 'تذكرة فردية منتصف الأسبوع',
    title: 'Single Midweek',
    saveBadge: 'Save 85 EGP',
    badgeColor: 'badge-cyan',
    age: 'Ages 1 - 3',
    features: [
      'All-day entry + 1 Package',
      'جبس وألوان'
    ],
    bundle: 'All-day entry + 1 Package جبس وألوان',
    extra: null,
    price: 'EGP 100',
    priceNum: 100,
    origPrice: 'EGP 185',
    oldPrice: 185,
    thumb: '/photo/kid-area-pic/graphic-composition.png',
    image: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png'
  },
  {
    id: 'sisters-midweek',
    zone: 'kids-area',
    titleEn: 'Sisters Midweek',
    titleAr: 'تذكرة الأختين منتصف الأسبوع',
    title: 'Sisters Midweek',
    saveBadge: 'Save 150 EGP',
    badgeColor: 'badge-blue',
    age: 'Ages 1 - 3',
    features: [
      'All-day entry for 2 kids'
    ],
    bundle: 'All-day entry for 2 kids',
    extra: null,
    price: 'EGP 150',
    priceNum: 150,
    origPrice: 'EGP 300',
    oldPrice: 300,
    thumb: '/photo/kid-area-pic/graphic-composition.png',
    image: '/photo/kid-area-pic/Classic illuminated carousel ride.png'
  },
  {
    id: 'single-weekend',
    zone: 'kids-area',
    titleEn: 'Single Weekend',
    titleAr: 'تذكرة فردية نهاية الأسبوع',
    title: 'Single Weekend',
    saveBadge: 'Save 35 EGP',
    badgeColor: 'badge-cyan',
    age: 'Ages 1 - 3',
    features: [
      'All-day entry + 1 Package',
      'جبس وألوان',
      '+ Free coloring workshop + Party included'
    ],
    bundle: 'All-day entry + 1 Package جبس وألوان',
    extra: '+ Free coloring workshop + Party included',
    price: 'EGP 150',
    priceNum: 150,
    origPrice: 'EGP 185',
    oldPrice: 185,
    thumb: '/photo/kid-area-pic/graphic-composition.png',
    image: '/photo/kid-area-pic/kids-ball-pit-slide.png'
  },
  {
    id: 'sisters-weekend',
    zone: 'kids-area',
    titleEn: 'Sisters Weekend',
    titleAr: 'تذكرة الأختين نهاية الأسبوع',
    title: 'Sisters Weekend',
    saveBadge: 'Save 120 EGP',
    badgeColor: 'badge-blue',
    age: 'Ages 1 - 3',
    features: [
      'Entry for 2 kids + 2 Package',
      'جبس وألوان',
      '+ Free coloring workshop + Party included'
    ],
    bundle: 'Entry for 2 kids + 2 Package جبس وألوان',
    extra: '+ Free coloring workshop + Party included',
    price: 'EGP 250',
    priceNum: 250,
    origPrice: 'EGP 370',
    oldPrice: 370,
    thumb: '/photo/kid-area-pic/graphic-composition.png',
    image: '/photo/kid-area-pic/Boy laughing playing with toys.png'
  }
];

export const funParkOffers = {
  weekend: [
    {
      id: 'fun-single-weekend-1',
      zone: 'fun-park',
      timing: 'weekend',
      titleEn: 'Single Weekend',
      titleAr: 'تذكرة فردية نهاية الأسبوع',
      saveBadge: 'Save 85 EGP',
      age: 'Ages 4 – 12',
      features: ['All-day entry + 2 Game(1 VR, 1 Basketball) + Party'],
      price: 'EGP 100',
      priceNum: 100,
      origPrice: 'EGP 185',
      thumb: '/photo/kid-area-pic/graphic-composition.png',
      image: '/photo/kid-area-pic/family-bumper-cars.png'
    },
    {
      id: 'fun-family-weekend',
      zone: 'fun-park',
      timing: 'weekend',
      titleEn: 'Family Weekend Duo',
      titleAr: 'تذكرة الثنائي نهاية الأسبوع',
      saveBadge: 'Save 150 EGP',
      age: 'Ages 4 – 12',
      features: ['Entry for 2 kids + 4 Games (2 VR, 2 Racing) + Party'],
      price: 'EGP 190',
      priceNum: 190,
      origPrice: 'EGP 340',
      thumb: '/photo/kid-area-pic/graphic-composition.png',
      image: '/photo/kid-area-pic/Classic illuminated carousel ride.png'
    }
  ],
  midweek: [
    {
      id: 'fun-single-midweek',
      zone: 'fun-park',
      timing: 'midweek',
      titleEn: 'Single Midweek Fun',
      titleAr: 'تذكرة منتصف الأسبوع للمرح',
      saveBadge: 'Save 90 EGP',
      age: 'Ages 4 – 12',
      features: ['All-day entry + 1 VR Game + 1 Arcade Token'],
      price: 'EGP 90',
      priceNum: 90,
      origPrice: 'EGP 180',
      thumb: '/photo/kid-area-pic/graphic-composition.png',
      image: '/photo/kid-area-pic/family-bumper-cars.png'
    },
    {
      id: 'fun-sisters-midweek',
      zone: 'fun-park',
      timing: 'midweek',
      titleEn: 'Sisters Midweek Fun',
      titleAr: 'تذكرة الأختين منتصف الأسبوع',
      saveBadge: 'Save 160 EGP',
      age: 'Ages 4 – 12',
      features: ['Entry for 2 kids + 2 VR Games + 2 Arcade Tokens'],
      price: 'EGP 160',
      priceNum: 160,
      origPrice: 'EGP 320',
      thumb: '/photo/kid-area-pic/graphic-composition.png',
      image: '/photo/kid-area-pic/Classic illuminated carousel ride.png'
    }
  ]
};

export const challengeGameTickets = [
  {
    id: 'motorcycle-1',
    zone: 'challenge',
    titleEn: 'Motorcycle Racing',
    titleAr: 'سباق الدراجات النارية',
    price: 'EGP 40 / ticket',
    priceNum: 40,
    img: '/photo/kid-area-pic/game-motorcycle-arcade.png',
    fallbackImg: '/photo/kid-area-pic/game-motorcycle-arcade.png'
  },
  {
    id: 'airhockey-1',
    zone: 'challenge',
    titleEn: 'Air Hockey',
    titleAr: 'هوكي الهواء المضيء',
    price: 'EGP 50 / 30 min',
    priceNum: 50,
    img: '/photo/kid-area-pic/game-air-hockey-table.png',
    fallbackImg: '/photo/kid-area-pic/Air Hockey Table.png'
  },
  {
    id: 'billiards',
    zone: 'challenge',
    titleEn: 'Billiards',
    titleAr: 'بلياردو المحترفين',
    price: 'EGP 50 / 30 min',
    priceNum: 50,
    img: '/photo/kid-area-pic/game-billiards-pool.png',
    fallbackImg: '/photo/kid-area-pic/Billiards Pool Table.png'
  },
  {
    id: 'pingpong',
    zone: 'challenge',
    titleEn: 'Ping Pong',
    titleAr: 'تنس طاولة الأبطال',
    price: 'EGP 40 / 30 min',
    priceNum: 40,
    img: '/photo/kid-area-pic/game-ping-pong-table.png',
    fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png'
  },
  {
    id: 'boxing-game',
    zone: 'challenge',
    titleEn: 'Power Boxer Machine',
    titleAr: 'ماكينة قياس قوة اللكم',
    price: 'EGP 30 / 3 punches',
    priceNum: 30,
    img: '/photo/kid-area-pic/game-boxing-punch.png',
    fallbackImg: '/photo/kid-area-pic/game-motorcycle-arcade.png'
  },
  {
    id: 'skeeball-game',
    zone: 'challenge',
    titleEn: 'Classic Skeeball',
    titleAr: 'سكي بول الجوائز الكلاسيكية',
    price: 'EGP 25 / game',
    priceNum: 25,
    img: '/photo/kid-area-pic/game-skeeball-classic.png',
    fallbackImg: '/photo/kid-area-pic/Family celebrating victory at skeeball.png'
  }
];

export const adventureGameTickets = [
  {
    id: 'pubg',
    zone: 'adventure',
    title: 'PUBG',
    titleEn: 'PUBG Tactical Simulator',
    titleAr: 'محاكي ببجي التكتيكي',
    priceText: 'EGP 40 / ticket',
    price: 40,
    priceNum: 40,
    image: '/photo/kid-area-pic/Laser & Tactical Arena.png',
    fallback: '/photo/kid-area-pic/photo-vr-friends.png'
  },
  {
    id: 'bamber-ball',
    zone: 'adventure',
    title: 'Bamber Ball',
    titleEn: 'Bamber Ball Arena',
    titleAr: 'حلبة بامبر بول الكروية',
    priceText: 'EGP 50 / 30 min',
    price: 50,
    priceNum: 50,
    image: '/photo/kid-area-pic/Air Hockey Table.png',
    fallback: '/photo/kid-area-pic/Fast-Paced Air Hockey.png'
  },
  {
    id: 'car-bamber',
    zone: 'adventure',
    title: 'Car Bamber',
    titleEn: 'Bumper Cars Clash',
    titleAr: 'سيارات التصادم الكهربائية',
    priceText: 'EGP 50 / 30 min',
    price: 50,
    priceNum: 50,
    image: '/photo/kid-area-pic/Billiards Pool Table.png',
    fallback: '/photo/kid-area-pic/Bumper Collision Bay.png'
  }
];
