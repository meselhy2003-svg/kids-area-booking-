import { useState, useEffect, useCallback, useRef } from 'react';
import { getPageImages, normalizePageKey } from '../api';

/**
 * Custom React Hook to fetch images for a specific page as an Array of Objects.
 * Equipped with background polling, exact URL logging, response.data logging,
 * and state comparison warnings to detect static/cached data.
 * 
 * @param {string} pageName - The name of the page (e.g. 'home', 'kids-area', 'fun-park', etc.)
 * @param {object} [options] - Optional settings ({ autoFetch: true, forceRefresh: false, pollInterval: 15000 })
 * @returns {{ images: Array<object>, loading: boolean, error: any, refetch: Function }}
 */
export function usePageImages(pageName, options = {}) {
  const normKey = normalizePageKey(pageName);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevImagesRef = useRef([]);

  useEffect(() => {
    prevImagesRef.current = images;
  }, [images]);

  const loadImages = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    console.log(`🔄 [POLLING TRIGGERED] Fetching page images for "${normKey}"...`);

    try {
      const data = await getPageImages(normKey, { forceRefresh: force });

      // 2. Console log response.data
      console.log(`📦 [Polling response.data] Page "${normKey}":`, data);

      // 3. Compare old state with new fetched data and warn if unchanged
      const oldState = prevImagesRef.current || [];
      const isLengthSame = oldState.length === (data?.length || 0);
      const isItemsSame = JSON.stringify(oldState.map(i => i?.url || i?.image || i?.src || i)) === 
                          JSON.stringify((data || []).map(i => i?.url || i?.image || i?.src || i));

      if (oldState.length > 0 && isLengthSame && isItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - ${normKey}]: Fetched images are IDENTICAL to previous state!\n` +
          `• Array length: ${data?.length || 0}\n` +
          `• Items:`, data,
          `\n• Diagnostic Note: If an image was recently uploaded, the backend is returning unchanged static data.`
        );
      } else if (data?.length > 0) {
        console.log(`✨ [POLLING UPDATE - ${normKey}]: Previous count: ${oldState.length} -> New count: ${data.length}`);
      }

      setImages(data || []);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      return [];
    }
  }, [normKey]);

  useEffect(() => {
    loadImages(options.forceRefresh || false);

    // Background polling every 5 seconds (or custom pollInterval)
    const intervalMs = options.pollInterval || 5000;
    const interval = setInterval(() => {
      loadImages(true);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [loadImages, options.forceRefresh, options.pollInterval]);

  return {
    images,
    loading,
    error,
    refetch: () => loadImages(true)
  };
}
