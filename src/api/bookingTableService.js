/**
 * Booking Table API Service
 * American Dream - Booking Table Module API (ADOS)
 * 
 * Production-ready service integrated with apiClient (Vercel Base URL: https://backend-ados.vercel.app).
 * Handles table reservations, area selection, availability checks, and status management
 * in American Dream Restaurant & Cafe.
 * 
 * Endpoints covered:
 * 1. Book a Table:                     POST   /api/booking-table
 * 2. Check Availability:               GET    /api/booking-table/availability (date, area, time)
 * 3. Get All Bookings:                 GET    /api/booking-table (paginated & filterable)
 * 4. Get Booking by Code:              GET    /api/booking-table/code/:bookingCode (TB-XXXXXX)
 * 5. Get Booking by ID:                GET    /api/booking-table/:bookingId
 * 6. Get Bookings by Guest:            GET    /api/booking-table/guest/:guestId
 * 7. Update Booking Details:           PUT    /api/booking-table/:bookingId
 * 8. Update Booking Status:            PATCH  /api/booking-table/:bookingId/status
 * 9. Delete Booking:                   DELETE /api/booking-table/:bookingId
 */

import { apiClient } from './apiClient';

/**
 * Extracts a human-readable error message from backend API responses
 * Handles various backend error payload structures safely.
 * 
 * @param {any} errOrRes - Axios-like error or response object
 * @param {string} fallbackMsg - Default fallback error message
 * @returns {string} User-friendly error message
 */
export function extractErrorMessage(errOrRes, fallbackMsg = 'Request failed. Please try again.') {
  if (!errOrRes) return fallbackMsg;
  if (typeof errOrRes === 'string') return errOrRes;

  const data = errOrRes.data || errOrRes.response?.data || errOrRes;
  if (typeof data === 'string') return data;

  if (data?.message) return data.message;
  if (typeof data?.error === 'string') return data.error;
  if (data?.error?.message) return data.error.message;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
  }

  return errOrRes.message || errOrRes.error || fallbackMsg;
}

// ============================================================================
// 1. BOOK A TABLE: POST /api/booking-table
// ============================================================================
/**
 * Creates a new table reservation at American Dream Restaurant & Cafe.
 * Supports both registered guest IDs and direct guest contact info (guest auto-creation).
 * 
 * @param {object} payload
 * @param {string} [payload.guest] - Registered Guest MongoDB ObjectId
 * @param {string} [payload.guestName] - Guest full name
 * @param {string} [payload.guestPhone] - Guest phone number
 * @param {string} [payload.name] - Fallback guest name
 * @param {string} [payload.phone] - Fallback guest phone
 * @param {string} payload.area - 'Roof' | 'Family 1' | 'Family 2' | 'Family 3' | 'Indoor' | 'Relaxation Area'
 * @param {string} payload.date - Reservation date (YYYY-MM-DD)
 * @param {string} payload.time - Reservation time (e.g. "6:00 PM")
 * @param {number|string} [payload.numberOfPerson=2] - Party size / number of seats
 * @param {string} [payload.notes] - Special requests (e.g. baby chair, sunset view)
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function bookTable(payload = {}) {
  try {
    const guestName = (payload.guestName || payload.name || '').trim();
    const guestPhone = (payload.guestPhone || payload.phone || '').trim();

    const body = {
      ...(payload.guest ? { guest: payload.guest } : {}),
      ...(guestName ? { guestName, name: guestName } : {}),
      ...(guestPhone ? { guestPhone, phone: guestPhone } : {}),
      area: payload.area || 'Roof',
      date: payload.date,
      time: payload.time,
      numberOfPerson: Number(payload.numberOfPerson || payload.guests || 2),
      ...(payload.notes ? { notes: payload.notes.trim() } : {})
    };

    const res = await apiClient.post('/api/booking-table', body);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to book table. Please check reservation details.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'Table reservation booked successfully.'
    };
  } catch (error) {
    console.error('[bookingTableService.bookTable] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not complete table reservation. Please check your data.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 2. CHECK AVAILABILITY: GET /api/booking-table/availability
// ============================================================================
/**
 * Checks number of currently booked tables and seats for selected date, area, and time slot.
 * 
 * @param {object} params
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @param {string} [params.area] - Seating area ('Roof', 'Family 1', 'Family 2', 'Family 3', 'Indoor', 'Relaxation Area')
 * @param {string} [params.time] - Time slot (e.g. "6:00 PM")
 * @returns {Promise<{ success: boolean, data: object, isAvailable?: boolean }>}
 */
