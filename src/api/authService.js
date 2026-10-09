/**
 * Authentication API Service
 * 
 * Handles authentication endpoints according to the Postman collection:
 * 1. Sign Up:        POST /api/auth/signup
 * 2. Login:          POST /api/auth/login
 * 3. Get Profile:    GET  /api/auth/me (with Authorization: Bearer <token>)
 * 4. Refresh Token:  POST /api/auth/refresh-token
 * 
 * Manages token and refreshToken persistence in localStorage and integrates
 * with the application's apiClient.
 */

import { apiClient, STORAGE_KEYS } from './apiClient';

// Storage keys for authentication tokens
export const AUTH_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  // Backward compatibility keys
  LEGACY_TOKEN: STORAGE_KEYS?.TOKEN || 'kids_area_auth_token',
  LEGACY_USER: STORAGE_KEYS?.ACTIVE_USER || 'kids_area_auth_user'
};

/**
 * Extracts human-readable error message from backend error responses
 */
export function extractErrorMessage(errOrRes, fallbackMsg = 'Authentication request failed.') {
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

/**
 * Retrieves the stored JWT token
 */
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.TOKEN) || localStorage.getItem(AUTH_KEYS.LEGACY_TOKEN);
};

/**
 * Retrieves the stored refresh token
 */
export const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
};

/**
 * Helper to store tokens in localStorage
 */
export const saveTokens = (token, refreshToken) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_KEYS.LEGACY_TOKEN, token);
  }
  if (refreshToken) {
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

/**
 * Clears authentication tokens and cached user data
 */
export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.LEGACY_TOKEN);
  localStorage.removeItem(AUTH_KEYS.LEGACY_USER);
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userRole');
  localStorage.setItem('american_dream_user_logged_in', 'false');
  localStorage.setItem('american_dream_is_guest', 'true');
  localStorage.removeItem('american_dream_active_user');
  localStorage.removeItem('american_dream_user_profile');
  localStorage.removeItem('american_dream_user_children');
  window.dispatchEvent(new CustomEvent('auth-changed', {
    detail: { isAuthenticated: false, user: null, isAdmin: false }
  }));
};

/**
 * Checks if a user is currently authenticated
 */
export const isUserAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    getStoredToken() || 
    (localStorage.getItem('american_dream_user_logged_in') === 'true' && localStorage.getItem('american_dream_is_guest') !== 'true') ||
    localStorage.getItem('isAdmin') === 'true'
  );
};

// ============================================================================
// 1. SIGN UP: POST /api/auth/signup
// ============================================================================
/**
 * Register a new user account
 * 
 * @param {object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.password
 * @param {string} payload.passwordConfirm
 * @param {string|number} [payload.age]
 * @param {string} [payload.gender]
 * @returns {Promise<{ success: boolean, token: string, refreshToken: string, user: object }>}
 */
export async function signup(payload) {
  try {
    const requestData = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      passwordConfirm: payload.passwordConfirm,
      age: payload.age !== undefined ? String(payload.age) : '25',
      gender: payload.gender || 'male'
    };

    const res = await apiClient.post('/api/auth/signup', requestData);

    if (!res.success) {
      throw new Error(extractErrorMessage(res, 'Sign up failed. Please check your data.'));
    }

    const token = res.data?.token;
    const refreshToken = res.data?.refreshToken;
    const user = res.data?.data || res.data?.user || {
      name: payload.name,
      email: payload.email,
      phone: payload.phone
    };

    // Save tokens on success
    saveTokens(token, refreshToken);

    if (user && typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
      localStorage.setItem('american_dream_user_logged_in', 'true');
    }

    return {
      success: true,
      token,
      refreshToken,
      user
    };
  } catch (error) {
    console.error('[authService.signup] Error:', error.message);
    throw new Error(extractErrorMessage(error, 'Sign up failed. Please try again.'));
  }
}

// ============================================================================
// 2. LOGIN: POST /api/auth/login
// ============================================================================
/**
 * Authenticate existing user with email and password
 * 
 * @param {object} credentials
 * @param {string} credentials.email - User email (or identifier)
 * @param {string} credentials.password - User password
 * @returns {Promise<{ success: boolean, token: string, refreshToken: string, user: object }>}
 */
