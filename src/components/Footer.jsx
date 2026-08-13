import React from 'react';
import { translations } from '../data/content';

export default function Footer({ lang, openModal }) {
  const t = translations[lang].footer;

  return (
    <footer className="footer">
      <div className="footer-brand">
        American Dream
      </div>

      <ul className="footer-links">
        <li className="footer-link" onClick={() => openModal('about')}>
          {t.aboutUs}
        </li>
        <li className="footer-link" onClick={() => openModal('contact')}>
          {t.contact}
        </li>
        <li className="footer-link" onClick={() => openModal('safety')}>
          {t.safetyRules}
        </li>
        <li className="footer-link" onClick={() => openModal('privacy')}>
          {t.privacyPolicy}
        </li>
      </ul>

      <div className="footer-copyright">
        {t.rights}
      </div>
    </footer>
  );
}
