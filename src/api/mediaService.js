/**
 * Media, Banner & Gallery API Service
 * 
 * Includes persistent caching (stale-while-revalidate), browser image preloading,
 * and automatic synchronization until backend server replaces dummy image URLs.
 */

import { apiClient } from './apiClient';
import { mediaCache, MEDIA_CACHE_KEYS } from './mediaCache';
import { 
  heroBannerSlides, 
  vibesGallery, 
  playzoneVibesImages, 
  ultimateDestinationImages,
  kidsAreaHeroBanners,
  exploreKidsAreaImages,
  funParkHeroBanners,
  exploreFunParkImages,
  challengeHeroBanners,
  exploreChallengeImages,
  adventureHeroBanners,
  exploreAdventureImages,
  eventsHeroBanners,
  vibesEventsImages
} from '../data/mock/media.mock';

export const mediaService = {
  /**
   * Helper to distribute a flat list of vibes images into 3 balanced columns
   */
  distributeVibesIntoColumns(items = [], numCols = 3) {
    if (!Array.isArray(items) || items.length === 0) return vibesGallery;
    if (Array.isArray(items[0])) return items; // already structured into columns

    const cols = Array.from({ length: numCols }, () => []);
    const defaultHeights = ['h-slide', 'h-ropes', 'h-cafe'];

    items.forEach((item, idx) => {
      const targetCol = typeof item.col === 'number' && item.col >= 0 && item.col < numCols
        ? item.col
        : idx % numCols;

      const enrichedItem = {
        ...item,
        className: item.className || defaultHeights[Math.floor(idx / numCols) % defaultHeights.length]
      };

      cols[targetCol].push(enrichedItem);
    });

    return cols;
  },

  /**
   * Synchronously get cached destination images (4 images) for instant render
   */
  getCachedUltimateDestinationImages() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
      ultimateDestinationImages
    );
  },

  /**
   * Get 4 Ultimate Destination section images
   */
  async getUltimateDestinationImages(forceRefresh = false) {
    const cached = this.getCachedUltimateDestinationImages();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_destination_override', null);
      const res = await apiClient.get('/api/media/ultimate-destination');

      let serverData = ultimateDestinationImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length === 4) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length === 4) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
          serverData, 
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getUltimateDestinationImages fallback:', err);
      return cached;
    }
  },

  /**
   * Update or replace the 4 Ultimate Destination images with server URLs
   */
  async setUltimateDestinationImages(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length !== 4) {
      console.warn('Ultimate Destination expects exactly 4 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
      newImages, 
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_destination_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_destination_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached PlayZone Vibes images (minimum 9 images)
   */
  getCachedPlayzoneVibes() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
      playzoneVibesImages
    );
  },

  /**
   * Get PlayZone Vibes images (minimum 9 images)
   */
  async getPlayzoneVibes(forceRefresh = false) {
    const cached = this.getCachedPlayzoneVibes();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_vibes_override', null);
      const res = await apiClient.get('/api/media/playzone-vibes');

      let serverData = playzoneVibesImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 9) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 9) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
          serverData, 
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getPlayzoneVibes fallback:', err);
      return cached;
    }
  },

  /**
   * Update or replace PlayZone Vibes images (minimum 9 images) with server URLs
   */
  async setPlayzoneVibes(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 9) {
      console.warn('PlayZone Vibes expects minimum 9 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
      newImages, 
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_vibes_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_vibes_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Get photo vibes gallery columns for desktop home (minimum 9 images)
   */
  async getVibesGallery(forceRefresh = false) {
    const vibes = await this.getPlayzoneVibes(forceRefresh);
    return this.distributeVibesIntoColumns(vibes);
  },

  /**
   * Synchronously get cached Kids Area hero banners for instant render
   */
  getCachedKidsHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
      kidsAreaHeroBanners
    );
  },

  /**
   * Get Kids Area Hero Banners with caching and server sync
   */
  async getKidsHeroBanners(forceRefresh = false) {
    const cached = this.getCachedKidsHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_hero_override', null);
      const res = await apiClient.get('/api/media/banners?zone=kids-area');

      let serverData = kidsAreaHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getKidsHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Kids Area hero banners with server URLs
   */
  async setKidsHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Kids Area images (minimum 3 images) for instant render
   */
  getCachedExploreKidsArea() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
      exploreKidsAreaImages
    );
  },

  /**
   * Get Explore Kids Area images (minimum 3 images from dummy data until live URLs provided)
   */
  async getExploreKidsArea(forceRefresh = false) {
    const cached = this.getCachedExploreKidsArea();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_explore_override', null);
      const res = await apiClient.get('/api/media/explore-kids-area');

      let serverData = exploreKidsAreaImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 3) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreKidsArea fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Kids Area images (minimum 3 images) with server URLs
   */
  async setExploreKidsArea(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Kids Area expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Fun Park hero banners for instant render
   */
  getCachedFunParkHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
      funParkHeroBanners
    );
  },

  /**
   * Get Fun Park Hero Banners with caching and server sync
   */
  async getFunParkHeroBanners(forceRefresh = false) {
    const cached = this.getCachedFunParkHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_funpark_hero_override', null);
      const res = await apiClient.get('/api/media/banners?zone=fun-park');

      let serverData = funParkHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getFunParkHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Fun Park hero banners with server URLs
   */
  async setFunParkHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_funpark_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('funpark_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Fun Park images (minimum 3 images) for instant render
   */
  getCachedExploreFunPark() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
      exploreFunParkImages
    );
  },

  /**
   * Get Explore Fun Park images (minimum 3 images from dummy data until live URLs provided)
   */
  async getExploreFunPark(forceRefresh = false) {
    const cached = this.getCachedExploreFunPark();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_funpark_explore_override', null);
      const res = await apiClient.get('/api/media/explore-fun-park');

      let serverData = exploreFunParkImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 3) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreFunPark fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Fun Park images (minimum 3 images) with server URLs
   */
  async setExploreFunPark(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Fun Park expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_funpark_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('funpark_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Challenge Zone hero banners for instant render
   */
  getCachedChallengeHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
      challengeHeroBanners
    );
  },

  /**
   * Get Challenge Zone Hero Banners with caching and server sync
   */
  async getChallengeHeroBanners(forceRefresh = false) {
    const cached = this.getCachedChallengeHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_challenge_hero_override', null);
      const res = await apiClient.get('/api/media/banners?zone=challenge');

      let serverData = challengeHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getChallengeHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Challenge Zone hero banners with server URLs
   */
  async setChallengeHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_challenge_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('challenge_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Challenge Zone images (minimum 3 images) for instant render
   */
  getCachedExploreChallenge() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
      exploreChallengeImages
    );
  },

  /**
   * Get Explore Challenge Zone images (minimum 3 images from dummy data until live URLs provided)
   */
  async getExploreChallenge(forceRefresh = false) {
    const cached = this.getCachedExploreChallenge();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_challenge_explore_override', null);
      const res = await apiClient.get('/api/media/explore-challenge');

      let serverData = exploreChallengeImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 3) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreChallenge fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Challenge Zone images (minimum 3 images) with server URLs
   */
  async setExploreChallenge(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Challenge Zone expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_challenge_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('challenge_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Adventure Zone hero banners for instant render
   */
  getCachedAdventureHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
      adventureHeroBanners
    );
  },

  /**
   * Get Adventure Zone Hero Banners with caching and server sync
   */
  async getAdventureHeroBanners(forceRefresh = false) {
    const cached = this.getCachedAdventureHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_adventure_hero_override', null);
      const res = await apiClient.get('/api/media/banners?zone=adventure');

      let serverData = adventureHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getAdventureHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Adventure Zone hero banners with server URLs
   */
  async setAdventureHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_adventure_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adventure_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Adventure Zone images (minimum 3 images) for instant render
   */
  getCachedExploreAdventure() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
      exploreAdventureImages
    );
  },

  /**
   * Get Explore Adventure Zone images (minimum 3 images from dummy data until live URLs provided)
   */
  async getExploreAdventure(forceRefresh = false) {
    const cached = this.getCachedExploreAdventure();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_adventure_explore_override', null);
      const res = await apiClient.get('/api/media/explore-adventure');

      let serverData = exploreAdventureImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 3) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreAdventure fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Adventure Zone images (minimum 3 images) with server URLs
   */
  async setExploreAdventure(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Adventure Zone expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_adventure_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adventure_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Events & Halls hero banners for zero-flash render
   */
  getCachedEventsHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
      eventsHeroBanners
    );
  },

  /**
   * Get EVENTS & HALLS (hero) images (from dummy data until live URLs provided)
   */
  async getEventsHeroBanners(forceRefresh = false) {
    const cached = this.getCachedEventsHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_events_hero_override', null);
      const res = await apiClient.get('/api/media/events-hero');

      let serverData = eventsHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getEventsHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace EVENTS & HALLS (hero) images with server URLs
   */
  async setEventsHeroBanners(newBanners, persistAsServer = true) {
    if (!Array.isArray(newBanners) || newBanners.length === 0) return [];
    await mediaCache.preloadImages(newBanners);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
      newBanners,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_events_hero_override', newBanners);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('events_hero_updated', { detail: newBanners }));
    }
    return newBanners;
  },

  /**
   * Synchronously get cached VIBES OF EVENTS images (minimum 6 images)
   */
  getCachedVibesEventsImages() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.VIBES_EVENTS,
      vibesEventsImages
    );
  },

  /**
   * Get VIBES OF EVENTS images (minimum 6 images from dummy data until live URLs provided)
   */
  async getVibesEventsImages(forceRefresh = false) {
    const cached = this.getCachedVibesEventsImages();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_events_vibes_override', null);
      const res = await apiClient.get('/api/media/events-vibes');

      let serverData = vibesEventsImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 6) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (res && Array.isArray(res.data) && res.data.length >= 6) {
        serverData = res.data;
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.VIBES_EVENTS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getVibesEventsImages fallback:', err);
      return cached;
    }
  },

  /**
   * Replace VIBES OF EVENTS images (minimum 6 images) with server URLs
   */
  async setVibesEventsImages(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 6) {
      console.warn('VIBES OF EVENTS expects minimum 6 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.VIBES_EVENTS,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_events_vibes_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('events_vibes_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Get hero banner slides for a specific zone with caching
   */
  async getHeroBanners(zone = 'kids-area') {
    if (zone === 'kids-area') {
      return this.getKidsHeroBanners();
    }
    if (zone === 'fun-park') {
      return this.getFunParkHeroBanners();
    }
    if (zone === 'challenge') {
      return this.getChallengeHeroBanners();
    }
    if (zone === 'adventure') {
      return this.getAdventureHeroBanners();
    }
    if (zone === 'events') {
      return this.getEventsHeroBanners();
    }

    const cacheKey = `${MEDIA_CACHE_KEYS.HERO_BANNERS}_${zone}`;
    const cached = mediaCache.get(cacheKey, heroBannerSlides[zone] || []);

    try {
      const res = await apiClient.get(`/api/media/banners?zone=${zone}`);
      const serverData = (res && Array.isArray(res.data) && res.data.length > 0)
        ? res.data
        : (heroBannerSlides[zone] || []);

      if (mediaCache.hasChanged(cached, serverData)) {
        mediaCache.preloadImages(serverData);
        mediaCache.set(cacheKey, serverData, res?.data ? 'server' : 'mock');
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn(`mediaService.getHeroBanners fallback for ${zone}:`, err);
      return cached;
    }
  },

  /**
   * Preload an array of images into browser memory
   */
  preloadImages(items) {
    return mediaCache.preloadImages(items);
  },

  /**
   * Clear media cache to force a re-fetch from the server
   */
  clearMediaCache() {
    mediaCache.clearAll();
    apiClient.storage.remove('kids_area_remote_destination_override');
    apiClient.storage.remove('kids_area_remote_vibes_override');
    apiClient.storage.remove('kids_area_remote_hero_override');
    apiClient.storage.remove('kids_area_remote_explore_override');
    apiClient.storage.remove('kids_area_remote_funpark_hero_override');
    apiClient.storage.remove('kids_area_remote_funpark_explore_override');
    apiClient.storage.remove('kids_area_remote_challenge_hero_override');
    apiClient.storage.remove('kids_area_remote_challenge_explore_override');
    apiClient.storage.remove('kids_area_remote_adventure_hero_override');
    apiClient.storage.remove('kids_area_remote_adventure_explore_override');
    apiClient.storage.remove('kids_area_remote_events_hero_override');
    apiClient.storage.remove('kids_area_remote_events_vibes_override');
  }
};

// Global helper for testing / debugging in browser console
if (typeof window !== 'undefined') {
  window.__mediaService = mediaService;
}
