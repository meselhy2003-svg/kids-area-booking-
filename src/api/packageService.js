/**
 * Package & Birthday Events API Service - Fully Dynamic from Server
 */

import { apiClient } from './apiClient';

/**
 * Format server package document into standardized UI-ready object
 */
export function formatPackage(pkg) {
  if (!pkg) return null;
  const currentPrice = pkg.priceAfterDiscount ?? pkg.price ?? 0;
  const originalPrice = pkg.price ?? currentPrice;
  const diff = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const saveText = diff > 0 ? `وفر ${diff} ج.م` : (pkg.saveBadge || '');

  const featureItems = Array.isArray(pkg.feature) && pkg.feature.length > 0
    ? pkg.feature
    : (Array.isArray(pkg.featuresAr) && pkg.featuresAr.length > 0
      ? pkg.featuresAr
      : (Array.isArray(pkg.features) && pkg.features.length > 0
        ? pkg.features
        : (Array.isArray(pkg.featuresEn) ? pkg.featuresEn : [])));

  return {
    _id: pkg._id || pkg.id,
    id: pkg._id || pkg.id,
    title: pkg.title || pkg.titleAr || pkg.titleEn || '',
    titleAr: pkg.title || pkg.titleAr || pkg.titleEn || '',
    titleEn: pkg.titleEn || pkg.title || '',
    subtitle: pkg.subtitle || pkg.subtitleAr || pkg.subtitleEn || '',
    subtitleAr: pkg.subtitle || pkg.subtitleAr || pkg.subtitleEn || '',
    subtitleEn: pkg.subtitleEn || pkg.subtitle || '',
    priceNum: currentPrice,
    price: `${currentPrice} ج.م`,
    origPrice: originalPrice > currentPrice ? `${originalPrice} ج.م` : null,
    oldPrice: originalPrice,
    pointsGets: pkg.pointsGets || 0,
    saveBadge: saveText,
    saveBadgeAr: saveText,
    saveBadgeEn: diff > 0 ? `Save ${diff} EGP` : '',
    features: featureItems,
    featuresAr: featureItems,
    feature: featureItems,
    image: pkg.image || pkg.img || '/photo/kid-area-pic/family-bumper-cars.png',
    img: pkg.image || pkg.img || '/photo/kid-area-pic/family-bumper-cars.png',
    description: pkg.description || pkg.descriptionAr || pkg.descriptionEn || '',
    details: pkg.description || pkg.descriptionAr || pkg.descriptionEn || '',
    page: pkg.page || '',
    category: pkg.category || ''
  };
}

export const packageService = {
  /**
   * Get all packages from server
   */
  async getAllPackages() {
    try {
      const res = await apiClient.get('/api/packages');
      const rawList = res.data?.packages || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(rawList)) {
        return rawList.map(formatPackage);
      }
    } catch (err) {
      console.warn('[packageService] Failed to fetch packages from API:', err);
    }
    return [];
  },

  /**
   * Get packages filtered by zone (e.g. 'adventureZone', 'challengeZone')
   */
  async getPackagesByZone(zone) {
    try {
      const res = await apiClient.get(`/api/packages?zone=${encodeURIComponent(zone)}`);
      const rawList = res.data?.packages || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(formatPackage);
      }
    } catch (err) {
      console.warn(`[packageService] Failed to fetch packages for zone ${zone}:`, err);
    }
    // Fallback: search in all packages
    const all = await this.getAllPackages();
    const cleanZone = (zone || '').toLowerCase();
    return all.filter(p => {
      const pZone = (p.page || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return pZone.includes(cleanZone) || pTitle.includes(cleanZone);
    });
  },

  /**
   * Get single package by ID
   */
  async getPackageById(id) {
    try {
      const res = await apiClient.get(`/api/packages/${id}`);
      const raw = res.data?.package || res.data?.data || res.data;
      if (raw) return formatPackage(raw);
    } catch (err) {
      console.warn(`[packageService] Failed to fetch package ${id}:`, err);
    }
    return null;
  },

  /**
   * Get birthday party packages
   */
  async getBirthdayPackages() {
    try {
      const res = await apiClient.get('/api/packages/birthdays');
      const rawList = res.data?.birthdays || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(formatPackage);
      }
    } catch (err) {
      console.warn('[packageService] Failed to fetch birthdays from API:', err);
    }
    return [];
  },

  /**
   * Request a custom private party quote
   */
  async requestCustomPartyQuote(partyDetails) {
    await apiClient.post('/api/packages/custom-quote', partyDetails);
    return {
      success: true,
      message: 'Custom party request submitted successfully! Our events coordinator will call you.'
    };
  }
};

