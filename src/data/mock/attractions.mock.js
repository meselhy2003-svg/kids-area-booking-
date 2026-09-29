/**
 * Mock Attractions & Play Zones Data
 * Detailed listings for rides, ball pits, climbing courses, and interactive VR areas.
 */

export const zoneAttractions = {
  'kids-area': [
    {
      id: 'ball-pit',
      zone: 'kids-area',
      titleEn: 'Ball Pit',
      titleAr: 'مسبح الكرات',
      img: '/photo/kid-area-pic/explore-ballpit-clean.png',
      fallbackImg: '/photo/kid-area-pic/kids-ball-pit-slide.png',
      desc: 'Giant soft ball pit with safe slides, tunnels, and gentle climbing cushions.',
      ageRange: 'Ages 1 - 4',
      safetyFeatures: ['Soft foam padding', 'Anti-bacterial sanitized balls', 'Full staff supervision']
    },
    {
      id: 'soft-play',
      zone: 'kids-area',
      titleEn: 'Soft Play Maze',
      titleAr: 'مناطق اللعب الناعمة',
      img: '/photo/kid-area-pic/explore-softplay-clean.png',
      fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png',
      desc: 'Multi-level soft maze designed for toddlers to explore balance and coordination.',
      ageRange: 'Ages 1 - 5',
      safetyFeatures: ['Reinforced netting', 'Impact absorbing floors', 'Low-height challenges']
    },
    {
      id: 'art-workshop',
      zone: 'kids-area',
      titleEn: 'Art Workshop',
      titleAr: 'ورش الرسم والألوان',
      img: '/photo/kid-area-pic/explore-artworkshop-clean.png',
      fallbackImg: '/photo/kid-area-pic/classic-carousel.png',
      desc: 'Creative corner for gypsum painting, coloring, sand art, and hands-on crafts.',
      ageRange: 'All Ages',
      safetyFeatures: ['Non-toxic washable colors', 'Child-safe utensils', 'Dedicated craft instructors']
    }
  ],
  'fun-park': [
    {
      id: 'fun-carousel',
      zone: 'fun-park',
      titleEn: 'Grand Carousel',
      titleAr: 'الدوامة المضيئة',
      img: '/photo/kid-area-pic/Classic illuminated carousel ride.png',
      fallbackImg: '/photo/kid-area-pic/Classic illuminated carousel ride.png',
      desc: 'Classic illuminated musical carousel horses with rotating warm lighting.',
      ageRange: 'Ages 3 - 12',
      safetyFeatures: ['Safety harness belts', 'Soft gentle deceleration', 'Operator controlled']
    },
    {
      id: 'fun-bumper-cars',
      zone: 'fun-park',
      titleEn: 'Family Bumper Cars',
      titleAr: 'سيارات التصادم العائلية',
      img: '/photo/kid-area-pic/family-bumper-cars.png',
      fallbackImg: '/photo/kid-area-pic/family-bumper-cars.png',
      desc: 'Shock-absorbing dual-seater electric bumper cars with high-energy track music.',
      ageRange: 'Ages 4 - 14',
      safetyFeatures: ['Rubber perimeter buffer', 'Seatbelts', 'Automatic emergency power cut']
    },
    {
      id: 'fun-trampoline',
      zone: 'fun-park',
      titleEn: 'Trampoline Sky Jump',
      titleAr: 'عالم الترامبولين والقفز',
      img: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png',
      fallbackImg: '/photo/kid-area-pic/Kids sliding into colorful ball pit.png',
      desc: 'Elastic trampoline arenas with soft landing foam cubes and basketball dunk rings.',
      ageRange: 'Ages 4 - 12',
      safetyFeatures: ['Spring covers & pads', 'Grip socks required', '1 child per trampoline grid']
    }
  ],
  'challenge': [
    {
      id: 'vr-arena',
      zone: 'challenge',
      titleEn: 'VR Arena Simulator',
      titleAr: 'حلبة الواقع الافتراضي',
      img: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      fallbackImg: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      desc: 'Immersive multiplayer 360 virtual reality goggles and motion feedback rigs.',
      ageRange: 'Ages 6+',
      safetyFeatures: ['Motion boundary guardians', 'Clean silicon face-cushions', 'Assisted guide']
    },
    {
      id: 'laser-tactical',
      zone: 'challenge',
      titleEn: 'Laser Tactical Arena',
      titleAr: 'متاهة الليزر التكتيكية',
      img: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      fallbackImg: '/photo/kid-area-pic/Laser & Tactical Arena.png',
      desc: 'Neon glow maze arena with infrared sensor target vests and team scoreboards.',
      ageRange: 'Ages 6 - 16',
      safetyFeatures: ['Eye-safe Class-1 infrared light', 'Padded maze corners', 'Low ambient lighting']
    },
    {
      id: 'air-hockey-neon',
      zone: 'challenge',
      titleEn: 'Neon Air Hockey Battle',
      titleAr: 'هوكي الهواء النيون',
      img: '/photo/kid-area-pic/Photo 8_ Neon Air Hockey.png',
      fallbackImg: '/photo/kid-area-pic/Air Hockey Table.png',
      desc: 'High velocity airflow table with glowing neon pucks and digital score tracking.',
      ageRange: 'All Ages',
      safetyFeatures: ['Rounded puck edges', 'Comfort grip mallets']
    }
  ],
  'adventure': [
    {
      id: 'climbing',
      zone: 'adventure',
      title: 'Climbing',
      titleEn: 'Vertical Rock Climbing',
      titleAr: 'تسلق الجدران والصخور',
      image: '/photo/kid-area-pic/ball-pit-thumb.png',
      img: '/photo/kid-area-pic/ball-pit-thumb.png',
      fallback: '/photo/kid-area-pic/explore-ballpit.png',
      fallbackImg: '/photo/kid-area-pic/explore-ballpit.png',
      desc: 'Tested auto-belay vertical rock faces with multiple difficulty grades.',
      ageRange: 'Ages 5 - 16',
      safetyFeatures: ['Certified auto-belay systems', 'Double-strap helmets', 'Padded fall mattresses']
    },
    {
      id: 'high-ropes',
      zone: 'adventure',
      title: 'High Ropes Suspension',
      titleEn: 'Sky High Ropes Course',
      titleAr: 'مسار الحبال المعلقة',
      image: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png',
      img: '/photo/kid-area-pic/Young girl balancing on high rope suspension bridge.png',
      fallback: '/photo/kid-area-pic/explore-softplay.png',
      fallbackImg: '/photo/kid-area-pic/explore-softplay.png',
      desc: 'Multi-obstacle rope bridge balancing adventure suspended 3 meters above ground.',
      ageRange: 'Ages 6 - 15',
      safetyFeatures: ['Continuous lifeline rail', 'Full-body harnesses', 'Lead marshal supervision']
    },
    {
      id: 'adventure-art',
      zone: 'adventure',
      title: 'Art Workshop',
      titleEn: 'Art Workshop & Clay',
      titleAr: 'ورش الرسم والألوان والفخار',
      image: '/photo/kid-area-pic/art-workshop-thumb.png',
      img: '/photo/kid-area-pic/art-workshop-thumb.png',
      fallback: '/photo/kid-area-pic/explore-artworkshop.png',
      fallbackImg: '/photo/kid-area-pic/explore-artworkshop.png',
      desc: 'Creative workshops, guided pottery, and colorful art creation.',
      ageRange: 'All Ages',
      safetyFeatures: ['Non-toxic washable colors', 'Aprons provided']
    }
  ]
};

export const liveParkStatus = {
  currentCapacity: 42,
  maxCapacity: 100,
  occupancyPercentage: 42,
  statusTextEn: 'Normal Flow - No Queue',
  statusTextAr: 'حركة طبيعية - لا يوجد انتظار',
  openingHours: '10:00 AM - 11:30 PM Daily',
  openNow: true,
  currentWaitTimeMins: 5
};
