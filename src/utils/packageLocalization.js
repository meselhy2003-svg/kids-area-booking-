/**
 * Localization helper for packages, passes, titles, subtitles, badges, and features.
 */

export function getLocalizedFeature(feat, isArabic) {
  if (!feat) return '';
  if (typeof feat === 'object') {
    if (isArabic) return feat.labelAr || feat.label || feat.nameAr || feat.name || '';
    const enObj = feat.labelEn || feat.nameEn;
    if (enObj && !/[ء-ي]/.test(enObj)) return enObj;
    const arObj = feat.labelAr || feat.label || feat.nameAr || feat.name || '';
    return getLocalizedFeature(arObj, false);
  }
  const str = String(feat).trim();

  // If Arabic is desired
  if (isArabic) {
    return str;
  }

  // If already in pure English (no Arabic characters)
  if (!/[ء-ي]/.test(str)) {
    return str;
  }

  // Exact dictionary mapping
  const dict = {
    // Passes & Tickets features
    'ورشة تلوين وجبس مجانية': 'Free Plaster & Coloring Workshop',
    'ورشة تلوين وجبس': 'Plaster & Coloring Workshop',
    'ورشة تلوين مجانية': 'Free Coloring Workshop',
    'تلوين وجبس': 'Plaster & Coloring Workshop',
    'جبس وألوان': 'Plaster & Color Art Workshop',
    'ورشة تلوين': 'Coloring Workshop',
    'تلوين وجبس مجاني': 'Free Plaster & Coloring',
    'دخول مجاني للتلوين والحفلات': 'Free Coloring & Party Access',

    'رمزين لألعاب الأركيد الإلكترونية': '2 Electronic Arcade Game Tokens',
    'رمزين لألعاب الأركيد': '2 Arcade Game Tokens',
    'رمزين ألعاب أركيد': '2 Arcade Game Tokens',
    'رمزين أركيد': '2 Arcade Game Tokens',
    '2 رمز آركيد مشمول': '2 Arcade Tokens Included',
    '2 رمز ألعاب الأركيد': '2 Arcade Game Tokens Included',
    'رموز ألعاب أركيد': 'Arcade Game Tokens',
    'رموز أركيد': 'Arcade Tokens',
    'رمز أركيد': '1 Arcade Token',
    'بطاقة ألعاب مشحونة بـ 50 نقطة مجاناً': 'Game Card loaded with 50 free points',
    'بطاقة ألعاب مشحونة بـ 50 نقطة': 'Game Card loaded with 50 points',
    'بطاقة ألعاب مشحونة': 'Loaded Game Card',
    '4 بطاقات ألعاب مشحونة': '4 Loaded Arcade Game Cards',

    'جوارب مضادة للانزلاق مجاناً عند الاستقبال': 'Free Non-Slip Grip Socks at Reception',
    'جوارب مانعة للانزلاق مجاناً عند الاستقبال': 'Free Non-Slip Grip Socks at Reception',
    'جوارب مضادة للانزلاق': 'Anti-Slip Grip Socks',
    'جوارب مانعة للانزلاق': 'Anti-Slip Grip Socks',
    'جوارب مضادة للانزلاق مجاناً': 'Free Anti-Slip Grip Socks',
    'جوارب مانعة للانزلاق مجاناً': 'Free Anti-Slip Grip Socks',

    'دخول طوال اليوم + باقة واحدة': 'All-Day Entry + 1 Package',
    'دخول طوال اليوم + لعبتين إضافيتين': 'All-Day Entry + 2 Extra Games',
    'دخول طوال اليوم + لعبتين': 'All-Day Entry + 2 Extra Games',
    'دخول طوال اليوم + 2 لعبة إضافية': 'All-Day Entry + 2 Extra Games',
    'دخول طوال اليوم + لعبة إضافية': 'All-Day Entry + 1 Extra Game',
    'دخول طوال اليوم + لعبة واحدة': 'All-Day Entry + 1 Extra Game',
    'دخول طوال اليوم': 'All-Day Entry',

    'لعبة واقع افتراضي + لعبة كرة سلة': '1 VR Game + 1 Basketball Game',
    '1 واقع افتراضي + 1 كرة سلة': '1 VR + 1 Basketball Game',
    'واقع افتراضي + كرة سلة': 'VR Game + Basketball Game',
    'لعبة الواقع الافتراضي + لعبة كرة السلة': 'VR Game + Basketball Game',
    'لعبة واقع افتراضي': '1 VR Game',
    'لعبة كرة سلة': '1 Basketball Game',

    'حضور مجاني لحفلة المسرح وعرض الفقاقيع': 'Free Theatre Show & Bubble Show Access',
    'حضور حفلة المسرح وعرض الفقاقيع': 'Theatre Show & Bubble Show Access',
    'حفلة المسرح وعرض الفقاقيع': 'Theatre Show & Bubble Show',
    'عرض الفقاقيع والمسرح': 'Bubble Show & Theatre',
    'عرض المسرح والفقاقيع': 'Theatre & Bubble Show',
    'حضور مجاني لحفلة المسرح': 'Free Theatre Show Access',
    'عرض الفقاقيع': 'Bubble Show',

    'سيارات التصادم الكهربائية': 'Electric Bumper Cars',
    'محاكي ببجي التكتيكي': 'PUBG Tactical Simulator',
    'حلبة بامبر بول الكروية': 'Bubble Ball Arena',
    'دخول غير محدود لمنطقة المغامرات والترامبولين': 'Unlimited access to Adventure Zone & Trampoline',
    'دخول غير محدود لمنطقة المغامرات': 'Unlimited access to Adventure Zone',
    'يشمل سيارات التصادم وساحة الواقع الافتراضي VR': 'Includes Bumper Cars & VR Arena',
    'يشمل سيارات التصادم وساحة الواقع الافتراضي': 'Includes Bumper Cars & VR Arena',
    'وجبة أطفال كومبو مجانية من المطعم': 'Free Kids Combo Meal from Restaurant',
    'وجبة أطفال كومبو من المطعم': 'Kids Combo Meal from Restaurant',
    'وجبة أطفال كومبو': 'Free Kids Combo Meal',
    'دخول ساحة التحديات والعوائق والنينجا': 'Access to Obstacle Course & Ninja Arena',
    'جولتين تسلق جدار المغامرة الآمن': '2 Safe Climbing Wall Rounds',
    'جولة تسلق جدار المغامرة الآمن': '1 Safe Climbing Wall Round',
    'مشروب منعش مجاني من الكافيه': 'Free Refreshing Drink from Cafe',
    'مشروب مجاني من الكافيه': 'Free Drink from Cafe',
    'دخول كامل لـ 4 أفراد طوال اليوم': 'All-day full entry for 4 persons',
    'دخول لـ 4 أفراد طوال اليوم': 'All-day entry for 4 persons',
    '4 وجبات عائلية متكاملة من المطعم': '4 complete family meals from Restaurant',
    'خصم 20% على أي مشتريات إضافية': '20% discount on additional purchases',
    'خصم 15% على أي مشتريات إضافية': '15% discount on additional purchases',
    'خصم 10% على أي مشتريات إضافية': '10% discount on additional purchases',
    'سينما 9D التفاعلية': '9D Interactive Cinema',
    'سينما 9D': '9D Cinema',
    'ترامبولين للأطفال': 'Kids Trampoline',
    'منطقة ألعاب الأطفال الإسفنجية (سوفت بلاي)': 'Toddler Soft Play Area',
    'سوفت بلاي للأطفال': 'Kids Soft Play',
    'متاهة العوائق والتحدي': 'Obstacle & Challenge Maze',
    'جدار التسلق الحر': 'Free Climbing Wall',
    'ألعاب أركيد فيديو حديثة': 'Modern Arcade Video Games',
    'ألعاب الطاولة التنافسية (إير هوكي، بيبي فوت)': 'Air Hockey & Foosball Tables'
  };

  if (dict[str]) return dict[str];

  // Normalized key (strip commas, punctuation, extra spaces)
  const cleanKey = str.replace(/[،,.]/g, '').replace(/\s+/g, ' ').trim();
  if (dict[cleanKey]) return dict[cleanKey];

  // Check if it has pattern "Arabic (English)" or "English (Arabic)"
  const match = str.match(/^([^\(]+)\s*\((.+)\)$/);
  if (match) {
    const outside = match[1].trim();
    const inside = match[2].trim();
    if (/[a-zA-Z]/.test(inside)) return inside;
    if (/[a-zA-Z]/.test(outside)) return outside;
  }

  // Keyword / Heuristic Rules for flexible dynamic texts
  const s = str;
  if (s.includes('جبس') || s.includes('تلوين')) {
    if (s.includes('مجان')) return 'Free Plaster & Coloring Workshop';
    return 'Plaster & Coloring Workshop';
  }
  if (s.includes('أركيد') || s.includes('آركيد') || s.includes('رمز')) {
    if (s.includes('رمزين') || s.includes('2')) return '2 Arcade Game Tokens';
    return 'Arcade Game Tokens';
  }
  if (s.includes('جوارب') || s.includes('انزلاق') || s.includes('الانزلاق')) {
    if (s.includes('مجان')) return 'Free Non-Slip Grip Socks at Reception';
    return 'Anti-Slip Grip Socks';
  }
  if (s.includes('افتراضي') || s.includes('VR') || s.includes('كرة سلة')) {
    if (s.includes('كرة سلة') || s.includes('سلة')) return '1 VR Game + 1 Basketball Game';
    return 'Virtual Reality (VR) Experience';
  }
  if (s.includes('مسرح') || s.includes('فقاقيع')) {
    if (s.includes('مجان')) return 'Free Access to Theatre & Bubble Show';
    return 'Theatre & Bubble Show Access';
  }
  if (s.includes('طوال اليوم') || s.includes('دخول')) {
    if (s.includes('لعبتين') || s.includes('2')) return 'All-Day Entry + 2 Extra Games';
    if (s.includes('باقة') || s.includes('1')) return 'All-Day Entry + 1 Package';
    if (s.includes('4 أفراد') || s.includes('عائل')) return 'All-day full entry for 4 persons';
    if (s.includes('مغامر') || s.includes('ترامبولين')) return 'Unlimited access to Adventure Zone & Trampoline';
    if (s.includes('تحدي') || s.includes('عوائق')) return 'Access to Obstacle Course & Ninja Arena';
    return 'All-Day Full Access Entry';
  }
  if (s.includes('وجبة') || s.includes('كومبو') || s.includes('مطعم')) {
    if (s.includes('4')) return '4 Complete Family Meals from Restaurant';
    if (s.includes('مجان') || s.includes('أطفال')) return 'Free Kids Combo Meal from Restaurant';
    return 'Kids Combo Meal from Restaurant';
  }
  if (s.includes('تسلق')) {
    if (s.includes('جولتين') || s.includes('2')) return '2 Safe Climbing Wall Rounds';
    return 'Safe Climbing Wall Round';
  }
  if (s.includes('مشروب') || s.includes('كافيه')) {
    return 'Free Refreshing Drink from Cafe';
  }
  if (s.includes('خصم')) {
    const numMatch = s.match(/(\d+)%/);
    if (numMatch) return `${numMatch[1]}% discount on additional purchases`;
    return 'Special discount on additional purchases';
  }
  if (s.includes('سيارات التصادم')) {
    return 'Electric Bumper Cars';
  }
  if (s.includes('ببجي')) {
    return 'PUBG Tactical Simulator';
  }
  if (s.includes('بامبر بول')) {
    return 'Bubble Ball Arena';
  }
  if (s.includes('سينما')) {
    return '9D Interactive Cinema';
  }
  if (s.includes('سوفت بلاي')) {
    return 'Toddler Soft Play Area';
  }

  return str;
}

export function getLocalizedPackage(pkg, lang = 'ar') {
  if (!pkg) return null;
  const isArabic = lang === 'ar';

  // Title
  let title = '';
  if (isArabic) {
    title = pkg.titleAr || pkg.title || '';
    if (!title || (!/[ء-ي]/.test(title) && pkg.titleEn)) {
      const titleLookup = {
        'adventure': 'باقة المغامرة',
        'adv-pass': 'باقة المغامرة',
        'challenge': 'باقة التحدي',
        'chal-pass': 'باقة التحدي',
        'midweek': 'باقة منتصف الأسبوع الفردية',
        'mid-pass': 'باقة منتصف الأسبوع الفردية',
        'weekend': 'باقة نهاية الأسبوع الفردية',
        'wknd-pass': 'باقة نهاية الأسبوع الفردية',
        'family': 'الباقة العائلية التوفيرية'
      };
      title = titleLookup[pkg.category] || titleLookup[pkg.page] || titleLookup[pkg.id] || titleLookup[pkg._id] || pkg.title || '';
    }
  } else {
    // English mode
    title = pkg.titleEn;
    if (!title || /[ء-ي]/.test(title)) {
      const cleanTitle = (pkg.title || '').trim();
      const enTitleLookup = {
        'باقة المغامرة': 'Adventure Pass',
        'تذكرة المغامرة': 'Adventure Pass',
        'تذكرة المغامرة الشاملة': 'Ultimate Adventure Pass',
        'باقة التحدي': 'Challenge Pass',
        'باقة التحدي والمرح': 'Challenge & Fun Pass',
        'باقة منتصف الأسبوع': 'Single Midweek Pass',
        'باقة منتصف الأسبوع الفردية': 'Single Midweek Pass',
        'تذكرة منتصف الأسبوع': 'Single Midweek Pass',
        'تذكرة فردية منتصف الأسبوع': 'Single Midweek Pass',
        'باقة نهاية الأسبوع': 'Single Weekend Pass',
        'باقة نهاية الأسبوع الفردية': 'Single Weekend Pass',
        'تذكرة نهاية الأسبوع': 'Single Weekend Pass',
        'تذكرة فردية نهاية الأسبوع': 'Single Weekend Pass',
        'تذكرة الأختين منتصف الأسبوع': 'Sisters Midweek Pass',
        'تذكرة الأختين': 'Sisters Pass',
        'تذكرة الأصدقاء منتصف الأسبوع': 'Friends Midweek Pass',
        'تذكرة الأصدقاء': 'Friends Pass',
        'الباقة العائلية': 'Family Day Pass',
        'الباقة العائلية التوفيرية': 'Family Day Pass',
        'تذكرة العائلة': 'Family Day Pass'
      };
      const catLookup = {
        'adventure': 'Adventure Pass',
        'adv-pass': 'Adventure Pass',
        'challenge': 'Challenge Pass',
        'chal-pass': 'Challenge Pass',
        'midweek': 'Single Midweek Pass',
        'mid-pass': 'Single Midweek Pass',
        'weekend': 'Single Weekend Pass',
        'wknd-pass': 'Single Weekend Pass',
        'family': 'Family Day Pass'
      };
      title = enTitleLookup[cleanTitle] || catLookup[pkg.category] || catLookup[pkg.page] || catLookup[pkg.id] || catLookup[pkg._id] || pkg.titleEn || cleanTitle;
    }
  }

  // Subtitle
  let subtitle = '';
  if (isArabic) {
    subtitle = pkg.subtitleAr || pkg.subtitle || '';
    if (!subtitle) {
      const subLookup = {
        'adventure': 'تجربة جميع ألعاب المغامرة',
        'challenge': 'تحديات حركية ومسابقات شيقة طوال اليوم',
        'midweek': 'لعب وأنشطة طوال اليوم',
        'weekend': 'قمة المرح في عطلة نهاية الأسبوع',
        'family': 'تذكرة دخول لـ 4 أفراد شاملة الألعاب والوجبات'
      };
      subtitle = subLookup[pkg.category] || subLookup[pkg.page] || '';
    }
  } else {
    // English mode
    subtitle = pkg.subtitleEn;
    if (!subtitle || /[ء-ي]/.test(subtitle)) {
      const cleanSub = (pkg.subtitle || '').trim();
      const enSubLookup = {
        'تجربة جميع ألعاب المغامرة': 'All Game Experience',
        'دخول غير محدود لجميع مناطق وألعاب المغامرة': 'Unlimited access to all adventure attractions & zones',
        'تحديات حركية ومسابقات شيقة طوال اليوم': 'Full day of active physical obstacles & competitions',
        'اختر أي 4 ألعاب': 'Pick any 4 games',
        'لعب وأنشطة طوال اليوم': 'All Day Play & Crafts',
        'يوم كامل من المرح والأنشطة': 'All Day Play & Crafts',
        'قمة المرح في عطلة نهاية الأسبوع': 'Weekend Ultimate Joy',
        'متعة عطلة نهاية الأسبوع': 'Weekend Ultimate Joy',
        'عطلة نهاية الأسبوع المرحة': 'Weekend Ultimate Joy',
        'تذكرة دخول لـ 4 أفراد شاملة الألعاب والوجبات': 'Full day pass for 4 persons including meals & games'
      };
      const catSubLookup = {
        'adventure': 'All Game Experience',
        'challenge': 'Full day of active physical obstacles & competitions',
        'midweek': 'All Day Play & Crafts',
        'weekend': 'Weekend Ultimate Joy',
        'family': 'Full day pass for 4 persons including meals & games'
      };
      subtitle = enSubLookup[cleanSub] || catSubLookup[pkg.category] || catSubLookup[pkg.page] || pkg.subtitleEn || cleanSub;
    }
  }

  // Save Badge
  const diff = (pkg.oldPrice && pkg.priceNum && pkg.oldPrice > pkg.priceNum)
    ? (pkg.oldPrice - pkg.priceNum)
    : 0;
  let saveBadge = '';
  if (isArabic) {
    saveBadge = pkg.saveBadgeAr || (diff > 0 ? `وفر ${diff} ج.م` : (pkg.saveBadge || ''));
  } else {
    saveBadge = pkg.saveBadgeEn || (diff > 0 ? `Save ${diff} EGP` : (pkg.saveBadge && !/[ء-ي]/.test(pkg.saveBadge) ? pkg.saveBadge : ''));
    if (!saveBadge && pkg.saveBadge && /[ء-ي]/.test(pkg.saveBadge)) {
      const matchNum = pkg.saveBadge.match(/\d+/);
      if (matchNum) {
        saveBadge = `Save ${matchNum[0]} EGP`;
      }
    }
  }

  // Features
  let rawFeatures = [];
  if (isArabic) {
    rawFeatures = (Array.isArray(pkg.featuresAr) && pkg.featuresAr.length > 0)
      ? pkg.featuresAr
      : (Array.isArray(pkg.feature) && pkg.feature.length > 0
        ? pkg.feature
        : (Array.isArray(pkg.features) ? pkg.features : []));
  } else {
    rawFeatures = (Array.isArray(pkg.featuresEn) && pkg.featuresEn.length > 0)
      ? pkg.featuresEn
      : (Array.isArray(pkg.features) && pkg.features.length > 0
        ? pkg.features
        : (Array.isArray(pkg.feature) ? pkg.feature : (Array.isArray(pkg.featuresAr) ? pkg.featuresAr : [])));
  }

  const localizedFeatures = rawFeatures.map(f => getLocalizedFeature(f, isArabic));

  return {
    ...pkg,
    title,
    subtitle,
    saveBadge,
    features: localizedFeatures,
    priceDisplay: isArabic ? `${pkg.priceNum || 0} ج.م` : `EGP ${pkg.priceNum || 0}`,
    oldPriceDisplay: diff > 0 ? (isArabic ? `${pkg.oldPrice} ج.م` : `EGP ${pkg.oldPrice}`) : null
  };
}
