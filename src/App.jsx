import React, { useState, useEffect, Suspense, lazy } from 'react';

// Mobile Components (Lazy Loaded)
const MobileHomePage = lazy(() => import('./pages/mobile/MobileHomePage'));
const KidsAreaPage = lazy(() => import('./pages/mobile/KidsAreaPage'));
const MobileFunParkPage = lazy(() => import('./pages/mobile/MobileFunParkPage'));
const MobileChallengePage = lazy(() => import('./pages/mobile/MobileChallengePage'));
const MobileAdventurePage = lazy(() => import('./pages/mobile/MobileAdventurePage'));
const MobilePackagePage = lazy(() => import('./pages/mobile/MobilePackagePage'));

// Desktop Components (Lazy Loaded)
const DesktopHomePage = lazy(() => import('./pages/desktop/DesktopHomePage'));
const DesktopKidsAreaPage = lazy(() => import('./pages/desktop/DesktopKidsAreaPage'));
const DesktopFunParkPage = lazy(() => import('./pages/desktop/DesktopFunParkPage'));
const DesktopChallengePage = lazy(() => import('./pages/desktop/DesktopChallengePage'));
const DesktopAdventurePage = lazy(() => import('./pages/desktop/DesktopAdventurePage'));
const DesktopPackagePage = lazy(() => import('./pages/desktop/DesktopPackagePage'));

// Synchronous Layout & UI Components
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import DesktopHeader from './components/DesktopHeader';
import DesktopSubNav from './components/DesktopSubNav';
import DesktopFooter from './components/DesktopFooter';
import MobileModals from './components/MobileModals';
import LoadingScreen from './components/common/LoadingScreen';

// Styles
import './components/MobilePlayZone.css';
import './components/DesktopPlayZone.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'kids-area' | 'fun-park' | 'challenge' | 'adventure' | 'package'
  const [lang, setLang] = useState('en');
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Responsive desktop vs mobile detection
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update HTML title & RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' 
      ? 'أمريكان دريم - منطقة الأطفال والمرح' 
      : 'American Dream Ismailia';
  }, [lang]);

  // Global listener for attraction booking
  useEffect(() => {
    const handleAttrBooking = (e) => {
      const item = e.detail;
      openModal('booking', {
        name: item?.titleEn || 'Attraction Pass',
        price: '50 EGP',
        priceNum: 50,
        discount: 'Zone Entry',
        details: item?.desc || 'General entry to attraction'
      });
    };
    window.addEventListener('open-booking-for', handleAttrBooking);
    return () => window.removeEventListener('open-booking-for', handleAttrBooking);
  }, []);

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  return (
    <>
      {/* 1. INITIAL WEBSITE PRELOADER & SPLASH SCREEN */}
      {isInitialLoading && (
        <LoadingScreen 
          fullscreen={true}
          lang={lang}
          onFinish={() => setIsInitialLoading(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* COMPUTER (DESKTOP) VIEW */}
      {/* ========================================================================= */}
      {isDesktop ? (
        <div className="desktop-app-shell">
          {/* Top Navbar */}
          <DesktopHeader 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
            setLang={setLang}
            isDesktopView={isDesktop}
            setIsDesktopView={setIsDesktop}
          />

          {/* Subnav & Search (for zone pages) */}
          {activeTab !== 'home' && (
            <DesktopSubNav 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* Main Desktop Page Body with Lazy Loading Suspense Fallback */}
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen fullscreen={false} lang={lang} />}>
              {activeTab === 'home' && (
                <DesktopHomePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'kids-area' && (
                <DesktopKidsAreaPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'fun-park' && (
                <DesktopFunParkPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'challenge' && (
                <DesktopChallengePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'adventure' && (
                <DesktopAdventurePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'package' && (
                <DesktopPackagePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}
            </Suspense>
          </main>

          {/* Desktop Footer */}
          <DesktopFooter openModal={openModal} setActiveTab={setActiveTab} />

          {/* Global Interactive Modals */}
          {modal.isOpen && (
            <MobileModals 
              modalType={modal.type}
              modalData={modal.data}
              closeModal={closeModal}
              setActiveTab={setActiveTab}
              lang={lang}
              setLang={setLang}
            />
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* MOBILE VIEW */
        /* ========================================================================= */
        <div className="mobile-app-shell">
          {/* Top Mobile Header */}
          <MobileHeader 
            setActiveTab={setActiveTab}
            onOpenMenu={() => openModal('menu-drawer')}
            onOpenProfile={() => openModal('profile')}
            lang={lang}
          />

          {/* Main Page Views with Lazy Loading Suspense Fallback */}
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen fullscreen={false} lang={lang} />}>
              {(activeTab === 'home' || activeTab === 'lobby') && (
                <MobileHomePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'kids-area' && (
                <KidsAreaPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'fun-park' && (
                <MobileFunParkPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'challenge' && (
                <MobileChallengePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'adventure' && (
                <MobileAdventurePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'package' && (
                <MobilePackagePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}
            </Suspense>
          </main>

          {/* Fixed Curved Dock Bottom Navigation */}
          <MobileBottomNav 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openModal={openModal}
          />

          {/* Global Interactive Modals & Drawers */}
          {modal.isOpen && (
            <MobileModals 
              modalType={modal.type}
              modalData={modal.data}
              closeModal={closeModal}
              setActiveTab={setActiveTab}
              lang={lang}
              setLang={setLang}
            />
          )}
        </div>
      )}
    </>
  );
}
