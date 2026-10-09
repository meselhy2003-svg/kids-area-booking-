import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Radio, 
  Image as ImageIcon, 
  ExternalLink,
  X,
  Layers,
  Clock
} from 'lucide-react';
import './PollingImageGallery.css';

// Base URL placeholders
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const IMAGE_BASE_URL = (
  import.meta.env.VITE_IMAGE_BASE_URL || 
  (API_BASE_URL ? `${API_BASE_URL}/media` : '/media')
).replace(/\/+$/, '');

/**
 * Filter out dummy/junk strings (e.g., "fjlsgjghlsjflgsjfg")
 * and ensure valid image file extensions.
 */
const isValidImageFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return false;

  const clean = filename.trim();
  if (clean.length < 4) return false;

  // Filter out dummy/test strings
  if (
    clean.includes('fjlsgjgh') || 
    clean === 'undefined' || 
    clean === 'null' || 
    clean.startsWith('[object')
  ) {
    return false;
  }

  // Base64 and Blob are valid
  if (clean.startsWith('data:image/') || clean.startsWith('blob:')) {
    return true;
  }

  // Check valid image extensions
  const cleanPath = clean.split('?')[0].split('#')[0];
  return /\.(jpe?g|png|webp|svg|gif|avif)($|\?)/i.test(cleanPath);
};

/**
 * Prepends the backend Image Base URL (import.meta.env.VITE_IMAGE_BASE_URL)
 * to each filename when binding to the <img src={...} /> attribute.
 */
const getFullImageUrl = (filename) => {
  if (!filename || typeof filename !== 'string') return '';

  let clean = filename.trim();

  // If already an absolute URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    // Strip developer machine localhost:9500 port if returned by database
    if (/^https?:\/\/(localhost|127\.0\.0\.1):9500/i.test(clean)) {
      clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):9500\/?(media\/)?/i, '');
    } else {
      return clean;
    }
  }

  // Local assets or data URIs
  if (clean.startsWith('data:') || clean.startsWith('blob:') || clean.startsWith('/assets/')) {
    return clean;
  }

  // Strip leading slashes and redundant 'media/' prefixes
  clean = clean.replace(/^\/+/, '');
  if (clean.startsWith('media/')) {
    clean = clean.substring(6).replace(/^\/+/, '');
  }

  const encodedFilename = encodeURI(clean);

  // In local browser development with Vite proxy (prevents CORS & ngrok blocks)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return `/media/${encodedFilename}`;
  }

  // Prepend Base URL placeholder (Requirement 2)
  return `${IMAGE_BASE_URL}/${encodedFilename}`;
};

/**
 * Extracts valid image filenames from various API payload structures
 */
const extractImageFilenames = (data) => {
  if (!data) return [];

  let candidates = [];

  if (Array.isArray(data)) {
    candidates = data;
  } else if (typeof data === 'object') {
    if (Array.isArray(data.images)) {
      candidates = data.images;
    } else if (Array.isArray(data.data)) {
      candidates = data.data;
    } else if (data.data && Array.isArray(data.data.images)) {
      candidates = data.data.images;
    } else if (typeof data.image === 'string') {
      candidates = [data.image];
    } else if (typeof data.filename === 'string') {
      candidates = [data.filename];
    } else {
      for (const val of Object.values(data)) {
        if (Array.isArray(val)) candidates.push(...val);
        else if (typeof val === 'string') candidates.push(val);
      }
    }
  }

  const flattened = [];
  for (const item of candidates) {
    if (typeof item === 'string') {
      flattened.push(item);
    } else if (item && typeof item === 'object') {
      if (Array.isArray(item.images)) flattened.push(...item.images);
      else if (typeof item.image === 'string') flattened.push(item.image);
      else if (typeof item.url === 'string') flattened.push(item.url);
      else if (typeof item.filename === 'string') flattened.push(item.filename);
    }
  }

  // Filter out dummy strings like "fjlsgjghlsjflgsjfg" and non-image values
  return flattened
    .map(name => (typeof name === 'string' ? name.trim() : ''))
    .filter(isValidImageFilename);
};

