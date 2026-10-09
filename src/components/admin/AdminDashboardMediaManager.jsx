import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  Search, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  Check, 
  Layers, 
  Folder, 
  Filter, 
  ExternalLink,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import './AdminDashboardMediaManager.css';

// Prepend Image Base URL per requirement (fallback to /media for proxying)
const IMAGE_BASE_URL = (
  import.meta.env.VITE_IMAGE_BASE_URL || 
  (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/media` : '/media')
).replace(/\/+$/, '');

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// Supported admin pages per Apidog specification
const ADMIN_PAGES = [
  { id: 'kids-area', labelEn: 'Kids Area', labelAr: 'منطقة الأطفال' },
  { id: 'fun-park', labelEn: 'Fun Park', labelAr: 'منطقة المرح' },
  { id: 'challenge', labelEn: 'Challenge Zone', labelAr: 'منطقة التحدي' },
  { id: 'adventure', labelEn: 'Adventure Zone', labelAr: 'منطقة المغامرات' },
  { id: 'home', labelEn: 'Home / Resort', labelAr: 'الصفحة الرئيسية' },
  { id: 'packages', labelEn: 'Packages', labelAr: 'الباقات والعروض' },
  { id: 'restaurant', labelEn: 'Restaurant & Café', labelAr: 'المطعم والكافيه' },
  { id: 'events', labelEn: 'Events & Halls', labelAr: 'القاعات والمناسبات' }
];

// Patterns for invalid dummy strings to ignore (e.g., "fjlsgjghlsjflgsjfg")
const JUNK_STRING_PATTERNS = [
  /fjlsgjgh/i,
  /^undefined$/i,
  /^null$/i,
  /^\[object /i,
  /testdummy/i
];

const VALID_EXT_REGEX = /\.(jpe?g|png|webp|svg|gif|avif)($|\?)/i;

const ANTI_CACHE_HEADERS = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '0'
};

/**
 * Validates candidate filename and filters out dummy strings
 */
const isValidFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return false;
  const trimmed = filename.trim();
  if (trimmed.length < 4) return false;

  for (const pattern of JUNK_STRING_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return true;
  }

  const cleanPath = trimmed.split('?')[0].split('#')[0];
  return VALID_EXT_REGEX.test(cleanPath);
};

/**
 * Prepend Base URL to filename for correct display
 */
const resolveFullImageUrl = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  const trimmed = filename.trim();

  // If already absolute or local asset
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('/photo/') || trimmed.startsWith('/assets/')) {
    return trimmed;
  }

  // Clean leading slashes and redundant 'media/'
  let clean = trimmed.replace(/^\/+/, '');
  if (clean.startsWith('media/')) {
    clean = clean.substring(6).replace(/^\/+/, '');
  }

  const encoded = encodeURI(clean);
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return `/media/${encoded}`;
  }

  return `${IMAGE_BASE_URL}/${encoded}`;
};

/**
 * Admin Dashboard Media Manager Component
 * Covers full CRUD lifecycle (GET /media/page/{page_name}, POST /upload-image, DELETE /delete-image)
 */
export default function AdminDashboardMediaManager({ 
  initialPage = 'kids-area',
  onClose,
  lang = 'en'
}) {
  // Page selection state
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Media data state
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadSection, setUploadSection] = useState('hero');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Deleting IDs tracker for granular loading state
  const [deletingFilenames, setDeletingFilenames] = useState(new Set());

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [copiedFilename, setCopiedFilename] = useState('');

  // Lightbox preview modal state
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3800);
  }, []);

  // =========================================================================
  // 1. FETCH IMAGES (GET /media/page/{page_name})
  // =========================================================================
  const fetchPageImages = useCallback(async (pageName, isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    setFetchError('');

    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const primaryEndpoint = isLocalhost 
      ? `/api/media/page/${encodeURIComponent(pageName)}` 
      : `${API_BASE_URL || ''}/api/media/page/${encodeURIComponent(pageName)}`;

    try {
      let response = await fetch(primaryEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...ANTI_CACHE_HEADERS
        },
        cache: 'no-store'
      });

      // Fallback to /api/media/section/{page_name} if /api/media/page returned 404
      if (!response.ok && (response.status === 404 || response.status === 405)) {
        const altEndpoint = isLocalhost 
          ? `/api/media/section/${encodeURIComponent(pageName)}` 
          : `${API_BASE_URL || ''}/api/media/section/${encodeURIComponent(pageName)}`;
        response = await fetch(altEndpoint, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json', 
            'ngrok-skip-browser-warning': 'true',
            ...ANTI_CACHE_HEADERS
          },
          cache: 'no-store'
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }

      const rawData = await response.json();

      // Extract and filter valid filenames
      let candidateList = [];
      if (Array.isArray(rawData)) {
        candidateList = rawData;
      } else if (rawData && typeof rawData === 'object') {
        const pool = rawData.images || rawData.data || rawData.filenames || rawData.files || [];
        candidateList = Array.isArray(pool) ? pool : [pool];
      }

      // Filter out invalid dummy strings (e.g. "fjlsgjghlsjflgsjfg")
      const validImages = candidateList
        .map(item => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') {
            return item.filename || item.url || item.path || item.image || item.src || '';
          }
          return '';
        })
        .filter(isValidFilename)
        .map(filename => ({
          filename,
          url: resolveFullImageUrl(filename)
        }));

      setImages(validImages);
    } catch (err) {
      console.warn(`[AdminMediaManager] GET /media/page/${pageName} error:`, err);
      setFetchError(err.message || 'Failed to fetch images from backend.');
      setImages([]);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, []);

  // Fetch when page changes
  useEffect(() => {
    fetchPageImages(selectedPage);
  }, [selectedPage, fetchPageImages]);

  // Clean up object URL previews
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // =========================================================================
  // 2. UPLOAD IMAGE (POST /upload-image)
  // =========================================================================
  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP, SVG, AVIF).', 'error');
      return;
    }

    // 15MB size check
    if (file.size > 15 * 1024 * 1024) {
      showToast('File size exceeds the 15MB limit. Please choose a smaller image.', 'error');
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      showToast('Please select an image file to upload.', 'error');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('images', selectedFile);
    formData.append('file', selectedFile);
    formData.append('page', selectedPage);
    formData.append('page_name', selectedPage);
    formData.append('section', uploadSection);
    formData.append('name', selectedFile.name);

    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const primaryEndpoint = isLocalhost ? '/api/upload-image' : `${API_BASE_URL || ''}/api/upload-image`;

    try {
      let response = await fetch(primaryEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          ...ANTI_CACHE_HEADERS
          // Browser sets multipart/form-data boundary automatically
        },
        cache: 'no-store'
      });

      // Fallback to /api/media if /api/upload-image returned 404 or 405
      if (!response.ok && (response.status === 404 || response.status === 405)) {
        const fallbackEndpoint = isLocalhost ? '/api/media' : `${API_BASE_URL || ''}/api/media`;
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          body: formData,
          headers: { 
            'ngrok-skip-browser-warning': 'true',
            ...ANTI_CACHE_HEADERS
          },
          cache: 'no-store'
        });
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Upload failed with HTTP ${response.status}: ${errText || response.statusText}`);
      }

      const resData = await response.json().catch(() => ({}));
      console.log('[AdminMediaManager] POST /upload-image success:', resData);

      showToast(`Image "${selectedFile.name}" uploaded successfully!`, 'success');

      // Clear upload form
      setSelectedFile(null);
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Requirement 4: Immediate Admin UI Synchronization (re-fetch & propagate)
      await fetchPageImages(selectedPage, true);

      // Broadcast event so client-side components update in real-time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('media-updated', { detail: { page: selectedPage } }));
      }
    } catch (err) {
      console.error('[AdminMediaManager] Upload error:', err);
      showToast(err.message || 'Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // =========================================================================
  // 3. DELETE IMAGE (DELETE /delete-image)
  // =========================================================================
  const handleDeleteImage = async (filename) => {
    if (!filename) return;

    // Prompt admin confirmation per Requirement 3
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete this image from the backend?\n\nFile: ${filename}\nPage: ${selectedPage}`
    );
    if (!confirmed) return;

    // Add to deleting tracker
    setDeletingFilenames(prev => new Set(prev).add(filename));

    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const primaryEndpoint = isLocalhost ? '/api/delete-image' : `${API_BASE_URL || ''}/api/delete-image`;

    try {
      // 1. Try sending DELETE with JSON body and anti-cache headers (NO query params)
      let response = await fetch(primaryEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...ANTI_CACHE_HEADERS
        },
        cache: 'no-store',
        body: JSON.stringify({ 
          filename, 
          image: filename, 
          id: filename, 
          page: selectedPage 
        })
      });

      // 2. Fallback to /api/media/{filename} without query params
      if (!response.ok && (response.status === 404 || response.status === 405)) {
        const altEndpoint = isLocalhost 
          ? `/api/media/${encodeURIComponent(filename)}` 
          : `${API_BASE_URL || ''}/api/media/${encodeURIComponent(filename)}`;
        response = await fetch(altEndpoint, {
          method: 'DELETE',
          headers: { 
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...ANTI_CACHE_HEADERS
          },
          cache: 'no-store'
        });
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Deletion failed with HTTP ${response.status}: ${errText || response.statusText}`);
      }

      showToast(`Image "${filename}" removed successfully.`, 'success');

      // Requirement 4: Immediate UI update (optimistic removal + re-fetch)
      setImages(prev => prev.filter(item => item.filename !== filename));
      await fetchPageImages(selectedPage, true);

      // Broadcast event so client-side components update in real-time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('media-updated', { detail: { page: selectedPage, deleted: filename } }));
      }
    } catch (err) {
      console.error('[AdminMediaManager] Delete error:', err);
      showToast(err.message || 'Failed to delete image.', 'error');
    } finally {
      setDeletingFilenames(prev => {
        const updated = new Set(prev);
        updated.delete(filename);
        return updated;
      });
    }
  };

  // Copy Image URL to clipboard
  const handleCopyUrl = (url, filename) => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedFilename(filename);
      setTimeout(() => setCopiedFilename(''), 2200);
      showToast('Image URL copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Could not copy URL.', 'error');
    });
  };

  // Filtered images list based on search query
  const filteredImages = images.filter(img => {
    if (!searchQuery.trim()) return true;
    return img.filename.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="amm-root-container">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`amm-toast-banner ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon" />
          ) : (
            <AlertCircle size={18} className="toast-icon" />
          )}
          <span className="toast-text">{toast.message}</span>
          <button 
            type="button" 
            className="toast-close-btn"
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="amm-header">
        <div className="amm-header-left">
          <div className="amm-header-badge">
            <ImageIcon size={18} />
            <span>Apidog API Integration</span>
          </div>
          <h2 className="amm-title">Admin Dashboard Media Manager</h2>
          <p className="amm-subtitle">
            Direct real-time management of backend assets (GET /media/page, POST /upload-image, DELETE /delete-image).
          </p>
        </div>

        <div className="amm-header-actions">
          <button 
            type="button" 
            className="amm-refresh-btn"
            onClick={() => fetchPageImages(selectedPage)}
            disabled={isLoading || isUploading}
            title="Re-fetch images from backend"
          >
            <RefreshCw size={15} className={isLoading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>

          {onClose && (
            <button 
              type="button" 
              className="amm-close-btn"
              onClick={onClose}
              title="Close Media Manager"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Page Navigation Tabs */}
      <nav className="amm-page-nav">
        <div className="amm-page-tabs-scroll">
          {ADMIN_PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`amm-page-tab ${selectedPage === page.id ? 'active' : ''}`}
              onClick={() => {
                if (selectedPage !== page.id) {
                  setSelectedPage(page.id);
                  setSearchQuery('');
                }
              }}
              disabled={isLoading || isUploading}
            >
              <Folder size={14} />
              <span>{lang === 'ar' ? page.labelAr : page.labelEn}</span>
              {selectedPage === page.id && (
                <span className="amm-active-count-badge">{images.length}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Grid Content */}
      <div className="amm-layout-body">
        
        {/* Left Column: Upload Panel (POST /upload-image) */}
        <section className="amm-upload-card">
          <div className="amm-card-header">
            <UploadCloud size={20} className="amm-card-header-icon" />
            <div>
              <h3 className="amm-card-title">Upload New Image</h3>
              <p className="amm-card-desc">
                Sends multipart/form-data to <code>POST /upload-image</code> for <strong>{selectedPage}</strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="amm-upload-form">
            
            {/* Drag & Drop Upload Zone */}
            <div 
              className={`amm-dropzone ${isDragOver ? 'drag-over' : ''} ${previewUrl ? 'has-preview' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif,image/gif"
                className="amm-hidden-file-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {previewUrl ? (
                <div className="amm-preview-container" onClick={(e) => e.stopPropagation()}>
                  <img src={previewUrl} alt="Upload preview" className="amm-preview-image" />
                  <div className="amm-preview-info">
                    <span className="amm-file-name" title={selectedFile?.name}>{selectedFile?.name}</span>
                    <span className="amm-file-size">
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}
                    </span>
                    <button 
                      type="button" 
                      className="amm-remove-preview-btn"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      title="Remove file"
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="amm-dropzone-prompt">
                  <div className="amm-upload-icon-circle">
                    <UploadCloud size={28} />
                  </div>
                  <span className="amm-dropzone-main-text">
                    Drag &amp; drop an image here, or <strong className="text-cyan">browse</strong>
                  </span>
                  <span className="amm-dropzone-sub-text">
                    Supports JPG, PNG, WEBP, SVG, AVIF (Max 15MB)
                  </span>
                </div>
              )}
            </div>

            {/* Target Section selection */}
            <div className="amm-form-row">
              <label className="amm-form-label">
                <Layers size={13} />
                <span>Target Section / Category:</span>
              </label>
              <select 
                className="amm-select-input"
                value={uploadSection}
                onChange={(e) => setUploadSection(e.target.value)}
                disabled={isUploading}
              >
                <option value="hero">Hero Carousel Banner</option>
                <option value="explore">Explore Gallery</option>
                <option value="attractions">Attractions &amp; Rides</option>
                <option value="vibes">Playzone Vibes</option>
                <option value="general">General Media</option>
              </select>
            </div>

            {/* Upload Button */}
            <button 
              type="submit" 
              className="amm-submit-upload-btn"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <RefreshCw size={16} className="spinning" />
                  <span>Uploading to Backend...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Upload Image to {selectedPage}</span>
                </>
              )}
            </button>
          </form>

          {/* Integration Note */}
          <div className="amm-info-callout">
            <span className="callout-dot" />
            <p>
              Uploaded assets are saved to the backend database. Client pages polling this endpoint will automatically reflect new images.
            </p>
          </div>
        </section>

        {/* Right Column: Images Gallery Grid (GET /media/page/{page_name}) */}
        <section className="amm-gallery-card">
          
          {/* Gallery Toolbar */}
          <div className="amm-gallery-toolbar">
            <div className="toolbar-left">
              <div className="search-wrap">
                <Search size={15} className="search-icon" />
                <input 
                  type="text"
                  placeholder="Search current page images by filename..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="toolbar-right">
              <span className="badge-count">
                {filteredImages.length} of {images.length} Image{images.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="amm-loading-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-thumbnail" />
                  <div className="skeleton-line full" />
                  <div className="skeleton-line half" />
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {!isLoading && fetchError && (
            <div className="amm-error-box">
              <AlertCircle size={22} className="error-icon" />
              <div className="error-content">
                <h4>Error Loading Images for "{selectedPage}"</h4>
                <p>{fetchError}</p>
                <button 
                  type="button" 
                  className="error-retry-btn"
                  onClick={() => fetchPageImages(selectedPage)}
                >
                  <RefreshCw size={13} />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !fetchError && filteredImages.length === 0 && (
            <div className="amm-empty-box">
              <div className="empty-icon-wrap">
                <ImageIcon size={38} />
              </div>
              <h4>No Images Found for "{selectedPage}"</h4>
              <p>
                {searchQuery 
                  ? `No images match your filter "${searchQuery}". Clear search to view all.`
                  : `This page does not have any active media uploaded yet. Use the upload panel on the left to add the first image.`}
              </p>
              {searchQuery && (
                <button 
                  type="button" 
                  className="empty-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}

          {/* Grid Layout of Image Cards */}
          {!isLoading && !fetchError && filteredImages.length > 0 && (
            <div className="amm-images-grid">
              {filteredImages.map((img) => {
                const isDeleting = deletingFilenames.has(img.filename);
                const isCopied = copiedFilename === img.filename;

                return (
                  <div key={img.filename} className={`amm-image-card ${isDeleting ? 'deleting' : ''}`}>
                    
                    {/* Thumbnail Wrap */}
                    <div className="card-thumb-wrap">
                      <img 
                        src={img.url} 
                        alt={img.filename} 
                        className="card-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/photo/kid area pic/Graphic Composition.png';
                        }}
                      />

                      {/* Hover Overlay with Preview & Copy */}
                      <div className="card-hover-overlay">
                        <button 
                          type="button" 
                          className="overlay-btn view"
                          onClick={() => setActivePreviewImage(img)}
                          title="Preview full size"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>

                        <button 
                          type="button" 
                          className={`overlay-btn copy ${isCopied ? 'copied' : ''}`}
                          onClick={() => handleCopyUrl(img.url, img.filename)}
                          title="Copy Full Image URL"
                        >
                          {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
                        </button>
                      </div>

                      {/* Deleting Indicator Spinner */}
                      {isDeleting && (
                        <div className="card-deleting-overlay">
                          <RefreshCw size={24} className="spinning" />
                          <span>Deleting...</span>
                        </div>
                      )}
                    </div>

                    {/* Card Meta & Actions */}
                    <div className="card-details">
                      <div className="card-filename-row">
                        <span className="card-filename" title={img.filename}>
                          {img.filename}
                        </span>
                      </div>

                      <div className="card-actions-row">
                        <span className="card-endpoint-tag">
                          <code>GET /media</code>
                        </span>

                        {/* DELETE BUTTON (DELETE /delete-image) */}
                        <button
                          type="button"
                          className="card-delete-btn"
                          onClick={() => handleDeleteImage(img.filename)}
                          disabled={isDeleting || isUploading}
                          title={`Delete "${img.filename}" from backend`}
                        >
                          {isDeleting ? (
                            <RefreshCw size={13} className="spinning" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>

      {/* Full Size Image Preview Modal */}
      {activePreviewImage && (
        <div className="amm-modal-backdrop" onClick={() => setActivePreviewImage(null)}>
          <div className="amm-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="amm-modal-top">
              <div className="modal-title-wrap">
                <ImageIcon size={18} />
                <span className="modal-title">{activePreviewImage.filename}</span>
              </div>
              <div className="modal-top-actions">
                <a 
                  href={activePreviewImage.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="modal-open-link"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={15} />
                  <span>Open URL</span>
                </a>
                <button 
                  type="button" 
                  className="modal-close-x"
                  onClick={() => setActivePreviewImage(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="amm-modal-image-wrap">
              <img 
                src={activePreviewImage.url} 
                alt={activePreviewImage.filename} 
                className="amm-modal-full-img"
              />
            </div>

            <div className="amm-modal-footer">
              <div className="modal-footer-url">
                <span className="url-label">Resolved URL:</span>
                <code className="url-code">{activePreviewImage.url}</code>
              </div>
              <button 
                type="button" 
                className="modal-footer-copy-btn"
                onClick={() => handleCopyUrl(activePreviewImage.url, activePreviewImage.filename)}
              >
                <Copy size={14} />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
