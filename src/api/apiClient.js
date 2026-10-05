/**
 * API Client
 * Configured with live HTTP request support, Postman/ngrok tunnel support,
 * timeout abort controllers, and local storage persistence.
 */

export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  || 'https://unfraternised-luella-unexpeditiously.ngrok-free.dev';

export const STORAGE_KEYS = {
  USERS: 'kids_area_users',
  ACTIVE_USER: 'kids_area_auth_user',
  TOKEN: 'kids_area_auth_token',
  BOOKINGS: 'kids_area_bookings'
};

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Builds a full URL from an endpoint path and query params
 */
const formatUrl = (endpoint = '', params = {}) => {
  let urlStr = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      urlStr += (urlStr.includes('?') ? '&' : '?') + queryString;
    }
  }

  return urlStr;
};

/**
 * Resolves standard request headers with ngrok bypass & auth token
 */
const getHeaders = (customHeaders = {}) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEYS.TOKEN)
    : null;

  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };
};

export const apiClient = {
  baseURL: API_BASE_URL,

  /**
   * Performs an asynchronous GET request
   */
  async get(endpoint, params = {}, options = {}) {
    const url = formatUrl(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(options.headers),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let parsedData = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        parsedData = await response.json();
      } else {
        const text = await response.text();
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text;
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[apiClient.get] ${endpoint} fallback:`, err.message);
      return {
        success: false,
        status: 0,
        error: err.message,
        data: null,
        endpoint,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Performs an asynchronous POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(options.headers),
        body: typeof data === 'string' ? data : JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let parsedData = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        parsedData = await response.json();
      } else {
        const text = await response.text();
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text;
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[apiClient.post] ${endpoint} fallback:`, err.message);
      return {
        success: false,
        status: 0,
        error: err.message,
        data: null,
        endpoint,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Performs an asynchronous PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(options.headers),
        body: typeof data === 'string' ? data : JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let parsedData = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        parsedData = await response.json();
      } else {
        const text = await response.text();
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text;
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[apiClient.put] ${endpoint} fallback:`, err.message);
      return {
        success: false,
        status: 0,
        error: err.message,
        data: null,
        endpoint,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Performs an asynchronous DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(options.headers),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let parsedData = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        parsedData = await response.json();
      } else {
        const text = await response.text();
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text;
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[apiClient.delete] ${endpoint} fallback:`, err.message);
      return {
        success: false,
        status: 0,
        error: err.message,
        data: null,
        endpoint,
        timestamp: new Date().toISOString()
      };
    }
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
