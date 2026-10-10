import React, { useState, useEffect, Suspense, lazy } from 'react';

// Mobile Components (Lazy Loaded)
const MobileHomePage = lazy(() => import('./pages/mobile/MobileHomePage'));
const KidsAreaPage = lazy(() => import('./pages/mobile/KidsAreaPage'));
const MobileFunParkPage = lazy(() => import('./pages/mobile/MobileFunParkPage'));
const MobileChallengePage = lazy(() => import('./pages/mobile/MobileChallengePage'));
const MobileAdventurePage = lazy(() => import('./pages/mobile/MobileAdventurePage'));
const MobilePackagePage = lazy(() => import('./pages/mobile/MobilePackagePage'));
const MobileEventsPage = lazy(() => import('./pages/mobile/MobileEventsPage'));
const MobileTripsPage = lazy(() => import('./pages/mobile/MobileTripsPage'));
const MobileCartPage = lazy(() => import('./pages/mobile/MobileCartPage'));
const MobileAboutPage = lazy(() => import('./pages/mobile/MobileAboutPage'));
const MobileRestaurantPage = lazy(() => import('./pages/mobile/MobileRestaurantPage'));

// Desktop Components (Lazy Loaded)
const DesktopHomePage = lazy(() => import('./pages/desktop/DesktopHomePage'));
const DesktopKidsAreaPage = lazy(() => import('./pages/desktop/DesktopKidsAreaPage'));
const DesktopFunParkPage = lazy(() => import('./pages/desktop/DesktopFunParkPage'));
const DesktopChallengePage = lazy(() => import('./pages/desktop/DesktopChallengePage'));
const DesktopAdventurePage = lazy(() => import('./pages/desktop/DesktopAdventurePage'));
const DesktopPackagePage = lazy(() => import('./pages/desktop/DesktopPackagePage'));
const DesktopEventsPage = lazy(() => import('./pages/desktop/DesktopEventsPage'));
const DesktopTripsPage = lazy(() => import('./pages/desktop/DesktopTripsPage'));
const DesktopCartPage = lazy(() => import('./pages/desktop/DesktopCartPage'));
const DesktopAboutPage = lazy(() => import('./pages/desktop/DesktopAboutPage'));
const DesktopRestaurantPage = lazy(() => import('./pages/desktop/DesktopRestaurantPage'));
const DesktopDashboardPage = lazy(() => import('./pages/desktop/DesktopDashboardPage'));
const DesktopProfilePage = lazy(() => import('./pages/desktop/DesktopProfilePage'));
const LoginPage = lazy(() => import('./components/auth/Login'));

// Synchronous Layout & UI Components
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import DesktopHeader from './components/DesktopHeader';
import DesktopSubNav from './components/DesktopSubNav';
import DesktopFooter from './components/DesktopFooter';
import MobileModals from './components/MobileModals';
import LoadingScreen from './components/common/LoadingScreen';
import LobbyPage from './pages/LobbyPage';
import FloatingGirlChatBot from './components/common/FloatingGirlChatBot';

// Styles
import './components/MobilePlayZone.css';
import './components/DesktopPlayZone.css';
import { isUserAuthenticated } from './api/authService';

const VALID_TABS = [
  'lobby',
  'home',
  'kids-area',
  'fun-park',
  'challenge',
  'adventure',
  'package',
  'events',
  'birthday',
  'trips',
  'cart',
  'about',
  'dashboard',
  'profile',
  'login'
];

