/**
 * Events & Hall Booking API Service
 * American Dream - Venue Spaces, Birthday Builder & Hall Booking Module (ADOS)
 * Base URL: https://backend-ados.vercel.app
 */

import { apiClient } from './apiClient';

/**
 * Extracts a clean error message from response or exception object
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

// =========================================================================
// 1. PUBLIC INFO & AVAILABILITY ENDPOINTS
// =========================================================================

/**
 * 1. Get Available Spaces & Halls
 * GET /api/events/spaces
 * Lists venue spaces (Indoor Hall, Panoramic Roof, Seaside Lawn, Grand Ballroom)
 */
export async function getSpaces() {
  try {
    const res = await apiClient.get('/api/events/spaces');
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    return [];
  }
}

/**
 * 2. Get Birthday Celebration Packages
 * GET /api/events/packages
 * Returns packages (Explorer Adventure, Champion Quest, Royal VIP)
 */
export async function getPackages() {
  try {
    const res = await apiClient.get('/api/events/packages');
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching birthday packages:', error);
    return [];
  }
}

/**
 * 3. Check Hall & Session Availability
 * GET /api/events/availability?space=indoor&date=2026-10-24&session=afternoon
 * @param {Object} params - { space, date, session } or (space, date, session)
 */
export async function checkAvailability(spaceOrParams, date, session) {
  try {
    let queryParams = {};
    if (typeof spaceOrParams === 'object' && spaceOrParams !== null) {
      queryParams = { ...spaceOrParams };
    } else {
      queryParams = { space: spaceOrParams, date, session };
    }

    const res = await apiClient.get('/api/events/availability', queryParams);
    if (res && res.success && res.data) {
      return res.data;
    }
    return { success: true, isAvailable: true };
  } catch (error) {
    console.warn('Availability check failed:', error);
    return { success: true, isAvailable: true };
  }
}

// =========================================================================
// 2. BOOKING & CUSTOMER ACTIONS
// =========================================================================

/**
 * 4. Book Event / Birthday / Hall
 * POST /api/events/book
 * @param {Object} payload - { contactName, contactPhone, contactEmail, eventType, space, totalGuests, eventDate, session, sessionTime, birthdayDetails, basePrice, venueFee, specialRequests }
 */
export async function bookEvent(payload) {
  try {
    const res = await apiClient.post('/api/events/book', payload);
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to book event'));
  } catch (error) {
    console.error('Error booking event:', error);
    throw new Error(extractErrorMessage(error, 'تعذر تأكيد حجز القاعة أو المناسبة'));
  }
}

/**
 * 5. Get Event by Booking Code
 * GET /api/events/code/:bookingCode (e.g. BD-47803)
 * @param {string} bookingCode
 */
