/**
 * Mock API Client
 * Simulates asynchronous HTTP requests, local storage persistence, and REST endpoints.
 * Ready to be swapped with axios/fetch for production backend APIs.
 */

const STORAGE_KEYS = {
  USERS: 'kids_area_users',
  ACTIVE_USER: 'kids_area_auth_user',
  TOKEN: 'kids_area_auth_token',
  BOOKINGS: 'kids_area_bookings'
};

const DEFAULT_DELAY_MS = 120;

const delay = (ms = DEFAULT_DELAY_MS) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  /**
   * Simulates a GET request to an endpoint with query params
   */
  async get(endpoint, params = {}) {
    await delay();
    return {
      success: true,
      status: 200,
      endpoint,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Simulates a POST request
   */
  async post(endpoint, data = {}) {
    await delay();
    return {
      success: true,
      status: 201,
      endpoint,
      data,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Simulates a PUT request
   */
  async put(endpoint, data = {}) {
    await delay();
    return {
      success: true,
      status: 200,
      endpoint,
      data,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Local Storage Helper Methods
   */
  storage: {
    get(key, defaultValue = null) {
      if (typeof window === 'undefined') return defaultValue;
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      } catch (e) {
        console.warn(`Error reading localStorage key "${key}":`, e);
        return defaultValue;
      }
    },
    set(key, value) {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Error writing to localStorage key "${key}":`, e);
      }
    },
    remove(key) {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Error removing localStorage key "${key}":`, e);
      }
    },
    KEYS: STORAGE_KEYS
  }
};