export async function checkAvailability({ date, area, time } = {}) {
  try {
    if (!date) {
      throw new Error('Date is required to check availability.');
    }

    const queryParams = {
      date,
      ...(area ? { area } : {}),
      ...(time ? { time } : {})
    };

    const res = await apiClient.get('/api/booking-table/availability', queryParams);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to check table availability.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const responseData = res.data?.data || res.data;
    const isAvailable = responseData?.isAvailable !== undefined 
      ? Boolean(responseData.isAvailable) 
      : (responseData?.available !== undefined ? Boolean(responseData.available) : true);

    return {
      success: true,
      data: responseData,
      isAvailable
    };
  } catch (error) {
    console.error('[bookingTableService.checkAvailability] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not verify table availability.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 3. GET ALL BOOKINGS: GET /api/booking-table
// ============================================================================
/**
 * Retrieves all table reservations with pagination and filtering options.
 * 
 * @param {object} [params={}]
 * @param {number|string} [params.page=1] - Page number
 * @param {number|string} [params.limit=10] - Items per page
 * @param {string} [params.area] - Filter by seating area
 * @param {string} [params.status] - Filter by status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
 * @param {string} [params.date] - Filter by reservation date (YYYY-MM-DD)
 * @returns {Promise<{ success: boolean, data: Array, pagination?: object, total?: number }>}
 */
export async function getAllBookings(params = {}) {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.area ? { area: params.area } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.date ? { date: params.date } : {})
    };

    const res = await apiClient.get('/api/booking-table', queryParams);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to fetch table bookings.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const payload = res.data;
    const bookings = Array.isArray(payload?.data)
      ? payload.data
      : (Array.isArray(payload) ? payload : (payload?.bookings || []));

    return {
      success: true,
      data: bookings,
      pagination: payload?.pagination || {
        page: Number(queryParams.page),
        limit: Number(queryParams.limit),
        total: payload?.total || bookings.length
      },
      total: payload?.total || bookings.length
    };
  } catch (error) {
    console.error('[bookingTableService.getAllBookings] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not retrieve table bookings.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 4. GET BOOKING BY CODE: GET /api/booking-table/code/:bookingCode
// ============================================================================
/**
 * Finds table reservation details by unique reservation code (e.g. TB-123456).
 * 
 * @param {string} bookingCode - Unique reservation code (e.g. "TB-123456")
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function getBookingByCode(bookingCode) {
  try {
    if (!bookingCode || typeof bookingCode !== 'string') {
      throw new Error('Booking code is required.');
    }

    const cleanCode = encodeURIComponent(bookingCode.trim());
    const res = await apiClient.get(`/api/booking-table/code/${cleanCode}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Reservation with code "${bookingCode}" not found.`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data
    };
  } catch (error) {
    console.error('[bookingTableService.getBookingByCode] Error:', error.message);
    const err = new Error(extractErrorMessage(error, `Reservation code "${bookingCode}" not found or invalid.`));
    err.response = error.response || { status: error.status || 404, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 404;
    throw err;
  }
}

// ============================================================================
// 5. GET BOOKING BY ID: GET /api/booking-table/:bookingId
// ============================================================================
/**
 * Retrieves full table reservation by MongoDB ObjectId.
 * 
 * @param {string} bookingId - Reservation MongoDB ObjectId
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function getBookingById(bookingId) {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required.');
    }

    const cleanId = encodeURIComponent(String(bookingId).trim());
    const res = await apiClient.get(`/api/booking-table/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Reservation not found for ID: ${bookingId}`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data
    };
  } catch (error) {
    console.error('[bookingTableService.getBookingById] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Table reservation not found.'));
    err.response = error.response || { status: error.status || 404, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 404;
    throw err;
  }
}

// ============================================================================
// 6. GET BOOKINGS BY GUEST: GET /api/booking-table/guest/:guestId
// ============================================================================
/**
 * Retrieves all table reservations made by a specific guest.
 * 
 * @param {string} guestId - Registered Guest MongoDB ObjectId
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getBookingsByGuest(guestId) {
  try {
    if (!guestId) {
      throw new Error('Guest ID is required.');
    }

    const cleanId = encodeURIComponent(String(guestId).trim());
    const res = await apiClient.get(`/api/booking-table/guest/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Failed to fetch bookings for guest: ${guestId}`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const bookings = Array.isArray(res.data?.data)
      ? res.data.data
      : (Array.isArray(res.data) ? res.data : []);

    return {
      success: true,
      data: bookings
    };
  } catch (error) {
    console.error('[bookingTableService.getBookingsByGuest] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not retrieve bookings for this guest.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 7. UPDATE BOOKING DETAILS: PUT /api/booking-table/:bookingId
// ============================================================================
/**
 * Updates table reservation details (party size, date, time, area, special notes).
 * 
 * @param {string} bookingId - Reservation MongoDB ObjectId
 * @param {object} updates - Reservation fields to update
 * @param {number|string} [updates.numberOfPerson] - Updated party size
 * @param {string} [updates.time] - Updated time (e.g. "7:30 PM")
 * @param {string} [updates.date] - Updated date (YYYY-MM-DD)
 * @param {string} [updates.area] - Updated area ('Roof', 'Family 1', etc.)
 * @param {string} [updates.notes] - Updated notes
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function updateBookingDetails(bookingId, updates = {}) {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required.');
    }

    const cleanId = encodeURIComponent(String(bookingId).trim());
    const payload = {
      ...(updates.numberOfPerson !== undefined ? { numberOfPerson: Number(updates.numberOfPerson) } : {}),
      ...(updates.time ? { time: updates.time } : {}),
      ...(updates.date ? { date: updates.date } : {}),
      ...(updates.area ? { area: updates.area } : {}),
      ...(updates.notes !== undefined ? { notes: updates.notes.trim() } : {})
    };

    const res = await apiClient.put(`/api/booking-table/${cleanId}`, payload);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to update reservation details.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'Reservation updated successfully.'
    };
  } catch (error) {
    console.error('[bookingTableService.updateBookingDetails] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not update reservation details.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 8. UPDATE BOOKING STATUS: PATCH /api/booking-table/:bookingId/status
// ============================================================================
/**
 * Updates reservation status (e.g. 'confirmed', 'cancelled', 'completed').
 * 
 * @param {string} bookingId - Reservation MongoDB ObjectId
 * @param {string|object} statusOrPayload - Status string (e.g. "confirmed") or { status: "confirmed" }
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function updateBookingStatus(bookingId, statusOrPayload) {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required.');
    }

    const cleanId = encodeURIComponent(String(bookingId).trim());
    const status = typeof statusOrPayload === 'string' 
      ? statusOrPayload 
      : (statusOrPayload?.status || 'confirmed');

    const res = await apiClient.patch(`/api/booking-table/${cleanId}/status`, { status });

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to update reservation status.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || `Reservation status updated to "${status}".`
    };
  } catch (error) {
    console.error('[bookingTableService.updateBookingStatus] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not update reservation status.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 9. DELETE BOOKING: DELETE /api/booking-table/:bookingId
// ============================================================================
/**
 * Cancels and deletes a table reservation by MongoDB ObjectId.
 * 
 * @param {string} bookingId - Reservation MongoDB ObjectId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function deleteBooking(bookingId) {
  try {
    if (!bookingId) {
      throw new Error('Booking ID is required.');
    }

    const cleanId = encodeURIComponent(String(bookingId).trim());
    const res = await apiClient.delete(`/api/booking-table/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Failed to delete reservation: ${bookingId}`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      message: res.data?.message || 'Table reservation cancelled successfully.'
    };
  } catch (error) {
    console.error('[bookingTableService.deleteBooking] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not delete reservation.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// DEFAULT EXPORT & ALIAS OBJECT
// ============================================================================
export const bookingTableService = {
  // Method 1: Book Table
  bookTable,
  book: bookTable,
  createBooking: bookTable,

  // Method 2: Check Availability
  checkAvailability,
  getAvailability: checkAvailability,

  // Method 3: Get All Bookings
  getAllBookings,
  getBookings: getAllBookings,

  // Method 4: Get Booking by Code
  getBookingByCode,
  getByCode: getBookingByCode,

  // Method 5: Get Booking by ID
  getBookingById,
  getById: getBookingById,

  // Method 6: Get Bookings by Guest
  getBookingsByGuest,
  getByGuest: getBookingsByGuest,
  getByGuestId: getBookingsByGuest,

  // Method 7: Update Booking Details
  updateBookingDetails,
  updateDetails: updateBookingDetails,
  update: updateBookingDetails,

  // Method 8: Update Booking Status
  updateBookingStatus,
  updateStatus: updateBookingStatus,

  // Method 9: Delete Booking
  deleteBooking,
  delete: deleteBooking,
  cancelBooking: deleteBooking,

  // Helper
  extractErrorMessage
};

export default bookingTableService;
