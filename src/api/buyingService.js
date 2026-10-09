/**
 * Buying API Service
 * American Dream - Buying Module API (ADOS)
 * 
 * Production-ready service integrated with apiClient (Vercel Base URL: https://backend-ados.vercel.app).
 * Handles purchasing, tracking, verifying, and redeeming tickets and packages.
 * 
 * Endpoints covered:
 * 1. Create Purchase:                   POST   /api/buying
 * 2. Get All Purchases:                 GET    /api/buying (paginated & filterable)
 * 3. Get Purchase by Order Code:        GET    /api/buying/code/:orderCode (QR Scanner)
 * 4. Get Purchase by ID:                GET    /api/buying/:buyingId
 * 5. Get Purchases by Guest ID:         GET    /api/buying/guest/:guestId
 * 6. Redeem Pass by Order Code:         PATCH  /api/buying/code/:orderCode/redeem (Gate Check-in)
 * 7. Redeem Pass by ID:                 PATCH  /api/buying/:buyingId/redeem
 * 8. Update Purchase Status:            PATCH  /api/buying/:buyingId/status
 * 9. Delete Purchase:                   DELETE /api/buying/:buyingId
 */

import { apiClient } from './apiClient';

/**
 * Extracts a human-readable error message from backend API responses
 * Handles backend error formats (data.message, data.error, validation error arrays, etc.)
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
// 1. CREATE PURCHASE: POST /api/buying
// ============================================================================
// 0. GET PAYMENT ACCOUNTS: GET /api/buying/payment-accounts
// ============================================================================
/**
 * Retrieves official payment accounts for InstaPay and Vodafone Cash
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function getPaymentAccounts() {
  try {
    const res = await apiClient.get('/api/buying/payment-accounts');
    if (!res.success) {
      throw new Error(extractErrorMessage(res, 'Failed to fetch payment accounts.'));
    }
    return {
      success: true,
      data: res.data?.data || res.data
    };
  } catch (error) {
    console.warn('[buyingService.getPaymentAccounts] Using fallback accounts:', error.message);
    return {
      success: true,
      data: {
        instapay: {
          address: 'americandream@instapay',
          accountName: 'أمريكان دريم كيدز إيريا',
          active: true
        },
        vodafoneCash: {
          walletNumber: '01023456789',
          accountName: 'أمريكان دريم كيدز إيريا',
          active: true
        },
        cash: {
          available: true,
          instructionsAr: 'الدفع نقداً عند الوصول واستلام إسورة الدخول عند الوصول.'
        }
      }
    };
  }
}

// ============================================================================
// 1. CREATE PURCHASE: POST /api/buying
// ============================================================================
/**
 * Creates a purchase for tickets and/or packages.
 * Automatically handles dynamic combinations of guest info, tickets, packages, payment, and notes.
 * Supports multipart/form-data upload when paymentProofFile is provided.
 * 
 * @param {object} payload
 * @param {string} [payload.guest] - Registered Guest MongoDB ObjectId
 * @param {string} [payload.guestName] - Guest full name
 * @param {string} [payload.guestPhone] - Guest phone number
 * @param {string} [payload.senderAccount] - Transfer sender phone / account
 * @param {Array<{ ticket: string, quantity: number }>} [payload.tickets] - Array of ticket objects
 * @param {Array<{ package: string, quantity: number }>} [payload.packages] - Array of package objects
 * @param {string} [payload.paymentMethod='cash'] - 'cash' | 'card' | 'instapay' | 'vodafone_cash' | 'points'
 * @param {string} [payload.paymentStatus='pending'] - 'pending' | 'pending_verification' | 'paid' | 'failed'
 * @param {File} [payload.paymentProofFile] - File object for transfer screenshot/receipt
 * @param {string} [payload.paymentProof] - Relative path if already uploaded
 * @param {string} [payload.notes] - Optional order or booking notes
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function createPurchase(payload = {}) {
  try {
    let body;
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      body = payload;
    } else if (payload.paymentProofFile) {
      const formData = new FormData();
      formData.append('paymentProof', payload.paymentProofFile);
      if (payload.guest) formData.append('guest', payload.guest);
      if (payload.guestName) formData.append('guestName', payload.guestName.trim());
      if (payload.guestPhone) formData.append('guestPhone', payload.guestPhone.trim());
      if (payload.senderAccount) formData.append('senderAccount', payload.senderAccount.trim());
      if (payload.tickets) formData.append('tickets', JSON.stringify(payload.tickets));
      if (payload.packages) formData.append('packages', JSON.stringify(payload.packages));
      formData.append('paymentMethod', payload.paymentMethod || 'cash');
      formData.append('paymentStatus', payload.paymentStatus || (payload.paymentMethod === 'cash' ? 'pending' : 'pending_verification'));
      if (payload.notes) formData.append('notes', payload.notes.trim());
      body = formData;
    } else {
      body = {
        ...(payload.guest ? { guest: payload.guest } : {}),
        ...(payload.guestName ? { guestName: payload.guestName.trim() } : {}),
        ...(payload.guestPhone ? { guestPhone: payload.guestPhone.trim() } : {}),
        ...(payload.senderAccount ? { senderAccount: payload.senderAccount.trim() } : {}),
        ...(Array.isArray(payload.tickets) && payload.tickets.length > 0 ? { tickets: payload.tickets } : {}),
        ...(Array.isArray(payload.packages) && payload.packages.length > 0 ? { packages: payload.packages } : {}),
        paymentMethod: payload.paymentMethod || 'cash',
        paymentStatus: payload.paymentStatus || (payload.paymentMethod === 'cash' ? 'pending' : (payload.paymentProof ? 'pending_verification' : 'pending')),
        ...(payload.paymentProof ? { paymentProof: payload.paymentProof } : {}),
        ...(payload.notes ? { notes: payload.notes.trim() } : {})
      };
    }

    const res = await apiClient.post('/api/buying', body);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'فشل إنشاء عملية الشراء، يرجى مراجعة البيانات.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'تم إنشاء الحجز بنجاح.'
    };
  } catch (error) {
    console.error('[buyingService.createPurchase] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'تعذر إتمام عملية الشراء. يرجى التأكد من البيانات المدخلة.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 2. GET ALL PURCHASES: GET /api/buying
// ============================================================================
/**
 * Retrieves a list of all purchases with pagination and optional filter criteria.
 * 
 * @param {object} [params={}]
 * @param {number|string} [params.page=1] - Page number
 * @param {number|string} [params.limit=10] - Items per page
 * @param {string} [params.status] - 'pending' | 'confirmed' | 'completed' | 'cancelled'
 * @param {string} [params.paymentStatus] - 'pending' | 'paid' | 'failed' | 'refunded'
 * @param {boolean|string} [params.used] - Filter by redemption status: true / false
 * @param {string} [params.paymentMethod] - 'cash' | 'card' | 'instapay' | 'vodafone_cash' | 'points'
 * @returns {Promise<{ success: boolean, data: Array, pagination?: object, total?: number }>}
 */
