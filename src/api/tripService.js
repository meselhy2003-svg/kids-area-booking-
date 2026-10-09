/**
 * Trip API Service
 * American Dream - School & Group Trips Module API (ADOS)
 *
 * Integrates with /api/trips endpoints.
 */

import { apiClient } from './apiClient.js';

/**
 * Extracts a clean error message
 */
export function extractErrorMessage(errOrRes, fallbackMsg = 'Failed to process trip request') {
  if (!errOrRes) return fallbackMsg;
  if (typeof errOrRes === 'string') return errOrRes;

  const data = errOrRes.data || errOrRes.response?.data || errOrRes;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (typeof data?.error === 'string') return data.error;

  return errOrRes.message || fallbackMsg;
}

/**
 * Get available trip offers with inclusions and pricing
 * GET /api/trips/offers
 */
export async function getTripOffers() {
  try {
    const res = await apiClient.get('trips/offers');
    return res.data || res;
  } catch (error) {
    console.warn('Failed to fetch trip offers from server, falling back to static offers:', error);
    return null;
  }
}

/**
 * Calculate trip cost and complimentary supervisors
 * POST /api/trips/calculate
 */
export async function calculateTripCost(payload) {
  try {
    const res = await apiClient.post('trips/calculate', payload);
    return res.data || res;
  } catch (error) {
    console.warn('Failed to calculate trip cost on server:', error);
    // Local calculation fallback
    const studentCount = Math.max(15, parseInt(payload.students, 10) || 15);
    const supervisors = Math.max(1, Math.floor(studentCount / 15));
    const price = payload.offerId === 'play-dine' ? 290 : payload.offerId === 'play-zone' ? 210 : 380;
    return {
      success: true,
      data: {
        students: studentCount,
        supervisors,
        totalPrice: studentCount * price
      }
    };
  }
}

/**
 * Create or save an official trip quotation
 * POST /api/trips/quote
 */
export async function createTripQuote(payload) {
  try {
    const res = await apiClient.post('trips/quote', payload);
    return res.data || res;
  } catch (error) {
    console.error('Error creating trip quotation:', error);
    throw new Error(extractErrorMessage(error, 'تعذر إصدار عرض السعر من السيرفر'));
  }
}

/**
 * Submit confirmed group trip booking
 * POST /api/trips/book
 */
export async function bookTrip(payload) {
  try {
    const res = await apiClient.post('trips/book', payload);
    return res.data || res;
  } catch (error) {
    console.error('Error booking trip:', error);
    throw new Error(extractErrorMessage(error, 'تعذر تأكيد حجز الرحلة'));
  }
}

/**
 * Get trip details by quotation code (e.g. AD-TRIP-7492)
 * GET /api/trips/code/:code
 */
export async function getTripByCode(code) {
  try {
    const res = await apiClient.get(`trips/code/${code}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error fetching trip ${code}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الرحلة'));
  }
}

/**
 * Get trips created by current user / phone
 * GET /api/trips/my-trips
 */
export async function getMyTrips(params = {}) {
  try {
    const res = await apiClient.get('trips/my-trips', params);
    return res.data || res;
  } catch (error) {
    console.error('Error fetching my trips:', error);
    return { success: false, data: [] };
  }
}

/**
 * Get all trips (paginated, with search & filters)
 * GET /api/trips
 */
export async function getAllTrips(params = {}) {
  try {
    const res = await apiClient.get('trips', params);
    return res.data || res;
  } catch (error) {
    console.error('Error fetching all trips:', error);
    return { success: false, trips: [], total: 0 };
  }
}

/**
 * Get trip by MongoDB ObjectId
 * GET /api/trips/:id
 */
export async function getTripById(id) {
  try {
    const res = await apiClient.get(`trips/${id}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error fetching trip id ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على بيانات الرحلة'));
  }
}

/**
 * Update trip details (e.g. reschedule date, student count)
 * PUT /api/trips/:id
 */
export async function updateTripBooking(id, payload) {
  try {
    const res = await apiClient.put(`trips/${id}`, payload);
    return res.data || res;
  } catch (error) {
    console.error(`Error updating trip ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث بيانات الرحلة'));
  }
}

/**
 * Update trip status ('Draft' | 'Confirmed' | 'Processing' | 'Cancelled' | 'Completed')
 * PATCH /api/trips/:id/status
 */
export async function updateTripStatus(id, status) {
  try {
    const res = await apiClient.patch(`trips/${id}/status`, { status });
    return res.data || res;
  } catch (error) {
    console.error(`Error updating trip status ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث حالة الرحلة'));
  }
}

/**
 * Delete a trip booking
 * DELETE /api/trips/:id
 */
export async function deleteTrip(id) {
  try {
    const res = await apiClient.delete(`trips/${id}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error deleting trip ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر حذف الرحلة'));
  }
}

export const tripService = {
  getTripOffers,
  calculateTripCost,
  createTripQuote,
  bookTrip,
  getTripByCode,
  getMyTrips,
  getAllTrips,
  getTripById,
  updateTripBooking,
  updateTripStatus,
  deleteTrip
};

export default tripService;

