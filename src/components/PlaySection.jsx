import React from 'react';
import { Gamepad2, Sparkles, Smile, ShieldCheck, Users, Clock, Info } from 'lucide-react';
import { translations, playZones } from '../data/content';

export default function PlaySection({ lang, openModal }) {
  const t = translations[lang].playSection;

  return (
    <div className="page-section">
      <div className="section-header">
        <h2 className="section-title">
          <Sparkles style={{ color: '#ffd15c' }} />
          <span>{t.title}</span>
        </h2>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      <div className="cards-grid">
        {playZones.map(zone => (
          <div key={zone.id} className="card">
            <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img 
                src={zone.image} 
                alt={lang === 'en' ? zone.titleEn : zone.titleAr}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: zone.color, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>
                {t.included}
              </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>
              {lang === 'en' ? zone.titleEn : zone.titleAr}
            </h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} style={{ color: '#ffd15c' }} />
                <span>{t.ageTag}: <strong>{zone.age}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} style={{ color: '#1693b3' }} />
                <span>{t.capacity}: <strong>{zone.capacity}</strong></span>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>
              {lang === 'en' ? zone.descEn : zone.descAr}
            </p>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openModal('playInfo', zone)}>
              <Info size={16} />
              <span>Zone Details & Rules</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
