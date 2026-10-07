import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import './LobbyPage.css';

// 4 Hanging Attraction Signs (Corrected file paths matching public/photo/lobby/)
const LOBBY_NAV_SIGNS = [
  {
    id: 'trips',
    tab: 'trips',
    img: '/photo/lobby/sign-trips.png',
    titleAr: 'الرحلات',
    titleShortAr: 'الرحلات',
    titleEn: 'Trips',
    titleShortEn: 'Trips',
    className: 'hanging-sign-trips',
    ariaLabel: 'رحلات أمريكان دريم / American Dream Trips'
  },
  {
    id: 'events',
    tab: 'events',
    img: '/photo/lobby/sign-events.png',
    titleAr: 'الحفلات والقاعات',
    titleShortAr: 'الحفلات',
    titleEn: 'Events & Halls',
    titleShortEn: 'Events',
    className: 'hanging-sign-events',
    ariaLabel: 'الحفلات والقاعات / Events & Halls'
  },
  {
    id: 'restaurant',
    tab: 'restaurant',
    img: '/photo/lobby/sign-restaurant.png',
    titleAr: 'المطعم والكافيه',
    titleShortAr: 'المطعم',
    titleEn: 'Restaurant & Cafe',
    titleShortEn: 'Restaurant',
    className: 'hanging-sign-restaurant',
    ariaLabel: 'المطعم والكافيه / Restaurant & Cafe'
  },
  {
    id: 'games',
    tab: 'kids-area',
    img: '/photo/lobby/sign-games.png',
    titleAr: 'منطقة الألعاب',
    titleShortAr: 'الألعاب',
    titleEn: 'Games Area',
    titleShortEn: 'Games',
    className: 'hanging-sign-games',
    ariaLabel: 'منطقة الألعاب / Games Area'
  }
];

