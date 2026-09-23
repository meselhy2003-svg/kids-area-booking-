import React from 'react';

export default function DesktopPackagePage({ setActiveTab, openModal, lang }) {
  const passes = [
    {
      id: 'all-day-super',
      name: 'All-Day Super Wristband',
      nameAr: 'إسورة الدخول الشامل طوال اليوم',
      price: 250,
      oldPrice: 380,
      save: 'SAVE 130 EGP',
      badgeClass: 'badge-blue',
      features: [
        'Unlimited access to Kids Area & Fun Park',
        '3 VR / Arcade game tokens included',
        '10% food voucher at American Dream Cafe',
        'Complimentary safety grip socks'
      ]
    },
    {
      id: 'family-bundle',
      name: 'Family Adventure Bundle (4 Passes)',
      nameAr: 'باقة العائلة المميزة (4 أساور)',
      price: 650,
      oldPrice: 950,
      save: 'SAVE 300 EGP',
      badgeClass: 'badge-cyan',
      features: [
        'Entry for 2 Adults + 2 Kids/Teens',
        'Full day access to all 4 zones',
        '10 Arcade credits + 2 Laser Arena passes',
        'Family pizza meal deal included'
      ]
    },
    {
      id: 'vip-wristband',
      name: 'VIP Fast Pass & Arcade Credit',
      nameAr: 'الإسورة الذهبية وسرعة الدخول الفوري',
      price: 450,
      oldPrice: 600,
      save: 'SAVE 150 EGP',
      badgeClass: 'badge-blue',
      features: [
        'Skip the line at all high-energy rides',
        'Unlimited climbing wall & high ropes bridge',
        '500 EGP Arcade gaming balance loaded',
        'Dedicated party coordinator service'
      ]
    }
  ];

  const handleRecharge = (pass) => {
    openModal('booking', {
      name: `${pass.name} - ${pass.nameAr}`,
      price: `${pass.price} EGP`,
      priceNum: pass.price,
      discount: pass.save,
      details: pass.features.join(' • ')
    });
  };

  return (
    <div className="desktop-page desktop-zone-page">
      <div className="desktop-page-container">
        
        {/* HERO BANNER */}
        <div className="desktop-zone-hero-banner package-hero-banner">
          <div className="desktop-zone-hero-left">
            <h1 className="desktop-zone-hero-title">Play Zone Wristbands</h1>
            <h2 className="desktop-zone-hero-tagline">Recharge, play, and get instant access!</h2>
            <h3 className="desktop-zone-hero-title-ar font-alexandria">باقات وأساور اللعب الذكية</h3>
            <p className="desktop-zone-hero-tagline-ar font-alexandria">احصل على إسورتك الذكية وتخطى طوابير الانتظار</p>
          </div>

          <div className="desktop-tilted-badge">
            <span>PLAY</span>
            <span>EXPLORE</span>
            <span>LEARN</span>
            <span>TOGETHER!</span>
          </div>
        </div>

        {/* PASSES SECTION */}
        <section className="desktop-zone-section offers-section">
          <div className="desktop-section-header-row">
            <h2 className="desktop-offers-heading">
              Featured Wristband Passes <span className="text-separator">|</span> <span className="font-alexandria">باقات الأساور المميزة</span>
            </h2>
          </div>

          <div className="desktop-offers-grid-3">
            {passes.map((pass) => (
              <div key={pass.id} className="desktop-offer-card package-card">
                <div className="desktop-offer-body">
                  <span className={`desktop-offer-save-tag ${pass.badgeClass}`}>
                    {pass.save}
                  </span>
                  
                  <h3 className="desktop-offer-title">{pass.name}</h3>
                  <h4 className="desktop-offer-title-ar font-alexandria">{pass.nameAr}</h4>

                  <ul className="desktop-package-features-list">
                    {pass.features.map((f, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a9c3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feat-check-icon">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="desktop-offer-price-row">
                    <div className="desktop-price-val">
                      <strong className="desktop-curr">EGP {pass.price}</strong>
                      {pass.oldPrice && <span className="desktop-old-price">EGP {pass.oldPrice}</span>}
                    </div>

                    <button 
                      className="desktop-get-offer-btn"
                      onClick={() => handleRecharge(pass)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn-ticket-icon">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      </svg>
                      <span>Recharge Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
