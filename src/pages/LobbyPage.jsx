import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Zap 
} from 'lucide-react';
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

  // Auth Modal & Flow State (Sign In / Sign Up when clicking 4 signs)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [pendingSign, setPendingSign] = useState(null);
  const [authForm, setAuthForm] = useState({
    identifier: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Helper: check if client already has account / is logged in
  const checkIsAuthenticated = () => {
    try {
      const status = localStorage.getItem('american_dream_user_logged_in');
      if (status === 'true') return true;
      const activeUser = localStorage.getItem('american_dream_active_user');
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed && parsed.id && parsed.id !== 'guest') return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  // Sign In submit handler
  const handleAuthLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authForm.identifier.trim() || !authForm.password.trim()) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال رقم الهاتف/البريد وكلمة المرور' : 'Please enter your phone/email and password');
      return;
    }

    // Persist login state
    localStorage.setItem('american_dream_user_logged_in', 'true');
    const existingProfile = localStorage.getItem('american_dream_user_profile');
    if (!existingProfile) {
      localStorage.setItem('american_dream_user_profile', JSON.stringify({
        name: authForm.identifier.includes('@') ? authForm.identifier.split('@')[0] : 'Ahmed Mohamed',
        phone: authForm.identifier.includes('@') ? '+20 101 234 5678' : authForm.identifier,
        email: authForm.identifier.includes('@') ? authForm.identifier : 'ahmed@americandream.com',
        address: 'Canal Waterfront Road, Ferdan District, Ismailia',
        gender: 'male',
        passId: '#AD-84920',
        memberSince: 'March 2027',
        points: 1350,
        storeCredit: 135.00
      }));
    }

    playCoinSound();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fde047', '#f59e0b', '#00a9c3', '#ffffff']
      });
    } catch {}

    const targetTitle = pendingSign ? (lang === 'ar' ? pendingSign.titleAr : pendingSign.titleEn) : (lang === 'ar' ? 'الحديقة' : 'the park');
    setAuthSuccessMsg(lang === 'ar' ? `تم تسجيل الدخول بنجاح! جاري نقلك إلى ${targetTitle}...` : `Signed in successfully! Redirecting to ${targetTitle}...`);

    setTimeout(() => {
      setShowAuthModal(false);
      if (setActiveTab) {
        setActiveTab(pendingSign ? pendingSign.tab : 'home');
      }
    }, 450);
  };

  // Sign Up submit handler
  const handleAuthRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authForm.name.trim() || !authForm.phone.trim() || !authForm.password.trim()) {
      setAuthError(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    if (authForm.password !== authForm.confirmPassword) {
      setAuthError(lang === 'ar' ? 'كلمة المرور وتأكيدها غير متطابقين' : 'Passwords do not match');
      return;
    }

    // Persist registered profile
    localStorage.setItem('american_dream_user_logged_in', 'true');
    localStorage.setItem('american_dream_user_profile', JSON.stringify({
      name: authForm.name.trim(),
      phone: authForm.phone.trim(),
      email: authForm.email.trim() || 'member@americandream.com',
      address: 'Canal Waterfront Road, Ferdan District, Ismailia',
      gender: 'male',
      passId: `#AD-${Math.floor(10000 + Math.random() * 90000)}`,
      memberSince: 'October 2026',
      points: 500, // Welcome bonus points!
      storeCredit: 50.00
    }));

    playCoinSound();
    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fde047', '#f59e0b', '#00a9c3', '#10b981', '#ffffff']
      });
    } catch {}

    const targetTitle = pendingSign ? (lang === 'ar' ? pendingSign.titleAr : pendingSign.titleEn) : (lang === 'ar' ? 'الحديقة' : 'the park');
    setAuthSuccessMsg(lang === 'ar' ? `مرحباً بك ${authForm.name}! تم إنشاء حسابك بنجاح وجاري نقلك إلى ${targetTitle}...` : `Welcome ${authForm.name}! Account created! Redirecting to ${targetTitle}...`);

    setTimeout(() => {
      setShowAuthModal(false);
      if (setActiveTab) {
        setActiveTab(pendingSign ? pendingSign.tab : 'home');
      }
    }, 500);
  };

  // Quick Demo Login (Ahmed Account)
  const handleQuickDemoLogin = () => {
    localStorage.setItem('american_dream_user_logged_in', 'true');
    localStorage.setItem('american_dream_user_profile', JSON.stringify({
      name: 'Ahmed Mohamed',
      phone: '+20 101 234 5678',
      email: 'ahmed@americandream.com',
      address: 'Canal Waterfront Road, Ferdan District, Ismailia',
      gender: 'male',
      passId: '#AD-84920',
      memberSince: 'March 2027',
      points: 1350,
      storeCredit: 135.00
    }));

    playCoinSound();
    try {
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.5 } });
    } catch {}

    const targetTitle = pendingSign ? (lang === 'ar' ? pendingSign.titleAr : pendingSign.titleEn) : (lang === 'ar' ? 'الحديقة' : 'the park');
    setAuthSuccessMsg(lang === 'ar' ? `مرحباً بعودتك أحمد! جاري نقلك إلى ${targetTitle}...` : `Welcome back Ahmed! Redirecting to ${targetTitle}...`);

    setTimeout(() => {
      setShowAuthModal(false);
      if (setActiveTab) {
        setActiveTab(pendingSign ? pendingSign.tab : 'home');
      }
    }, 400);
  };

  // Continue as Guest handler
  const handleContinueAsGuest = () => {
    playCoinSound();
    setShowAuthModal(false);
    if (setActiveTab) {
      setActiveTab(pendingSign ? pendingSign.tab : 'home');
    }
  };

  // Handle Sign Click: Golden celebratory feedback & auth check
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

    // Check if client is already authenticated
    const hasAccount = checkIsAuthenticated();
    if (hasAccount) {
      setTimeout(() => {
        if (setActiveTab) {
          setActiveTab(sign.tab);
        }
      }, 320);
    } else {
      setPendingSign(sign);
      setAuthError('');
      setAuthSuccessMsg('');
      setTimeout(() => {
        setShowAuthModal(true);
        setAuthTab('login');
      }, 350);
    }
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

    const hasAccount = checkIsAuthenticated();
    if (hasAccount) {
      setTimeout(() => {
        if (setActiveTab) {
          setActiveTab('home');
        }
      }, 280);
    } else {
      setPendingSign({
        id: 'home',
        tab: 'home',
        titleAr: 'حديقة أمريكان دريم',
        titleEn: 'American Dream Park'
      });
      setAuthError('');
      setAuthSuccessMsg('');
      setTimeout(() => {
        setShowAuthModal(true);
        setAuthTab('login');
      }, 320);
    }
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

      {/* ========================================================================= */}
      {/* AUTH GATEWAY MODAL (SIGN IN / SIGN UP WHEN CLICKING 4 SIGNS) */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div 
          className="lobby-auth-backdrop" 
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="lobby-auth-card" 
            onClick={(e) => e.stopPropagation()}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="lobby-auth-header">
              <div className="lobby-auth-logo-row">
                <img 
                  src="/photo/logo/logo nav bar and footer.png" 
                  alt="American Dream" 
                  className="lobby-auth-logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <h3 className="lobby-auth-title">
                  {lang === 'ar' ? 'بوابة دخول أمريكان دريم' : 'American Dream Gateway'}
                </h3>
              </div>
              <button 
                type="button" 
                className="lobby-auth-close-btn"
                onClick={() => setShowAuthModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Destination Pill */}
            {pendingSign && (
              <div className="lobby-auth-destination-pill">
                <Sparkles size={16} color="#fde047" />
                <span>
                  {lang === 'ar' ? 'الوجهة المختارة:' : 'Selected Destination:'}{' '}
                  <strong>{lang === 'ar' ? pendingSign.titleAr : pendingSign.titleEn}</strong>
                </span>
              </div>
            )}

            {/* Tabs: Sign In / Sign Up */}
            <div className="lobby-auth-tabs">
              <button 
                type="button"
                className={`lobby-auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button 
                type="button"
                className={`lobby-auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
              >
                {lang === 'ar' ? 'إنشاء حساب جديد' : 'Sign Up'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="lobby-auth-body">
              {/* Error Message */}
              {authError && (
                <div className="lobby-auth-error">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* Success Message */}
              {authSuccessMsg && (
                <div className="lobby-auth-success">
                  <Check size={18} />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN */}
              {authTab === 'login' && (
                <form onSubmit={handleAuthLogin} className="lobby-auth-form">
                  {/* Phone or Email */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف أو البريد الإلكتروني:' : 'Phone or Email:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <User size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="text" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '01012345678 أو البريد' : '01012345678 or email'}
                        value={authForm.identifier}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, identifier: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Lock size={18} className="lobby-auth-input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '••••••••' : '••••••••'}
                        value={authForm.password}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        className="lobby-auth-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="lobby-auth-submit-btn">
                    <span>
                      {lang === 'ar' 
                        ? `دخول ومتابعة إلى ${pendingSign ? pendingSign.titleShortAr || pendingSign.titleAr : 'الحديقة'}` 
                        : `Sign In & Continue to ${pendingSign ? pendingSign.titleShortEn || pendingSign.titleEn : 'Park'}`}
                    </span>
                    {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>

                  {/* Quick Demo Login */}
                  <button 
                    type="button" 
                    className="lobby-auth-demo-btn"
                    onClick={handleQuickDemoLogin}
                  >
                    <Zap size={15} />
                    <span>{lang === 'ar' ? '⚡ تجربة سريعة كـ أحمد (Demo Account)' : '⚡ Quick Demo Login (Ahmed)'}</span>
                  </button>

                  {/* Switch to Sign Up */}
                  <div className="lobby-auth-switch-text">
                    <span>{lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}</span>{' '}
                    <button 
                      type="button" 
                      className="lobby-auth-switch-link"
                      onClick={() => { setAuthTab('register'); setAuthError(''); }}
                    >
                      {lang === 'ar' ? 'أنشئ حسابك الآن' : 'Sign Up now'}
                    </button>
                  </div>

                  {/* Guest Continue */}
                  <button 
                    type="button" 
                    className="lobby-auth-guest-btn"
                    onClick={handleContinueAsGuest}
                  >
                    {lang === 'ar' ? 'المتابعة كزائر دون تسجيل حساب ←' : 'Continue as Guest without account →'}
                  </button>
                </form>
              )}

              {/* TAB 2: SIGN UP */}
              {authTab === 'register' && (
                <form onSubmit={handleAuthRegister} className="lobby-auth-form">
                  {/* Name */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <User size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="text" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'}
                        value={authForm.name}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Phone size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="tel" 
                        required
                        className="lobby-auth-input"
                        placeholder="+20 101 234 5678"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Mail size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="email" 
                        className="lobby-auth-input"
                        placeholder="user@example.com"
                        value={authForm.email}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Lock size={18} className="lobby-auth-input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '••••••••' : '••••••••'}
                        value={authForm.password}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        className="lobby-auth-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'تأكيد كلمة المرور:' : 'Confirm Password:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Lock size={18} className="lobby-auth-input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '••••••••' : '••••••••'}
                        value={authForm.confirmPassword}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="lobby-auth-submit-btn">
                    <span>
                      {lang === 'ar' 
                        ? `إنشاء حساب ومتابعة إلى ${pendingSign ? pendingSign.titleShortAr || pendingSign.titleAr : 'الحديقة'}` 
                        : `Sign Up & Continue to ${pendingSign ? pendingSign.titleShortEn || pendingSign.titleEn : 'Park'}`}
                    </span>
                    {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>

                  {/* Switch to Sign In */}
                  <div className="lobby-auth-switch-text">
                    <span>{lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>{' '}
                    <button 
                      type="button" 
                      className="lobby-auth-switch-link"
                      onClick={() => { setAuthTab('login'); setAuthError(''); }}
                    >
                      {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                  </div>

                  {/* Guest Continue */}
                  <button 
                    type="button" 
                    className="lobby-auth-guest-btn"
                    onClick={handleContinueAsGuest}
                  >
                    {lang === 'ar' ? 'المتابعة كزائر دون تسجيل حساب ←' : 'Continue as Guest without account →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
