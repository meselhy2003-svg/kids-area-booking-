import React from 'react';
import { Calendar, PartyPopper, Check, Gift, Star } from 'lucide-react';
import { translations, eventPackages } from '../data/content';

export default function EventsSection({ lang, openModal }) {
  const t = translations[lang].eventsSection;

  return (
    <div className="page-section">
      <div className="section-header">
        <h2 className="section-title">
          <PartyPopper style={{ color: '#ffd15c' }} />
          <span>{t.title}</span>
        </h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {eventPackages.map(pkg => (
          <div 
            key={pkg.id} 
            className="card"
            style={{ 
              border: pkg.popular ? '2px solid #ffd15c' : '1px solid rgba(255,255,255,0.15)',
              position: 'relative',
              background: pkg.popular ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))' : 'rgba(30, 41, 59, 0.7)'
            }}
          >
            {pkg.badge && (
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: pkg.popular ? '#ffd15c' : '#1693b3', color: pkg.popular ? '#1e293b' : 'white', padding: '4px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '0.8rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {pkg.badge}
              </div>
            )}

            <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem 0' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {lang === 'en' ? pkg.nameEn : pkg.nameAr}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffd15c' }}>
                {pkg.price}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {pkg.guests}
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', flexGrow: 1 }}>
              {(lang === 'en' ? pkg.featuresEn : pkg.featuresAr).map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <Check size={16} style={{ color: '#2ecc71', flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className={pkg.popular ? "btn-accent" : "btn-primary"} 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => openModal('partyBooking', pkg)}
            >
              <Gift size={18} />
              <span>{t.selectPackage}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
