import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { translations } from '../data/content';

export default function LobbyHero({ lang, openModal, setActiveTab }) {
  const t = translations[lang].hero;

  // Refs for GSAP targets
  const girlRef      = useRef(null);
  const boyRef       = useRef(null);
  const entryBtnRef  = useRef(null);
  const exitBtnRef   = useRef(null);
  const sparkleBurst = useRef(null);

  // Frames for girl character animation (all frames from photo/landingpagegirl)
  const GIRL_FRAMES = {
    frame1: '/photo/landingpagegirl/frame-1.png',
    frame2: '/photo/landingpagegirl/frame-2.png',
    frame3: '/photo/landingpagegirl/frame-3.png',
    frame4: '/photo/landingpagegirl/frame-4.png',
  };

  // React state
  const [girlImgSrc,   setGirlImgSrc]   = useState(GIRL_FRAMES.frame1);
  const [boyImgSrc,    setBoyImgSrc]    = useState('/photo/boy-layer.png');
  const [entryHovered, setEntryHovered] = useState(false);
  const [exitHovered,  setExitHovered]  = useState(false);
  const [sparkling,    setSparkling]    = useState(false);
  const [sparklePos,   setSparklePos]   = useState({ left: '25%', top: '32%' });
  const [activeBubble, setActiveBubble] = useState(null);
  const animLock = useRef(false); // prevent double-click mid-animation

  // Preload all frames on mount for instant zero-lag frame switching
  useEffect(() => {
    Object.values(GIRL_FRAMES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    ['/photo/boy-exit.png', '/photo/boy-layer.png'].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ─────────────────────────────────────────────
  // IDLE ANIMATIONS  (mount once, run forever)
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Girl: gentle floating breath
    gsap.to(girlRef.current, {
      y: -6,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Girl: very slight swaying rotation
    gsap.to(girlRef.current, {
      rotation: 2.5,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Boy: gentle floating breath (identical to girl timing & ease)
    gsap.to(boyRef.current, {
      y: -6,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(boyRef.current, {
      rotation: 2.5,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      gsap.killTweensOf(girlRef.current);
      gsap.killTweensOf(boyRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────
  // ENTRY SIGN CLICK  →  Girl jumps & taps sign with hand, cycling through all frames
  // ─────────────────────────────────────────────
  const handleEntryClick = () => {
    if (animLock.current) return;
    animLock.current = true;

    // Pause idle float during jump
    gsap.killTweensOf(girlRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-start idle float & reset girl image after landing
        setGirlImgSrc(GIRL_FRAMES.frame1);
        gsap.to(girlRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(girlRef.current, { rotation: 2.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        animLock.current = false;
        setActiveTab('kids-area');
      },
    });

    // Frame 1: Ground takeoff
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame1), null, 0);

    // Frame 2: Rising jump pose
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame2), null, 0.10);

    // 1. Girl jumps with a trajectory towards the Entry button
    tl.to(girlRef.current, {
      x: 65,
      y: -90,
      rotation: -5,
      scale: 1.05,
      duration: 0.42,
      ease: 'power2.out',
    }, 0);

    // Frame 3: Mid-air flight pose
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame3), null, 0.22);

    // Frame 4: Peak reach pose tapping sign with pointing finger!
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame4), null, 0.36);

    // 2. Peak of jump
    tl.to(girlRef.current, {
      y: -102,
      rotation: -2,
      duration: 0.14,
      ease: 'sine.out',
    }, 0.42);

    // 3. Entry Sign swings on chains upon hand impact
    tl.to(
      entryBtnRef.current,
      {
        rotation: 18,
        duration: 0.12,
        yoyo: true,
        repeat: 5,
        ease: 'sine.inOut',
      },
      0.44,
    );

    // 4. Sparkle + confetti burst at Entry sign position
    tl.call(() => {
      setSparklePos({ left: '25%', top: '32%' });
      setSparkling(true);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { x: 0.30, y: 0.38 },
        colors: ['#ffd15c', '#ffffff', '#00c2e0', '#ff6b6b'],
      });
      setTimeout(() => setSparkling(false), 800);
    }, null, 0.44);

    // Frame 3: Descending flight
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame3), null, 0.65);

    // Frame 2: Preparing for ground contact
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame2), null, 0.85);

    // 5. Girl lands back down bouncing
    tl.to(girlRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.55,
      ease: 'bounce.out',
    }, 0.70);

    // Frame 1: Landed back on ground
    tl.call(() => setGirlImgSrc(GIRL_FRAMES.frame1), null, 1.15);
  };

  // ─────────────────────────────────────────────
  // EXIT SIGN CLICK  →  Boy stays in place while exit pose shows
  // ─────────────────────────────────────────────
  const handleExitClick = () => {
    if (animLock.current) return;
    animLock.current = true;

    // Pause idle float & ensure boy stays grounded in the exact same place
    gsap.killTweensOf(boyRef.current);
    gsap.set(boyRef.current, { x: 0, y: 0, rotation: 0, scale: 1 });
    setBoyImgSrc('/photo/boy-exit.png');

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-start idle float & reset boy image
        setBoyImgSrc('/photo/boy-layer.png');
        gsap.to(boyRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(boyRef.current, { rotation: 2.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        animLock.current = false;
        openModal('exit');
      },
    });

    // 1. Exit Sign swings on chains
    tl.to(
      exitBtnRef.current,
      {
        rotation: -18,
        duration: 0.12,
        yoyo: true,
        repeat: 5,
        ease: 'sine.inOut',
      },
      0,
    );

    // 2. Sparkle + confetti burst at Exit sign position
    tl.call(() => {
      setSparklePos({ left: '68%', top: '32%' });
      setSparkling(true);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { x: 0.70, y: 0.38 },
        colors: ['#ffd15c', '#ffffff', '#00c2e0', '#ff6b6b'],
      });
      setTimeout(() => setSparkling(false), 800);
    }, null, 0.1);

    // 3. Keep boy in place for 0.9s showing the sad exit pose
    tl.to(boyRef.current, {
      duration: 0.9,
    });
  };

  // Normal character click (speech bubble + confetti + playful jump animation)
  const triggerCharacterClick = (who) => {
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
    setActiveBubble(who === 'girl' ? t.girlSpeech : t.boySpeech);
    setTimeout(() => setActiveBubble(null), 4200);

    if (who === 'girl' && !animLock.current) {
      gsap.killTweensOf(girlRef.current);
      const hopTl = gsap.timeline({
        onComplete: () => {
          setGirlImgSrc(GIRL_FRAMES.frame1);
          gsap.to(girlRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.to(girlRef.current, { rotation: 2.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        },
      });
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame2), null, 0.06);
      hopTl.to(girlRef.current, { y: -30, rotation: -3, scale: 1.04, duration: 0.2, ease: 'power1.out' }, 0);
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame3), null, 0.14);
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame4), null, 0.24);
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame3), null, 0.38);
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame2), null, 0.48);
      hopTl.to(girlRef.current, { y: 0, rotation: 0, scale: 1, duration: 0.32, ease: 'bounce.out' }, 0.45);
      hopTl.call(() => setGirlImgSrc(GIRL_FRAMES.frame1), null, 0.7);
    }
  };

  return (
    <div className="hero-container">
      {/* Ambient background glow & blurred backdrop for widescreen displays */}
      <div className="hero-backdrop" aria-hidden="true">
        <img src="/photo/bg-sdqpur.png" alt="" className="hero-backdrop-img" />
        <div className="hero-backdrop-overlay" />
      </div>

      <div className="hero-image-wrapper">

        {/* ── Background Photo ── */}
        <img
          src="/photo/bg-sdqpur.png"
          alt="American Dream Ismailia Reception"
          className="hero-main-img"
        />

        {/* Atmospheric vignettes for seamless lighting & contrast */}
        <div className="hero-vignette-top" aria-hidden="true" />
        <div className="hero-vignette-bottom" aria-hidden="true" />

        {/* ══════════════════════════════════════════
            GIRL CHARACTER OVERLAY  (GSAP-animated)
        ══════════════════════════════════════════ */}
        <div
          ref={girlRef}
          className="character-overlay girl-overlay"
          onClick={() => triggerCharacterClick('girl')}
          title="Click me!"
        >
          <img src={girlImgSrc} alt="Girl character" className="char-layer-img" />
          {activeBubble === t.girlSpeech && (
            <div className="speech-bubble speech-bubble--girl">{t.girlSpeech}</div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            BOY CHARACTER OVERLAY  (GSAP-animated)
        ══════════════════════════════════════════ */}
        <div
          ref={boyRef}
          className="character-overlay boy-overlay"
          onClick={() => triggerCharacterClick('boy')}
          title="Click me!"
        >
          <img src={boyImgSrc} alt="Boy character" className="char-layer-img" />
          {activeBubble === t.boySpeech && (
            <div className="speech-bubble speech-bubble--boy">{t.boySpeech}</div>
          )}
        </div>

        {/* ── Sparkle burst ── */}
        {sparkling && (
          <div className="sparkle-burst" style={{ left: sparklePos.left, top: sparklePos.top }}>
            {['✨', '⭐', '💥', '🌟', '✨'].map((s, i) => (
              <span key={i} className={`sparkle sparkle--${i}`}>{s}</span>
            ))}
          </div>
        )}

        {/* ── ENTRY Sign Button ── */}
        <button
          ref={entryBtnRef}
          className="sign-btn sign-btn--entry"
          onMouseEnter={() => setEntryHovered(true)}
          onMouseLeave={() => setEntryHovered(false)}
          onClick={handleEntryClick}
          aria-label="Entry / دخول"
        >
          <img
            src={entryHovered ? '/photo/entry-glow.png' : '/photo/entry-normal.png'}
            alt="Entry دخول"
            className={`sign-img ${entryHovered ? 'sign-img--hovered' : ''}`}
          />
        </button>

        {/* ── EXIT Sign Button ── */}
        <button
          ref={exitBtnRef}
          className="sign-btn sign-btn--exit"
          onMouseEnter={() => setExitHovered(true)}
          onMouseLeave={() => setExitHovered(false)}
          onClick={handleExitClick}
          aria-label="Exit / خروج"
        >
          <img
            src={exitHovered ? '/photo/exit-glow.png' : '/photo/exit-normal.png'}
            alt="Exit خروج"
            className={`sign-img ${exitHovered ? 'sign-img--hovered' : ''}`}
          />
        </button>

        {/* ── Main Park Sign (Above Entry & Exit) ── */}
        <div className="main-park-sign">
          <img
            src="/photo/Gemini_Generated_Image_7a4kvx7a4kvx7a4k-removebg-preview.png"
            alt="American Dream Ismailia"
            className="main-park-sign-img"
          />
        </div>

      </div>
    </div>
  );
}
