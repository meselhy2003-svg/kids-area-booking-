/**
 * useHomeMedia Hook
 * 
 * Manages home page image caching, zero-flash synchronous hydration,
 * background revalidation, browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../api/mediaService';

export function useHomeMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [destinationImages, setDestinationImages] = useState(() => 
    mediaService.getCachedUltimateDestinationImages()
  );

  const [vibesImages, setVibesImages] = useState(() => 
    mediaService.getCachedPlayzoneVibes()
  );

  const [vibesColumns, setVibesColumns] = useState(() => {
    const cachedVibes = mediaService.getCachedPlayzoneVibes();
    return mediaService.distributeVibesIntoColumns(cachedVibes);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isServerSynced, setIsServerSynced] = useState(false);

  // 2. Background synchronization with server
  const syncMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [freshDest, freshVibes] = await Promise.all([
        mediaService.getUltimateDestinationImages(forceRefresh),
        mediaService.getPlayzoneVibes(forceRefresh)
      ]);

      if (Array.isArray(freshDest) && freshDest.length > 0) {
        setDestinationImages(freshDest);
      }

      if (Array.isArray(freshVibes) && freshVibes.length >= 9) {
        setVibesImages(freshVibes);
        setVibesColumns(mediaService.distributeVibesIntoColumns(freshVibes));
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useHomeMedia] Background sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Listen for dynamic server updates & reactive cache changes
  useEffect(() => {
    const handleDestUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length === 4) {
        setDestinationImages(e.detail);
      }
    };

    const handleVibesUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length >= 9) {
        setVibesImages(e.detail);
        setVibesColumns(mediaService.distributeVibesIntoColumns(e.detail));
      }
    };

    window.addEventListener('kids_area_destination_updated', handleDestUpdate);
    window.addEventListener('kids_area_vibes_updated', handleVibesUpdate);

    return () => {
      window.removeEventListener('kids_area_destination_updated', handleDestUpdate);
      window.removeEventListener('kids_area_vibes_updated', handleVibesUpdate);
    };
  }, []);

  // 4. Initial preloading & background verification
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      // Preload current cached images for optimal performance
      mediaService.preloadImages(destinationImages);
      mediaService.preloadImages(vibesImages);

      // Perform background sync with server
      await syncMedia(false);
    }

    initialSync();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncMedia(true);
  }, [syncMedia]);

  const updateDestinationImages = useCallback((newImages) => {
    return mediaService.setUltimateDestinationImages(newImages);
  }, []);

  return {
    destinationImages,
    vibesImages,
    vibesColumns,
    isLoading,
    isServerSynced,
    refreshCache,
    updateDestinationImages
  };
}