export default function LobbyPage({ 
  setActiveTab, 
  lang = 'ar', 
  setLang,
  isDesktop = true
}) {
  // Animation & Interactive States
  const [isJumping, setIsJumping] = useState(false);
  const [girlPose, setGirlPose] = useState('idle'); // 'idle' | 'jumping'
  const [activeSignHit, setActiveSignHit] = useState(null);
  const [showCoinSign, setShowCoinSign] = useState(null);
  const [, setJumpCount] = useState(0);

  // Timeouts ref to prevent race conditions
  const animTimeoutRef = useRef(null);
  const hitTimeoutRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Prevent any document scrolling while the lobby gateway is visible
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Initialize Web Audio API for Mario retro sounds
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Ensure AudioContext is always active & auto-unlocked on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [getAudioContext]);

  // Synthesize Retro Jump Sound (Mario Jump Whoosh) - Always Active
  const playJumpSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.32);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [getAudioContext]);

  // Synthesize Retro Block Hit / Coin Sound (Mario Coin Chime) - Always Active
  const playCoinSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      osc2.frequency.setValueAtTime(987.77, now);
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.42);
      osc2.stop(now + 0.42);
    } catch {
      // ignore
    }
  }, [getAudioContext]);

  // Trigger the Super Mario Jump sequence
  const triggerMarioJump = useCallback((targetSignId = 'trips') => {
    if (isJumping) return;

    setIsJumping(true);
    setGirlPose('jumping');
    setJumpCount(c => c + 1);
    playJumpSound();

    // Peak reached, trigger coin chime & confetti
    hitTimeoutRef.current = setTimeout(() => {
      setActiveSignHit(targetSignId);
      setShowCoinSign(targetSignId);
      playCoinSound();

      try {
        confetti({
          particleCount: 22,
          spread: 50,
          startVelocity: 16,
          ticks: 45,
          origin: { x: 0.28, y: 0.38 },
          colors: ['#fde047', '#f59e0b', '#fbbf24', '#ffffff'],
          shapes: ['circle']
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setActiveSignHit(null);
        setShowCoinSign(null);
      }, 550);
    }, 420);

    // Complete jump & land back down
    animTimeoutRef.current = setTimeout(() => {
      setIsJumping(false);
      setGirlPose('idle');
    }, 950);
  }, [isJumping, playJumpSound, playCoinSound]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
    };
  }, []);

  // Handle Sign Click: Golden celebratory feedback & navigation to page
  const handleSignClick = (sign) => {
    setActiveSignHit(sign.id);
    setShowCoinSign(sign.id);
    playCoinSound();

    try {
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.45 },
        colors: ['#fde047', '#f59e0b', '#fbbf24', '#ffffff']
      });
    } catch {
      // ignore
    }

    if (!isJumping) {
      triggerMarioJump(sign.id);
    }

    setTimeout(() => {
      if (setActiveTab) {
        setActiveTab(sign.tab);
      }
    }, 320);
  };

  // Direct entry to main park home page
  const handleEnterPark = () => {
    playCoinSound();
    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      if (setActiveTab) {
        setActiveTab('home');
      }
    }, 280);
  };

  return (
    <div className={`lobby-gateway-container ${lang === 'ar' ? 'font-alexandria lang-ar' : 'lang-en'}`}>
      {/* Ambient Lighting Overlay */}
      <div className="lobby-ambient-overlay" />

      {/* ========================================================================= */}
      {/* HANGING RECEPTION BRAND SIGN (Top Center Plaque) */}
      {/* ========================================================================= */}
      <div 
        className="lobby-header-plaque"
        style={!isDesktop ? { top: 0, marginTop: '176px' } : {}}
      >
        <img 
          src="/photo/Gemini_Generated_Image_7a4kvx7a4kvx7a4k-removebg-preview.png" 
          alt="American Dream Ismailia" 
          className="lobby-header-img"
          onError={(e) => {
            e.currentTarget.src = '/photo/lobby/Gemini_Generated_Image_7a4kvx7a4kvx7a4k-removebg-preview.png';
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4 HANGING BUTTON SIGNS (Trips, Events, Restaurant, Games) */}
      {/* ========================================================================= */}
      <main 
        className="lobby-signs-stage" 
        style={{ direction: 'ltr', marginTop: isDesktop ? '170px' : '350px' }}
      >
        {LOBBY_NAV_SIGNS.map((sign) => {
          const isHit = activeSignHit === sign.id;
          const showCoin = showCoinSign === sign.id;

          return (
            <button
              key={sign.id}
              type="button"
              className={`hanging-sign-wrap ${sign.className} ${isHit ? 'sign-hit-animation' : ''}`}
              onMouseEnter={() => {
                if (sign.id === 'trips' && !isJumping) {
                  triggerMarioJump('trips');
                }
              }}
              onClick={() => handleSignClick(sign)}
              aria-label={sign.ariaLabel}
              title={lang === 'ar' ? `اضغط للانتقال إلى ${sign.titleAr}` : `Click to visit ${sign.titleEn}`}
            >
              <img 
                src={sign.img} 
                alt={sign.titleAr} 
                className="hanging-sign-img"
              />

              {/* Golden Coin Burst Particle on Hit / Click */}
              {showCoin && (
                <div className="mario-coin-particle">
                  <svg viewBox="0 0 24 24" width="44" height="44" fill="#fde047">
                    <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
                    <polygon points="12 4 14.5 9.5 20.5 10.3 16 14.7 17.2 20.5 12 17.5 6.8 20.5 8 14.7 3.5 10.3 9.5 9.5 12 4" fill="#f59e0b" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </main>

      {/* ========================================================================= */}
      {/* CHARACTERS STAGE (Girl on Bottom-Left, Boy on Bottom-Right) */}
      {/* ========================================================================= */}
      <div className="lobby-characters-stage">
        {/* GIRL CHARACTER (Bottom-Left) with Super Mario Jump */}
        <div 
          className={`girl-character-anchor ${isJumping ? 'jumping' : ''}`}
          onClick={() => triggerMarioJump('trips')}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          title={lang === 'ar' ? 'اضغط لتشاهدني أقفز!' : 'Click to watch me jump!'}
        >
          {/* Girl Character Image: Swaps to Jumping Pose on Jump */}
          <img 
            src={
              girlPose === 'jumping'
                ? '/photo/lobby/Gemini_Generated_Image_1ar6a61ar6a61ar6-removebg-preview.png'
                : '/photo/lobby/Gemini_Generated_Image_q8ae7hq8ae7hq8ae-removebg-preview.png'
            } 
            alt="American Dream Girl" 
            className="girl-character-img"
          />

          {/* Realistic Elliptical Ground Shadow */}
          <div className="character-ground-shadow" />
        </div>

        {/* BOY CHARACTER (Bottom-Right) Waving & Welcoming */}
        <div 
          className="boy-character-anchor"
          onClick={handleEnterPark}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          title={lang === 'ar' ? 'اضغط للدخول إلى الحديقة' : 'Click to enter the park'}
        >
          {/* Boy Character Image */}
          <img 
            src="/photo/lobby/Gemini_Generated_Image_g7v7rfg7v7rfg7v7-removebg-preview.png" 
            alt="American Dream Boy" 
            className="boy-character-img"
          />

          {/* Realistic Elliptical Ground Shadow */}
          <div className="character-ground-shadow" />
        </div>
      </div>
    </div>
  );
}
