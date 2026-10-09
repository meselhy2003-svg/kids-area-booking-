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
  Calendar,
  Plus,
  Trash2,
  Users
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
  const [isBoyJumping, setIsBoyJumping] = useState(false);
  const [girlPose, setGirlPose] = useState('idle'); // 'idle' | 'jumping'
  const [activeSignHit, setActiveSignHit] = useState(null);
  const [showCoinSign, setShowCoinSign] = useState(null);
  const [, setJumpCount] = useState(0);

  // Timeouts ref to prevent race conditions
  const animTimeoutRef = useRef(null);
  const boyAnimTimeoutRef = useRef(null);
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
        ctx.resume().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('pointermove', unlockAudio, { once: true });
    window.addEventListener('mousemove', unlockAudio, { once: true });
    window.addEventListener('mouseenter', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('mousemove', unlockAudio);
      window.removeEventListener('mouseenter', unlockAudio);
    };
  }, [getAudioContext]);

  // Synthesize Retro Jump Sound (Mario Jump Whoosh) - Always Active
  const playJumpSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.32);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [getAudioContext]);

  // Synthesize Retro Block Hit / Coin Sound (Mario Coin Chime) - Always Active
  const playCoinSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

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

      gain.gain.setValueAtTime(0.28, now);
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

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);

    setIsJumping(true);
    setGirlPose('jumping');
    setJumpCount(c => c + 1);
    playJumpSound();

    // Map sign positions to confetti burst horizontal origins
    const signOrigins = {
      trips: 0.35,
      events: 0.45,
      restaurant: 0.55,
      games: 0.65
    };
    const originX = signOrigins[targetSignId] || 0.45;

    // Peak reached, trigger coin chime & confetti
    hitTimeoutRef.current = setTimeout(() => {
      setActiveSignHit(targetSignId);
      setShowCoinSign(targetSignId);
      playCoinSound();

      try {
        confetti({
          particleCount: 26,
          spread: 55,
          startVelocity: 16,
          ticks: 45,
          origin: { x: originX, y: 0.34 },
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
    }, 380);

    // Complete jump & land back down
    animTimeoutRef.current = setTimeout(() => {
      setIsJumping(false);
      setGirlPose('idle');
    }, 880);
  }, [isJumping, playJumpSound, playCoinSound]);

  // Trigger Boy Jump sequence
  const triggerBoyJump = useCallback(() => {
    if (isBoyJumping) return;
    setIsBoyJumping(true);
    playJumpSound();
    playCoinSound();
    try {
      confetti({
        particleCount: 26,
        spread: 50,
        startVelocity: 16,
        ticks: 45,
        origin: { x: 0.85, y: 0.45 },
        colors: ['#38bdf8', '#0284c7', '#fde047', '#ffffff'],
        shapes: ['circle']
      });
    } catch {
      // ignore
    }

    boyAnimTimeoutRef.current = setTimeout(() => {
      setIsBoyJumping(false);
    }, 950);
  }, [isBoyJumping, playJumpSound, playCoinSound]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (boyAnimTimeoutRef.current) clearTimeout(boyAnimTimeoutRef.current);
      if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
    };
  }, []);

  // Auth Modal & Flow State (Sign In / Sign Up when clicking 4 signs)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [pendingSign, setPendingSign] = useState(null);

  // Guest Registration Form (matches backend Mongoose guestSchema + password security)
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'male', // 'male' | 'female'
    password: '',
    confirmPassword: '',
    children: [] // array of { name: '', age: '', gender: 'female' }
  });

  // Login Form States (Phone + Password)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Children management helpers
  const handleAddChild = () => {
    setGuestForm(prev => ({
      ...prev,
      children: [
        ...prev.children,
        { name: '', age: '', gender: 'female' }
      ]
    }));
  };

  const handleRemoveChild = (index) => {
    setGuestForm(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateChild = (index, field, value) => {
    setGuestForm(prev => ({
      ...prev,
      children: prev.children.map((child, i) => {
        if (i === index) {
          return { ...child, [field]: value };
        }
        return child;
      })
    }));
  };

  // Helper: check if client already has account / is logged in
  const checkIsAuthenticated = () => {
    try {
      if (localStorage.getItem('american_dream_is_guest') === 'true') return false;
      const status = localStorage.getItem('american_dream_user_logged_in');
      if (status === 'true') return true;
      const activeUser = localStorage.getItem('american_dream_active_user');
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed && (parsed.id || parsed.phone) && parsed.id !== 'guest') return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  // Sign In submit handler (Authenticates by phone & password)
  const handleAuthLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const cleanPhone = loginPhone.trim();
    if (!cleanPhone) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال رقم الهاتف المسجل' : 'Please enter your registered phone number');
      return;
    }

    if (!loginPassword.trim()) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    // =========================================================================
    // 1. ADMIN INTERCEPT: Check for fixed admin credentials
    // =========================================================================
    const ADMIN_CREDENTIALS = {
      email: 'admin@americandream.eg',
      password: 'Admin@123'
    };

    if (
      (cleanPhone.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() || cleanPhone === 'admin' || cleanPhone === '01000000000') &&
      loginPassword.trim() === ADMIN_CREDENTIALS.password
    ) {
      console.log('👑 [Admin Intercept] Admin credentials detected. Redirecting to dashboard.');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('american_dream_user_logged_in', 'true');
      localStorage.removeItem('american_dream_is_guest');

      if (typeof window !== 'undefined') {
        window.location.hash = '#dashboard';
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAdmin: true } }));
      }
      if (onEnterApp) onEnterApp();
      return;
    }
    let guestFound = null;
    try {
      const registered = JSON.parse(localStorage.getItem('american_dream_registered_guests') || '[]');
      guestFound = registered.find(g => 
        g.phone && g.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
      );
    } catch (err) {
      console.warn('Error reading registered guests:', err);
    }

    // If registered guest has a password, verify it
    if (guestFound && guestFound.password && guestFound.password !== loginPassword.trim()) {
      setAuthError(lang === 'ar' ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' : 'Incorrect password, please try again');
      return;
    }

    // If not found in registered guests, check existing profile or create a recognized profile
    if (!guestFound) {
      const existingProfile = localStorage.getItem('american_dream_user_profile');
      if (existingProfile) {
        try {
          const parsed = JSON.parse(existingProfile);
          if (parsed && parsed.phone && parsed.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')) {
            guestFound = parsed;
          }
        } catch {}
      }
    }

    const guestData = guestFound || {
      name: cleanPhone.includes('1012345678') ? 'Ahmed Mohamed' : `ضيف كريم (${cleanPhone.slice(-4)})`,
      phone: cleanPhone,
      age: '30',
      gender: 'male',
      children: []
    };

    // Persist login state
    localStorage.setItem('american_dream_user_logged_in', 'true');
    localStorage.removeItem('american_dream_is_guest');
    localStorage.setItem('american_dream_user_profile', JSON.stringify({
      name: guestData.name,
      phone: guestData.phone,
      age: guestData.age || '30',
      gender: guestData.gender || 'male',
      email: `${guestData.phone.replace(/[^0-9]/g, '')}@americandream.com`,
      address: 'Canal Waterfront Road, Ferdan District, Ismailia',
      passId: guestData.passId || `#AD-${Math.floor(10000 + Math.random() * 90000)}`,
      memberSince: guestData.memberSince || 'October 2026',
      points: guestData.points || 1350,
      storeCredit: guestData.storeCredit || 135.00
    }));

    if (guestData.children && guestData.children.length > 0) {
      localStorage.setItem('american_dream_user_children', JSON.stringify(
        guestData.children.map((c, i) => ({
          id: c.id || c._id || `child-${i + 1}`,
          name: c.name,
          age: c.age,
          gender: c.gender,
          wristband: c.wristband || `#WB-${1000 + i}`
        }))
      ));
    }

    localStorage.setItem('american_dream_active_user', JSON.stringify({
      id: 'guest-' + (guestData.phone.replace(/[^0-9]/g, '') || Date.now()),
      name: guestData.name,
      phone: guestData.phone,
      age: guestData.age,
      gender: guestData.gender,
      children: guestData.children || [],
      points: 1350
    }));

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
    setAuthSuccessMsg(lang === 'ar' ? `مرحباً بك ${guestData.name}! تم تسجيل الدخول بنجاح، جاري نقلك إلى ${targetTitle}...` : `Welcome ${guestData.name}! Signed in successfully, redirecting to ${targetTitle}...`);

    setTimeout(() => {
      setShowAuthModal(false);
      if (setActiveTab) {
        setActiveTab(pendingSign ? pendingSign.tab : 'home');
      }
    }, 450);
  };

  // Sign Up submit handler (Validates & saves guestSchema: name, phone, age, gender, children)
  const handleAuthRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    // Validate required parent / guest fields
    if (!guestForm.name.trim()) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال اسم الضيف' : 'Please enter guest name');
      return;
    }
    if (!guestForm.phone.trim()) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }
    if (!guestForm.age || !String(guestForm.age).trim()) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال العمر' : 'Please enter age');
      return;
    }
    if (!guestForm.gender) {
      setAuthError(lang === 'ar' ? 'يرجى اختيار النوع (ذكر / أنثى)' : 'Please select gender');
      return;
    }
    if (!guestForm.password || guestForm.password.length < 4) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال كلمة مرور من 4 خانات على الأقل' : 'Password must be at least 4 characters');
      return;
    }
    if (guestForm.password !== guestForm.confirmPassword) {
      setAuthError(lang === 'ar' ? 'كلمة المرور وتأكيدها غير متطابقين' : 'Passwords do not match');
      return;
    }

    // Validate children if any added
    for (let i = 0; i < guestForm.children.length; i++) {
      const child = guestForm.children[i];
      if (!child.name.trim() || !child.age || !String(child.age).trim()) {
        setAuthError(
          lang === 'ar' 
            ? `يرجى إكمال بيانات الطفل رقم (${i + 1}) أو حذفه` 
            : `Please fill details for child #${i + 1} or remove it`
        );
        return;
      }
    }

    // Construct full Guest document strictly matching mongoose guestSchema + password
    const newGuest = {
      _id: 'guest_' + Date.now(),
      name: guestForm.name.trim(),
      phone: guestForm.phone.trim(),
      age: String(guestForm.age).trim(),
      gender: guestForm.gender, // 'male' | 'female'
      password: guestForm.password,
      children: guestForm.children.map((c, idx) => ({
        _id: `child_${Date.now()}_${idx}`,
        name: c.name.trim(),
        age: String(c.age).trim(),
        gender: c.gender || 'male',
        wristband: `#WB-${Math.floor(1000 + Math.random() * 9000)}`
      })),
      createdAt: new Date().toISOString()
    };

    // Store in registered guests collection
    try {
      const existing = JSON.parse(localStorage.getItem('american_dream_registered_guests') || '[]');
      const filtered = existing.filter(g => g.phone !== newGuest.phone);
      filtered.push(newGuest);
      localStorage.setItem('american_dream_registered_guests', JSON.stringify(filtered));
    } catch {}

    // Persist active logged in state
    localStorage.setItem('american_dream_user_logged_in', 'true');
    localStorage.removeItem('american_dream_is_guest');
    localStorage.setItem('american_dream_user_profile', JSON.stringify({
      id: newGuest._id,
      name: newGuest.name,
      phone: newGuest.phone,
      age: newGuest.age,
      gender: newGuest.gender,
      email: `${newGuest.phone.replace(/[^0-9]/g, '')}@americandream.com`,
      address: 'Canal Waterfront Road, Ferdan District, Ismailia',
      passId: `#AD-${Math.floor(10000 + Math.random() * 90000)}`,
      memberSince: 'October 2026',
      points: 500, // Welcome bonus points!
      storeCredit: 50.00
    }));

    // Persist children list for instant sync with DesktopProfilePage and Booking flow
    localStorage.setItem('american_dream_user_children', JSON.stringify(
      newGuest.children.map((c) => ({
        id: c._id,
        name: c.name,
        age: c.age,
        gender: c.gender,
        wristband: c.wristband
      }))
    ));

    // Active user for topbars & headers
    localStorage.setItem('american_dream_active_user', JSON.stringify({
      id: newGuest._id,
      name: newGuest.name,
      phone: newGuest.phone,
      age: newGuest.age,
      gender: newGuest.gender,
      children: newGuest.children,
      points: 500
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
    setAuthSuccessMsg(lang === 'ar' ? `مرحباً بك ${newGuest.name}! تم تسجيل حسابك بنجاح وجاري نقلك إلى ${targetTitle}...` : `Welcome ${newGuest.name}! Account created! Redirecting to ${targetTitle}...`);

    setTimeout(() => {
      setShowAuthModal(false);
      if (setActiveTab) {
        setActiveTab(pendingSign ? pendingSign.tab : 'home');
      }
    }, 500);
  };

  // Continue as Guest handler
  const handleContinueAsGuest = () => {
    localStorage.setItem('american_dream_user_logged_in', 'false');
    localStorage.setItem('american_dream_is_guest', 'true');
    localStorage.removeItem('kids_area_auth_token');
    localStorage.removeItem('american_dream_active_user');
    localStorage.setItem('kids_area_auth_user', JSON.stringify({ id: 'guest', name: 'Guest' }));
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
                if (!isJumping) {
                  triggerMarioJump(sign.id);
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
          className={`boy-character-anchor ${isBoyJumping ? 'jumping' : ''}`}
          onClick={() => {
            triggerBoyJump();
            handleEnterPark();
          }}
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
                  {/* Registered Phone */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف المسجل:' : 'Registered Phone Number:'}
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Phone size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="tel" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '01012345678 أو +20...' : '01012345678 or +20...'}
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'كلمة المرور:' : 'Password:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Lock size={18} className="lobby-auth-input-icon" />
                      <input 
                        type={showLoginPassword ? 'text' : 'password'} 
                        required
                        className="lobby-auth-input"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="lobby-auth-eye-btn"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

                  {/* Switch to Sign Up */}
                  <div className="lobby-auth-switch-text">
                    <span>{lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}</span>{' '}
                    <button 
                      type="button" 
                      className="lobby-auth-switch-link"
                      onClick={() => { setAuthTab('register'); setAuthError(''); }}
                    >
                      {lang === 'ar' ? 'سجّل بياناتك كـ Guest الآن' : 'Sign Up as Guest now'}
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

              {/* TAB 2: SIGN UP (Strictly adheres to Mongoose guestSchema) */}
              {authTab === 'register' && (
                <form onSubmit={handleAuthRegister} className="lobby-auth-form">
                  {/* Name: { type: String, required: true } */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'الاسم بالكامل:' : 'Full Name:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <User size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="text" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'}
                        value={guestForm.name}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Phone: { type: String, required: true, unique: true } */}
                  <div className="lobby-auth-field-group">
                    <label className="lobby-auth-label">
                      {lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'} *
                    </label>
                    <div className="lobby-auth-input-wrap">
                      <Phone size={18} className="lobby-auth-input-icon" />
                      <input 
                        type="tel" 
                        required
                        className="lobby-auth-input"
                        placeholder={lang === 'ar' ? '01012345678 أو +20...' : '+20 101 234 5678'}
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Age & Gender Grid (schema: age String, gender enum['male', 'female']) */}
                  <div className="lobby-auth-grid-2">
                    {/* Age: { type: String, required: true } */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'العمر (السن):' : 'Age:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Calendar size={18} className="lobby-auth-input-icon" />
                        <input 
                          type="number" 
                          required
                          min="1"
                          max="120"
                          className="lobby-auth-input"
                          placeholder={lang === 'ar' ? 'مثال: 32' : 'e.g. 32'}
                          value={guestForm.age}
                          onChange={(e) => setGuestForm(prev => ({ ...prev, age: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Gender: { type: String, enum: ["male", "female"], required: true } */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'النوع:' : 'Gender:'} *
                      </label>
                      <div className="lobby-gender-toggles">
                        <button
                          type="button"
                          className={`lobby-gender-btn ${guestForm.gender === 'male' ? 'active' : ''}`}
                          onClick={() => setGuestForm(prev => ({ ...prev, gender: 'male' }))}
                        >
                          <span>👨</span>
                          <span>{lang === 'ar' ? 'ذكر' : 'Male'}</span>
                        </button>
                        <button
                          type="button"
                          className={`lobby-gender-btn ${guestForm.gender === 'female' ? 'active' : ''}`}
                          onClick={() => setGuestForm(prev => ({ ...prev, gender: 'female' }))}
                        >
                          <span>👩</span>
                          <span>{lang === 'ar' ? 'أنثى' : 'Female'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password (Security) */}
                  <div className="lobby-auth-grid-2">
                    {/* Password */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'كلمة المرور:' : 'Password:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Lock size={18} className="lobby-auth-input-icon" />
                        <input 
                          type={showRegisterPassword ? 'text' : 'password'} 
                          required
                          className="lobby-auth-input"
                          placeholder="••••••••"
                          value={guestForm.password}
                          onChange={(e) => setGuestForm(prev => ({ ...prev, password: e.target.value }))}
                        />
                        <button 
                          type="button" 
                          className="lobby-auth-eye-btn"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="lobby-auth-field-group">
                      <label className="lobby-auth-label">
                        {lang === 'ar' ? 'تأكيد كلمة المرور:' : 'Confirm Password:'} *
                      </label>
                      <div className="lobby-auth-input-wrap">
                        <Lock size={18} className="lobby-auth-input-icon" />
                        <input 
                          type={showRegisterPassword ? 'text' : 'password'} 
                          required
                          className="lobby-auth-input"
                          placeholder="••••••••"
                          value={guestForm.confirmPassword}
                          onChange={(e) => setGuestForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Children Section: Array of { name, age, gender } */}
                  <div className="lobby-children-card">
                    <div className="lobby-children-header">
                      <div className="lobby-children-title">
                        <Users size={16} />
                        <span>{lang === 'ar' ? 'الأطفال المرافقين' : 'Accompanying Children'}</span>
                        <span className="lobby-child-badge">
                          {guestForm.children.length} {lang === 'ar' ? 'طفل' : 'child'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="lobby-add-child-btn"
                        onClick={handleAddChild}
                      >
                        <Plus size={14} />
                        <span>{lang === 'ar' ? 'إضافة طفل' : 'Add Child'}</span>
                      </button>
                    </div>

                    {guestForm.children.length === 0 ? (
                      <div className="lobby-no-children-note">
                        {lang === 'ar' 
                          ? 'لم تتم إضافة أطفال بعد. اضغط (+ إضافة طفل) لإضافة طفل مرافق.' 
                          : 'No children added yet. Click (+ Add Child) to register a child.'}
                      </div>
                    ) : (
                      <div className="lobby-children-list">
                        {guestForm.children.map((child, index) => (
                          <div key={index} className="lobby-child-row">
                            <div className="lobby-child-row-top">
                              <span className="lobby-child-badge">
                                {lang === 'ar' ? `الطفل ${index + 1}` : `Child ${index + 1}`}
                              </span>
                              <button
                                type="button"
                                className="lobby-child-remove-btn"
                                onClick={() => handleRemoveChild(index)}
                                title={lang === 'ar' ? 'حذف الطفل' : 'Remove Child'}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="lobby-child-fields-grid">
                              {/* Child Name: { type: String, required: true } */}
                              <input 
                                type="text"
                                required
                                className="lobby-child-input"
                                placeholder={lang === 'ar' ? 'اسم الطفل' : 'Child name'}
                                value={child.name}
                                onChange={(e) => handleUpdateChild(index, 'name', e.target.value)}
                              />
                              {/* Child Age: { type: String, required: true } */}
                              <input 
                                type="number"
                                required
                                min="1"
                                max="18"
                                className="lobby-child-input"
                                placeholder={lang === 'ar' ? 'العمر' : 'Age'}
                                value={child.age}
                                onChange={(e) => handleUpdateChild(index, 'age', e.target.value)}
                              />
                              {/* Child Gender: { type: String, enum: ["male", "female"], required: true } */}
                              <select
                                className="lobby-child-gender-select"
                                value={child.gender}
                                onChange={(e) => handleUpdateChild(index, 'gender', e.target.value)}
                              >
                                <option value="male">{lang === 'ar' ? 'ولد (ذكر)' : 'Boy (Male)'}</option>
                                <option value="female">{lang === 'ar' ? 'بنت (أنثى)' : 'Girl (Female)'}</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
