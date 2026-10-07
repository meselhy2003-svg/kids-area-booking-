import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  fetchPageImages, 
  uploadImage, 
  getImageUrl, 
  isValidImageFilename, 
  IMAGE_BASE_URL 
} from '../../services/imageApiService';
import './ImageGalleryUploader.css';

/**
 * ImageGalleryUploader Component
 * 
 * Production-ready React component satisfying:
 * 1. GET /media/page/{page_name} fetching with base URL prepending & dummy string filtering.
 * 2. POST /upload-image multipart/form-data upload.
 * 3. Immediate UI synchronization (optimistic + instant re-fetch without manual reload).
 * 4. Comprehensive state management (loading, error, success for both fetch & upload).
 */
export const ImageGalleryUploader = ({ 
  pageName: initialPageName = 'kids-area',
  title = 'إدارة ورفع الوسائط | Media Management & Uploader',
  allowPageSwitch = true,
  onUploadSuccess = null
}) => {
  // Page selection state
  const [activePage, setActivePage] = useState(initialPageName);

  // Fetching state
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Uploading state
  const [selectedFile, setSelectedFile] = useState(null);
  const [localFilePreview, setLocalFilePreview] = useState(null);
  const [sectionName, setSectionName] = useState('hero');
  const [imageDisplayName, setImageDisplayName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // UI helpers
  const [copiedFilename, setCopiedFilename] = useState(null);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const availablePages = [
    { key: 'kids-area', label: 'Kids Area (منطقة الأطفال)' },
    { key: 'hero', label: 'Hero Banners (البانر الرئيسي)' },
    { key: 'fun-park', label: 'Fun Park (حديقة المرح)' },
    { key: 'home', label: 'Home Page (الصفحة الرئيسية)' },
    { key: 'challenge', label: 'Challenge Zone (منطقة التحدي)' },
    { key: 'adventure', label: 'Adventure (المغامرة)' },
    { key: 'events', label: 'Events (الفعاليات)' }
  ];

  /**
   * 1. Fetch images from GET /media/page/{page_name}
   */
  const loadImages = useCallback(async (targetPage = activePage, silent = false) => {
    if (!silent) {
      setIsLoadingImages(true);
    }
    setFetchError(null);

    try {
      const result = await fetchPageImages(targetPage);
      console.log(`[ImageGalleryUploader] Loaded images data for page "${targetPage}":`, result);

      if (result.success) {
        // Valid image filenames (already filtered out dummy strings like "fjlsgjghlsjflgsjfg")
        setImages(result.filenames);
      } else {
        setFetchError(result.error || 'Failed to load images from the server.');
      }
    } catch (err) {
      setFetchError(err.message || 'Unexpected network error.');
    } finally {
      if (!silent) {
        setIsLoadingImages(false);
      }
    }
  }, [activePage]);

  // Initial fetch and on activePage change
  useEffect(() => {
    loadImages(activePage);
  }, [activePage, loadImages]);

  // Handle file selection and client-side preview
  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP, SVG).');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);

    // Generate local preview URL
    const objectUrl = URL.createObjectURL(file);
    setLocalFilePreview(objectUrl);

    // Default name
    if (!imageDisplayName) {
      setImageDisplayName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  // Clean up object URL on unmount or file reset
  useEffect(() => {
    return () => {
      if (localFilePreview) {
        URL.revokeObjectURL(localFilePreview);
      }
    };
  }, [localFilePreview]);

  /**
   * 2. Upload image via POST /upload-image & 3. Immediate UI Sync
   */
  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!selectedFile) {
      setUploadError('يرجى اختيار صورة أولاً للرفع.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Progress simulation for responsive UX
      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 250);

      const result = await uploadImage({
        file: selectedFile,
        pageName: activePage,
        section: sectionName,
        name: imageDisplayName.trim() || selectedFile.name
      });

      console.log('[ImageGalleryUploader] Upload response data:', result);

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (result.success) {
        setUploadSuccess('تم رفع الصورة بنجاح وتحديث الموقع فوراً!');
        
        // 3. IMMEDIATE UI SYNC:
        // Optimistically insert filename if available
        if (result.filename && isValidImageFilename(result.filename)) {
          setImages(prev => {
            if (prev.includes(result.filename)) return prev;
            return [result.filename, ...prev];
          });
        }

        // Trigger immediate server re-fetch without manual page reload
        await loadImages(activePage, true);

        // Reset upload form
        setSelectedFile(null);
        setLocalFilePreview(null);
        setImageDisplayName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // External callback
        if (typeof onUploadSuccess === 'function') {
          onUploadSuccess(result);
        }

        // Auto-dismiss success notification after 5 seconds
        setTimeout(() => {
          setUploadSuccess(null);
          setUploadProgress(0);
        }, 5000);
      } else {
        setUploadError(result.error || 'فشل رفع الصورة على الخادم.');
      }
    } catch (err) {
      setUploadError(err.message || 'حدث خطأ غير متوقع أثناء الرفع.');
    } finally {
      setIsUploading(false);
    }
  };

  // Clipboard copy helper
  const handleCopyUrl = (filename) => {
    const fullUrl = getImageUrl(filename);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedFilename(filename);
      setTimeout(() => setCopiedFilename(null), 2000);
    }).catch(() => {
      // Fallback
      setCopiedFilename(filename);
      setTimeout(() => setCopiedFilename(null), 2000);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="igu-container" dir="rtl">
      {/* Header */}
      <div className="igu-header">
        <div className="igu-header-title-wrap">
          <div className="igu-header-icon-badge">
            <Sparkles size={22} className="igu-icon-sparkle" />
          </div>
          <div>
            <h2 className="igu-title">{title}</h2>
            <p className="igu-subtitle">
              ربط مباشر مع واجهة برمجة التطبيقات (Apidog API) - عرض فوري ورفع متزامن بدون إعادة تحميل.
            </p>
          </div>
        </div>

        <div className="igu-header-actions">
          {allowPageSwitch && (
            <div className="igu-page-select-wrap">
              <Layers size={16} />
              <select 
                value={activePage} 
                onChange={(e) => setActivePage(e.target.value)}
                className="igu-select"
                aria-label="اختر الصفحة"
              >
                {availablePages.map(page => (
                  <option key={page.key} value={page.key}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="button" 
            onClick={() => loadImages(activePage)}
            className="igu-btn-refresh"
            disabled={isLoadingImages}
            title="تحديث قائمة الصور"
          >
            <RefreshCw size={16} className={isLoadingImages ? 'igu-spinning' : ''} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <section className="igu-upload-card">
        <h3 className="igu-section-heading">
          <UploadCloud size={20} />
          <span>رفع صورة جديدة (POST /upload-image)</span>
        </h3>

        {/* Upload Notifications */}
        {uploadSuccess && (
          <div className="igu-alert igu-alert-success" role="alert">
            <CheckCircle2 size={18} />
            <span>{uploadSuccess}</span>
            <button 
              type="button" 
              onClick={() => setUploadSuccess(null)} 
              className="igu-alert-close"
              aria-label="إغلاق التنبيه"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="igu-alert igu-alert-error" role="alert">
            <AlertCircle size={18} />
            <span>{uploadError}</span>
            <button 
              type="button" 
              onClick={() => setUploadError(null)} 
              className="igu-alert-close"
              aria-label="إغلاق التنبيه"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Dropzone Area */}
        <div 
          className={`igu-dropzone ${isDragOver ? 'igu-dropzone-active' : ''} ${selectedFile ? 'igu-dropzone-has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            className="igu-hidden-input"
          />

          {!selectedFile ? (
            <div className="igu-dropzone-placeholder">
              <UploadCloud size={44} className="igu-dropzone-icon" />
              <p className="igu-dropzone-text">
                اسحب الصورة وأفلتها هنا، أو <span className="igu-link-text">تصفح ملفات جهازك</span>
              </p>
              <span className="igu-dropzone-hint">
                يدعم صيغ JPG, PNG, WebP, SVG (الحد الأقصى 10MB)
              </span>
            </div>
          ) : (
            <div className="igu-file-preview-card">
              <div className="igu-preview-img-box">
                <img src={localFilePreview} alt="معاينة الصورة" />
              </div>
              <div className="igu-preview-info">
                <div className="igu-preview-meta">
                  <strong className="igu-preview-name">{selectedFile.name}</strong>
                  <span className="igu-preview-size">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setLocalFilePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="igu-btn-remove-preview"
                >
                  <X size={14} />
                  <span>تغيير الصورة</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Controls */}
        {selectedFile && (
          <form onSubmit={handleUploadSubmit} className="igu-upload-form-controls">
            <div className="igu-form-grid">
              <div className="igu-form-group">
                <label htmlFor="igu-img-name">اسم أو وصف الصورة (اختياري)</label>
                <input 
                  id="igu-img-name"
                  type="text"
                  value={imageDisplayName}
                  onChange={(e) => setImageDisplayName(e.target.value)}
                  placeholder="مثال: صورة الغلاف لمنطقة المرح"
                  className="igu-input"
                />
              </div>

              <div className="igu-form-group">
                <label htmlFor="igu-sec-name">القسم المستهدف (Section)</label>
                <select 
                  id="igu-sec-name"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  className="igu-input"
                >
                  <option value="hero">Hero (البانر الرئيسي العلوي)</option>
                  <option value="explore">Explore (استكشف الألعاب والمناطق)</option>
                  <option value="vibes">Vibes (معرض الأجواء)</option>
                  <option value="gallery">Gallery (معرض الصور العام)</option>
                </select>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="igu-progress-wrap">
                <div className="igu-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            {/* Submit Action */}
            <div className="igu-submit-actions">
              <button 
                type="submit" 
                disabled={isUploading}
                className="igu-btn-primary"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={18} className="igu-spinning" />
                    <span>جاري الرفع والمزامنة... ({uploadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    <span>رفع ونشر الصورة فوراً</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Gallery Section: GET /media/page/{page_name} */}
      <section className="igu-gallery-section">
        <div className="igu-gallery-header">
          <div className="igu-gallery-title-wrap">
            <ImageIcon size={20} />
            <h3 className="igu-section-heading">
              صور الصفحة الحالية: <span className="igu-active-page-badge">{activePage}</span>
            </h3>
          </div>
          <span className="igu-images-count-badge">
            {images.length} صورة متاحة
          </span>
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="igu-alert igu-alert-error" role="alert">
            <AlertCircle size={18} />
            <div className="igu-alert-content">
              <span>{fetchError}</span>
              <button 
                type="button" 
                onClick={() => loadImages(activePage)}
                className="igu-btn-inline-retry"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoadingImages ? (
          <div className="igu-grid-skeleton">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="igu-skeleton-card">
                <div className="igu-skeleton-thumb"></div>
                <div className="igu-skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="igu-empty-state">
            <ImageIcon size={48} className="igu-empty-icon" />
            <h4>لا توجد صور مسجلة لهذه الصفحة حالياً</h4>
            <p>يمكنك رفع صورة جديدة من الأعلى لتظهر هنا فوراً في الوقت الفعلي.</p>
          </div>
        ) : (
          <div className="igu-images-grid">
            {images.map((filename, index) => {
              // Prepend Base URL to filename (Requirement 1)
              const fullImageUrl = getImageUrl(filename);

              return (
                <div key={`${filename}-${index}`} className="igu-image-card">
                  <div 
                    className="igu-image-thumb-box"
                    onClick={() => setSelectedLightboxImage(fullImageUrl)}
                    title="انقر للمعاينة بحجم كامل"
                  >
                    <img 
                      src={fullImageUrl} 
                      alt={`صورة ${filename}`}
                      loading="lazy"
                      onError={(e) => {
                        // Safe fallback image for broken assets
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20fill%3D%22%231e293b%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EImage%20Offline%3C%2Ftext%3E%3C%2Fsvg%3E';
                      }}
                    />
                    <div className="igu-thumb-overlay">
                      <ExternalLink size={20} />
                      <span>معاينة</span>
                    </div>
                  </div>

                  <div className="igu-image-card-footer">
                    <span className="igu-filename" title={filename}>
                      {filename}
                    </span>

                    <button 
                      type="button"
                      onClick={() => handleCopyUrl(filename)}
                      className={`igu-btn-copy ${copiedFilename === filename ? 'igu-copied' : ''}`}
                      title="نسخ رابط الصورة المباشر"
                    >
                      {copiedFilename === filename ? (
                        <>
                          <Check size={14} />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedLightboxImage && (
        <div 
          className="igu-lightbox-backdrop" 
          onClick={() => setSelectedLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="igu-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              onClick={() => setSelectedLightboxImage(null)}
              className="igu-lightbox-close"
              aria-label="إغلاق المعاينة"
            >
              <X size={20} />
            </button>
            <img src={selectedLightboxImage} alt="عرض مكبّر" className="igu-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryUploader;