/**
 * PollingImageGallery Component
 * 
 * Features:
 * - Short Polling every 5 seconds (5000ms) with useEffect and setInterval.
 * - Cleanup function (clearInterval) to prevent memory leaks on unmount.
 * - Prepends VITE_IMAGE_BASE_URL to image filenames.
 * - Filters out dummy strings.
 * - Seamless state management: loading spinner shows ONLY during initial fetch.
 */
export const PollingImageGallery = ({ 
  pageName = 'kids-area',
  title = 'المعرض الحي المباشر (Short Polling)',
  allowPageSwitch = true,
  pollIntervalMs = 5000 // 5 seconds default
}) => {
  const [selectedPage, setSelectedPage] = useState(pageName);

  // States
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);        // ONLY true on initial fetch
  const [isPollingActive, setIsPollingActive] = useState(false); // Background pulse
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeLightbox, setActiveLightbox] = useState(null);

  // Ref to track whether initial load has completed
  const isInitialLoadRef = useRef(true);

  // Synchronize prop change
  useEffect(() => {
    setSelectedPage(pageName);
    isInitialLoadRef.current = true;
  }, [pageName]);

  /**
   * Fetch function
   * @param {boolean} isInitial - Whether this is the first load
   * @param {AbortSignal} signal - Optional abort signal
   */
  const fetchImagesData = useCallback(async (isInitial = false, signal = null) => {
    if (isInitial) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsPollingActive(true);
    }

    const sanitizedPage = encodeURIComponent(String(selectedPage).trim());
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const endpoint = isLocalhost 
      ? `/api/media/page/${sanitizedPage}`
      : `${API_BASE_URL}/media/page/${sanitizedPage}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal
      });

      if (!response.ok) {
        // Fallback for demo/dev if /media/page/ returned 404
        if (response.status === 404 && isLocalhost) {
          const altRes = await fetch(`/api/media/section/${sanitizedPage}`, {
            headers: { 'Accept': 'application/json' },
            signal
          });
          if (altRes.ok) {
            const altData = await altRes.json();
            const validFiles = extractImageFilenames(altData);
            setImages(validFiles);
            setLastUpdated(new Date().toLocaleTimeString());
            setError(null);
            return;
          }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log(`[PollingImageGallery] Polled data for page "${selectedPage}":`, rawData);
      const validFilenames = extractImageFilenames(rawData);

      // Seamlessly update state
      setImages(validFilenames);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;

      console.error(`[PollingGallery] Error fetching page "${selectedPage}":`, err);

      // Only set blocking error if initial load failed
      if (isInitial) {
        setError(err.message || 'Failed to load media.');
      }
    } finally {
      if (isInitial) {
        setIsLoading(false);
        isInitialLoadRef.current = false;
      }
      setTimeout(() => setIsPollingActive(false), 600);
    }
  }, [selectedPage]);

  /**
   * Requirement 1: Polling Mechanism
   * - Uses useEffect and setInterval to fetch every 5000ms.
   * - Clean up clearInterval inside useEffect to prevent memory leaks.
   */
  useEffect(() => {
    let isSubscribed = true;
    const abortController = new AbortController();

    // 1. Initial Fetch (shows loading UI)
    isInitialLoadRef.current = true;
    fetchImagesData(true, abortController.signal);

    // 2. Short Polling Interval (every 5 seconds / 5000ms)
    // Subsequent background polls do NOT trigger the loading spinner UI!
    const intervalId = setInterval(() => {
      if (isSubscribed) {
        fetchImagesData(false, abortController.signal);
      }
    }, pollIntervalMs);

    // 3. Cleanup function to prevent memory leaks when component unmounts
    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
      abortController.abort();
    };
  }, [selectedPage, pollIntervalMs, fetchImagesData]);

  return (
    <div className="pig-container" dir="rtl">
      {/* Top Header */}
      <header className="pig-header">
        <div className="pig-header-info">
          <div className="pig-badge-pulse">
            <Radio size={16} className={`pig-pulse-icon ${isPollingActive ? 'pig-active' : ''}`} />
            <span>تحديث حي كل 5 ثوانٍ</span>
          </div>
          <h2 className="pig-title">{title}</h2>
          <p className="pig-subtitle">
            مزامنة حية من خادم Apidog عبر <code>GET /media/page/{selectedPage}</code> بدون إعادة تحميل الصفحة.
          </p>
        </div>

        <div className="pig-header-controls">
          {allowPageSwitch && (
            <div className="pig-select-wrapper">
              <Layers size={16} />
              <select 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
                className="pig-select"
                aria-label="اختر الصفحة"
              >
                <option value="kids-area">منطقة الأطفال (kids-area)</option>
                <option value="hero">البانر الرئيسي (hero)</option>
                <option value="fun-park">حديقة المرح (fun-park)</option>
                <option value="home">الصفحة الرئيسية (home)</option>
                <option value="challenge">منطقة التحدي (challenge)</option>
                <option value="adventure">المغامرة (adventure)</option>
              </select>
            </div>
          )}

          {lastUpdated && (
            <div className="pig-last-synced" title="وقت آخر مزامنة">
              <Clock size={14} />
              <span>آخر تحديث: {lastUpdated}</span>
            </div>
          )}

          <button 
            type="button" 
            onClick={() => fetchImagesData(false)}
            className="pig-btn-manual-sync"
            title="مزامنة فورية الآن"
          >
            <RefreshCw size={15} className={isPollingActive ? 'pig-spin' : ''} />
            <span>مزامنة الآن</span>
          </button>
        </div>
      </header>

      {/* Requirement 3: Seamless State Management */}
      {/* Initial Loading Spinner ONLY shows during the first fetch */}
      {isLoading ? (
        <div className="pig-initial-loading-view">
          <Loader2 size={44} className="pig-spin pig-spinner-icon" />
          <h3 className="pig-loading-title">جاري تحميل بيانات الصور لأول مرة...</h3>
          <p className="pig-loading-desc">يتم التحقق من مسارات Apidog وتصفية الروابط غير الصالحة</p>
        </div>
      ) : error ? (
        <div className="pig-error-banner" role="alert">
          <AlertCircle size={22} />
          <div className="pig-error-text">
            <strong>تعذر جلب الصور من الخادم</strong>
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            onClick={() => fetchImagesData(true)} 
            className="pig-btn-retry"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="pig-empty-view">
          <ImageIcon size={48} className="pig-empty-icon" />
          <h3>لا توجد صور مسجلة حالياً لصفحة "{selectedPage}"</h3>
          <p>عند رفع أي صورة إلى السيرفر، ستظهر هنا تلقائياً خلال 5 ثوانٍ دون الحاجة لتحديث الصفحة.</p>
        </div>
      ) : (
        /* Requirement 2: Image Grid with Base URL Prepending & Filtered Filenames */
        <div className="pig-gallery-grid">
          {images.map((filename, idx) => {
            // Requirement 2: Prepend Base URL to filename
            const fullImageUrl = getFullImageUrl(filename);

            return (
              <article key={`${filename}-${idx}`} className="pig-card">
                <div 
                  className="pig-thumb-box"
                  onClick={() => setActiveLightbox(fullImageUrl)}
                >
                  <img 
                    src={fullImageUrl} 
                    alt={`صورة ${filename}`} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20fill%3D%22%231e293b%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EImage%20Offline%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                  <div className="pig-thumb-hover">
                    <ExternalLink size={20} />
                    <span>عرض كامل</span>
                  </div>
                </div>

                <div className="pig-card-footer">
                  <span className="pig-filename" title={filename}>
                    {filename}
                  </span>
                  <span className="pig-index-badge">#{idx + 1}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div 
          className="pig-lightbox-overlay" 
          onClick={() => setActiveLightbox(null)}
        >
          <div className="pig-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              onClick={() => setActiveLightbox(null)}
              className="pig-lightbox-close"
              aria-label="إغلاق المعاينة"
            >
              <X size={20} />
            </button>
            <img src={activeLightbox} alt="معاينة كاملة" className="pig-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PollingImageGallery;
