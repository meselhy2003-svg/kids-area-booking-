import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ 
  fullscreen = true, 
  lang = 'en',
  onFinish = null 
}) {
  const [progress, setProgress] = useState(15);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress simulation for pleasant user experience
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 20) + 12;
        return Math.min(100, prev + increment);
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && onFinish) {
      const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 400);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinish]);

  return (
    <div className={`loading-screen-container ${fullscreen ? 'fullscreen' : 'inline'} ${fadingOut ? 'fade-out' : ''}`}>
      {/* Background ambient lighting orbs */}
      <div className="loading-ambient-orb orb-1" />
      <div className="loading-ambient-orb orb-2" />
      <div className="loading-ambient-orb orb-3" />

      <div className="loading-content-box">
        {/* Animated Brand Logo */}
        <div className="loading-logo-wrapper">
          <img 
            src="/photo/logo/logo nav bar and footer.png" 
            alt="Play Zone" 
            className="loading-logo-img"
          />
          <div className="loading-logo-glow" />
        </div>

        {/* Colorful PLAY ZONE Title */}
        <h2 className="loading-brand-title">
          <span style={{ color: '#00a9c3' }}>P</span>
          <span style={{ color: '#ffffff' }}>L</span>
          <span style={{ color: '#f7a81b' }}>A</span>
          <span style={{ color: '#ffffff' }}>Y</span>
          <span className="loading-title-space">&nbsp;</span>
          <span style={{ color: '#00a9c3' }}>Z</span>
          <span style={{ color: '#ffffff' }}>O</span>
          <span style={{ color: '#f7a81b' }}>N</span>
          <span style={{ color: '#ffffff' }}>E</span>
        </h2>

        <p className="loading-tagline">
          {lang === 'ar' 
            ? 'أمريكان دريم الإسماعيلية • عالم المغامرة والمرح' 
            : 'American Dream Ismailia • Premier Fun Park'}
        </p>

        {/* Modern Animated Progress Bar */}
        <div className="loading-progress-track">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${progress}%` }} 
          />
          <div className="loading-progress-glow" style={{ left: `${progress}%` }} />
        </div>

        {/* Percentage Counter and Status Label */}
        <div className="loading-status-row">
          <span className="loading-status-text">
            {progress < 40 
              ? (lang === 'ar' ? 'جاري تحسين الصور والتذاكر...' : 'Optimizing media & passes...')
              : progress < 80 
                ? (lang === 'ar' ? 'جاري تحميل مناطق الألعاب...' : 'Connecting play zones...')
                : (lang === 'ar' ? 'مستعدون للمرح!' : 'Ready for adventure!')}
          </span>
          <span className="loading-percent-number">{progress}%</span>
        </div>

        {/* Mini Playful Dots */}
        <div className="loading-dots-bounce">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>
    </div>
  );
}
