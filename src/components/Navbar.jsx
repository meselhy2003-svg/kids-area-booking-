import React, { useState } from 'react';
import { Bell, Globe, Sparkles, X, Check } from 'lucide-react';
import { translations } from '../data/content';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, openNotifications }) {
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="nav-brand" onClick={() => setActiveTab('lobby')}>
        <span>American</span> Dream
      </div>

      {/* Nav Links */}
      <nav>
        <ul className="nav-links">
          <li 
            className={`nav-item ${activeTab === 'lobby' ? 'active' : ''}`}
            onClick={() => setActiveTab('lobby')}
          >
            {t.nav.lobby}
          </li>
          <li 
            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            {t.nav.menu}
          </li>
          <li 
            className={`nav-item ${activeTab === 'play' ? 'active' : ''}`}
            onClick={() => setActiveTab('play')}
          >
            {t.nav.play}
          </li>
          <li 
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            {t.nav.events}
          </li>
        </ul>
      </nav>

      {/* Action Controls */}
      <div className="nav-actions">
        {/* Notification Bell */}
        <button 
          className="icon-btn" 
          aria-label="Notifications"
          onClick={openNotifications}
          title="Announcements"
        >
          <Bell size={20} />
          <span className="badge">2</span>
        </button>

        {/* Language Switcher */}
        <button className="lang-toggle" onClick={toggleLanguage} title="Switch Language">
          <Globe size={16} />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>
    </header>
  );
}
