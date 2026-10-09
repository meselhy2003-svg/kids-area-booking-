import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { attractionService } from '../api/attractionService';
import { ticketService } from '../api/ticketService';
import { liveParkStatus as defaultParkStatus } from '../data/mock/attractions.mock';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [parkStatus, setParkStatus] = useState(defaultParkStatus);
  const [recentBookings, setRecentBookings] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kids_area_cart');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cart from localStorage:', e);
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  // Load park status and recent bookings on mount
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      try {
        const [status, bookings] = await Promise.all([
          attractionService.getParkStatus(),
          ticketService.getStoredBookings()
        ]);
        if (isMounted) {
          if (status) setParkStatus(status);
          if (bookings) setRecentBookings(bookings);
        }
      } catch (e) {
        console.warn('DataContext init warning:', e);
      }
    }
    initData();
    return () => { isMounted = false; };
  }, []);

  // Sync cartItems changes to localStorage
  const syncCartStorage = (items) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kids_area_cart', JSON.stringify(items));
      } catch (e) {}
    }
  };

  // Book a ticket pass
  const bookTicket = useCallback(async (bookingData) => {
    setLoading(true);
    try {
      const res = await ticketService.createBooking(bookingData);
      setRecentBookings(prev => [res.booking, ...prev]);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cart Management for Passes / Tickets / Packages
  const addToCart = useCallback((item) => {
    const rawId = item._id || item.id || `item-${Date.now()}`;
    const unitPrice = Number(item.priceAfterDiscount ?? item.priceNum ?? item.priceEgp ?? item.price ?? 100);
    const oldPrice = Number(item.oldPrice ?? item.origPrice ?? item.price ?? unitPrice);

    const isPackage = item.type === 'package';

    const normalized = {
      id: rawId,
      _id: rawId,
      ticket: !isPackage ? (item.ticket || rawId) : undefined,
      package: isPackage ? (item.package || rawId) : undefined,
      type: isPackage ? 'package' : 'ticket',
      title: item.title || item.name || '',
      titleAr: item.titleAr || item.title || item.name || '',
      titleEn: item.titleEn || item.title || item.name || '',
      zone: item.zone || item.page || 'kidsArea',
      zoneLabel: item.zoneLabel || item.zone || 'Play Zone',
      age: item.age || 'All Ages',
      inclusions: item.inclusions || item.description || item.bundle || (Array.isArray(item.features) ? item.features.join(' • ') : ''),
      priceEgp: unitPrice,
      pricePts: Number(item.pricePts ?? (unitPrice * 3)),
      oldPriceEgp: oldPrice > unitPrice ? oldPrice : null,
      qty: Number(item.qty || 1),
      thumb: item.thumb || item.image || item.img || '/photo/kid-area-pic/graphic-composition.png',
      saveBadge: item.saveBadge || ''
    };

    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === normalized.id);
      let updated;
      if (idx > -1) {
        updated = prev.map((it, i) => i === idx ? { ...it, qty: it.qty + (normalized.qty || 1) } : it);
      } else {
        updated = [...prev, normalized];
      }
      syncCartStorage(updated);
      return updated;
    });
  }, []);

  const updateCartQty = useCallback((id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const nextQty = Math.max(1, item.qty + delta);
          return { ...item, qty: nextQty };
        }
        return item;
      });
      syncCartStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== itemId);
      syncCartStorage(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    syncCartStorage([]);
  }, []);

  const value = {
    parkStatus,
    recentBookings,
    cartItems,
    setCartItems,
    loading,
    bookTicket,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
