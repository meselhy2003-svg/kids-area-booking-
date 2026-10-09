import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../../api/authService';

// Placeholder fixed Admin Credentials (change these as needed)
const ADMIN_CREDENTIALS = {
  email: 'admin@americandream.eg',
  password: 'Admin@123'
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // React Router navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Destination intended by user before being redirected to login
  const from = location.state?.from?.pathname || location.state?.from || '/';

  // Safe navigation helper that works with both React Router and hash routes
  const safeNavigate = (path) => {
    try {
      if (navigate) {
        navigate(path);
        return;
      }
    } catch {
      // Fallback if component is rendered outside a BrowserRouter
    }

    if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
      window.location.hash = '#dashboard';
    } else {
      window.location.hash = '#home';
    }
  };

  /**
   * Form submission handler with Admin Intercept logic
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLoginError('يرجى إدخال البريد الإلكتروني');
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
      trimmedEmail.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      console.log('👑 [Auth] Admin credentials detected. Bypassing backend API.');

      // 2. ADMIN REDIRECTION:
      // Save admin identifier in localStorage & bypass backend API call
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('american_dream_user_logged_in', 'true');

      // Dispatch custom event to notify layout/header components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAdmin: true } }));
      }

      // Redirect immediately to the Admin Dashboard route
      safeNavigate('/admin'); // or '/dashboard'
      return;
    }

    // =========================================================================
    // 3. NORMAL USER FLOW: Proceed with backend API authentication
    // =========================================================================
    setIsLoading(true);

    try {
      // Call live backend API: POST /api/auth/login
      const result = await authService.login({
        email: trimmedEmail,
        password
      });

      console.log('✅ [Auth] Normal user authenticated successfully:', result.user);

      // Ensure any previous admin session flag is cleared for regular users
      localStorage.removeItem('isAdmin');
      localStorage.setItem('userRole', 'user');

      // Dispatch event to notify layout/header components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAdmin: false, user: result.user } }));
      }

      // Redirect regular user to intended destination (or home)
      safeNavigate(from);
    } catch (err) {
      console.error('❌ [Auth] Login failed:', err);

      // Extract status code and error messages from Vercel backend response
      const status = err.response?.status || err.status;
      const backendMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.data?.message || 
        err.message || 
        '';

      // Check if backend specifically indicates user not found or generic 401/404 credentials mismatch
      const isNotFoundOrWrongCredentials = 
        status === 401 || 
        status === 404 || 
        /not found|unregistered|incorrect|invalid|user does not exist|unauthorized/i.test(backendMessage);

      if (isNotFoundOrWrongCredentials) {
        setLoginError('هذا الحساب غير مسجل أو البيانات غير صحيحة');
      } else if (backendMessage && typeof backendMessage === 'string') {
        setLoginError(backendMessage);
      } else {
        setLoginError('هذا الحساب غير مسجل أو البيانات غير صحيحة');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4 py-12">
      <div className="w-full max-w-md bg-neutral-800/90 border border-neutral-700/60 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-inner">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Access your American Dream account or Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div 
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm animate-fadeIn"
            dir="auto"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed font-medium">{loginError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="name@example.com"
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-neutral-900/60 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-11 pr-11 py-3 bg-neutral-900/60 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-neutral-700 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition duration-200 flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Credential Helper Hint */}
        <div className="mt-8 pt-6 border-t border-neutral-700/50 text-center">
          <p className="text-xs text-neutral-500">
            Admin access: <code className="text-amber-400 font-mono">admin@americandream.eg</code>
          </p>
        </div>

      </div>
    </div>
  );
}
