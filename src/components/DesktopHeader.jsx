import React from 'react';
import { getTranslations } from '../data/translations';

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
            className={`desktop-nav-link ${activeTab === 'events' ? 'active' : ''}`}
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
          {/* Language Switcher Button */}
          <button 
            className="desktop-lang-btn font-alexandria"
            onClick={() => setLang && setLang(lang === 'ar' ? 'en' : 'ar')}
            title={lang === 'ar' ? 'Switch website to English' : 'تحويل الموقع إلى اللغة العربية'}
            aria-label="Switch Language"
            style={{ fontFamily: "'Alexandria', 'Tajawal', sans-serif" }}
          >
            <span style={{ marginInlineEnd: '4px' }}>🌐</span>
            <span style={{ fontFamily: "'Alexandria', 'Tajawal', sans-serif" }}>{t.nav.switchLangText}</span>
          </button>

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

          {/* User Profile Pill */}
          <button 
            className="desktop-nav-user-pill"
            onClick={() => openModal('profile')}
            title={`${t.nav.profileName} - ${t.nav.cart}`}
          >
            <span className="desktop-nav-user-name">{t.nav.profileName}</span>
            <img 
              src="/photo/kid area pic/icon/Symbol.png" 
              alt="Avatar" 
              className="desktop-nav-user-avatar" 
            />
          </button>

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
        onClick={() => openModal('profile')}
        title={lang === 'ar' ? 'رصيد نقاطك: ٢,٢٥٠ نقطة' : 'Balance: 2,250 points'}
      >
        {t.common.ptsValue}
      </div>
    </header>
  );
}
