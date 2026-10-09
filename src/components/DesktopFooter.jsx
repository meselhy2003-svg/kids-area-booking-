import React from 'react';
import { getTranslations } from '../data/translations';

export default function DesktopFooter({ openModal, setActiveTab, lang = 'ar' }) {
  const t = getTranslations(lang);

  return (
    <footer className="desktop-footer">
      <div className="desktop-footer-container">
        {/* Left: Brand Logo */}
        <a 
          href="#home"
          className="desktop-footer-brand" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab && setActiveTab('home');
          }}
          title={t.brand.name}
          aria-label={t.brand.name}
        >
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt={t.brand.name} 
            className="desktop-footer-logo-img" 
          />
        </a>

        {/* Center: Legal & Info Links */}
        <div className="desktop-footer-links">
          <button 
            className="desktop-footer-link"
            onClick={() => setActiveTab && setActiveTab('about')}
          >
            {t.footer.about}
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => {
              if (setActiveTab) {
                setActiveTab('about');
                setTimeout(() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            {t.footer.contact}
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('safety-guidelines')}
          >
            {t.footer.safety}
          </button>
          <button 
            className="desktop-footer-link"
            onClick={() => openModal && openModal('about-info')}
          >
            {t.footer.privacy}
          </button>
        </div>

        {/* Right: Copyright Text */}
        <div className="desktop-footer-copy">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
