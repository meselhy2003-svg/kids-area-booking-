import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  FileText,
  Sparkles,
  ArrowUp,
  Share2
} from 'lucide-react';
import './PdfMenuModal.css';

export const MENU_PAGES = [
  { page: 1, titleAr: 'عروض التوفير', titleEn: 'Special Offers', category: 'offers', icon: '🔥' },
  { page: 2, titleAr: 'وجبات عائلية', titleEn: 'Family Meals', category: 'family', icon: '👨‍👩‍👧‍👦' },
  { page: 3, titleAr: 'وجبات أطفال', titleEn: "Kids' Meals", category: 'kids', icon: '🎈' },
  { page: 4, titleAr: 'البيتزا الإيطالية', titleEn: 'Italian Pizza', category: 'pizza', icon: '🍕' },
  { page: 5, titleAr: 'الباستا والمكرونات', titleEn: 'Delicious Pasta', category: 'pasta', icon: '🍝' },
  { page: 6, titleAr: 'البرجر المشوي', titleEn: 'Charcoal Burgers', category: 'burgers', icon: '🍔' },
  { page: 7, titleAr: 'تشيكن مقرمش', titleEn: 'Crispy Fried Chicken', category: 'chicken', icon: '🍗' },
  { page: 8, titleAr: 'تشيكن & جمبري', titleEn: 'Chicken & Shrimp', category: 'grills', icon: '🍤' },
  { page: 9, titleAr: 'المقبلات والبطاطس', titleEn: 'Appetizers & Fries', category: 'appetizers', icon: '🍟' },
  { page: 10, titleAr: 'توست وكرواسون', titleEn: 'Toast & Croissant', category: 'bakery', icon: '🥐' },
  { page: 11, titleAr: 'حلويات ومولتن كيك', titleEn: 'Molten & Desserts', category: 'desserts', icon: '🍫' },
  { page: 12, titleAr: 'الكيك والحلويات الفاخرة', titleEn: 'Cakes & Sweets', category: 'cakes', icon: '🍰' },
  { page: 13, titleAr: 'الوافل والبان كيك', titleEn: 'Waffles & Pancakes', category: 'waffles', icon: '🥞' },
  { page: 14, titleAr: 'القهوة والإسبريسو', titleEn: 'Coffee & Espresso', category: 'coffee', icon: '☕' },
  { page: 15, titleAr: 'المشروبات الساخنة', titleEn: 'Hot Drinks', category: 'hot_drinks', icon: '🫖' },
  { page: 16, titleAr: 'الميلك شيك والسموذي', titleEn: 'Milkshakes & Smoothies', category: 'shakes', icon: '🥤' },
  { page: 17, titleAr: 'مشروبات منعشة وآيس كوفي', titleEn: 'Mix Soft & Ice Coffee', category: 'cold_drinks', icon: '🧊' },
  { page: 18, titleAr: 'الكوكتيلات والعصائر الفريش', titleEn: 'Cocktails & Fresh Drinks', category: 'juices', icon: '🍹' },
];

const PDF_URL = '/menu/american-dream-menu.pdf';

