import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Phone, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../api/authService';

// Fixed Admin Credentials (can log in with admin phone or email)
const ADMIN_CREDENTIALS = {
  email: 'admin@americandream.eg',
  phone: '01000000000',
  password: 'Admin@123'
};

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Safe navigation helper that works with hash routes
  const safeNavigate = (path = 'home') => {
    const cleanPath = path.replace(/^[\/#]+/, '');
    if (typeof window !== 'undefined') {
      window.location.hash = '#' + (cleanPath || 'home');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  /**
   * Form submission handler for Phone + Password Login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setLoginError('يرجى إدخال رقم الهاتف المحمول');
      return;
    }

    if (!password) {
      setLoginError('يرجى إدخال كلمة المرور');
      return;
    }

    // =========================================================================
    // 1. ADMIN INTERCEPT: Check for fixed admin credentials
    // =========================================================================
    if (
      (cleanPhone.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() ||
       cleanPhone === ADMIN_CREDENTIALS.phone ||
       cleanPhone === 'admin') &&
      password === ADMIN_CREDENTIALS.password
    ) {
      console.log('👑 [Auth] Admin credentials detected. Bypassing backend API.');

      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('american_dream_user_logged_in', 'true');
      localStorage.removeItem('american_dream_is_guest');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAdmin: true } }));
      }

      safeNavigate('/admin');
      return;
    }

    // =========================================================================
    // 2. NORMAL USER FLOW: Proceed with backend API authentication
    // =========================================================================
    setIsLoading(true);

    try {
      // Call backend API: POST /api/auth/login with phone & password
      const result = await authService.login({
        phone: cleanPhone,
        password
      });

      console.log('✅ [Auth] User authenticated successfully:', result.user);

      localStorage.removeItem('isAdmin');
      localStorage.setItem('userRole', 'user');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAdmin: false, user: result.user } }));
      }

      // Redirect user to intended destination (or home)
      safeNavigate('home');
    } catch (err) {
      console.error('❌ [Auth] Login failed:', err);

      const backendMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.data?.message || 
        err.message || 
        'بيانات تسجيل الدخول غير صحيحة، يرجى التأكد من رقم الهاتف وكلمة المرور';

      setLoginError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12 relative overflow-hidden" dir="rtl">
      {/* Background glowing ambient effects */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            تسجيل الدخول
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            سجل دخولك برقم الهاتف لمتابعة حجوزاتك ونقاطك في أمريكان دريم
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div 
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm animate-fadeIn"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed font-medium">{loginError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Phone Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              رقم الهاتف المحمول (Phone Number)
            </label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="010XXXXXXXX"
                disabled={isLoading}
                className="w-full pr-12 pl-4 py-3.5 bg-neutral-950/70 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-500 text-left focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm disabled:opacity-50"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              مثال: 01019998877 أو +2010...
            </p>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-neutral-300">
                كلمة المرور (Password)
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                dir="ltr"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pr-12 pl-12 py-3.5 bg-neutral-950/70 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-500 text-left focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <button
            type="button"
            onClick={() => safeNavigate('/')}
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition"
          >
            <span>العودة إلى الصفحة الرئيسية</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
