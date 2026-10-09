import { useState, useEffect } from 'react';
import { packageService } from '../api/packageService';

export function usePackages(initialCategory = 'adventure') {
  const [packageList, setPackageList] = useState([]);
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
          setPackageList(passes.length > 0 ? passes : (allPkgs || []));
          if (bdays) setBirthdays(bdays);
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
  packageList.forEach((pkg, index) => {
    if (pkg._id) packagesMap[pkg._id] = pkg;
    const title = (pkg.title || '').toLowerCase();
    const page = (pkg.page || '').toLowerCase();
    const cat = (pkg.category || '').toLowerCase();

    if (title.includes('مغامرة') || page.includes('adventure')) packagesMap.adventure = pkg;
    else if (title.includes('تحدي') || page.includes('challenge')) packagesMap.challenge = pkg;
    else if (title.includes('منتصف') || cat.includes('midweek')) packagesMap.midweek = pkg;
    else if (title.includes('نهاية') || cat.includes('weekend')) packagesMap.weekend = pkg;
  });

  // Determine current active package
  const currentPackage =
    packageList.find(p => p._id === activeCategory) ||
    packagesMap[activeCategory] ||
    packagesMap.adventure ||
    packageList[0] ||
    null;

  return {
    packages: packagesMap,
    packageList,
    birthdays,
    activeCategory,
    setActiveCategory,
    currentPackage,
    loading
  };
}