export default function PdfMenuModal({ isOpen, onClose, lang = 'ar' }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.4 = 140%, 1.8 = 180%, 2.2 = 220%
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const modalContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pageRefs = useRef({});
  const categoryTabsRef = useRef(null);
  const visibleMap = useRef({});

  // Reset to page 1 on open and lock background scroll
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setActiveCategoryIndex(0);
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      // Reset scroll position to top
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-detect current visible page using IntersectionObserver
  useEffect(() => {
    if (!isOpen) return;
    visibleMap.current = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNum = parseInt(entry.target.getAttribute('data-page'), 10);
          if (!isNaN(pageNum)) {
            if (entry.isIntersecting) {
              visibleMap.current[pageNum] = entry.intersectionRatio;
            } else {
              delete visibleMap.current[pageNum];
            }
          }
        });

        // Pick page with the largest visible area
        const visibleKeys = Object.keys(visibleMap.current);
        if (visibleKeys.length > 0) {
          visibleKeys.sort((a, b) => visibleMap.current[b] - visibleMap.current[a]);
          const bestPage = parseInt(visibleKeys[0], 10);
          setCurrentPage(bestPage);
          setActiveCategoryIndex(bestPage - 1);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: [0.15, 0.4, 0.7],
      }
    );

    Object.values(pageRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen]);

  // Keep category pills horizontally scrolled to active item
  useEffect(() => {
    if (!categoryTabsRef.current) return;
    const activeTab = categoryTabsRef.current.querySelector(`.pdf-cat-pill.active`);
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeCategoryIndex]);

  // Scroll smoothly to a specific page
  const scrollToPage = useCallback((pageNum) => {
    const el = pageRefs.current[pageNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNum);
      setActiveCategoryIndex(pageNum - 1);
    }
  }, []);

  const handleNextPage = () => {
    if (currentPage < MENU_PAGES.length) {
      scrollToPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  };

  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Zoom controls
  const zoomIn = () => setZoomLevel((prev) => Math.min(2.2, Number((prev + 0.3).toFixed(1))));
  const zoomOut = () => setZoomLevel((prev) => Math.max(1, Number((prev - 0.3).toFixed(1))));
  const resetZoom = () => setZoomLevel(1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Share menu link
  const handleShare = async () => {
    const shareData = {
      title: lang === 'ar' ? 'منيو أمريكان دريم' : 'American Dream Menu',
      text: lang === 'ar' ? 'تصفح منيو أمريكان دريم الرسمي' : 'Browse the official American Dream Menu',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  if (!isOpen) return null;

  const activePageData = MENU_PAGES[currentPage - 1] || MENU_PAGES[0];

  return (
    <div
      className={`pdf-menu-modal-overlay ${lang === 'ar' ? 'font-alexandria' : ''}`}
      ref={modalContainerRef}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'منيو أمريكان دريم' : 'American Dream Menu'}
    >
      {/* 1. TOP CONTROL BAR */}
      <header className="pdf-menu-topbar">
        {/* Left: Close button + Brand */}
        <div className="pdf-menu-topbar-left">
          <button
            className="pdf-btn-close"
            onClick={onClose}
            aria-label={lang === 'ar' ? 'إغلاق المنيو' : 'Close Menu'}
            title={lang === 'ar' ? 'إغلاق (Esc)' : 'Close (Esc)'}
          >
            <X size={20} />
          </button>

          <div className="pdf-menu-title-block">
            <h2 className="pdf-menu-main-title">
              {lang === 'ar' ? 'منيو أمريكان دريم' : 'American Dream Menu'}
            </h2>
            <span className="pdf-menu-page-indicator">
              {lang === 'ar'
                ? `صفحة ${currentPage} من ${MENU_PAGES.length} • ${activePageData.titleAr}`
                : `Page ${currentPage} of ${MENU_PAGES.length} • ${activePageData.titleEn}`}
            </span>
          </div>
        </div>

        {/* Right: Actions (Zoom, Download, Fullscreen, Share) */}
        <div className="pdf-menu-topbar-right">
          {/* Zoom controls */}
          <div className="pdf-zoom-group">
            <button
              className="pdf-control-btn"
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              title={lang === 'ar' ? 'تصغير' : 'Zoom Out'}
              aria-label="Zoom Out"
            >
              <ZoomOut size={17} />
            </button>
            <span
              className="pdf-zoom-label"
              onClick={resetZoom}
              title={lang === 'ar' ? 'إعادة ضبط الحجم' : 'Reset Zoom'}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              className="pdf-control-btn"
              onClick={zoomIn}
              disabled={zoomLevel >= 2.2}
              title={lang === 'ar' ? 'تكبير' : 'Zoom In'}
              aria-label="Zoom In"
            >
              <ZoomIn size={17} />
            </button>
            {zoomLevel > 1 && (
              <button
                className="pdf-control-btn pdf-reset-btn"
                onClick={resetZoom}
                title={lang === 'ar' ? 'الحجم الأصلي' : 'Original Size'}
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Download PDF button */}
          <a
            href={PDF_URL}
            download="American-Dream-Menu.pdf"
            className="pdf-download-btn"
            title={lang === 'ar' ? 'تحميل نسخة PDF عالية الجودة (4MB)' : 'Download Full PDF (4MB)'}
          >
            <Download size={16} />
            <span className="pdf-download-text">
              {lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
            </span>
          </a>

          {/* Share */}
          <button
            className="pdf-control-btn pdf-share-btn"
            onClick={handleShare}
            title={lang === 'ar' ? 'مشاركة المنيو' : 'Share Menu'}
            aria-label="Share Menu"
          >
            <Share2 size={17} />
          </button>

          {/* Fullscreen */}
          <button
            className="pdf-control-btn pdf-fullscreen-btn"
            onClick={toggleFullscreen}
            title={lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>
        </div>
      </header>

      {/* 2. CATEGORY QUICK-JUMP HORIZONTAL BAR */}
      <nav className="pdf-categories-scroll-bar" ref={categoryTabsRef} aria-label="Menu Sections">
        <div className="pdf-categories-track">
          {MENU_PAGES.map((item, idx) => (
            <button
              key={item.page}
              className={`pdf-cat-pill ${activeCategoryIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToPage(item.page)}
              aria-label={lang === 'ar' ? item.titleAr : item.titleEn}
            >
              <span className="pdf-cat-icon">{item.icon}</span>
              <span className="pdf-cat-text">
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </span>
              <span className="pdf-cat-num">{item.page}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 3. MAIN SCROLLABLE PAGES CONTAINER */}
      <main
        className="pdf-pages-scroll-container"
        ref={scrollContainerRef}
        style={{
          '--pdf-zoom': zoomLevel,
        }}
      >
        <div className="pdf-pages-feed">
          {MENU_PAGES.map((p) => (
            <section
              key={p.page}
              data-page={p.page}
              ref={(el) => (pageRefs.current[p.page] = el)}
              className={`pdf-page-card ${currentPage === p.page ? 'is-active-page' : ''}`}
              id={`menu-page-${p.page}`}
            >
              {/* Floating Page Badge */}
              <div className="pdf-page-header-badge">
                <span className="pdf-page-badge-icon">{p.icon}</span>
                <span className="pdf-page-badge-title">
                  {lang === 'ar' ? p.titleAr : p.titleEn}
                </span>
                <span className="pdf-page-badge-num">
                  {lang === 'ar' ? `صفحة ${p.page}` : `Page ${p.page}`}
                </span>
              </div>

              {/* Crisp Page Image */}
              <div
                className="pdf-page-image-wrapper"
                onDoubleClick={() => {
                  setZoomLevel((prev) => (prev > 1.2 ? 1 : 1.6));
                }}
              >
                <img
                  src={`/menu/pages/page-${p.page}.webp`}
                  alt={`${lang === 'ar' ? p.titleAr : p.titleEn} - American Dream Menu`}
                  className="pdf-page-image"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.triedFallback) {
                      e.currentTarget.dataset.triedFallback = 'true';
                      e.currentTarget.src = `/menu/pages/page-${p.page}.jpg`;
                    }
                  }}
                />
              </div>
            </section>
          ))}

          {/* End of Menu Banner */}
          <div className="pdf-menu-footer-card">
            <div className="pdf-footer-sparkle">
              <Sparkles size={28} color="#ffd15c" />
            </div>
            <h3>
              {lang === 'ar' ? 'أمريكان دريم - الإسماعيلية' : 'American Dream - Ismailia'}
            </h3>
            <p>
              {lang === 'ar'
                ? 'نتمنى لكم تجربة طعام فريدة وممتعة! الأسعار تشمل ضريبة القيمة المضافة ويضاف 10% خدمة صالة.'
                : 'We wish you a wonderful dining experience! 10% dine-in service applies.'}
            </p>
            <div className="pdf-footer-actions">
              <a
                href={PDF_URL}
                download="American-Dream-Menu.pdf"
                className="pdf-footer-download-btn"
              >
                <Download size={18} />
                <span>{lang === 'ar' ? 'تحميل نسخة PDF على هاتفك' : 'Download PDF to Device'}</span>
              </a>
              <button className="pdf-footer-top-btn" onClick={handleScrollToTop}>
                <ArrowUp size={16} />
                <span>{lang === 'ar' ? 'الرجوع للأعلى' : 'Back to Top'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 4. FLOATING MOBILE BOTTOM QUICK BAR */}
      <footer className="pdf-mobile-bottom-bar">
        <button
          className="pdf-nav-arrow-btn"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          aria-label={lang === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}
        >
          <ChevronRight size={20} />
          <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
        </button>

        {/* Middle Quick Info & Download */}
        <div className="pdf-mobile-middle-info">
          <span className="pdf-mobile-page-txt">
            {lang === 'ar'
              ? `${currentPage} / ${MENU_PAGES.length}`
              : `${currentPage} / ${MENU_PAGES.length}`}
          </span>
          <a
            href={PDF_URL}
            download="American-Dream-Menu.pdf"
            className="pdf-mobile-quick-download"
            title={lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
          >
            <Download size={14} />
            <span>PDF</span>
          </a>
        </div>

        <button
          className="pdf-nav-arrow-btn"
          onClick={handleNextPage}
          disabled={currentPage >= MENU_PAGES.length}
          aria-label={lang === 'ar' ? 'الصفحة التالية' : 'Next Page'}
        >
          <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
          <ChevronLeft size={20} />
        </button>
      </footer>

      {/* Toast Notification */}
      {showShareToast && (
        <div className="pdf-toast-bubble">
          <FileText size={16} />
          <span>{lang === 'ar' ? 'تم نسخ رابط المنيو بنجاح!' : 'Menu link copied!'}</span>
        </div>
      )}
    </div>
  );
}
