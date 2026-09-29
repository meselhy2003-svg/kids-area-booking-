/**
 * Media, Banner & Gallery API Service
 */

import { apiClient } from './apiClient';
import { heroBannerSlides, vibesGallery } from '../data/mock/media.mock';

export const mediaService = {
  /**
   * Get hero banner slides for a specific zone
   */
  async getHeroBanners(zone = 'kids-area') {
    await apiClient.get(`/api/media/banners?zone=${zone}`);
    return heroBannerSlides[zone] || [];
  },

  /**
   * Get photo vibes gallery columns for desktop home
   */
  async getVibesGallery() {
    await apiClient.get('/api/media/vibes-gallery');
    return vibesGallery;
  }
};
