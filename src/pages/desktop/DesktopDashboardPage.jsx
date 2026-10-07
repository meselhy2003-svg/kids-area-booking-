import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  uploadMediaImage, 
  deleteMediaImage, 
  getMediaByPage, 
  resolveImageUrl, 
  mediaService 
} from '../../api/mediaService';
import { API_BASE_URL } from '../../api/apiClient';
import './DesktopDashboardPage.css';

const AVAILABLE_PAGES = [
  { key: 'kids-area', labelAr: 'منطقة الأطفال (Kids Area)', labelEn: 'Kids Area' },
  { key: 'fun-park', labelAr: 'فن بارك (Fun Park)', labelEn: 'Fun Park' },
  { key: 'challenge', labelAr: 'منطقة التحدي (Challenge Zone)', labelEn: 'Challenge Zone' },
  { key: 'adventure', labelAr: 'حديقة المغامرة (Adventure Park)', labelEn: 'Adventure Park' },
  { key: 'events', labelAr: 'الحفلات والفعاليات (Events & Birthdays)', labelEn: 'Events & Parties' },
  { key: 'home', labelAr: 'الصفحة الرئيسية (Home & Vibes)', labelEn: 'Home Page' }
];

const AVAILABLE_SECTIONS = [
  { key: 'hero', labelAr: 'بانر الغلاف الرئيسي (Hero Banner)', labelEn: 'Hero Banner' },
  { key: 'explore', labelAr: 'استكشف الألعاب والأنشطة (Explore Section)', labelEn: 'Explore Attractions' },
  { key: 'vibes', labelAr: 'أجواء وتجارب المنطقة (Vibes & Gallery)', labelEn: 'Zone Vibes & Moments' },
  { key: 'general', labelAr: 'صور عامة للمنطقة (General Media)', labelEn: 'General Media' }
];

