import { useState, useEffect, useMemo } from 'react';
import { ticketService } from '../api/ticketService';
import { attractionService } from '../api/attractionService';
import { mediaService } from '../api/mediaService';
import { kidsAreaOffers, funParkOffers } from '../data/mock/tickets.mock';
import { zoneAttractions } from '../data/mock/attractions.mock';
import { heroBannerSlides } from '../data/mock/media.mock';

export function useZoneData(zoneId = 'kids-area', searchQuery = '') {
  // Pre-seed with mock fixtures for instantaneous render (zero loading flash)
  const initialOffers = zoneId === 'kids-area' 
    ? kidsAreaOffers 
    : zoneId === 'fun-park' 
      ? funParkOffers.weekend 
      : [];

  const [offers, setOffers] = useState(initialOffers);
  const [attractions, setAttractions] = useState(zoneAttractions[zoneId] || []);
  const [banners, setBanners] = useState(heroBannerSlides[zoneId] || []);
  const [loading, setLoading] = useState(false);
  const [timing, setTiming] = useState('weekend'); // for fun-park ('weekend' | 'midweek')

  // Fetch updated data from API layer
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        let loadedOffers = [];
        if (zoneId === 'fun-park') {
          loadedOffers = await ticketService.getFunParkOffers(timing);
        } else {
          loadedOffers = await ticketService.getOffers(zoneId);
        }

        const [loadedAttractions, loadedBanners] = await Promise.all([
          attractionService.getAttractions(zoneId),
          mediaService.getHeroBanners(zoneId)
        ]);

        if (isMounted) {
          if (loadedOffers) setOffers(loadedOffers);
          if (loadedAttractions) setAttractions(loadedAttractions);
          if (loadedBanners) setBanners(loadedBanners);
          console.log(`[useZoneData] Loaded data for zone "${zoneId}":`, {
            offers: loadedOffers,
            attractions: loadedAttractions,
            banners: loadedBanners
          });
        }
      } catch (err) {
        console.warn(`Error loading zone data for ${zoneId}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [zoneId, timing]);

  // Search filter
  const filteredOffers = useMemo(() => {
    if (!searchQuery.trim()) return offers;
    const q = searchQuery.toLowerCase();
    return offers.filter(o => 
      (o.titleEn && o.titleEn.toLowerCase().includes(q)) ||
      (o.titleAr && o.titleAr.includes(q)) ||
      (o.title && o.title.toLowerCase().includes(q)) ||
      (Array.isArray(o.features) && o.features.some(f => f.toLowerCase().includes(q))) ||
      (o.bundle && o.bundle.toLowerCase().includes(q))
    );
  }, [offers, searchQuery]);

  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) return attractions;
    const q = searchQuery.toLowerCase();
    return attractions.filter(a => 
      (a.titleEn && a.titleEn.toLowerCase().includes(q)) ||
      (a.titleAr && a.titleAr.includes(q)) ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.desc && a.desc.toLowerCase().includes(q))
    );
  }, [attractions, searchQuery]);

  return {
    offers,
    attractions,
    banners,
    filteredOffers,
    filteredAttractions,
    loading,
    timing,
    setTiming
  };
}
