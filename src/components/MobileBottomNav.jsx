import React from 'react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'home',
      label: 'HOME',
      icon: '/photo/kid-area-pic/icon/home-icon.png',
      isHome: true
    },
    {
      id: 'kids-area',
      label: 'KIDS AREA',
      icon: '/photo/kid-area-pic/icon/kids-icon.png'
    },
    {
      id: 'fun-park',
      label: 'FUN PARK',
      icon: '/photo/kid-area-pic/icon/funpark-icon.png'
    },
    {
      id: 'challenge',
      label: 'CHALLENGE',
      icon: '/photo/kid-area-pic/icon/challenge-icon.png'
    },
    {
      id: 'adventure',
      label: 'ADVENTURE',
      icon: '/photo/kid-area-pic/icon/adventure-icon.png'
    },
    {
      id: 'package',
      label: 'PACKAGE',
      icon: '/photo/kid-area-pic/icon/package-icon.png'
    }
  ];

  // Resolve active index (defaults to 0 for home/lobby)
  let activeIndex = tabs.findIndex(t => t.id === activeTab);
  if (activeIndex === -1) activeIndex = 0;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTab = tabs[activeIndex];
  const notchFillColor = 'var(--pz-bg-cream, #faf7f2)';

  return (
    <nav className="mobile-bottom-nav">
      <div className="wave-navbar-container">
        {/* Animated Wave Slider (Concave Notch + Elevated Circle Bubble) */}
        <div 
          className="wave-slider"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          {/* The Concave Wave Notch Cutout SVG - Concentric Circular Cradle */}
          <div className="wave-notch-wrap">
            <svg 
              className="wave-notch-svg" 
              viewBox="0 0 90 34" 
              preserveAspectRatio="none"
            >
              <path 
                d="M 0,-4 L 0,0 L 4.8,0 A 10 10 0 0 1 14.6 8.05 A 31 31 0 0 0 75.4 8.05 A 10 10 0 0 1 85.2 0 L 90,0 L 90,-4 Z" 
                fill={notchFillColor} 
              />
            </svg>
          </div>

          {/* Elevated Circle Bubble Floating Above the Notch */}
          <div className="wave-bubble-ring">
            <div className="wave-bubble-circle">
              {currentTab.isHome ? (
                <svg 
                  className="wave-active-icon-svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" 
                    fill="#FF9E00" 
                  />
                </svg>
              ) : (
                <div 
                  className="wave-active-icon-mask"
                  style={{
                    WebkitMaskImage: `url('${currentTab.icon}')`,
                    maskImage: `url('${currentTab.icon}')`
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* The 6 Interactive Tab Items */}
        <div className="wave-tabs-row">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tab.id}
                className={`wave-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                aria-label={tab.label}
              >
                {/* Resting Icon (fades out when tab rises into circle bubble) */}
                <div className={`tab-resting-icon ${isActive ? 'hide' : ''}`}>
                  {tab.isHome ? (
                    <svg 
                      className="resting-home-svg" 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path 
                        d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" 
                        fill="#ffffff" 
                      />
                    </svg>
                  ) : (
                    <img 
                      src={tab.icon} 
                      alt={tab.label} 
                      className="resting-tab-img"
                    />
                  )}
                </div>

                {/* Tab Label (lights up in gold under the wave) */}
                <span className="wave-tab-text">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
