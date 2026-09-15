export const translations = {
  en: {
    brandName: "American Dream",
    brandSubtitle: "Ismailia Kids Park",
    nav: {
      lobby: "Lobby",
      menu: "Menu",
      play: "Play",
      events: "Events"
    },
    hero: {
      reception: "Reception",
      entry: "ENTRY",
      exit: "EXIT",
      liveStatus: "Live Park Capacity: 42 / 100 Kids",
      openHours: "Open Today: 10:00 AM - 11:00 PM",
      bookTickets: "Buy Wristband",
      explorePark: "Explore Play Zones",
      boySpeech: "Hi! Welcome to American Dream Ismailia! Click Entry to check in! 🎈",
      girlSpeech: "Hey there! Are you ready to play, bounce, and eat yummy treats? 🍕✨"
    },
    menuSection: {
      title: "Kids & Family Yummy Snacks",
      subtitle: "Freshly prepared meals, drinks, and sweet treats for energetic kids!",
      all: "All Items",
      meals: "Kids Meals",
      drinks: "Drinks & Smoothies",
      sweets: "Sweet Treats",
      addToCart: "Add to Order",
      cartTitle: "Your Snack Box",
      checkout: "Place Order at Counter"
    },
    playSection: {
      title: "Fun Play Zones & Activities",
      subtitle: "Safe, clean, and super exciting zones tailored for every age group!",
      ageTag: "Age",
      capacity: "Max Capacity",
      included: "Included in Wristband"
    },
    eventsSection: {
      title: "Unforgettable Birthday Parties",
      subtitle: "Make your child's birthday magical with custom themes, games, and delicious cake!",
      selectPackage: "Book This Party",
      customParty: "Custom Party Request"
    },
    footer: {
      aboutUs: "About Us",
      contact: "Contact",
      safetyRules: "Safety Rules",
      privacyPolicy: "Privacy Policy",
      rights: "© 2026 American Dream Ismailia. All rights reserved."
    }
  },
  ar: {
    brandName: "أمريكان دريم",
    brandSubtitle: "منطقة ألعاب الإسماعيلية",
    nav: {
      lobby: "الرئيسية",
      menu: "قائمة الطعام",
      play: "الألعاب",
      events: "الحفلات"
    },
    hero: {
      reception: "الاستقبال",
      entry: "دخول",
      exit: "خروج",
      liveStatus: "السعة الحالية: ٤٢ / ١٠٠ طفل",
      openHours: "مفتوح اليوم: ١٠:٠٠ ص - ١١:٠٠ م",
      bookTickets: "حجز تذكرة / إسورة",
      explorePark: "استكشف الألعاب",
      boySpeech: "أهلاً بك في أمريكان دريم الإسماعيلية! اضغط على الدخول! 🎈",
      girlSpeech: "مرحباً! هل أنت مستعد للمرح والمغامرة والوجبات اللذيذة؟ 🍕✨"
    },
    menuSection: {
      title: "الوجبات والمأكولات اللذيذة",
      subtitle: "وجبات طازجة ومشروبات منعشة وحلويات مميزة للأطفال والعائلات!",
      all: "الكل",
      meals: "وجبات الأطفال",
      drinks: "المشروبات",
      sweets: "الحلويات",
      addToCart: "أضف للطلب",
      cartTitle: "صندوق الوجبة",
      checkout: "إتمام الطلب في الكاونتر"
    },
    playSection: {
      title: "مناطق الألعاب والمغامرة",
      subtitle: "مناطق آمنة، نظيفة وممتعة للغاية مصممة لكل الفئات العمرية!",
      ageTag: "العمر",
      capacity: "السعة القصوى",
      included: "مشمول بالتذكرة"
    },
    eventsSection: {
      title: "حفلات أعياد الميلاد",
      subtitle: "اجعل عيد ميلاد طفلك ذكراً لا تُنسى مع العروض الخاصة والكعك والألعاب!",
      selectPackage: "احجز الباقة الان",
      customParty: "طلب حفلة خاصة"
    },
    footer: {
      aboutUs: "من نحن",
      contact: "تواصل معنا",
      safetyRules: "قواعد السلامة",
      privacyPolicy: "سياسة الخصوصية",
      rights: "© ٢٠٢٦ أمريكان دريم الإسماعيلية. جميع الحقوق محفوظة."
    }
  }
};

export const menuItems = [
  {
    id: 1,
    category: "meals",
    nameEn: "Super Kid Chicken Nuggets",
    nameAr: "وجبة ناجتس الدجاج الابطال",
    descEn: "6 pcs golden nuggets + french fries + apple juice",
    descAr: "٦ قطع ناجتس مقرمشة + بطاطس + عصير تفاح",
    price: 120,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    category: "meals",
    nameEn: "Mini Dream Cheeseburger",
    nameAr: "ميني تشيز برجر دريم",
    descEn: "Juicy beef mini patty + cheese + crispy fries",
    descAr: "برجر لحم بقري طازج + جبنة + بطاطس مقرمشة",
    price: 135,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    category: "meals",
    nameEn: "Cheesy Kids Pizza Slice",
    nameAr: "شريحة بيتزا الموزاريلا",
    descEn: "Rich mozzarella cheese pizza slice with fresh tomato sauce",
    descAr: "شريحة بيتزا بجبن الموزاريلا الغنية وصلصة الطماطم",
    price: 95,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    category: "drinks",
    nameEn: "Fresh Mango Sunshine Smoothie",
    nameAr: "سموذي المانجو الطازج",
    descEn: "100% real fresh mango juice topped with vanilla drizzle",
    descAr: "عصير مانجو طازج ١٠٠٪ مع لمسة فانيليا",
    price: 65,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    category: "drinks",
    nameEn: "Berry Blast Milkshake",
    nameAr: "ميلك شيك التوت البري",
    descEn: "Creamy strawberry & blueberry blend with whipped cream",
    descAr: "مزيج الفرولة والتوت البري مع الكريمة المخفوقة",
    price: 75,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    category: "sweets",
    nameEn: "Rainbow Ice Cream Sundae",
    nameAr: "آيس كريم رينبو صنداي",
    descEn: "3 scoops vanilla, chocolate & strawberry with sprinkles",
    descAr: "٣ بولات آيس كريم متنوعة مع السكر الملون",
    price: 70,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    category: "sweets",
    nameEn: "Caramel Butter Popcorn Bucket",
    nameAr: "دلو بوب كورن بالكراميل",
    descEn: "Freshly popped warm popcorn with rich caramel coating",
    descAr: "فشار طازج وساخن بصلصة الكراميل الغنية",
    price: 55,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=80"
  }
];