export async function getEventByCode(bookingCode) {
  try {
    const res = await apiClient.get(`/api/events/code/${bookingCode}`);
    if (res && res.success && res.data) {
      return res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Event reservation not found'));
  } catch (error) {
    console.error(`Error fetching event code ${bookingCode}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على الحجز بواسطة الكود'));
  }
}

/**
 * 6. Upload Deposit Payment Proof Receipt
 * POST /api/events/:bookingId/deposit-proof
 * @param {string} bookingId - MongoDB ObjectId
 * @param {Object} payload - { paymentMethod, paymentProof }
 */
export async function uploadDepositProof(bookingId, payload) {
  try {
    const res = await apiClient.post(`/api/events/${bookingId}/deposit-proof`, payload);
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to upload deposit proof'));
  } catch (error) {
    console.error(`Error uploading deposit proof for booking ${bookingId}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر رفع إيصال العربون'));
  }
}

/**
 * 7. Get My Events by Phone Number
 * GET /api/events/my-events?phone=01234567890
 * @param {string|Object} phoneOrParams - Phone string or { phone }
 */
export async function getMyEvents(phoneOrParams) {
  try {
    const params = typeof phoneOrParams === 'string' ? { phone: phoneOrParams } : (phoneOrParams || {});
    const res = await apiClient.get('/api/events/my-events', params);
    if (res && res.success && res.data) {
      return res.data.bookings || res.data.data || res.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching customer events:', error);
    return [];
  }
}

// =========================================================================
// 3. ADMIN MANAGEMENT ENDPOINTS
// =========================================================================

/**
 * 8. Get All Events (Paginated with filters)
 * GET /api/events?page=1&limit=10&status=pending_deposit&search=Youssef
 * @param {Object} params - { page, limit, status, search }
 */
export async function getAllEvents(params = { page: 1, limit: 10 }) {
  try {
    const res = await apiClient.get('/api/events', params);
    if (res && res.success && res.data) {
      return res.data;
    }
    return { bookings: [], total: 0, page: 1, pages: 1 };
  } catch (error) {
    console.error('Error fetching all events:', error);
    return { bookings: [], total: 0, page: 1, pages: 1 };
  }
}

/**
 * 9. Get Event by MongoDB ID
 * GET /api/events/:bookingId
 * @param {string} bookingId
 */
export async function getEventById(bookingId) {
  try {
    const res = await apiClient.get(`/api/events/${bookingId}`);
    if (res && res.success && res.data) {
      return res.data.booking || res.data.data || res.data;
    }
    throw new Error(extractErrorMessage(res, 'Event not found'));
  } catch (error) {
    console.error(`Error fetching event ${bookingId}:`, error);
    throw new Error(extractErrorMessage(error, 'لم يتم العثور على بيانات الحجز'));
  }
}

/**
 * 10. Update Event Booking Details
 * PUT /api/events/:bookingId
 * @param {string} bookingId
 * @param {Object} payload - { totalGuests, specialRequests, sessionTime, ... }
 */
export async function updateEvent(bookingId, payload) {
  try {
    const res = await apiClient.put(`/api/events/${bookingId}`, payload);
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to update event details'));
  } catch (error) {
    console.error(`Error updating event ${bookingId}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث بيانات الحجز'));
  }
}

/**
 * 11. Update Event Status (Verify Deposit / Confirm Reservation)
 * PATCH /api/events/:bookingId/status
 * @param {string} bookingId
 * @param {string|Object} statusOrPayload - 'confirmed' | 'pending_deposit' | 'completed' | 'cancelled' or { status }
 */
export async function updateEventStatus(bookingId, statusOrPayload) {
  try {
    const payload = typeof statusOrPayload === 'string' ? { status: statusOrPayload } : statusOrPayload;
    const res = await apiClient.patch(`/api/events/${bookingId}/status`, payload);
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to update event status'));
  } catch (error) {
    console.error(`Error updating status for event ${bookingId}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر تحديث حالة الحجز'));
  }
}

/**
 * 12. Delete Event Booking
 * DELETE /api/events/:bookingId
 * @param {string} bookingId
 */
export async function deleteEvent(bookingId) {
  try {
    const res = await apiClient.delete(`/api/events/${bookingId}`);
    if (res && res.success) {
      return res.data;
    }
    throw new Error(extractErrorMessage(res, 'Failed to delete event'));
  } catch (error) {
    console.error(`Error deleting event ${bookingId}:`, error);
    throw new Error(extractErrorMessage(error, 'تعذر حذف الحجز'));
  }
}

// =========================================================================
// DEFAULT SERVICE OBJECT EXPORT
// =========================================================================

export const eventsService = {
  // Public & Availability
  getSpaces,
  getEventSpaces: getSpaces,
  getPackages,
  getBirthdayPackages: getPackages,
  checkAvailability,
  checkEventAvailability: checkAvailability,

  // Booking & Customer
  bookEvent,
  getEventByCode,
  uploadDepositProof,
  getMyEvents,

  // Admin Management
  getAllEvents,
  getEventById,
  updateEvent,
  updateEventBooking: updateEvent,
  updateEventStatus,
  deleteEvent,
  deleteEventBooking: deleteEvent
};

export const eventService = eventsService;

export default eventsService;
