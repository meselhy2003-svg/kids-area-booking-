import React from 'react';

export default function RunningHeroBanner({ initialSlide = 0, slideIndex, zoneIndex, setActiveTab, showSign }) {
  const activeIdx = zoneIndex !== undefined ? zoneIndex : (slideIndex !== undefined ? slideIndex : initialSlide);

  const slides = [
    {
      id: 'kids-area',
      tab: 'kids-area',
      bgImage: '/photo/kid-area-pic/running-image/Little boy laughing in ball pit1.png',
      titleEn: 'Kids Area',
      subtitleEn: 'Little Adventurers Big Smiles!',
      titleAr: 'منطقة الأطفال',
      subtitleAr: 'مغامرات صغيرة وسعادة كبيرة!',
      showSign: true
    },
    {
      id: 'fun-park',
      tab: 'fun-park',
      bgImage: '/photo/kid-area-pic/running-image/Little boy laughing in ball pit2.png',
      titleEn: 'Fun Park',
      subtitleEn: 'world of fun, laughter, and endless smiles',
      titleAr: 'منطقة المرح',
      subtitleAr: 'عالم من المرح والضحك والابتسامات التي لا تنتهي',
      showSign: true
    },
    {
      id: 'challenge',
      tab: 'challenge',
      bgImage: '/photo/kid-area-pic/running-image/Little boy laughing in ball pit3.png',
      titleEn: 'CHALLENGE ZONE',
      subtitleEn: 'Challenge yourself, beat your score, and have fun',
      titleAr: 'منطقة التحدي',
      subtitleAr: 'تحدى نفسك، حطم رقمك القياسي، واستمتع باللعب',
      showSign: true
    },
    {
      id: 'adventure',
      tab: 'adventure',
      bgImage: '/photo/kid-area-pic/running-image/Little boy laughing in ball pit3.png',
      titleEn: 'ADVENTURE ZONE',
      subtitleEn: 'Where boundless energy meets endless family smiles in Ismailia premier indoor wonderland.',
      titleAr: 'منطقة المغامرات',
      subtitleAr: 'حيث تلتقي الطاقة والحماس بابتسامات عائلية لا تنتهي في عالم المغامرات الداخلي الأول في الإسماعيلية',
      showSign: false // Sign removed from adventure image only
    }
  ];

  const current = slides[activeIdx] || slides[0];
  const shouldShowSign = showSign !== undefined ? showSign : (current.showSign !== false);

  return (
    <div className="running-banner-slider">
      <div className="running-slide active">
        {/* Background Image strictly from "photo/kid area pic/running image" */}
        <img 
          src={current.bgImage} 
          alt={current.titleEn} 
          className="running-banner-bg" 
        />

        {/* Dark gradient overlay + bilingual typography */}
        <div className="running-banner-overlay">
          <h2 className="running-title-en">{current.titleEn}</h2>
          <p className="running-sub-en">{current.subtitleEn}</p>
          <h3 className="running-title-ar">{current.titleAr}</h3>
          <p className="running-sub-ar">{current.subtitleAr}</p>
        </div>
      </div>

      {/* Yellow Tilted Sign (Hidden on Adventure image only) */}
      {shouldShowSign && (
        <div className="banner-yellow-sticker challenge-sticker">
          <span>Play</span>
          <span>Explore</span>
          <span>Learn</span>
          <span>Together!</span>
        </div>
      )}

      {/* 4 Navigation Dots strictly matching media_1790113823963.png - media_1790113842348.png */}
      <div className="banner-dots-row">
        {slides.map((s, idx) => (
          <span 
            key={s.id} 
            className={`banner-dot ${activeIdx === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (setActiveTab && s.tab) {
                setActiveTab(s.tab);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${s.titleEn}`}
            title={s.titleEn}
          />
        ))}
      </div>
    </div>
  );
}