export const playZones = [
  {
    id: "toddler",
    titleEn: "Toddler Paradise",
    titleAr: "منطقة الأطفال الصغار",
    age: "1 - 4 Years",
    capacity: "20 Kids",
    descEn: "Soft padded play mats, foam block building, sensory slides, and mini ball pit designed for maximum safety.",
    descAr: "أرضيات وسائد ناعمة، مكعبات إسفنجية، زحاليق حسية وحوض كرات صغير مخصص لأمان الصغار.",
    iconName: "Baby",
    color: "#ff7675",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "trampoline",
    titleEn: "Trampoline Sky Arena",
    titleAr: "عالم الترامبولين والقفز",
    age: "4 - 12 Years",
    capacity: "25 Kids",
    descEn: "High bounce trampolines, foam pit jump zone, and slam dunk basketball hoops.",
    descAr: "ترامبولين عالي المرونة، حفرة مكعبات الإسفنج، وسلال كرة السلة للقفز العالي.",
    iconName: "Sparkles",
    color: "#0984e3",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "ballpit",
    titleEn: "Giant Ball Pit Jungle",
    titleAr: "متاهة الكرات الملونة",
    age: "2 - 10 Years",
    capacity: "30 Kids",
    descEn: "Over 50,000 colorful balls, spiral tube slides, climbing obstacles, and air cannons.",
    descAr: "أكثر من ٥٠,٠٠٠ كرة ملونة، زحاليق حلزونية، عقبات تسلق ومدافع كرات هواء.",
    iconName: "Smile",
    color: "#fdcb6e",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "arcade",
    titleEn: "VR & Arcade Funland",
    titleAr: "صالة العاب الكترونية و VR",
    age: "6 - 14 Years",
    capacity: "15 Kids",
    descEn: "Virtual reality games, racing simulators, air hockey tables, and prize machines.",
    descAr: "ألعاب الواقع الافتراضي، محاكاة السباقات، الهوكي الهوائي وماكينات الجوائز.",
    iconName: "Gamepad2",
    color: "#6c5ce7",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80"
  }
];

export const eventPackages = [
  {
    id: "silver",
    nameEn: "Sparkle Dream",
    nameAr: "باقة الأمل الفضية",
    price: "1,500 EGP",
    guests: "Up to 10 Kids",
    featuresEn: [
      "2 Hours All-Zone Access",
      "Juice Boxes & Snack Popcorn",
      "Dedicated Party Host",
      "Digital Birthday Invitations"
    ],
    featuresAr: [
      "ساعتان دخول لجميع مناطق الألعاب",
      "علب عصير وفشار للأطفال",
      "مضيف حفلات خاص",
      "دعوات إلكترونية للحفل"
    ],
    popular: false,
    badge: "Basic Fun"
  },
  {
    id: "gold",
    nameEn: "Super Star Celebration",
    nameAr: "الباقة الذهبية الابطال",
    price: "2,800 EGP",
    guests: "Up to 20 Kids",
    featuresEn: [
      "3 Hours Unlimited Play",
      "Kids Meal (Nuggets/Pizza + Fries)",
      "Custom Theme Backdrop & Balloons",
      "Mascot Character Appearance",
      "Gift Bag for Every Child"
    ],
    featuresAr: [
      "٣ ساعات لعب لا محدود",
      "وجبات أطفال (ناجتس/بيتزا + بطاطس)",
      "تزيين بالونات وديكور ثيم خاص",
      "حضور شخصية كرتونية (ماسكوت)",
      "هدية خاصة لكل طفل"
    ],
    popular: true,
    badge: "Most Popular ⭐"
  },
  {
    id: "diamond",
    nameEn: "Ultimate Dream VIP",
    nameAr: "الباقة الماسية الـ VIP",
    price: "4,500 EGP",
    guests: "Up to 35 Kids",
    featuresEn: [
      "Full Private Area Reservation (3 Hrs)",
      "Full Meal & Drinks for All Kids",
      "Custom 2-Tier Birthday Cake",
      "Photographer & Video Highlights",
      "Face Painting & Balloon Animals",
      "VIP Surprise Gift for Birthday Child"
    ],
    featuresAr: [
      "حجز كامل للمنطقة الخاصة (٣ ساعات)",
      "وجبات كاملة ومشروبات لجميع الأطفال",
      "كعكة عيد ميلاد طبقتين حسب الطلب",
      "مصور محترف وتغطية فيديو",
      "رسم على الوجه وتشكيل بالونات",
      "هدية مفاجأة فاخرة لصاحب العيد"
    ],
    popular: false,
    badge: "VIP Full Experience"
  }
];
