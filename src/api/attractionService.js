/**
 * Attractions & Park Status API Service
 */

import { apiClient } from './apiClient';
import { zoneAttractions, liveParkStatus } from '../data/mock/attractions.mock';
import { virtualTourData } from '../data/mock/media.mock';

export const attractionService = {
  /**
   * Get all attractions for a specific play zone
   */
  async getAttractions(zone = 'kids-area') {
    await apiClient.get(`/api/attractions?zone=${zone}`);
    return zoneAttractions[zone] || [];
  },

  /**
   * Find an attraction by its ID
   */
  async getAttractionById(id) {
    await apiClient.get(`/api/attractions/${id}`);
    for (const zone of Object.values(zoneAttractions)) {
      const found = zone.find(a => a.id === id);
      if (found) return found;
    }
    return null;
  },

  /**
   * Get live park capacity, wait time, and opening status
   */
  async getParkStatus() {
    await apiClient.get('/api/park/status');
    return liveParkStatus;
  },

  /**
   * Get 360 virtual tour assets
   */
  async getVirtualTour() {
    await apiClient.get('/api/park/virtual-tour');
    return virtualTourData;
  }
};