const resolveTabFromHash = (hashString) => {
  if (!hashString) return null;
  const h = hashString.replace(/^#\/?/, '').trim();
  if (!h) return null;

  // 1. Dashboard specific admin hashes (Check FIRST to prevent clash with public routes)
  if (
    h === 'dashboard' ||
    h === 'orders' ||
    h === 'playzone-orders' ||
    h === 'restaurant-orders' ||
    h === 'events-orders' ||
    h === 'trips-orders' ||
    h === 'guests' ||
    h === 'play-zones' ||
    h === 'about-cms' ||
    h === 'admin-about'
  ) {
    return 'dashboard';
  }

  // 2. Public restaurant routes
  if (
    h === 'restaurant' ||
    h === 'restaurant-delivery' ||
    h === 'restaurant-book-table' ||
    h === 'delivery' ||
    h === 'book-table'
  ) {
    return 'restaurant';
  }

  if (h === 'birthday') {
    return 'events';
  }

  if (VALID_TABS.includes(h)) {
    return h;
  }

  return null;
};

const getInitialActiveTab = () => {
  if (typeof window === 'undefined') return 'lobby';

  // 1. Check current URL hash first (direct URL navigation or page reload)
  const tabFromHash = resolveTabFromHash(window.location.hash);
  if (tabFromHash) {
    return tabFromHash;
  }

  // 2. Check sessionStorage if user was in an active session
  try {
    const savedTab = sessionStorage.getItem('kids_area_active_tab');
    if (savedTab && (VALID_TABS.includes(savedTab) || savedTab === 'dashboard')) {
      return savedTab;
    }
  } catch (e) {
    // ignore
  }

  // 3. Fallback to lobby only when opening site fresh with no hash
  return 'lobby';
};

export default function App() {
  // Retain the current tab across browser refreshes
  const [activeTab, setActiveTab] = useState(getInitialActiveTab);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('kids_area_active_tab', activeTab);
      } catch (e) {
        // ignore
      }

      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();

      // Keep subroute / sub-section intact if hash already matches the active tab domain
      if (activeTab === 'restaurant' && (currentHash.includes('delivery') || currentHash.includes('book-table') || currentHash === 'restaurant')) {
        // keep subroute intact
      } else if (activeTab === 'dashboard' && (
        currentHash.includes('orders') ||
        currentHash.includes('trips') ||
        currentHash.includes('events') ||
        currentHash.includes('restaurant') ||
        currentHash.includes('guests') ||
        currentHash.includes('about') ||
        currentHash.includes('play-zones') ||
        currentHash === 'dashboard'
      )) {
        // keep dashboard sub-section hash intact
      } else {
        window.location.hash = activeTab;
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handleHashSync = () => {
      const tab = resolveTabFromHash(window.location.hash);
      if (tab) {
        setActiveTab(tab);
      }
    };
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kids_area_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar'; // Default language: Egyptian Arabic
  });
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);

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

  // Update HTML title, dir & persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kids_area_lang', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.title = lang === 'ar' 
        ? 'أمريكان دريم - منطقة الأطفال والمرح بالإسماعيلية' 
        : 'American Dream Ismailia - Family Entertainment';
    }
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
    // If opening booking or offer and user is NOT authenticated, require sign in / sign up
    if (type === 'booking' || type === 'partyBooking') {
      const isAuth = isUserAuthenticated();
      if (!isAuth) {
        setModal({
          isOpen: true,
          type: 'auth-required',
          data: {
            action: 'offer',
            offerData: data,
            returnType: type
          }
        });
        return;
      }
    }
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
      {/* FULL-SCREEN LOBBY GATEWAY PAGE (BEFORE ENTERING MAIN SITE) */}
      {/* ========================================================================= */}
      {activeTab === 'lobby' ? (
        <LobbyPage 
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          isDesktop={isDesktop}
        />
      ) : isDesktop ? (
        <div className="desktop-app-shell">
          {/* Top Navbar */}
          {activeTab !== 'dashboard' && (
            <DesktopHeader 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              openModal={openModal}
              lang={lang}
              setLang={setLang}
              isDesktopView={isDesktop}
              setIsDesktopView={setIsDesktop}
            />
          )}

          {/* Subnav & Search (for zone pages) */}
          {activeTab !== 'home' && activeTab !== 'events' && activeTab !== 'trips' && activeTab !== 'cart' && activeTab !== 'about' && activeTab !== 'restaurant' && activeTab !== 'dashboard' && activeTab !== 'profile' && (
            <DesktopSubNav 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              lang={lang}
            />
          )}

          {/* Main Desktop Page Body with Lazy Loading Suspense Fallback */}
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen fullscreen={false} lang={lang} />}>
              {activeTab === 'about' && (
                <DesktopAboutPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'restaurant' && (
                <DesktopRestaurantPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'home' && (
                <DesktopHomePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'cart' && (
                <DesktopCartPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'trips' && (
                <DesktopTripsPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {(activeTab === 'events' || activeTab === 'birthday') && (
                <DesktopEventsPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  initialBirthdayView={activeTab === 'birthday'}
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

              {activeTab === 'dashboard' && (
                <DesktopDashboardPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  setLang={setLang}
                />
              )}

              {activeTab === 'profile' && (
                <DesktopProfilePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'login' && (
                <LoginPage />
              )}
            </Suspense>
          </main>

          {/* Desktop Footer */}
          {activeTab !== 'dashboard' && (
            <DesktopFooter openModal={openModal} setActiveTab={setActiveTab} lang={lang} />
          )}

          {/* Global Interactive Modals */}
          {modal.isOpen && (
            <MobileModals 
              modalType={modal.type}
              modalData={modal.data}
              closeModal={closeModal}
              setActiveTab={setActiveTab}
              lang={lang}
              setLang={setLang}
              openModal={openModal}
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
            onOpenProfile={() => setActiveTab('profile')}
            lang={lang}
            setLang={setLang}
          />

          {/* Main Page Views with Lazy Loading Suspense Fallback */}
          <main style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen fullscreen={false} lang={lang} />}>
              {activeTab === 'home' && (
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

              {(activeTab === 'events' || activeTab === 'birthday') && (
                <MobileEventsPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  initialBirthdayView={activeTab === 'birthday'}
                />
              )}

              {activeTab === 'trips' && (
                <MobileTripsPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'cart' && (
                <MobileCartPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'about' && (
                <MobileAboutPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'restaurant' && (
                <MobileRestaurantPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'dashboard' && (
                <DesktopDashboardPage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                  setLang={setLang}
                />
              )}

              {activeTab === 'profile' && (
                <DesktopProfilePage 
                  setActiveTab={setActiveTab}
                  openModal={openModal}
                  lang={lang}
                />
              )}

              {activeTab === 'login' && (
                <LoginPage />
              )}
            </Suspense>
          </main>

          {/* Fixed Curved Dock Bottom Navigation */}
          <MobileBottomNav 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openModal={openModal}
            lang={lang}
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
              openModal={openModal}
            />
          )}
        </div>
      )}

      {/* Floating 3D Sally AI ChatBot Assistant (Hidden on Admin Dashboard & Lobby) */}
      {activeTab !== 'dashboard' && activeTab !== 'lobby' && (
        <FloatingGirlChatBot 
          setActiveTab={setActiveTab}
          openModal={openModal}
          lang={lang}
        />
      )}
    </>
  );
}
