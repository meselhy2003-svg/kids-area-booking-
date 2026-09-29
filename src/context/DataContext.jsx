import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { attractionService } from '../api/attractionService';
import { ticketService } from '../api/ticketService';
import { liveParkStatus as defaultParkStatus } from '../data/mock/attractions.mock';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [parkStatus, setParkStatus] = useState(defaultParkStatus);
  const [recentBookings, setRecentBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
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

  // Cart Management for Snack Box / Items
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = {
    parkStatus,
    recentBookings,
    cartItems,
    loading,
    bookTicket,
    addToCart,
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
