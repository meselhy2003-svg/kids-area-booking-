/**
 * Mock Media, Gallery, 360 Tour, and Banner Assets Data
 */

export const heroBannerSlides = {
  'kids-area': [
    {
      titleEn: 'Kids Area',
      subtitleEn: 'Little Adventurers Big Smiles!',
      titleAr: 'منطقة الأطفال',
      subtitleAr: 'مغامرات صغيرة وسعادة كبيرة!',
      badge: 'Play Explore Learn Together!',
      bgGradient: 'linear-gradient(135deg, #0b2533 0%, #104252 60%, #195b68 100%)'
    },
    {
      titleEn: 'Sensory Wonder',
      subtitleEn: 'Colors, Shapes & Joyful Play!',
      titleAr: 'عالم الاستكشاف',
      subtitleAr: 'ألوان ومرح وتنمية مهارات!',
      badge: 'Safe & Sanitized!',
      bgGradient: 'linear-gradient(135deg, #08343f 0%, #0d5162 60%, #126e82 100%)'
    },
    {
      titleEn: 'Creative Zone',
      subtitleEn: 'Clay, Colors & Imagination!',
      titleAr: 'ورش الإبداع',
      subtitleAr: 'ألوان وتلوين وجبس مرح!',
      badge: 'Workshops Daily!',
      bgGradient: 'linear-gradient(135deg, #0a3a40 0%, #15626a 60%, #208792 100%)'
    }
  ],
  'fun-park': [
    {
      titleEn: 'Family Adventure',
      subtitleEn: 'Together moments & shared joy!',
      titleAr: 'مغامرات العائلة',
      subtitleAr: 'لحظات مشتركة وأجواء ساحرة!',
      badge: 'All Ages Welcome!',
      bgGradient: 'linear-gradient(135deg, #092c3a 0%, #0e4c5b 60%, #156d7f 100%)'
    },
    {
      titleEn: 'Fun Park',
      subtitleEn: 'world of fun, laughter, and endless smiles',
      titleAr: 'منطقة المرح',
      subtitleAr: 'عالم من المرح والضحك والابتسامات التي لا تنتهي',
      badge: 'Play Explore Learn Together!',
      bgGradient: 'linear-gradient(135deg, #082935 0%, #0d4653 60%, #136272 100%)'
    },
    {
      titleEn: 'Adrenaline Rides',
      subtitleEn: 'Bumper cars, speedway & arcade thrills!',
      titleAr: 'حلبات وحركات',
      subtitleAr: 'سباقات وتصادم وألعاب حماسية!',
      badge: 'Unlimited Smiles!',
      bgGradient: 'linear-gradient(135deg, #072a31 0%, #0b515d 60%, #127a89 100%)'
    }
  ],
  'challenge': [
    {
      titleEn: 'Challenge Zone',
      subtitleEn: 'Arcade thrills, VR simulators & high scores!',
      titleAr: 'منطقة التحدي والآركيد',
      subtitleAr: 'ألعاب فيديو، سباقات وواقع افتراضي!',
      badge: 'Level Up Your Game!',
      bgGradient: 'linear-gradient(135deg, #0c2033 0%, #143e5c 60%, #1d5f8a 100%)'
    }
  ],
  'adventure': [
    {
      titleEn: 'Adventure High Ropes',
      subtitleEn: 'Suspension bridges, ziplines & auto-belay climbing!',
      titleAr: 'منطقة المغامرات والتسلق',
      subtitleAr: 'جسور معلقة، انزلاق حر وجدران تسلق آمنة!',
      badge: 'Conquer The Heights!',
      bgGradient: 'linear-gradient(135deg, #092b2f 0%, #104f55 60%, #1b7e88 100%)'
    }
  ]
};

export const vibesGallery = [
  [
    { src: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png', title: 'Ball Pit Joy', className: 'h-slide' },
    { src: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png', title: 'Rope Course Adventure', className: 'h-ropes' },
    { src: '/photo/kid-area-pic/Image.png', title: 'Cafe Treats & Shakes', className: 'h-cafe' }
  ],
  [
    { src: '/photo/kid-area-pic/Family celebrating victory at skeeball.png', title: 'Skeeball High Scores', className: 'h-skeeball' },
    { src: '/photo/kid-area-pic/Classic illuminated carousel ride.png', title: 'Illuminated Carousel', className: 'h-carousel' },
    { src: '/photo/kid-area-pic/Photo 8_ Neon Air Hockey.png', title: 'Neon Arcade Battle', className: 'h-airhockey' }
  ],
  [
    { src: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png', title: 'VR Arena Squad', className: 'h-vr' },
    { src: '/photo/kid-area-pic/Family birthday party celebration with cake.png', title: 'Birthday Milestones', className: 'h-birthday' },
    { src: '/photo/kid-area-pic/toddler-rainbow-slide.png', title: 'Little Explorers Slide', className: 'h-toddler' }
  ]
];

export const virtualTourData = {
  id: 'dome-360',
  title: 'Play Zone Virtual Tour',
  titleAr: 'جولة افتراضية ٣٦٠ درجة',
  mainPanorama: '/photo/kid-area-pic/dome-360.png',
  fallbackPanorama: '/photo/kid-area-pic/360 Virtual Dome Card (~32% width_ 4 columns).png',
  zones: [
    { id: 'kids-area', label: 'Kids Area', targetTab: 'kids-area' },
    { id: 'fun-park', label: 'Fun Park', targetTab: 'fun-park' },
    { id: 'challenge', label: 'Arcade VR', targetTab: 'challenge' },
    { id: 'adventure', label: 'High Ropes', targetTab: 'adventure' }
  ]
};
