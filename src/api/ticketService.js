/**
 * Ticket & Booking API Service
 * Handles offers querying, individual game ticket passes, and checkout reservations.
 */

import { apiClient } from './apiClient';
import {
  kidsAreaOffers,
  funParkOffers,
  challengeGameTickets,
  adventureGameTickets
} from '../data/mock/tickets.mock';
import { authService } from './authService';

const { storage } = apiClient;

/**
 * Normalizes front-end zone names to the backend "page" enum:
 * "kidsArea", "funZone", "challengeZone", "adventureZone"
 */
export const mapZoneToPage = (zone = '') => {
  const z = String(zone).toLowerCase().replace(/[-_\s]/g, '');
  if (z.includes('kid')) return 'kidsArea';
  if (z.includes('fun')) return 'funZone';
  if (z.includes('chal')) return 'challengeZone';
  if (z.includes('adv')) return 'adventureZone';
  return zone;
};

/**
 * Formats a raw backend ticket document into a uniform front-end card object
 */
const formatTicket = (t) => {
  if (!t) return null;
  const currentPrice = t.priceAfterDiscount ?? t.price ?? 0;
  const originalPrice = t.price ?? currentPrice;
  const diff = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const computedSave = diff > 0 ? `وفر ${diff} ج.م` : '';

  return {
    ...t,
    id: t._id || t.id,
    _id: t._id || t.id,
    title: t.title || t.titleAr || t.titleEn || '',
    price: originalPrice,
    priceAfterDiscount: currentPrice,
    priceNum: currentPrice,
    oldPrice: originalPrice > currentPrice ? originalPrice : null,
    saveBadge: t.saveBadge || t.saveBadgeAr || computedSave,
    badgeColor: t.badgeColor || 'badge-cyan',
    age: t.age || t.ageAr || 'Ages 1 - 12',
    description: t.description || t.descriptionAr || t.bundle || (Array.isArray(t.features) ? t.features.join(' • ') : ''),
    bundle: t.bundle || t.bundleAr || t.description || '',
    features: Array.isArray(t.features) ? t.features : [],
    image: t.image || t.thumb || '/photo/kid-area-pic/graphic-composition.png',
    thumb: t.thumb || t.image || '/photo/kid-area-pic/graphic-composition.png',
    priceType: t.priceType || 'all-day'
  };
};

export const ticketService = {
  /**
   * Get tickets directly from backend API by zone
   */
  async getTickets(zone = 'kidsArea', timing = '') {
    const pageKey = mapZoneToPage(zone);
    const params = { zone: pageKey, limit: 50 };
    if (timing && timing !== 'all') {
      params.timing = timing;
    }

    try {
      const res = await apiClient.get('/api/tickets', params);
      if (res.success && res.data?.tickets && Array.isArray(res.data.tickets) && res.data.tickets.length > 0) {
        return res.data.tickets.map(formatTicket);
      }
    } catch (err) {
      console.warn(`[ticketService] Failed to fetch tickets for zone "${pageKey}" from API:`, err);
    }
    return null;
  },

  /**
   * Get offers for a specific zone (with mock fallback)
   */
  async getOffers(zone = 'kids-area') {
    const serverTickets = await this.getTickets(zone);
    if (serverTickets && serverTickets.length > 0) {
      return serverTickets;
    }

    // Safe fallback to fixtures if server is unreachable
    const mapped = mapZoneToPage(zone);
    if (mapped === 'kidsArea') return kidsAreaOffers;
    if (mapped === 'funZone') return [...funParkOffers.weekend, ...funParkOffers.midweek];
    if (mapped === 'challengeZone') return challengeGameTickets;
    if (mapped === 'adventureZone') return adventureGameTickets;
    return kidsAreaOffers;
  },

  /**
   * Get Fun Park offers by day timing ('weekend' | 'midweek')
   */
  async getFunParkOffers(timing = 'weekend') {
    const serverTickets = await this.getTickets('funZone', timing);
    if (serverTickets && serverTickets.length > 0) {
      return serverTickets;
    }

    return funParkOffers[timing] || funParkOffers.weekend;
  },

  /**
   * Get arcade/attraction single game tickets
   */
  async getGameTickets(zone = 'challenge') {
    const serverTickets = await this.getTickets(zone);
    if (serverTickets && serverTickets.length > 0) {
      return serverTickets;
    }

    const mapped = mapZoneToPage(zone);
    if (mapped === 'adventureZone') {
      return adventureGameTickets;
    }
    return challengeGameTickets;
  },

  /**
   * Create a new ticket booking reservation
   */
  async createBooking({
    name,
    phone,
    passName,
    zone = 'Play Zone',
    quantity = 1,
    date = 'today',
    priceNum = 100,
    price = '100 EGP',
    details = ''
  }) {
    const code = 'PZ-' + Math.floor(100000 + Math.random() * 900000);
    const bookingRecord = {
      id: 'bk-' + Date.now(),
      code,
      name,
      phone,
      passName,
      zone,
      quantity,
      date,
      priceNum,
      price,
      totalAmount: priceNum * quantity,
      details,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    // Save to global bookings list
    const existingBookings = storage.get(storage.KEYS.BOOKINGS, []);
    storage.set(storage.KEYS.BOOKINGS, [bookingRecord, ...existingBookings]);

    // Automatically sync with user wallet
    await authService.addPassToWallet({
      code,
      name: passName,
      zone,
      quantity,
      date: date === 'today' ? 'Valid Today' : date === 'tomorrow' ? 'Valid Tomorrow' : 'Valid Weekend',
      price: `${priceNum * quantity} EGP`,
      priceNum
    });

    return {
      success: true,
      booking: bookingRecord
    };
  },

  /**
   * Get all confirmed bookings stored locally
   */
  async getStoredBookings() {
    return storage.get(storage.KEYS.BOOKINGS, []);
  }
};
