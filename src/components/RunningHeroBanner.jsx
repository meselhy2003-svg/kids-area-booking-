import React from 'react';

export default function RunningHeroBanner({ initialSlide = 0, slideIndex, zoneIndex, setActiveTab, showSign, heroSlide, lang = 'ar' }) {
  const isArabic = lang === 'ar';
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

  let current = slides[activeIdx] || slides[0];
  if (heroSlide) {
    current = {
      ...current,
      bgImage: heroSlide.image || heroSlide.src || heroSlide.bgImage || current.bgImage,
      fallbackImg: heroSlide.fallbackSrc || current.bgImage,
      titleEn: heroSlide.titleEn || current.titleEn,
      subtitleEn: heroSlide.subtitleEn || current.subtitleEn,
      titleAr: heroSlide.titleAr || current.titleAr,
      subtitleAr: heroSlide.subtitleAr || current.subtitleAr
    };
  }

  const shouldShowSign = showSign !== undefined ? showSign : (current.showSign !== false);

  return (
    <div className={`running-banner-slider ${isArabic ? 'lang-ar' : 'lang-en'}`}>
      <div className="running-slide active">
        {/* Background Image */}
        <img 
          src={current.bgImage} 
          alt={isArabic ? current.titleAr : current.titleEn} 
          className="running-banner-bg" 
          onError={(e) => {
            const fb = current.fallbackImg || '/photo/kid-area-pic/running-image/Little boy laughing in ball pit1.png';
            if (!e.currentTarget.src.includes(fb)) {
              e.currentTarget.src = fb;
            }
          }}
        />

        {/* Dark gradient overlay + strictly single language typography */}
        <div className="running-banner-overlay">
          {isArabic ? (
            <>
              <h2 className="running-title-ar font-alexandria">{current.titleAr}</h2>
              <p className="running-sub-ar font-alexandria">{current.subtitleAr}</p>
            </>
          ) : (
            <>
              <h2 className="running-title-en">{current.titleEn}</h2>
              <p className="running-sub-en">{current.subtitleEn}</p>
            </>
          )}
        </div>
      </div>

      {/* Yellow Tilted Sign */}
      {shouldShowSign && (
        <div className="banner-yellow-sticker challenge-sticker">
          {isArabic ? (
            <>
              <span>العب</span>
              <span>اكتشف</span>
              <span>تعلم</span>
              <span>معنا!</span>
            </>
          ) : (
            <>
              <span>Play</span>
              <span>Explore</span>
              <span>Learn</span>
              <span>Together!</span>
            </>
          )}
        </div>
      )}

      {/* 4 Navigation Dots */}
      <div className="banner-dots-row">
        {slides.map((s, idx) => {
          const dotTitle = isArabic ? s.titleAr : s.titleEn;
          return (
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
              aria-label={dotTitle}
              title={dotTitle}
            />
          );
        })}
      </div>
    </div>
  );
}
