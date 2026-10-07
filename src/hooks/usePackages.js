import { useState, useEffect } from 'react';
import { packageService } from '../api/packageService';
import { passPackages, birthdayPackages } from '../data/mock/packages.mock';

export function usePackages(initialCategory = 'adventure') {
  const [packages, setPackages] = useState(passPackages);
  const [birthdays, setBirthdays] = useState(birthdayPackages);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const [pkgs, bdays] = await Promise.all([
          packageService.getAllPackages(),
          packageService.getBirthdayPackages()
        ]);
        if (isMounted) {
          if (pkgs) setPackages(pkgs);
          if (bdays) setBirthdays(bdays);
          console.log('[usePackages] Loaded packages data:', {
            packages: pkgs,
            birthdays: bdays
          });
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

  const currentPackage = packages[activeCategory] || packages.adventure;

  return {
    packages,
    birthdays,
    activeCategory,
    setActiveCategory,
    currentPackage,
    loading
  };
}