export async function login({ email, identifier, password }) {
  try {
    const requestData = {
      email: (email || identifier || '').trim(),
      password
    };

    const res = await apiClient.post('/api/auth/login', requestData);

    if (!res.success) {
      const errorMsg = extractErrorMessage(res, 'Invalid email or password.');
      const err = new Error(errorMsg);
      err.response = { status: res.status, data: res.data };
      err.status = res.status;
      throw err;
    }

    const token = res.data?.token;
    const refreshToken = res.data?.refreshToken;
    const user = res.data?.data || res.data?.user || { email: requestData.email };

    // Save tokens on success
    saveTokens(token, refreshToken);

    if (user && typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
      localStorage.setItem('american_dream_user_logged_in', 'true');
    }

    return {
      success: true,
      token,
      refreshToken,
      user
    };
  } catch (error) {
    console.error('[authService.login] Error:', error.message);
    const err = new Error(extractErrorMessage(error, 'Login failed. Please check your credentials.'));
    err.response = error.response || { status: error.status || 401, data: error.data || { message: error.message } };
    err.status = error.status || error.response?.status || 401;
    throw err;
  }
}

// ============================================================================
// 3. GET PROFILE: GET /api/auth/me
// ============================================================================
/**
 * Retrieve the authenticated user's profile
 * Dynamically attaches the Authorization: Bearer <token> header from localStorage.
 * 
 * @returns {Promise<{ success: boolean, user: object }>}
 */
export async function getProfile() {
  try {
    const token = getStoredToken();

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Dynamically attach the Authorization: Bearer <token> header
    const res = await apiClient.get('/api/auth/me', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.success) {
      // If token is invalid or expired, clear invalid session
      if (res.status === 401 || res.status === 403) {
        clearTokens();
      }
      throw new Error(extractErrorMessage(res, 'Failed to fetch user profile.'));
    }

    const user = res.data?.data || res.data?.user || res.data;

    if (user && typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('[authService.getProfile] Error:', error.message);
    throw new Error(extractErrorMessage(error, 'Could not retrieve user profile.'));
  }
}

// ============================================================================
// 4. REFRESH TOKEN: POST /api/auth/refresh-token
// ============================================================================
/**
 * Refresh expired access token using stored refresh token
 * 
 * @param {string} [tokenToRefresh] - Optional explicit refresh token
 * @returns {Promise<{ success: boolean, token: string, refreshToken: string }>}
 */
export async function refreshToken(tokenToRefresh = null) {
  try {
    const currentRefreshToken = tokenToRefresh || getStoredRefreshToken();

    if (!currentRefreshToken) {
      throw new Error('No refresh token available. Please log in again.');
    }

    const res = await apiClient.post('/api/auth/refresh-token', {
      refreshToken: currentRefreshToken
    });

    if (!res.success) {
      clearTokens();
      throw new Error(extractErrorMessage(res, 'Session refresh failed. Please log in again.'));
    }

    const newToken = res.data?.token;
    const newRefreshToken = res.data?.refreshToken || currentRefreshToken;

    // Update stored tokens with newly returned values
    saveTokens(newToken, newRefreshToken);

    return {
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('[authService.refreshToken] Error:', error.message);
    clearTokens();
    throw new Error(extractErrorMessage(error, 'Failed to refresh token.'));
  }
}

/**
 * Logs out the user and clears stored session credentials
 */
export async function logout() {
  try {
    clearTokens();
    return { success: true };
  } catch (e) {
    return { success: true };
  }
}

export async function getCurrentUser() {
  if (!getStoredToken()) return null;
  try {
    const res = await getProfile();
    return res.user;
  } catch (err) {
    return null;
  }
}

/**
 * Updates profile data in local storage
 */
export async function updateProfile(updates = {}) {
  try {
    const cached = localStorage.getItem(AUTH_KEYS.USER);
    const parsed = cached ? JSON.parse(cached) : {};
    const updated = { ...parsed, ...updates };
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(updated));
    return { success: true, user: updated };
  } catch {
    return { success: true, user: updates };
  }
}

/**
 * Adds booked pass to user's wallet in local storage
 */
export async function addPassToWallet(passDetails) {
  try {
    const cached = localStorage.getItem(AUTH_KEYS.USER);
    const user = cached ? JSON.parse(cached) : {};
    const passes = Array.isArray(user.activePasses) ? user.activePasses : [];
    const newPass = {
      code: passDetails.code || ('PZ-' + Math.floor(100000 + Math.random() * 900000)),
      zone: passDetails.zone || 'Play Zone Pass',
      name: passDetails.name || 'General Admission',
      quantity: passDetails.quantity || 1,
      date: passDetails.date || 'Today',
      price: passDetails.price || '100 EGP',
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    const updatedUser = { ...user, activePasses: [newPass, ...passes] };
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  } catch {
    return { success: true };
  }
}

// Export authService object with convenient aliases for existing app context
export const authService = {
  signup,
  register: signup, // alias
  login,
  getProfile,
  getCurrentUser,
  refreshToken,
  logout,
  isUserAuthenticated,
  getStoredToken,
  getStoredRefreshToken,
  saveTokens,
  clearTokens,
  updateProfile,
  addPassToWallet
};

export default authService;
