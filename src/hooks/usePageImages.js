import { useState, useEffect, useCallback } from 'react';
import { getPageImages, normalizePageKey } from '../api';

/**
 * Custom React Hook to fetch images for a specific page as an Array of Objects.
 * 
 * @param {string} pageName - The name of the page (e.g. 'home', 'kids-area', 'fun-park', etc.)
 * @param {object} [options] - Optional settings ({ autoFetch: true, forceRefresh: false })
 * @returns {{ images: Array<object>, loading: boolean, error: any, refetch: Function }}
 */
export function usePageImages(pageName, options = {}) {
  const normKey = normalizePageKey(pageName);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPageImages(normKey, { forceRefresh: force });
      setImages(data);
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
  }, [loadImages, options.forceRefresh]);

  return {
    images,
    loading,
    error,
    refetch: () => loadImages(true)
  };
}
