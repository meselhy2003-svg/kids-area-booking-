/**
 * Package & Birthday Events API Service
 */

import { apiClient } from './apiClient';
import { passPackages, birthdayPackages } from '../data/mock/packages.mock';

export const packageService = {
  /**
   * Get all multi-zone pass packages
   */
  async getAllPackages() {
    await apiClient.get('/api/packages');
    return passPackages;
  },

  /**
   * Get single pass package by category key
   */
  async getPackageByCategory(category = 'adventure') {
    await apiClient.get(`/api/packages/${category}`);
    return passPackages[category] || passPackages.adventure;
  },

  /**
   * Get birthday party tiers
   */
  async getBirthdayPackages() {
    await apiClient.get('/api/packages/birthdays');
    return birthdayPackages;
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
