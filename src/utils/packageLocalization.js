/**
 * Localization helper for packages, passes, titles, subtitles, badges, and features.
 */

export function getLocalizedFeature(feat, isArabic) {
  if (!feat) return '';
  if (typeof feat === 'object') {
    if (isArabic) return feat.labelAr || feat.label || feat.nameAr || feat.name || '';
    return feat.labelEn || feat.label || feat.nameEn || feat.name || '';
  }
  const str = String(feat).trim();

  // If English is desired
  if (!isArabic) {
    const dict = {
      'سيارات التصادم الكهربائية': 'Electric Bumper Cars',
      'محاكي ببجي التكتيكي': 'PUBG Tactical Simulator',
      'حلبة بامبر بول الكروية': 'Bubble Ball Arena',
      'دخول غير محدود لمنطقة المغامرات والترامبولين': 'Unlimited access to Adventure Zone & Trampoline',
      'يشمل سيارات التصادم وساحة الواقع الافتراضي VR': 'Includes Bumper Cars & VR Arena',
      'وجبة أطفال كومبو مجانية من المطعم': 'Free Kids Combo Meal from Restaurant',
      'بطاقة ألعاب مشحونة بـ 50 نقطة مجاناً': 'Game Card loaded with 50 free points',
      'دخول ساحة التحديات والعوائق والنينجا': 'Access to Obstacle Course & Ninja Arena',
      'جولتين تسلق جدار المغامرة الآمن': '2 Safe Climbing Wall Rounds',
      'مشروب منعش مجاني من الكافيه': 'Free Refreshing Drink from Cafe',
      'دخول كامل لـ 4 أفراد طوال اليوم': 'All-day full entry for 4 persons',
      '4 وجبات عائلية متكاملة من المطعم': '4 complete family meals from Restaurant',
      '4 بطاقات ألعاب مشحونة': '4 loaded arcade game cards',
      'خصم 20% على أي مشتريات إضافية': '20% discount on additional purchases',
      'جبس وألوان': 'Plaster & Color Art Workshop',
      '2 رمز آركيد مشمول': '2 Arcade Tokens Included',
      'دخول مجاني للتلوين والحفلات': 'Free Coloring & Party Access',
      '1 واقع افتراضي + 1 كرة سلة': '1 VR + 1 Basketball Game',
      'دخول طوال اليوم + باقة واحدة': 'All-Day Entry + 1 Package',
      'دخول طوال اليوم + لعبتين': 'All-Day Entry + 2 Games'
    };

    if (dict[str]) return dict[str];

    // Check if it has pattern "Arabic (English)" or "English (Arabic)"
    const match = str.match(/^([^\(]+)\s*\((.+)\)$/);
    if (match) {
      const outside = match[1].trim();
      const inside = match[2].trim();
      if (/[a-zA-Z]/.test(inside)) {
        return inside;
      }
      if (/[a-zA-Z]/.test(outside)) {
        return outside;
      }
    }

    return str;
  }

  // Arabic mode
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
        'باقة نهاية الأسبوع': 'Single Weekend Pass',
        'باقة نهاية الأسبوع الفردية': 'Single Weekend Pass',
        'الباقة العائلية': 'Family Day Pass',
        'الباقة العائلية التوفيرية': 'Family Day Pass'
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
        'تحديات حركية ومسابقات شيقة طوال اليوم': 'Pick any 4 games',
        'اختر أي 4 ألعاب': 'Pick any 4 games',
        'لعب وأنشطة طوال اليوم': 'All Day Play & Crafts',
        'يوم كامل من المرح والأنشطة': 'All Day Play & Crafts',
        'قمة المرح في عطلة نهاية الأسبوع': 'Weekend Ultimate Joy',
        'متعة عطلة نهاية الأسبوع': 'Weekend Ultimate Joy',
        'تذكرة دخول لـ 4 أفراد شاملة الألعاب والوجبات': 'Full day pass for 4 persons including meals & games'
      };
      const catSubLookup = {
        'adventure': 'All Game Experience',
        'challenge': 'Pick any 4 games',
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
    saveBadge = pkg.saveBadgeEn || (diff > 0 ? `Save ${diff} EGP` : '');
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
