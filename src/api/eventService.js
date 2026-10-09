/**
 * Event API Service
 * American Dream - Events & Hall Booking Module API (ADOS)
 *
 * Integrates with /api/events endpoints (Halls, Birthdays, Availability, Deposit).
 */

import { apiClient } from './apiClient.js';

/**
 * Extracts a clean error message
 */
export function extractErrorMessage(errOrRes, fallbackMsg = 'Failed to process event request') {
  if (!errOrRes) return fallbackMsg;
  if (typeof errOrRes === 'string') return errOrRes;

  const data = errOrRes.data || errOrRes.response?.data || errOrRes;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (typeof data?.error === 'string') return data.error;

  return errOrRes.message || fallbackMsg;
}

/**
 * Get available venue spaces and halls
 * GET /api/events/spaces
 */
export async function getEventSpaces() {
  try {
    const res = await apiClient.get('events/spaces');
    return res.data || res;
  } catch (error) {
    console.warn('Failed to fetch event spaces from server, using local fallback:', error);
    return null;
  }
}

/**
 * Get birthday celebration packages
 * GET /api/events/packages
 */
export async function getBirthdayPackages() {
  try {
    const res = await apiClient.get('events/packages');
    return res.data || res;
  } catch (error) {
    console.warn('Failed to fetch birthday packages from server, using local fallback:', error);
    return null;
  }
}

/**
 * Check hall & session availability for a specific date
 * GET /api/events/availability?space=indoor&date=2026-10-24&session=afternoon
 */
export async function checkEventAvailability(space, date, session) {
  try {
    const res = await apiClient.get('events/availability', { space, date, session });
    return res.data || res;
  } catch (error) {
    console.warn('Availability check failed or server offline:', error);
    return { success: true, isAvailable: true };
  }
}

/**
 * Book an event / birthday celebration / grand hall
 * POST /api/events/book
 */
export async function bookEvent(payload) {
  try {
    const res = await apiClient.post('events/book', payload);
    return res.data || res;
  } catch (error) {
    console.error('Error booking event:', error);
    throw new Error(extractErrorMessage(error, 'تعذر تأكيد حجز القاعة أو المناسبة'));
  }
}

/**
 * Get event details by reservation code (e.g. BD-47803 or EV-10294)
 * GET /api/events/code/:code
 */
export async function getEventByCode(code) {
  try {
    const res = await apiClient.get(`events/code/${code}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error fetching event ${code}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الحجز'));
  }
}

/**
 * Upload payment proof receipt for deposit
 * POST /api/events/:id/deposit-proof
 */
export async function uploadDepositProof(bookingId, payload) {
  try {
    const res = await apiClient.post(`events/${bookingId}/deposit-proof`, payload);
    return res.data || res;
  } catch (error) {
    console.error('Error uploading deposit proof:', error);
    throw new Error(extractErrorMessage(error, 'تعذر رفع إيصال العربون'));
  }
}

/**
 * Get events for a specific phone number or current user
 * GET /api/events/my-events
 */
export async function getMyEvents(params = {}) {
  try {
    const res = await apiClient.get('events/my-events', params);
    return res.data || res;
  } catch (error) {
    console.error('Error fetching my events:', error);
    return { success: false, bookings: [] };
  }
}

/**
 * Get all event & hall bookings (paginated, with search & filters)
 * GET /api/events
 */
export async function getAllEvents(params = {}) {
  try {
    const res = await apiClient.get('events', params);
    return res.data || res;
  } catch (error) {
    console.error('Error fetching all events:', error);
    return { success: false, bookings: [], total: 0 };
  }
}

/**
 * Get event booking by MongoDB ObjectId
 * GET /api/events/:id
 */
export async function getEventById(id) {
  try {
    const res = await apiClient.get(`events/${id}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error fetching event id ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الحجز'));
  }
}

/**
 * Update event booking details
 * PUT /api/events/:id
 */
export async function updateEventBooking(id, payload) {
  try {
    const res = await apiClient.put(`events/${id}`, payload);
    return res.data || res;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث بيانات حجز القاعة'));
  }
}

/**
 * Update event booking status
 * PATCH /api/events/:id/status
 */
export async function updateEventStatus(id, status) {
  try {
    const res = await apiClient.patch(`events/${id}/status`, { status });
    return res.data || res;
  } catch (error) {
    console.error(`Error updating event status ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث حالة الحجز'));
  }
}

/**
 * Delete event booking
 * DELETE /api/events/:id
 */
export async function deleteEventBooking(id) {
  try {
    const res = await apiClient.delete(`events/${id}`);
    return res.data || res;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر إلغاء أو حذف حجز القاعة'));
  }
}

export const eventService = {
  getEventSpaces,
  getBirthdayPackages,
  checkEventAvailability,
  bookEvent,
  getEventByCode,
  uploadDepositProof,
  getMyEvents,
  getAllEvents,
  getEventById,
  updateEventBooking,
  updateEventStatus,
  deleteEventBooking
};

export default eventService;

