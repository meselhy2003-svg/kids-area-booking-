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

export const ticketService = {
  /**
   * Get offers for a specific zone
   */
  async getOffers(zone = 'kids-area') {
    await apiClient.get(`/api/tickets/offers?zone=${zone}`);
    if (zone === 'kids-area') {
      return kidsAreaOffers;
    }
    if (zone === 'fun-park') {
      return [...funParkOffers.weekend, ...funParkOffers.midweek];
    }
    return kidsAreaOffers;
  },

  /**
   * Get Fun Park offers by day timing ('weekend' | 'midweek')
   */
  async getFunParkOffers(timing = 'weekend') {
    await apiClient.get(`/api/tickets/fun-park?timing=${timing}`);
    return funParkOffers[timing] || funParkOffers.weekend;
  },

  /**
   * Get arcade/attraction single game tickets
   */
  async getGameTickets(zone = 'challenge') {
    await apiClient.get(`/api/tickets/games?zone=${zone}`);
    if (zone === 'adventure') {
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
    await apiClient.post('/api/tickets/book', { name, passName, quantity });

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
    await apiClient.get('/api/tickets/bookings');
    return storage.get(storage.KEYS.BOOKINGS, []);
  }
};
