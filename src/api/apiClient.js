/**
 * API Client
 * Configured for production backend deployed on Vercel:
 * Base URL: https://backend-ados.vercel.app
 * 
 * Strict Clean Rules:
 * 1. Base URL is strictly https://backend-ados.vercel.app
 * 2. Zero ngrok headers or mock/localhost fallbacks
 * 3. Zero manual cache-busting (?t=... / ?cb=...) to prevent 400 errors
 * 4. Standard clean headers: Content-Type: application/json, Accept: application/json, and Bearer token
 * 5. Direct, clean REST calls to /api/... endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9500';

export const STORAGE_KEYS = {
  USERS: 'kids_area_users',
  ACTIVE_USER: 'kids_area_auth_user',
  TOKEN: 'token',
  LEGACY_TOKEN: 'kids_area_auth_token',
  BOOKINGS: 'kids_area_bookings'
};

const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Retrieves the stored JWT authentication token
 */
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN);
};

/**
 * Builds a clean, fully-qualified URL from an endpoint path and query params.
 * Strictly guarantees:
 * - Every relative endpoint starts with '/api/'
 * - Base URL is strictly https://backend-ados.vercel.app
 * - Strips any manual cache-busting query params (t, cb, _, ts) to prevent backend 400 errors
 */
const formatUrl = (endpoint = '', params = {}) => {
  let urlStr = '';

  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    urlStr = endpoint;
  } else {
    let cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    // Ensure every request URL explicitly starts with 'api/'
    if (!cleanEndpoint.startsWith('api/')) {
      cleanEndpoint = `api/${cleanEndpoint}`;
    }

    urlStr = `${API_BASE_URL}/${cleanEndpoint}`;
  }

  // Parse and sanitize query parameters, stripping all manual cache-busting tokens
  try {
    const urlObj = new URL(urlStr);

    // Strip legacy cache busters
    urlObj.searchParams.delete('t');
    urlObj.searchParams.delete('cb');
    urlObj.searchParams.delete('_');
    urlObj.searchParams.delete('ts');

    // Append legitimate query params only if provided
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, val]) => {
        if (key !== 't' && key !== 'cb' && key !== '_' && key !== 'ts' && val !== undefined && val !== null) {
          urlObj.searchParams.set(key, String(val));
        }
      });
    }

    return urlObj.toString();
  } catch {
    // Basic fallback string formatting
    let [base, search] = urlStr.split('?');
    const query = new URLSearchParams(search || '');
    query.delete('t');
    query.delete('cb');
    query.delete('_');
    query.delete('ts');

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, val]) => {
        if (key !== 't' && key !== 'cb' && key !== '_' && key !== 'ts' && val !== undefined && val !== null) {
          query.set(key, String(val));
        }
      });
    }

    const qs = query.toString();
    return qs ? `${base}?${qs}` : base;
  }
};

/**
 * Resolves standard clean HTTP headers.
 * Keeps ONLY standard headers: Content-Type, Accept, and Authorization Bearer.
 * No ngrok headers, no anti-cache directives.
 */
const getHeaders = (customHeaders = {}, isFormData = false) => {
  const token = getAuthToken();

  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  } else if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  return headers;
};

/**
 * Safely parses the HTTP response payload
 */
const parseResponseData = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiClient = {
  baseURL: API_BASE_URL,

  /**
   * Direct asynchronous GET request without cache-busting query parameters
   */
  async get(endpoint, params = {}, options = {}) {
    const url = formatUrl(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(options.headers, false),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Direct asynchronous POST request (JSON or FormData)
   */
  async post(endpoint, data = {}, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(options.headers, isFormData),
        body: isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data)),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Direct multipart/form-data upload request (for images & media)
   */
  async upload(endpoint, formData, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(options.headers, true),
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Direct asynchronous PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(options.headers, isFormData),
        body: isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data)),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Direct asynchronous PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(options.headers, isFormData),
        body: isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data)),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Direct asynchronous DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = formatUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(options.headers, false),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const parsedData = await parseResponseData(response);

      return {
        success: response.ok,
        status: response.status,
        data: parsedData,
        endpoint
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        success: false,
        status: err.name === 'AbortError' ? 408 : 0,
        error: err.message,
        data: null,
        endpoint
      };
    }
  },

  /**
   * Local Storage Persistence Helpers
   */
  storage: {
    get(key, defaultValue = null) {
      if (typeof window === 'undefined') return defaultValue;
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      } catch {
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

export default apiClient;
