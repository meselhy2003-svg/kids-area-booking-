/**
 * useHomeMedia Hook
 * 
 * Manages home page image caching, zero-flash synchronous hydration,
 * background revalidation, browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
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

  // References to previous state for comparison
  const prevDestRef = useRef(destinationImages);
  const prevVibesRef = useRef(vibesImages);

  useEffect(() => {
    prevDestRef.current = destinationImages;
  }, [destinationImages]);

  useEffect(() => {
    prevVibesRef.current = vibesImages;
  }, [vibesImages]);

  // 2. Background synchronization with server
  const syncMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    console.log('🔄 [POLLING TRIGGERED] Initiating sync for Home / Resort media...');

    try {
      const [freshDest, freshVibes] = await Promise.all([
        mediaService.getUltimateDestinationImages(forceRefresh),
        mediaService.getPlayzoneVibes(forceRefresh)
      ]);

      // 2. Console log response.data every time polling triggers
      console.log('📦 [Polling response.data] Destination Highlights:', freshDest);
      console.log('📦 [Polling response.data] Playzone Vibes:', freshVibes);

      // 3. Compare old state with new fetched data and warn if unchanged
      const oldDest = prevDestRef.current || [];
      const isDestLengthSame = oldDest.length === (freshDest?.length || 0);
      const isDestItemsSame = JSON.stringify(oldDest.map(i => i?.src || i?.image || i?.url || i)) === 
                              JSON.stringify((freshDest || []).map(i => i?.src || i?.image || i?.url || i));

      if (isDestLengthSame && isDestItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Home Destination]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshDest?.length || 0}\n` +
          `• Items:`, freshDest,
          `\n• Diagnostic Note: If an image was recently uploaded to Home (Destination), the server or mock API is returning static data.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Home Destination]: New images detected! Prev count: ${oldDest.length} -> New count: ${freshDest?.length}`);
      }

      const oldVibes = prevVibesRef.current || [];
      const isVibesLengthSame = oldVibes.length === (freshVibes?.length || 0);
      const isVibesItemsSame = JSON.stringify(oldVibes.map(i => i?.src || i?.image || i?.url || i)) === 
                               JSON.stringify((freshVibes || []).map(i => i?.src || i?.image || i?.url || i));

      if (isVibesLengthSame && isVibesItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Home Vibes/Gallery]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshVibes?.length || 0}\n` +
          `• Items:`, freshVibes,
          `\n• Diagnostic Note: If an image was recently uploaded to Home (Vibes), the server or mock API is returning static data.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Home Vibes]: New images detected! Prev count: ${oldVibes.length} -> New count: ${freshVibes?.length}`);
      }

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

  // 4. Initial preloading & background verification + Auto-sync on window focus
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

    // Revalidate when user switches tabs or returns to window (e.g. from Apidog)
    const handleWindowFocus = () => {
      syncMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    // Background polling every 5 seconds to catch remote uploads
    const interval = setInterval(() => {
      syncMedia(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(interval);
    };
  }, [syncMedia]);

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
