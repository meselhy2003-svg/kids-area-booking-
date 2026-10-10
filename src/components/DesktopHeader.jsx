import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, LogIn, UserPlus, ShoppingBag, Sparkles } from 'lucide-react';
import { getTranslations } from '../data/translations';
import { authService, isUserAuthenticated } from '../api/authService';

export default function DesktopHeader({ 
  activeTab, 
  setActiveTab, 
  openModal, 
  lang = 'ar', 
  setLang,
  isDesktopView,
  setIsDesktopView
}) {
  const t = getTranslations(lang);
  const isAr = lang === 'ar';
  const isPlayZonesActive = ['kids-area', 'fun-park', 'challenge', 'adventure', 'package'].includes(activeTab);

  const [isLoggedIn, setIsLoggedIn] = useState(() => isUserAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUserSync());
  const [menuOpen, setMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Sync authentication state across storage events and custom events
  useEffect(() => {
    const handleAuthChange = () => {
      const auth = isUserAuthenticated();
      setIsLoggedIn(auth);
      setCurrentUser(authService.getCurrentUserSync());
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Handle Profile Icon Click
  const handleProfileIconClick = () => {
    setMenuOpen(prev => !prev);
  };

  // Handle Login action from Guest Popover
  const handleGuestLogin = () => {
    setMenuOpen(false);
    if (typeof openModal === 'function') {
      openModal('auth', { initialMode: 'login' });
    } else if (setActiveTab) {
      setActiveTab('login');
      window.location.hash = '#login';
    }
  };

  // Handle Sign Up action from Guest Popover
  const handleGuestSignup = () => {
    setMenuOpen(false);
    if (typeof openModal === 'function') {
      openModal('auth', { initialMode: 'signup' });
    } else if (setActiveTab) {
      setActiveTab('login');
      window.location.hash = '#signup';
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setMenuOpen(false);
    await authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    if (setActiveTab) setActiveTab('lobby');
    if (typeof window !== 'undefined') {
      window.location.hash = '#lobby';
    }
  };

  const userName = currentUser?.name || (isAr ? 'عضو أمريكان دريم' : 'American Dream Member');
  const userPoints = currentUser?.points || 0;

  return (
    <header className="desktop-navbar">
      <div className="desktop-nav-container">
        {/* Brand Logo */}
        <a 
          href="#home"
          className="desktop-nav-brand" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          title={t.brand.name}
          aria-label={t.brand.name}
        >
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt={t.brand.name} 
            className="desktop-nav-logo-img" 
          />
        </a>

        {/* Center Main Nav Links */}
        <nav className="desktop-nav-menu">
          <button 
            className={`desktop-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            {t.nav.home}
          </button>
          <button 
            className={`desktop-nav-link ${isPlayZonesActive ? 'active' : ''}`}
            onClick={() => setActiveTab('kids-area')}
          >
            {t.nav.playZone}
          </button>
          <button 
            className={`desktop-nav-link ${activeTab === 'restaurant' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurant')}
          >
            {t.nav.restaurant}
          </button>
          <button 
            className={`desktop-nav-link ${(activeTab === 'events' || activeTab === 'birthday') ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            {t.nav.events}
          </button>
          <button 
            className={`desktop-nav-link ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            {t.nav.tripsShort}
          </button>
        </nav>

        {/* Right Nav Actions */}
        <div className="desktop-nav-right">
          {/* Language Switcher Pill */}
          <div className="desktop-lang-switcher-pill" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '24px',
            padding: '3px 4px',
            gap: '2px'
          }}>
            <button
              type="button"
              onClick={() => setLang && setLang('ar')}
              className={`desktop-lang-choice ar-choice font-alexandria arabic-alexandria-text ${lang === 'ar' ? 'active' : ''}`}
              title="اللغة العربية - مصر"
              style={{
                background: lang === 'ar' ? '#00a9c3' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '18px',
                padding: '5px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Alexandria', 'Tajawal', sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span 
                className="font-alexandria arabic-alexandria-text"
                style={{ fontFamily: "'Alexandria', 'Tajawal', sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                العربية (مصر)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLang && setLang('en')}
              className={`desktop-lang-choice ${lang === 'en' ? 'active' : ''}`}
              title="English"
              style={{
                background: lang === 'en' ? '#00a9c3' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '18px',
                padding: '5px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span>English</span>
            </button>
          </div>

          {/* Cart Button */}
          <button 
            className={`desktop-nav-parachute-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
            title={t.nav.cart}
            aria-label={t.nav.cart}
          >
            <img 
              src="/photo/kid area pic/icon/cart.png" 
              alt={t.nav.cart} 
              className="desktop-nav-parachute-img" 
            />
          </button>

          {/* User Profile Container & Dropdown */}
          <div className="desktop-user-menu-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
            {/* User Profile Pill */}
            <button 
              type="button"
              className={`desktop-nav-user-pill ${activeTab === 'profile' || menuOpen ? 'active' : ''} ${!isLoggedIn ? 'guest-pill' : ''}`}
              onClick={handleProfileIconClick}
              title={isLoggedIn ? userName : (isAr ? 'حساب الزائر' : 'Guest Account')}
              aria-label={isLoggedIn ? userName : 'User Account'}
              aria-expanded={menuOpen}
            >
              <span className="desktop-nav-user-icon-wrap">
                <svg 
                  className="desktop-nav-user-svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3.2" />
                  <path d="M7 20.662V19a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5v1.662" />
                </svg>
              </span>
            </button>

            {/* DYNAMIC DROPDOWN / POPOVER */}
            {menuOpen && (
              <div className={`desktop-user-dropdown-popover ${isAr ? 'lang-ar font-alexandria' : 'lang-en'}`}>
                {isLoggedIn ? (
                  /* 1. AUTHENTICATED USER MENU */
                  <div className="user-popover-auth-body">
                    <div className="user-popover-header">
                      <div className="user-popover-avatar">
                        <User size={18} className="avatar-icon" />
                      </div>
                      <div className="user-popover-info">
                        <div className="user-popover-name">{userName}</div>
                        <div className="user-popover-phone">{currentUser?.phone || ''}</div>
                      </div>
                      <div className="user-popover-points-tag">
                        <Sparkles size={12} />
                        <span>{isAr ? `${userPoints} نقطة` : `${userPoints} pts`}</span>
                      </div>
                    </div>

                    <div className="user-popover-divider" />

                    <div className="user-popover-actions">
                      <button 
                        type="button" 
                        className="user-popover-item"
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveTab('profile');
                        }}
                      >
                        <User size={16} className="item-icon" />
                        <span>{isAr ? 'الملف الشخصي والمحفظة' : 'My Profile & Wallet'}</span>
                      </button>

                      <button 
                        type="button" 
                        className="user-popover-item"
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveTab('profile');
                        }}
                      >
                        <ShoppingBag size={16} className="item-icon" />
                        <span>{isAr ? 'تذاكري وحجوزاتي النشطة' : 'My Active Passes'}</span>
                      </button>

                      <div className="user-popover-divider" />

                      <button 
                        type="button" 
                        className="user-popover-item logout-item"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="item-icon" />
                        <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2. GUEST USER POPOVER */
                  <div className="user-popover-guest-body">
                    <div className="guest-popover-top">
                      <div className="guest-badge-icon-wrap">
                        <User size={22} className="guest-top-icon" />
                      </div>
                      <div className="guest-badge-pill">
                        {isAr ? 'وضع الزائر' : 'Guest Mode'}
                      </div>
                    </div>

                    <h4 className="guest-popover-title">
                      {isAr ? 'أهلاً بك، ضيفنا العزيز! 👋' : 'Welcome, Guest! 👋'}
                    </h4>
                    <p className="guest-popover-desc">
                      {isAr 
                        ? 'سجل دخولك أو أنشئ حساباً جديداً للوصول إلى محفظة تذاكرك، وتجميع نقاط المكافآت والعروض الحصرية.'
                        : 'Sign in or create an account to access your digital passes, earn reward points, and view orders.'}
                    </p>

                    <div className="guest-popover-buttons">
                      <button 
                        type="button" 
                        className="guest-login-primary-btn font-alexandria"
                        onClick={handleGuestLogin}
                      >
                        <LogIn size={16} />
                        <span>{isAr ? 'تسجيل الدخول' : 'Login'}</span>
                      </button>

                      <button 
                        type="button" 
                        className="guest-signup-secondary-btn font-alexandria"
                        onClick={handleGuestSignup}
                      >
                        <UserPlus size={16} />
                        <span>{isAr ? 'إنشاء حساب جديد' : 'Sign Up'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* About us Button */}
          <button 
            className={`desktop-about-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
            title={t.nav.about}
          >
            {t.nav.about}
          </button>
        </div>
      </div>

      {/* Floating points Badge */}
      <div 
        className="desktop-points-badge"
        onClick={() => {
          if (isLoggedIn) {
            setActiveTab('profile');
          } else {
            setMenuOpen(true);
          }
        }}
        title={isLoggedIn 
          ? (lang === 'ar' ? `رصيد نقاطك: ${userPoints} نقطة` : `Balance: ${userPoints} points`)
          : (lang === 'ar' ? 'سجل دخولك لكسب النقاط' : 'Login to earn points')}
      >
        {isLoggedIn ? `${userPoints} PTS` : t.common.ptsValue}
      </div>
    </header>
  );
}
