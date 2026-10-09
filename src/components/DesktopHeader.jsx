import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { getTranslations } from '../data/translations';
import { authService, isUserAuthenticated } from '../api/authService';

export default function DesktopHeader({ 
  activeTab, 
  setActiveTab, 
  openModal, 
  lang, 
  setLang,
  isDesktopView,
  setIsDesktopView
}) {
  const t = getTranslations(lang);
  const isPlayZonesActive = ['kids-area', 'fun-park', 'challenge', 'adventure', 'package'].includes(activeTab);

  const [isLoggedIn, setIsLoggedIn] = useState(() => isUserAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isUserAuthenticated());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    if (setActiveTab) setActiveTab('lobby');
    if (typeof window !== 'undefined') {
      window.location.hash = '#lobby';
    }
  };

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
          {/* Language Switcher Pill: Main Arabic (Alexandria), Second English */}
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

          {/* Parachute / Fast Pass Cart Button */}
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

          {/* User Profile Pill (Opens Profile Page - Icon Only) */}
          <button 
            className={`desktop-nav-user-pill ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            title={t.nav.profileName}
            aria-label={t.nav.profileName}
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

          {/* Log Out Button */}
          {isLoggedIn && (
            <button
              type="button"
              className="desktop-nav-logout-btn"
              onClick={handleLogout}
              title={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
              aria-label={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut size={15} />
              <span>{lang === 'ar' ? 'خروج' : 'Logout'}</span>
            </button>
          )}

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

      {/* Floating points Badge (Opens Profile Page) */}
      <div 
        className="desktop-points-badge"
        onClick={() => setActiveTab('profile')}
        title={lang === 'ar' ? 'رصيد نقاطك: ٢,٢٥٠ نقطة' : 'Balance: 2,250 points'}
      >
        {t.common.ptsValue}
      </div>
    </header>
  );
}
