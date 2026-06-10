import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Github } from 'lucide-react';
import imgBackground from '../../imports/MacBookPro161-1/f8f18319f4fb99fe2eb04e1f157c2aeccb39edb6.png';
import { updateUserProfile } from '../services/api';
import { supabase } from '../services/supabaseClient';

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState<null | 'google' | 'github' | 'email'>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const checkAndSyncSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session?.user) {
          const userId = session.user.id;
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_id', userId);
          }

          try {
            await updateUserProfile(userId, {
              username: session.user.user_metadata?.user_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || userId,
              bio: session.user.user_metadata?.bio || '',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata?.avatar_url || '',
            });
          } catch (error) {
            console.error('Failed to sync authenticated profile:', error);
          }

          // User is already logged in, redirect to home
          navigate('/');
          return;
        }

        // User is not logged in, show auth form
        setIsChecking(false);
      } catch (error) {
        console.error('Failed to check session:', error);
        setIsChecking(false);
      }
    };

    void checkAndSyncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userId = session.user.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_id', userId);
        }

        try {
          await updateUserProfile(userId, {
            username: session.user.user_metadata?.user_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || userId,
            bio: session.user.user_metadata?.bio || '',
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url || '',
          });
        } catch (error) {
          console.error('Failed to sync authenticated profile:', error);
        }

        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      setAuthLoading('email');

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              user_name: formData.username || formData.email.split('@')[0] || 'user',
            },
          },
        });

        if (error) throw error;

        const userId = data.user?.id;
        if (userId) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_id', userId);
          }

          await updateUserProfile(userId, {
            username: formData.username || formData.email.split('@')[0] || userId,
            bio: '',
            email: formData.email,
            avatar_url: '',
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        const userId = data.user?.id;
        if (userId && typeof window !== 'undefined') {
          localStorage.setItem('user_id', userId);
        }
      }

      navigate('/');
    } catch (error) {
      console.error('Failed to persist auth profile:', error);
      setAuthError(error instanceof Error ? error.message : 'Email login failed.');
    } finally {
      setAuthLoading(null);
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    try {
      setAuthError(null);
      setAuthLoading(provider);
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });
    } catch (error) {
      console.error(`Failed to start ${provider} OAuth:`, error);
      if (error instanceof Error && error.message.includes('provider is not enabled')) {
        setAuthError(`${provider === 'google' ? 'Google' : 'GitHub'} login is not enabled in Supabase yet.`);
      } else {
        setAuthError(error instanceof Error ? error.message : `${provider} login failed.`);
      }
      setAuthLoading(null);
    }
  };

  // Show loading state while checking if user is logged in
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={imgBackground} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1622] via-purple-900/50 to-[#0b1622]" />
        </div>
        <div className="text-white text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={imgBackground}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1622] via-purple-900/50 to-[#0b1622]" />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-[rgba(138,56,245,0.15)] backdrop-blur-2xl border-2 border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'Cabin' }}
            >
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <p className="text-gray-400">
              {mode === 'login'
                ? 'Sign in to continue your journey'
                : 'Join the anime & movie community'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {authError}
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleProviderLogin('google')}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
              disabled={authLoading !== null}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {authLoading === 'google' ? 'Connecting Google...' : 'Continue with Google'}
            </button>

            <button
              type="button"
              onClick={() => handleProviderLogin('github')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
              disabled={authLoading !== null}
            >
              <Github className="w-5 h-5" />
              {authLoading === 'github' ? 'Connecting GitHub...' : 'Continue with GitHub'}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[rgba(138,56,245,0.15)] text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg pl-11 pr-11 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <a href="#" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Skip Auth */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
