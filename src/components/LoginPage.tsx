import React, { useState } from 'react';
import { Heart, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSwitchToRegister: () => void;
  loading: boolean;
  errorMessage: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onSwitchToRegister,
  loading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await onLogin(email.trim(), password);
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleFillDemoUser = () => {
    setEmail('demo@bandhan.com');
    setPassword('Demo@123');
    setLocalError(null);
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@bandhan.com');
    setPassword('Admin@123');
    setLocalError(null);
  };

  const activeError = localError || errorMessage;

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-xl shadow-rose-100/40">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your Bandhan Matrimonial account</p>
        </div>

        {/* Quick Credentials Sandbox Filler */}
        <div className="mb-6 p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>QA Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="fill-demo-user-btn"
              data-testid="quick-login-user"
              type="button"
              onClick={handleFillDemoUser}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 font-semibold hover:bg-amber-100/60 transition-colors text-center"
            >
              Demo User <br />
              <span className="text-[10px] font-normal text-amber-700">demo@bandhan.com</span>
            </button>
            <button
              id="fill-demo-admin-btn"
              data-testid="quick-login-admin"
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 font-semibold hover:bg-amber-100/60 transition-colors text-center"
            >
              Admin <br />
              <span className="text-[10px] font-normal text-amber-700">admin@bandhan.com</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {activeError && (
          <div
            id="login-error-message"
            data-testid="login-error-message"
            className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{activeError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="login-email"
                data-testid="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="login-password"
                data-testid="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            data-testid="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Don't have a matrimonial profile yet?{' '}
            <button
              id="switch-to-register-btn"
              data-testid="switch-to-register-btn"
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-rose-600 hover:underline"
            >
              Register Free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