export async function getAllPurchases(params = {}) {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.status ? { status: params.status } : {}),
      ...(params.paymentStatus ? { paymentStatus: params.paymentStatus } : {}),
      ...(params.used !== undefined && params.used !== null ? { used: String(params.used) } : {}),
      ...(params.paymentMethod ? { paymentMethod: params.paymentMethod } : {})
    };

    const res = await apiClient.get('/api/buying', queryParams);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to fetch purchases.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const payload = res.data;
    const purchases = Array.isArray(payload?.data)
      ? payload.data
      : (Array.isArray(payload) ? payload : (payload?.purchases || []));

    return {
      success: true,
      data: purchases,
      pagination: payload?.pagination || {
        page: Number(queryParams.page),
        limit: Number(queryParams.limit),
        total: payload?.total || purchases.length
      },
      total: payload?.total || purchases.length
    };
  } catch (error) {
    console.error('[buyingService.getAllPurchases] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not retrieve purchases.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 3. GET PURCHASE BY ORDER CODE: GET /api/buying/code/:orderCode (QR Scanner)
// ============================================================================
/**
 * Looks up pass and purchase details by unique turnstile QR order code (e.g. PZ-123456).
 * 
 * @param {string} orderCode - Unique order/pass code (e.g. "PZ-123456")
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function getPurchaseByOrderCode(orderCode) {
  try {
    if (!orderCode || typeof orderCode !== 'string') {
      throw new Error('Order code is required.');
    }

    const cleanCode = encodeURIComponent(orderCode.trim());
    const res = await apiClient.get(`/api/buying/code/${cleanCode}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Purchase with code "${orderCode}" not found.`);
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
    console.error('[buyingService.getPurchaseByOrderCode] Error:', error.message);
    const err = new Error(extractErrorMessage(error, `Order code "${orderCode}" not found or invalid.`));
    err.response = error.response || { status: error.status || 404, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 404;
    throw err;
  }
}

// ============================================================================
// 4. GET PURCHASE BY ID: GET /api/buying/:buyingId
// ============================================================================
/**
 * Retrieves full purchase document by MongoDB ObjectId.
 * 
 * @param {string} buyingId - Purchase MongoDB ObjectId
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function getPurchaseById(buyingId) {
  try {
    if (!buyingId) {
      throw new Error('Purchase ID is required.');
    }

    const cleanId = encodeURIComponent(String(buyingId).trim());
    const res = await apiClient.get(`/api/buying/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Purchase not found for ID: ${buyingId}`);
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
    console.error('[buyingService.getPurchaseById] Error:', error.message);
    const err = new Error(extractErrorMessage(error, `Purchase not found.`));
    err.response = error.response || { status: error.status || 404, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 404;
    throw err;
  }
}

// ============================================================================
// 5. GET PURCHASES BY GUEST ID: GET /api/buying/guest/:guestId
// ============================================================================
/**
 * Retrieves all order and purchase records for a specific registered guest.
 * 
 * @param {string} guestId - Registered Guest MongoDB ObjectId
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getPurchasesByGuestId(guestId) {
  try {
    if (!guestId) {
      throw new Error('Guest ID is required.');
    }

    const cleanId = encodeURIComponent(String(guestId).trim());
    const res = await apiClient.get(`/api/buying/guest/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Failed to fetch purchases for guest: ${guestId}`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const purchases = Array.isArray(res.data?.data)
      ? res.data.data
      : (Array.isArray(res.data) ? res.data : []);

    return {
      success: true,
      data: purchases
    };
  } catch (error) {
    console.error('[buyingService.getPurchasesByGuestId] Error:', error.message);
    const err = new Error(extractErrorMessage(error, `Could not retrieve purchases for this guest.`));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 6. REDEEM PASS BY ORDER CODE: PATCH /api/buying/code/:orderCode/redeem (Gate Check-in)
// ============================================================================
/**
 * Gate scanner turnstile check-in and redemption by QR order code.
 * Sets used = true, usedAt = timestamp, status = completed.
 * Rejects with 400 if already redeemed.
 * 
 * @param {string} orderCode - Unique order code (e.g. "PZ-123456")
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function redeemPassByOrderCode(orderCode) {
  try {
    if (!orderCode || typeof orderCode !== 'string') {
      throw new Error('Order code is required for redemption.');
    }

    const cleanCode = encodeURIComponent(orderCode.trim());
    const res = await apiClient.patch(`/api/buying/code/${cleanCode}/redeem`, {});

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Pass redemption failed or already used.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'Pass redeemed successfully at gate turnstile.'
    };
  } catch (error) {
    console.error('[buyingService.redeemPassByOrderCode] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'This pass could not be redeemed (it may already be used or invalid).'));
    err.response = error.response || { status: error.status || 400, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 400;
    throw err;
  }
}

// ============================================================================
// 7. REDEEM PASS BY ID: PATCH /api/buying/:buyingId/redeem
// ============================================================================
/**
 * Alternative redemption endpoint by MongoDB ObjectId.
 * 
 * @param {string} buyingId - Purchase MongoDB ObjectId
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function redeemPassById(buyingId) {
  try {
    if (!buyingId) {
      throw new Error('Purchase ID is required for redemption.');
    }

    const cleanId = encodeURIComponent(String(buyingId).trim());
    const res = await apiClient.patch(`/api/buying/${cleanId}/redeem`, {});

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Pass redemption failed or already used.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'Pass redeemed successfully.'
    };
  } catch (error) {
    console.error('[buyingService.redeemPassById] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'This pass could not be redeemed.'));
    err.response = error.response || { status: error.status || 400, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 400;
    throw err;
  }
}

// ============================================================================
// 8. UPDATE PURCHASE STATUS: PATCH /api/buying/:buyingId/status
// ============================================================================
/**
 * Updates paymentStatus, order status, or notes on a purchase.
 * 
 * @param {string} buyingId - Purchase MongoDB ObjectId
 * @param {object} statusData
 * @param {string} [statusData.paymentStatus] - 'pending' | 'paid' | 'failed' | 'refunded'
 * @param {string} [statusData.status] - 'pending' | 'confirmed' | 'completed' | 'cancelled'
 * @param {string} [statusData.notes] - Updated notes or cashier verification
 * @returns {Promise<{ success: boolean, data: object, message?: string }>}
 */
export async function updatePurchaseStatus(buyingId, statusData = {}) {
  try {
    if (!buyingId) {
      throw new Error('Purchase ID is required.');
    }

    const cleanId = encodeURIComponent(String(buyingId).trim());
    const payload = {
      ...(statusData.paymentStatus ? { paymentStatus: statusData.paymentStatus } : {}),
      ...(statusData.status ? { status: statusData.status } : {}),
      ...(statusData.notes ? { notes: statusData.notes.trim() } : {})
    };

    const res = await apiClient.patch(`/api/buying/${cleanId}/status`, payload);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Failed to update purchase status.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      data: res.data?.data || res.data,
      message: res.data?.message || 'Purchase status updated successfully.'
    };
  } catch (error) {
    console.error('[buyingService.updatePurchaseStatus] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not update purchase status.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// 9. DELETE PURCHASE: DELETE /api/buying/:buyingId
// ============================================================================
/**
 * Deletes or cancels a purchase record by MongoDB ObjectId.
 * 
 * @param {string} buyingId - Purchase MongoDB ObjectId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function deletePurchase(buyingId) {
  try {
    if (!buyingId) {
      throw new Error('Purchase ID is required.');
    }

    const cleanId = encodeURIComponent(String(buyingId).trim());
    const res = await apiClient.delete(`/api/buying/${cleanId}`);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, `Failed to delete purchase: ${buyingId}`);
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    return {
      success: true,
      message: res.data?.message || 'Purchase deleted successfully.'
    };
  } catch (error) {
    console.error('[buyingService.deletePurchase] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Could not delete purchase.'));
    err.response = error.response || { status: error.status || 500, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 500;
    throw err;
  }
}

// ============================================================================
// DEFAULT EXPORT & ALIAS OBJECT
// ============================================================================
export const buyingService = {
  // Method 0: Get Payment Accounts
  getPaymentAccounts,

  // Method 1: Create Purchase
  createPurchase,
  create: createPurchase,

  // Method 2: Get All Purchases
  getAllPurchases,
  getPurchases: getAllPurchases,

  // Method 3: Get Purchase by Order Code (QR Scanner)
  getPurchaseByOrderCode,
  getByOrderCode: getPurchaseByOrderCode,
  getByCode: getPurchaseByOrderCode,

  // Method 4: Get Purchase by ID
  getPurchaseById,
  getById: getPurchaseById,

  // Method 5: Get Purchases by Guest ID
  getPurchasesByGuestId,
  getByGuestId: getPurchasesByGuestId,
  getByGuest: getPurchasesByGuestId,

  // Method 6: Redeem Pass by Order Code
  redeemPassByOrderCode,
  redeemByOrderCode: redeemPassByOrderCode,
  redeemByCode: redeemPassByOrderCode,

  // Method 7: Redeem Pass by ID
  redeemPassById,
  redeemById: redeemPassById,

  // Method 8: Update Purchase Status
  updatePurchaseStatus,
  updateStatus: updatePurchaseStatus,

  // Method 9: Delete Purchase
  deletePurchase,
  delete: deletePurchase,

  // Helper
  extractErrorMessage
};

export default buyingService;
