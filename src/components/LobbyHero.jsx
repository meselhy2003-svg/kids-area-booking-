import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { Ticket, Clock } from 'lucide-react';
import { translations } from '../data/content';

export default function LobbyHero({ lang, openModal, setActiveTab }) {
  const t = translations[lang].hero;

  // Refs for GSAP targets
  const girlRef      = useRef(null);
  const boyRef       = useRef(null);
  const entryBtnRef  = useRef(null);
  const exitBtnRef   = useRef(null);
  const sparkleBurst = useRef(null);

  // React state
  const [girlImgSrc,   setGirlImgSrc]   = useState('/photo/girl-layer.png');
  const [boyImgSrc,    setBoyImgSrc]    = useState('/photo/boy-layer.png');
  const [entryHovered, setEntryHovered] = useState(false);
  const [exitHovered,  setExitHovered]  = useState(false);
  const [sparkling,    setSparkling]    = useState(false);
  const [sparklePos,   setSparklePos]   = useState({ left: '25%', top: '32%' });
  const [activeBubble, setActiveBubble] = useState(null);
  const animLock = useRef(false); // prevent double-click mid-animation

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
  // ENTRY SIGN CLICK  →  Girl jumps & taps sign with hand
  // ─────────────────────────────────────────────
  const handleEntryClick = () => {
    if (animLock.current) return;
    animLock.current = true;

    // Pause idle float during jump & swap to jump pose image
    gsap.killTweensOf(girlRef.current);
    setGirlImgSrc('/photo/girl-jump.png');

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-start idle float & reset girl image after landing
        setGirlImgSrc('/photo/girl-layer.png');
        gsap.to(girlRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(girlRef.current, { rotation: 2.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        animLock.current = false;
        openModal('entry');
      },
    });

    // 1. Girl jumps with a smaller range away from the Entry button
    tl.to(girlRef.current, {
      x: 110,
      y: -110,
      rotation: -6,
      scale: 1.06,
      duration: 0.42,
      ease: 'power2.out',
    });

    // 2. Peak of small jump
    tl.to(girlRef.current, {
      y: -125,
      rotation: -2,
      duration: 0.14,
      ease: 'sine.out',
    });

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
      '<',
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
    });

    // 5. Girl lands back down bouncing
    tl.to(girlRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.55,
      ease: 'bounce.out',
      delay: 0.15,
    });
  };

  // ─────────────────────────────────────────────
  // EXIT SIGN CLICK  →  Boy jumps & taps sign with hand (identical motion)
  // ─────────────────────────────────────────────
  const handleExitClick = () => {
    if (animLock.current) return;
    animLock.current = true;

    // Pause idle float during jump & swap to sad exit pose image
    gsap.killTweensOf(boyRef.current);
    setBoyImgSrc('/photo/boy-exit.png');

    const tl = gsap.timeline({
      onComplete: () => {
        // Re-start idle float & reset boy image after landing
        setBoyImgSrc('/photo/boy-layer.png');
        gsap.to(boyRef.current, { y: -6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(boyRef.current, { rotation: 2.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        animLock.current = false;
        openModal('exit');
      },
    });

    // 1. Boy jumps with an even smaller range further away from the Exit button
    tl.to(boyRef.current, {
      x: -70,
      y: -70,
      rotation: -4,
      scale: 1.04,
      duration: 0.40,
      ease: 'power2.out',
    });

    // 2. Peak of tiny jump
    tl.to(boyRef.current, {
      y: -85,
      rotation: -1,
      duration: 0.12,
      ease: 'sine.out',
    });

    // 3. Exit Sign swings on chains upon hand impact
    tl.to(
      exitBtnRef.current,
      {
        rotation: -18,
        duration: 0.12,
        yoyo: true,
        repeat: 5,
        ease: 'sine.inOut',
      },
      '<',
    );

    // 4. Sparkle + confetti burst at Exit sign position
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
    });

    // 5. Boy lands back down bouncing
    tl.to(boyRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.55,
      ease: 'bounce.out',
      delay: 0.15,
    });
  };

  // Normal character click (speech bubble + confetti)
  const triggerCharacterClick = (who) => {
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
    setActiveBubble(who === 'girl' ? t.girlSpeech : t.boySpeech);
    setTimeout(() => setActiveBubble(null), 4200);
  };

  return (
    <div className="hero-container">
      <div className="hero-image-wrapper">

        {/* ── Background Photo ── */}
        <img
          src="/photo/bg-thelast.png"
          alt="American Dream Ismailia Reception"
          className="hero-main-img"
        />

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

        {/* ── Reception Neon ── */}
        <div className="hotspot-reception-neon" onClick={() => openModal('reception')}>
          Reception
        </div>
        <div className="hotspot hotspot-reception" onClick={() => openModal('reception')} />

      </div>

      {/* ── Floating Status Bar ── */}
      <div className="hero-controls">
        <div className="hero-stat-chip">
          <span className="stat-dot" />
          <span>{t.liveStatus}</span>
        </div>
        <div className="hero-stat-chip">
          <Clock size={16} style={{ color: '#ffd15c' }} />
          <span>{t.openHours}</span>
        </div>
        <button className="btn-primary" onClick={() => openModal('tickets')}>
          <Ticket size={18} />
          <span>{t.bookTickets}</span>
        </button>
        <button className="btn-accent" onClick={() => setActiveTab('play')}>
          <span>{t.explorePark}</span>
        </button>
      </div>
    </div>
  );
}