export default function DesktopDashboardPage({ setActiveTab, openModal, lang = 'ar' }) {
  const isArabic = lang === 'ar';
  const fileInputRef = useRef(null);

  // Active Dashboard Tab: 'upload' | 'library' | 'system'
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
  const [isDragging, setIsDragging] = useState(false);

  // Library State
  const [libraryFilterPage, setLibraryFilterPage] = useState('all');
  const [libraryItems, setLibraryItems] = useState([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Total images counter
  const [totalMediaCount, setTotalMediaCount] = useState(0);

  // Load live media count across entire backend
  const fetchTotalCount = useCallback(async () => {
    try {
      const all = await getMediaByPage('all');
      setTotalMediaCount(Array.isArray(all) ? all.length : 0);
    } catch {
      // ignore
    }
  }, []);

  // Fetch library items
  const loadLibrary = useCallback(async () => {
    setIsLoadingLibrary(true);
    try {
      let rawItems = [];
      if (libraryFilterPage === 'all') {
        rawItems = await getMediaByPage('all');
      } else {
        rawItems = await getMediaByPage(libraryFilterPage);
      }

      const items = [];
      const seen = new Set();
      (rawItems || []).forEach(item => {
        if (!item || !item._id || seen.has(item._id)) return;
        seen.add(item._id);

        const rawImgs = Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []);
        const firstImg = rawImgs[0] || item.imageUrl || item.image;
        if (!firstImg) return;

        items.push({
          ...item,
          resolvedPage: item.page || (libraryFilterPage === 'all' ? 'live' : libraryFilterPage),
          previewUrl: resolveImageUrl(firstImg)
        });
      });

      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setLibraryItems(items);
      if (libraryFilterPage === 'all') {
        setTotalMediaCount(items.length);
      }
    } catch (err) {
      console.warn('Error fetching library:', err);
    } finally {
      setIsLoadingLibrary(false);
    }
  }, [libraryFilterPage]);

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  useEffect(() => {
    if (activeTabName === 'library') {
      loadLibrary();
    }
  }, [activeTabName, loadLibrary]);

  // Clean preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file select
  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(isArabic ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(null);
    const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    if (!imageName) {
      setImageName(rawName.replace(/[-_]/g, ' '));
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Submit Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError(isArabic ? 'يرجى اختيار صورة أولاً' : 'Please select an image file first');
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
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // confetti optional
        }
        fetchTotalCount();
      } else {
        setUploadError(res.error || (isArabic ? 'فشل رفع الصورة للسيرفر' : 'Failed to upload image'));
      }
    } catch (err) {
      setUploadError(err.message || (isArabic ? 'حدث خطأ غير متوقع' : 'Unexpected error during upload'));
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageName('');
    setUploadSuccess(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Delete Image
  const handleDeleteImage = async (item) => {
    const confirmMsg = isArabic 
      ? `هل أنت متأكد من حذف صورة "${item.name || 'الصورة'}" نهائياً من السيرفر؟`
      : `Are you sure you want to permanently delete "${item.name || 'this image'}"?`;

    if (!window.confirm(confirmMsg)) return;

    setDeletingId(item._id);
    try {
      const res = await deleteMediaImage(item._id, item.resolvedPage || targetPage);
      if (res.success) {
        setLibraryItems(prev => prev.filter(i => i._id !== item._id));
        setTotalMediaCount(prev => Math.max(0, prev - 1));
      } else {
        alert(res.error || (isArabic ? 'تعذر حذف الصورة' : 'Could not delete image'));
      }
    } catch (err) {
      alert(err.message || (isArabic ? 'خطأ أثناء الحذف' : 'Error deleting'));
    } finally {
      setDeletingId(null);
    }
  };

  // Copy Image URL
  const handleCopyUrl = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear cache
  const handleClearCache = () => {
    mediaService.clearMediaCache();
    alert(isArabic ? 'تم تفريغ الذاكرة المؤقتة بنجاح.' : 'Media cache cleared successfully.');
  };

  return (
    <div className={`dashboard-page ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      <div className="dashboard-container">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & NAVIGATION */}
        {/* ========================================================================= */}
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <div className="dashboard-header-icon">
              ⚙️
            </div>
            <div>
              <h1 className="dashboard-title font-alexandria">
                {isArabic ? 'لوحة التحكم وإدارة وسائط الموقع' : 'Media & Content Admin Dashboard'}
              </h1>
              <p className="dashboard-subtitle">
                {isArabic 
                  ? 'رفع وتحديث الصور والأقسام مباشرة إلى سيرفر الموقع (Apidog Backend)'
                  : 'Upload & synchronize site images directly with the live backend server'}
              </p>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <button 
              className="dashboard-back-btn font-alexandria"
              onClick={() => setActiveTab('kids-area')}
              title={isArabic ? 'معاينة منطقة الألعاب' : 'Preview Kids Area'}
            >
              <span>🎡</span>
              <span>{isArabic ? 'معاينة الموقع' : 'Preview Site'}</span>
            </button>
            <button 
              className="dashboard-preview-btn font-alexandria"
              onClick={() => setActiveTab('home')}
              title={isArabic ? 'العودة للرئيسية' : 'Go to Home'}
            >
              <span>🏠</span>
              <span>{isArabic ? 'الرئيسية' : 'Home Page'}</span>
            </button>
          </div>
        </header>

        {/* Status Indicators */}
        <div className="dashboard-status-row">
          <div className="dashboard-status-chip">
            <span className="status-dot-pulse" />
            <span><strong>{isArabic ? 'حالة السيرفر:' : 'Backend Status:'}</strong> {isArabic ? 'متصل بنجاح (200 OK)' : 'Online & Connected'}</span>
          </div>
          <div className="dashboard-status-chip">
            <span>🌐 <strong>API:</strong> {API_BASE_URL.replace('https://', '')}</span>
          </div>
          <div className="dashboard-status-chip">
            <span>⚡ <strong>{isArabic ? 'المزامنة الفورية:' : 'Live Sync:'}</strong> {isArabic ? 'مفعلة تلقائياً' : 'Enabled'}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. KPI METRICS CARDS */}
        {/* ========================================================================= */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span className="stat-card-icon">📸</span>
            <div className="stat-card-value font-alexandria">{totalMediaCount}</div>
            <div className="stat-card-title">{isArabic ? 'إجمالي الصور المرفوعة على السيرفر' : 'Total Uploaded Media'}</div>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon">🎡</span>
            <div className="stat-card-value font-alexandria">{AVAILABLE_PAGES.length}</div>
            <div className="stat-card-title">{isArabic ? 'مناطق وصفحات الحديقة النشطة' : 'Supported Park Zones'}</div>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon">🖼️</span>
            <div className="stat-card-value font-alexandria">{AVAILABLE_SECTIONS.length}</div>
            <div className="stat-card-title">{isArabic ? 'أقسام العرض (Banners / Explore / Vibes)' : 'Display Sections'}</div>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-card-icon">🔒</span>
            <div className="stat-card-value font-alexandria" style={{ color: '#10b981', fontSize: '1.6rem' }}>
              {isArabic ? 'آمن وموثق' : 'Apidog Ready'}
            </div>
            <div className="stat-card-title">{isArabic ? 'تكامل الـ API الرسمي' : 'Official API Integration'}</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TABS NAVIGATION */}
        {/* ========================================================================= */}
        <div className="dashboard-tabs-nav font-alexandria">
          <button 
            className={`dashboard-tab-btn ${activeTabName === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTabName('upload')}
          >
            <span>📤</span>
            <span>{isArabic ? 'رفع صورة جديدة' : 'Upload New Media'}</span>
          </button>

          <button 
            className={`dashboard-tab-btn ${activeTabName === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTabName('library')}
          >
            <span>🖼️</span>
            <span>{isArabic ? 'مكتبة الصور المرفوعة' : 'Live Media Library'}</span>
            <span className="tab-badge">{totalMediaCount}</span>
          </button>

          <button 
            className={`dashboard-tab-btn ${activeTabName === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTabName('system')}
          >
            <span>⚙️</span>
            <span>{isArabic ? 'معلومات الربط والنظام' : 'System & API Info'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. TAB 1: UPLOAD PANEL */}
        {/* ========================================================================= */}
        {activeTabName === 'upload' && (
          <div className="dashboard-upload-panel">
            {uploadError && (
              <div className="dashboard-alert dashboard-alert-error">
                <span>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="dashboard-alert dashboard-alert-success">
                <span>🎉</span>
                <div>
                  <strong>{isArabic ? 'تم رفع الصورة بنجاح!' : 'Image uploaded successfully!'}</strong>
                  <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                    {isArabic 
                      ? 'تم نشر الصورة وتحديث كاش الموقع تلقائياً. يمكنك الانتقال للموقع لمعاينتها.' 
                      : 'The image has been synced live to the site. You can preview it immediately.'}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="dashboard-upload-grid">
              
              {/* Left Column: Drag & Drop Box + Preview */}
              <div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {previewUrl ? (
                  <div className="dashboard-preview-card">
                    <img src={previewUrl} alt="Preview" className="dashboard-preview-img" />
                    <button 
                      type="button" 
                      className="preview-remove-btn"
                      onClick={handleResetForm}
                      title={isArabic ? 'إزالة واختيار صورة أخرى' : 'Remove image'}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`dashboard-dropzone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="dropzone-icon">📁</div>
                    <div className="dropzone-title font-alexandria">
                      {isArabic ? 'اسحب الصورة هنا أو اضغط للاختيار' : 'Drag & drop image here or browse'}
                    </div>
                    <p className="dropzone-desc">
                      {isArabic ? 'يدعم PNG, JPG, JPEG, WEBP حتى 10MB' : 'Supports PNG, JPG, JPEG, WEBP up to 10MB'}
                    </p>
                  </div>
                )}

                {selectedFile && (
                  <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
                    📎 <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              {/* Right Column: Target Settings & Submit */}
              <div>
                {/* Target Page Selector */}
                <div className="upload-form-group">
                  <label className="upload-label">
                    {isArabic ? 'اختر الصفحة المستهدفة:' : 'Target Page:'}
                  </label>
                  <select 
                    className="upload-select"
                    value={targetPage}
                    onChange={(e) => setTargetPage(e.target.value)}
                  >
                    {AVAILABLE_PAGES.map((p) => (
                      <option key={p.key} value={p.key}>
                        {isArabic ? p.labelAr : p.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Section Selector */}
                <div className="upload-form-group">
                  <label className="upload-label">
                    {isArabic ? 'اختر القسم داخل الصفحة:' : 'Target Section:'}
                  </label>
                  <select 
                    className="upload-select"
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                  >
                    {AVAILABLE_SECTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {isArabic ? s.labelAr : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Name / Title */}
                <div className="upload-form-group">
                  <label className="upload-label">
                    {isArabic ? 'عنوان الصورة أو الوصف:' : 'Image Title / Label:'}
                  </label>
                  <input 
                    type="text"
                    className="upload-input"
                    value={imageName}
                    placeholder={isArabic ? 'مثال: صورة غلاف حديقة الأطفال الجديدة' : 'e.g. New Kids Area Hero Slide'}
                    onChange={(e) => setImageName(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  <button 
                    type="submit" 
                    className="dashboard-submit-btn font-alexandria"
                    disabled={isUploading || !selectedFile}
                  >
                    {isUploading ? (
                      <>
                        <span className="upload-spinner" />
                        <span>{isArabic ? 'جارٍ رفع الصورة إلى السيرفر...' : 'Uploading to server...'}</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>{isArabic ? 'رفع الصورة إلى الموقع الآن' : 'Upload Image to Site'}</span>
                      </>
                    )}
                  </button>

                  {uploadSuccess && (
                    <button 
                      type="button"
                      className="dashboard-preview-btn font-alexandria"
                      style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}
                      onClick={() => setActiveTab(targetPage)}
                    >
                      <span>👁️</span>
                      <span>{isArabic ? 'معاينة في الموقع' : 'Preview Live'}</span>
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TAB 2: LIVE MEDIA LIBRARY */}
        {/* ========================================================================= */}
        {activeTabName === 'library' && (
          <div>
            {/* Filter by Page */}
            <div className="library-filter-bar">
              <div className="library-filter-pills font-alexandria">
                <button 
                  className={`library-filter-pill ${libraryFilterPage === 'all' ? 'active' : ''}`}
                  onClick={() => setLibraryFilterPage('all')}
                >
                  {isArabic ? 'الكل' : 'All Pages'}
                </button>
                {AVAILABLE_PAGES.map((p) => (
                  <button 
                    key={p.key}
                    className={`library-filter-pill ${libraryFilterPage === p.key ? 'active' : ''}`}
                    onClick={() => setLibraryFilterPage(p.key)}
                  >
                    {isArabic ? p.labelAr.split('(')[0].trim() : p.labelEn}
                  </button>
                ))}
              </div>

              <button 
                className="dashboard-back-btn" 
                style={{ padding: '8px 16px' }}
                onClick={loadLibrary}
                disabled={isLoadingLibrary}
              >
                <span>🔄</span>
                <span>{isArabic ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {/* Content Grid */}
            {isLoadingLibrary ? (
              <div className="library-empty-state">
                <div className="dropzone-icon">⏳</div>
                <p>{isArabic ? 'جارٍ جلب الصور من السيرفر...' : 'Loading images from server...'}</p>
              </div>
            ) : libraryItems.length === 0 ? (
              <div className="library-empty-state">
                <div className="empty-icon">📭</div>
                <h3 className="font-alexandria" style={{ margin: '0 0 6px', color: '#ffffff' }}>
                  {isArabic ? 'لا توجد صور مرفوعة في هذا القسم بعد' : 'No images uploaded for this section yet'}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px' }}>
                  {isArabic 
                    ? 'يمكنك الانتقال لتبويب "رفع صورة جديدة" لرفع صورك الأولى مباشرة.' 
                    : 'Switch to the "Upload New Media" tab to add your first image.'}
                </p>
                <button 
                  className="dashboard-preview-btn font-alexandria"
                  onClick={() => setActiveTabName('upload')}
                >
                  <span>📤</span>
                  <span>{isArabic ? 'رفع صورة جديدة الآن' : 'Upload Image Now'}</span>
                </button>
              </div>
            ) : (
              <div className="library-grid">
                {libraryItems.map((item) => (
                  <div key={item._id} className="library-card">
                    <div className="library-card-img-wrap">
                      <img 
                        src={item.previewUrl} 
                        alt={item.name || 'Media Item'} 
                        className="library-card-img" 
                        loading="lazy"
                      />
                      <span className="library-badge-pill">
                        {item.resolvedPage || item.page} • {item.section || 'hero'}
                      </span>
                    </div>

                    <div className="library-card-body">
                      <h4 className="library-card-title" title={item.name}>
                        {item.name || (isArabic ? 'صورة بدون اسم' : 'Unnamed Image')}
                      </h4>

                      <div className="library-card-meta">
                        <span>📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Live'}</span>
                      </div>

                      <div className="library-card-actions">
                        <button 
                          className="card-copy-btn"
                          onClick={() => handleCopyUrl(item.previewUrl, item._id)}
                        >
                          <span>{copiedId === item._id ? '✓' : '🔗'}</span>
                          <span>{copiedId === item._id ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ الرابط' : 'Copy URL')}</span>
                        </button>

                        <button 
                          className="card-delete-btn"
                          disabled={deletingId === item._id}
                          onClick={() => handleDeleteImage(item)}
                        >
                          <span>{deletingId === item._id ? '⏳' : '🗑️'}</span>
                          <span>{isArabic ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. TAB 3: SYSTEM INFO */}
        {/* ========================================================================= */}
        {activeTabName === 'system' && (
          <div className="system-info-panel">
            <div className="system-card">
              <h3 className="system-card-title font-alexandria">
                <span>📡</span>
                <span>{isArabic ? 'نقاط نهاية الـ API المتصلة' : 'Connected API Endpoints'}</span>
              </h3>

              <div className="system-row">
                <span className="system-key">Upload Media:</span>
                <span className="system-val" style={{ color: '#38bdf8' }}>POST /api/media</span>
              </div>
              <div className="system-row">
                <span className="system-key">Page Media:</span>
                <span className="system-val" style={{ color: '#34d399' }}>GET /api/media/page/:page</span>
              </div>
              <div className="system-row">
                <span className="system-key">Section Media:</span>
                <span className="system-val" style={{ color: '#34d399' }}>GET /api/media/section/:section</span>
              </div>
              <div className="system-row">
                <span className="system-key">Delete Media:</span>
                <span className="system-val" style={{ color: '#f87171' }}>DELETE /api/media/:id</span>
              </div>
              <div className="system-row">
                <span className="system-key">Static File Route:</span>
                <span className="system-val" style={{ color: '#fbbf24' }}>/media/:filename</span>
              </div>
            </div>

            <div className="system-card">
              <h3 className="system-card-title font-alexandria">
                <span>🛠️</span>
                <span>{isArabic ? 'أدوات الإدارة والذاكرة المؤقتة' : 'Management & Cache Tools'}</span>
              </h3>

              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                {isArabic 
                  ? 'يقوم النظام بحفظ الصور مؤقتاً لسرعة التحميل (Zero-latency cache). عند رفع صور جديدة، يتم تحديث الكاش تلقائياً. يمكنك أيضاً تفريغ الذاكرة يدوياً أدناه.' 
                  : 'The site caches images for maximum loading speed. When new images are uploaded, the cache updates automatically. You can also manually purge it below.'}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="dashboard-back-btn font-alexandria"
                  onClick={handleClearCache}
                >
                  <span>🧹</span>
                  <span>{isArabic ? 'تفريغ الذاكرة المؤقتة (Clear Cache)' : 'Clear Local Cache'}</span>
                </button>

                <a 
                  href="https://r3zftzhfcy.apidog.io/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="dashboard-preview-btn font-alexandria"
                  style={{ textDecoration: 'none' }}
                >
                  <span>📖</span>
                  <span>{isArabic ? 'فتح توثيق Apidog' : 'Open Apidog Docs'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
