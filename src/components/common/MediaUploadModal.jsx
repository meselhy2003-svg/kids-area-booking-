import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './MediaUploadModal.css';
import { 
  uploadMediaImage, 
  deleteMediaImage, 
  getMediaByPage, 
  PAGE_MEDIA_KEYS, 
  resolveImageUrl 
} from '../../api/mediaService';

export default function MediaUploadModal({ 
  isOpen, 
  closeModal, 
  setActiveTab, 
  lang = 'ar' 
}) {
  const isArabic = lang === 'ar';

  // Active Tab: 'upload' | 'library'
  const [activeTabName, setActiveTabName] = useState('upload');

  // Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [targetPage, setTargetPage] = useState('kids-area');
  const [targetSection, setTargetSection] = useState('hero');
  const [imageName, setImageName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Library State
  const [libraryFilterPage, setLibraryFilterPage] = useState('all');
  const [libraryItems, setLibraryItems] = useState([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');

  const fileInputRef = useRef(null);

  // Pages options
  const pagesList = [
    { key: PAGE_MEDIA_KEYS.KIDS_AREA, nameAr: 'منطقة الأطفال', nameEn: 'Kids Area' },
    { key: PAGE_MEDIA_KEYS.FUN_PARK, nameAr: 'فن بارك', nameEn: 'Fun Park' },
    { key: PAGE_MEDIA_KEYS.CHALLENGE, nameAr: 'منطقة التحدي', nameEn: 'Challenge Zone' },
    { key: PAGE_MEDIA_KEYS.ADVENTURE, nameAr: 'منطقة المغامرة', nameEn: 'Adventure Zone' },
    { key: PAGE_MEDIA_KEYS.EVENTS, nameAr: 'الفعاليات', nameEn: 'Events' },
    { key: PAGE_MEDIA_KEYS.HOME, nameAr: 'الصفحة الرئيسية', nameEn: 'Home Page' },
    { key: PAGE_MEDIA_KEYS.ABOUT, nameAr: 'من نحن', nameEn: 'About Us' },
    { key: PAGE_MEDIA_KEYS.PACKAGE, nameAr: 'الباقات والعروض', nameEn: 'Packages' },
    { key: PAGE_MEDIA_KEYS.TRIPS, nameAr: 'الرحلات المدرسية', nameEn: 'Trips' }
  ];

  // Sections options
  const sectionsList = [
    { key: 'hero', nameAr: 'البانر الرئيسي (Hero Banner)', nameEn: 'Hero Banner' },
    { key: 'explore', nameAr: 'استكشف والألعاب (Explore & Games)', nameEn: 'Explore & Attractions' },
    { key: 'vibes', nameAr: 'الأجواء والمعرض (Vibes & Gallery)', nameEn: 'Vibes & Gallery' },
    { key: 'destination', nameAr: 'وجهات مميزة (Destination)', nameEn: 'Destination Highlights' },
    { key: 'games', nameAr: 'ألعاب ومناطق مرح (Games)', nameEn: 'Games' },
    { key: 'general', nameAr: 'عام (General)', nameEn: 'General' }
  ];

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(isArabic ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, etc.)' : 'Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(null);

    // Auto-fill image name from file name
    const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    if (!imageName) {
      setImageName(rawName.replace(/[-_]/g, ' '));
    }

    // Create object URL for instant preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadError('');
        setUploadSuccess(null);
        const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        if (!imageName) {
          setImageName(rawName.replace(/[-_]/g, ' '));
        }
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setUploadError(isArabic ? 'الملف المحدد ليس صورة' : 'Selected file is not an image');
      }
    }
  };

  // Clean preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Submit Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError(isArabic ? 'يرجى اختيار صورة أولاً' : 'Please choose an image first');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(null);

    try {
      const res = await uploadMediaImage({
        file: selectedFile,
        page: targetPage,
        section: targetSection,
        name: imageName.trim() || 'Uploaded Image'
      });

      if (res.success && res.data) {
        setUploadSuccess(res);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // confetti optional
        }
      } else {
        setUploadError(res.error || (isArabic ? 'فشل رفع الصورة' : 'Failed to upload image'));
      }
    } catch (err) {
      setUploadError(err.message || (isArabic ? 'حدث خطأ أثناء الرفع' : 'Upload error occurred'));
    } finally {
      setIsUploading(false);
    }
  };

  // Load Library Items
  const loadLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const targetPages = libraryFilterPage === 'all' 
        ? pagesList.map(p => p.key) 
        : [libraryFilterPage];

      const results = await Promise.allSettled(
        targetPages.map(pk => getMediaByPage(pk))
      );

      const allItems = [];
      results.forEach((res, idx) => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          allItems.push(...res.value);
        }
      });

      // Deduplicate by _id
      const seen = new Set();
      const unique = allItems.filter(item => {
        if (!item._id) return true;
        if (seen.has(item._id)) return false;
        seen.add(item._id);
        return true;
      });

      // Sort newest first
      unique.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setLibraryItems(unique);
    } catch (err) {
      console.warn('Library load note:', err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (activeTabName === 'library') {
      loadLibrary();
    }
  }, [activeTabName, libraryFilterPage]);

  // Handle Delete
  const handleDelete = async (item) => {
    if (!item._id) return;
    const confirmMsg = isArabic
      ? `هل أنت متأكد من حذف الصورة "${item.name || 'الصورة'}" من الموقع؟`
      : `Are you sure you want to delete "${item.name || 'Image'}" from the website?`;
    
    if (!window.confirm(confirmMsg)) return;

    setDeletingId(item._id);
    try {
      const res = await deleteMediaImage(item._id, item.page, item.section);
      if (res.success) {
        setLibraryItems(prev => prev.filter(it => it._id !== item._id));
      } else {
        alert(res.error || (isArabic ? 'فشل حذف الصورة' : 'Failed to delete'));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Reset form to upload another
  const handleResetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageName('');
    setUploadSuccess(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Go to page
  const handleGoToPage = (pageKey) => {
    if (setActiveTab) {
      setActiveTab(pageKey);
    }
    if (closeModal) {
      closeModal();
    }
  };

  const copyToClipboard = (url) => {
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className={`media-upload-overlay ${isArabic ? 'rtl' : 'ltr'}`} onClick={closeModal}>
      <div 
        className="media-upload-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        {/* Modal Header */}
        <div className="media-modal-header">
          <div className="media-modal-title-wrap">
            <span className="media-modal-icon">📸</span>
            <div>
              <h2 className="media-modal-title font-alexandria">
                {isArabic ? 'إدارة ورفع صور الموقع' : 'Upload & Manage Site Media'}
              </h2>
              <p className="media-modal-subtitle">
                {isArabic 
                  ? 'رفع الصور مباشرة إلى السيرفر والـ API لتظهر في الموقع فوراً' 
                  : 'Upload images directly to the backend API to show instantly on the site'}
              </p>
            </div>
          </div>
          <button 
            className="media-modal-close-btn" 
            onClick={closeModal}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="media-modal-tabs">
          <button 
            type="button"
            className={`media-tab-btn ${activeTabName === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTabName('upload')}
          >
            <span>⬆️</span>
            <span>{isArabic ? 'رفع صورة جديدة' : 'Upload New Image'}</span>
          </button>
          <button 
            type="button"
            className={`media-tab-btn ${activeTabName === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTabName('library')}
          >
            <span>🖼️</span>
            <span>{isArabic ? 'الصور المرفوعة على الموقع' : 'Live Media Library'}</span>
            {libraryItems.length > 0 && (
              <span className="media-tab-count">{libraryItems.length}</span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: UPLOAD NEW IMAGE */}
        {/* ========================================================================= */}
        {activeTabName === 'upload' && (
          <div className="media-tab-content">
            {uploadSuccess ? (
              /* Success Result View */
              <div className="media-success-card">
                <div className="media-success-badge">✓ {isArabic ? 'تم الرفع بنجاح!' : 'Uploaded Successfully!'}</div>
                <h3 className="media-success-title font-alexandria">
                  {isArabic ? 'تمت إضافة الصورة إلى الموقع بنجاح' : 'Image is now live on the website!'}
                </h3>

                {uploadSuccess.imageUrl && (
                  <div className="media-success-preview">
                    <img 
                      src={uploadSuccess.imageUrl} 
                      alt={uploadSuccess.data?.name || 'Uploaded'} 
                      className="media-success-img"
                    />
                  </div>
                )}

                <div className="media-success-details">
                  <div className="media-detail-row">
                    <span className="media-detail-label">{isArabic ? 'اسم الصورة:' : 'Title:'}</span>
                    <span className="media-detail-value">{uploadSuccess.data?.name}</span>
                  </div>
                  <div className="media-detail-row">
                    <span className="media-detail-label">{isArabic ? 'الصفحة:' : 'Page:'}</span>
                    <span className="media-detail-value tag-cyan">{uploadSuccess.data?.page}</span>
                  </div>
                  <div className="media-detail-row">
                    <span className="media-detail-label">{isArabic ? 'القسم:' : 'Section:'}</span>
                    <span className="media-detail-value tag-gold">{uploadSuccess.data?.section}</span>
                  </div>
                  {uploadSuccess.imageUrl && (
                    <div className="media-detail-row media-url-row">
                      <span className="media-detail-label">{isArabic ? 'الرابط المباشر:' : 'Live URL:'}</span>
                      <button 
                        type="button"
                        className="media-copy-btn"
                        onClick={() => copyToClipboard(uploadSuccess.imageUrl)}
                      >
                        {copiedUrl === uploadSuccess.imageUrl 
                          ? (isArabic ? '✓ تم النسخ' : '✓ Copied') 
                          : (isArabic ? '📋 نسخ الرابط' : '📋 Copy URL')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="media-success-actions">
                  <button 
                    type="button" 
                    className="media-btn-primary font-alexandria"
                    onClick={() => handleGoToPage(targetPage)}
                  >
                    <span>👀</span>
                    <span>{isArabic ? `عرض الصفحة (${targetPage})` : `Go to Page (${targetPage})`}</span>
                  </button>
                  <button 
                    type="button" 
                    className="media-btn-secondary font-alexandria"
                    onClick={handleResetForm}
                  >
                    <span>➕</span>
                    <span>{isArabic ? 'رفع صورة أخرى' : 'Upload Another Image'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Form View */
              <form onSubmit={handleUpload} className="media-upload-form">
                {uploadError && (
                  <div className="media-error-alert">
                    <span>⚠️</span>
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Drag and Drop Zone */}
                <div 
                  className={`media-dropzone ${previewUrl ? 'has-file' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {previewUrl ? (
                    <div className="media-dropzone-preview">
                      <img src={previewUrl} alt="Preview" className="media-preview-thumbnail" />
                      <div className="media-dropzone-change-overlay">
                        <span>🔄 {isArabic ? 'انقر لتغيير الصورة' : 'Click to change image'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="media-dropzone-empty">
                      <div className="media-dropzone-icon">📁</div>
                      <div className="media-dropzone-text font-alexandria">
                        {isArabic ? 'اسحب الصورة وأفلتها هنا أو اضغط للاختيار' : 'Drag & drop image here or click to browse'}
                      </div>
                      <div className="media-dropzone-hint">
                        PNG, JPG, JPEG, WEBP, GIF (Max 10MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Grid */}
                <div className="media-form-grid">
                  {/* Target Page */}
                  <div className="media-form-group">
                    <label className="media-label font-alexandria">
                      <span>📄</span> {isArabic ? 'اختر الصفحة المستهدفة' : 'Target Page'}
                    </label>
                    <select 
                      className="media-select font-alexandria"
                      value={targetPage}
                      onChange={(e) => setTargetPage(e.target.value)}
                    >
                      {pagesList.map(p => (
                        <option key={p.key} value={p.key}>
                          {isArabic ? p.nameAr : p.nameEn} ({p.key})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Section */}
                  <div className="media-form-group">
                    <label className="media-label font-alexandria">
                      <span>🎯</span> {isArabic ? 'اختر قسم الصفحة' : 'Target Section'}
                    </label>
                    <select 
                      className="media-select font-alexandria"
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                    >
                      {sectionsList.map(s => (
                        <option key={s.key} value={s.key}>
                          {isArabic ? s.nameAr : s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Name / Title */}
                  <div className="media-form-group full-width">
                    <label className="media-label font-alexandria">
                      <span>🏷️</span> {isArabic ? 'عنوان / اسم الصورة' : 'Image Title / Caption'}
                    </label>
                    <input 
                      type="text"
                      className="media-input font-alexandria"
                      placeholder={isArabic ? 'مثال: بانر العيد المميز' : 'e.g. Special Holiday Banner'}
                      value={imageName}
                      onChange={(e) => setImageName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="media-form-footer">
                  <button 
                    type="submit" 
                    className="media-btn-primary full-width font-alexandria"
                    disabled={isUploading || !selectedFile}
                  >
                    {isUploading ? (
                      <>
                        <span className="media-spinner"></span>
                        <span>{isArabic ? 'جاري الرفع إلى السيرفر...' : 'Uploading to backend...'}</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>{isArabic ? 'رفع الصورة ونشرها في الموقع' : 'Upload & Publish Image'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE MEDIA LIBRARY */}
        {/* ========================================================================= */}
        {activeTabName === 'library' && (
          <div className="media-tab-content">
            {/* Filter Bar */}
            <div className="media-library-toolbar">
              <div className="media-filter-wrap">
                <label className="media-filter-label">
                  {isArabic ? 'تصفية حسب الصفحة:' : 'Filter by Page:'}
                </label>
                <select 
                  className="media-select-sm"
                  value={libraryFilterPage}
                  onChange={(e) => setLibraryFilterPage(e.target.value)}
                >
                  <option value="all">{isArabic ? 'جميع الصفحات' : 'All Pages'}</option>
                  {pagesList.map(p => (
                    <option key={p.key} value={p.key}>
                      {isArabic ? p.nameAr : p.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                className="media-refresh-btn"
                onClick={loadLibrary}
                disabled={isLoadingLibrary}
                title={isArabic ? 'تحديث القائمة' : 'Refresh'}
              >
                🔄 {isArabic ? 'تحديث' : 'Refresh'}
              </button>
            </div>

            {/* Items Grid */}
            {isLoadingLibrary ? (
              <div className="media-loading-state">
                <span className="media-spinner large"></span>
                <p>{isArabic ? 'جاري تحميل الصور من السيرفر...' : 'Fetching images from server...'}</p>
              </div>
            ) : libraryItems.length === 0 ? (
              <div className="media-empty-state">
                <span className="media-empty-icon">📭</span>
                <h4 className="font-alexandria">{isArabic ? 'لا توجد صور مرفوعة بعد' : 'No uploaded images found'}</h4>
                <p>{isArabic ? 'قم برفع صورتك الأولى من تبويب "رفع صورة جديدة" أعلاه' : 'Upload your first image from the upload tab above'}</p>
                <button 
                  type="button" 
                  className="media-btn-primary font-alexandria"
                  onClick={() => setActiveTabName('upload')}
                >
                  ➕ {isArabic ? 'رفع صورة الآن' : 'Upload Image Now'}
                </button>
              </div>
            ) : (
              <div className="media-library-grid">
                {libraryItems.map(item => {
                  const rawImg = Array.isArray(item.images) ? item.images[0] : item.images;
                  const fullUrl = resolveImageUrl(rawImg);
                  const isDeleting = deletingId === item._id;

                  return (
                    <div key={item._id || Math.random()} className="media-card-item">
                      <div className="media-card-img-wrap">
                        <img 
                          src={fullUrl} 
                          alt={item.name || 'Site Image'} 
                          className="media-card-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/photo/kid area pic/explore/1.png';
                          }}
                        />
                        <div className="media-card-badges">
                          <span className="card-badge-page">{item.page}</span>
                          <span className="card-badge-section">{item.section}</span>
                        </div>
                      </div>

                      <div className="media-card-info">
                        <h4 className="media-card-title truncate" title={item.name}>
                          {item.name || (isArabic ? 'صورة بدون اسم' : 'Untitled Image')}
                        </h4>
                        {item.createdAt && (
                          <div className="media-card-date">
                            {new Date(item.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>

                      <div className="media-card-actions">
                        <button 
                          type="button"
                          className="media-card-btn copy-btn"
                          onClick={() => copyToClipboard(fullUrl)}
                          title={isArabic ? 'نسخ رابط الصورة' : 'Copy Image URL'}
                        >
                          {copiedUrl === fullUrl ? '✓' : '📋'}
                        </button>
                        <button 
                          type="button"
                          className="media-card-btn view-btn"
                          onClick={() => handleGoToPage(item.page)}
                          title={isArabic ? 'عرض في الصفحة' : 'View on Page'}
                        >
                          👀
                        </button>
                        <button 
                          type="button"
                          className="media-card-btn delete-btn"
                          onClick={() => handleDelete(item)}
                          disabled={isDeleting}
                          title={isArabic ? 'حذف من الموقع' : 'Delete from website'}
                        >
                          {isDeleting ? '⌛' : '🗑️'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
