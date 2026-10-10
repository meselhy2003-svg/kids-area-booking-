import { useState, useEffect } from 'react';
import { packageService } from '../api/packageService';

export const DEFAULT_PACKAGES = [
  {
    _id: 'adventure',
    id: 'adventure',
    title: 'تذكرة المغامرة الشاملة',
    titleAr: 'تذكرة المغامرة الشاملة',
    titleEn: 'Ultimate Adventure Pass',
    subtitle: 'دخول غير محدود لجميع مناطق وألعاب المغامرة',
    subtitleAr: 'دخول غير محدود لجميع مناطق وألعاب المغامرة',
    subtitleEn: 'Unlimited access to all adventure attractions & zones',
    priceNum: 350,
    price: '350 ج.م',
    oldPrice: 450,
    origPrice: '450 ج.م',
    pointsGets: 35,
    saveBadge: 'وفر 100 ج.م',
    saveBadgeAr: 'وفر 100 ج.م',
    saveBadgeEn: 'Save 100 EGP',
    features: [
      'دخول غير محدود لمنطقة المغامرات والترامبولين',
      'يشمل سيارات التصادم وساحة الواقع الافتراضي VR',
      'وجبة أطفال كومبو مجانية من المطعم',
      'بطاقة ألعاب مشحونة بـ 50 نقطة مجاناً'
    ],
    feature: [
      'دخول غير محدود لمنطقة المغامرات والترامبولين',
      'يشمل سيارات التصادم وساحة الواقع الافتراضي VR',
      'وجبة أطفال كومبو مجانية من المطعم',
      'بطاقة ألعاب مشحونة بـ 50 نقطة مجاناً'
    ],
    image: '/photo/kid-area-pic/family-bumper-cars.png',
    img: '/photo/kid-area-pic/family-bumper-cars.png',
    description: 'دخول شامل لكافة مناطق المغامرة والتحدي',
    page: 'adventure',
    category: 'adventure'
  },
  {
    _id: 'challenge',
    id: 'challenge',
    title: 'باقة التحدي والمرح',
    titleAr: 'باقة التحدي والمرح',
    titleEn: 'Challenge & Fun Pass',
    subtitle: 'تحديات حركية ومسابقات شيقة طوال اليوم',
    subtitleAr: 'تحديات حركية ومسابقات شيقة طوال اليوم',
    subtitleEn: 'Full day of active physical obstacles & competitions',
    priceNum: 280,
    price: '280 ج.م',
    oldPrice: 350,
    origPrice: '350 ج.م',
    pointsGets: 28,
    saveBadge: 'وفر 70 ج.م',
    saveBadgeAr: 'وفر 70 ج.م',
    saveBadgeEn: 'Save 70 EGP',
    features: [
      'دخول ساحة التحديات والعوائق والنينجا',
      'جولتين تسلق جدار المغامرة الآمن',
      'مشروب منعش مجاني من الكافيه'
    ],
    feature: [
      'دخول ساحة التحديات والعوائق والنينجا',
      'جولتين تسلق جدار المغامرة الآمن',
      'مشروب منعش مجاني من الكافيه'
    ],
    image: '/photo/mobile-challenge/offer-collage.png',
    img: '/photo/mobile-challenge/offer-collage.png',
    description: 'باقة التحدي والمنافسة للأطفال والشباب',
    page: 'challenge',
    category: 'challenge'
  },
  {
    _id: 'family',
    id: 'family',
    title: 'الباقة العائلية التوفيرية',
    titleAr: 'الباقة العائلية التوفيرية',
    titleEn: 'Family Day Pass',
    subtitle: 'تذكرة دخول لـ 4 أفراد شاملة الألعاب والوجبات',
    subtitleAr: 'تذكرة دخول لـ 4 أفراد شاملة الألعاب والوجبات',
    subtitleEn: 'Full day pass for 4 persons including meals & games',
    priceNum: 890,
    price: '890 ج.م',
    oldPrice: 1200,
    origPrice: '1200 ج.م',
    pointsGets: 90,
    saveBadge: 'وفر 310 ج.م',
    saveBadgeAr: 'وفر 310 ج.م',
    saveBadgeEn: 'Save 310 EGP',
    features: [
      'دخول كامل لـ 4 أفراد طوال اليوم',
      '4 وجبات عائلية متكاملة من المطعم',
      '4 بطاقات ألعاب مشحونة',
      'خصم 20% على أي مشتريات إضافية'
    ],
    feature: [
      'دخول كامل لـ 4 أفراد طوال اليوم',
      '4 وجبات عائلية متكاملة من المطعم',
      '4 بطاقات ألعاب مشحونة',
      'خصم 20% على أي مشتريات إضافية'
    ],
    image: '/photo/kid-area-pic/packages-hero-trio.png',
    img: '/photo/kid-area-pic/packages-hero-trio.png',
    description: 'أفضل عرض عائلي ليوم لا يُنسى',
    page: 'family',
    category: 'family'
  }
];

export function usePackages(initialCategory = 'adventure') {
  const [packageList, setPackageList] = useState(DEFAULT_PACKAGES);
  const [birthdays, setBirthdays] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const [allPkgs, bdays] = await Promise.all([
          packageService.getAllPackages(),
          packageService.getBirthdayPackages()
        ]);
        if (isMounted) {
          // Filter pass packages (non-birthday)
          const passes = (allPkgs || []).filter(
            p => p.page !== 'birthday' && p.category !== 'birthday' && !p.title?.includes('عيد') && !p.title?.includes('Birthday')
          );
          if (passes.length > 0) {
            setPackageList(passes);
          }
          if (bdays && bdays.length > 0) setBirthdays(bdays);
        }
      } catch (err) {
        console.warn('Failed to fetch packages:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Build key map for backward-compatible category lookups
  const packagesMap = {};
  const currentList = packageList.length > 0 ? packageList : DEFAULT_PACKAGES;

  currentList.forEach((pkg) => {
    if (pkg._id) packagesMap[pkg._id] = pkg;
    if (pkg.id) packagesMap[pkg.id] = pkg;
    const title = (pkg.title || '').toLowerCase();
    const page = (pkg.page || '').toLowerCase();
    const cat = (pkg.category || '').toLowerCase();

    if (title.includes('مغامرة') || page.includes('adventure')) packagesMap.adventure = pkg;
    else if (title.includes('تحدي') || page.includes('challenge')) packagesMap.challenge = pkg;
    else if (title.includes('عائل') || cat.includes('family') || page.includes('family')) packagesMap.family = pkg;
    else if (title.includes('منتصف') || cat.includes('midweek')) packagesMap.midweek = pkg;
    else if (title.includes('نهاية') || cat.includes('weekend')) packagesMap.weekend = pkg;
  });

  // Determine current active package
  const currentPackage =
    currentList.find(p => p._id === activeCategory || p.id === activeCategory) ||
    packagesMap[activeCategory] ||
    packagesMap.adventure ||
    currentList[0] ||
    DEFAULT_PACKAGES[0];

  return {
    packages: packagesMap,
    packageList: currentList,
    birthdays,
    activeCategory,
    setActiveCategory,
    currentPackage,
    loading
  };
}
