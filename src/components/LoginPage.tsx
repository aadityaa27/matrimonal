import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { authenticateUser } from '../db/matrimonialDb';
import { UserAccount } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateRegister: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      const matchedUser = await authenticateUser(email.trim(), password);
      if (matchedUser) {
        onLoginSuccess(matchedUser);
      } else {
        setErrorMsg('Invalid email or password. You can use demo credentials or register a new account.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('ananya@example.com');
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div id="login-page" data-testid="login-page" className="max-w-md mx-auto py-8">
      
      {/* Back button */}
      <button
        id="login-back-home"
        data-testid="login-back-home"
        onClick={onNavigateHome}
        className="mb-4 text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Landing Page</span>
      </button>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 id="login-title" data-testid="login-title" className="text-2xl font-bold text-gray-900">
            Candidate Login
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to access your matrimonial profile and 10-photo album
          </p>
        </div>

        {/* Quick Demo Fill Helper */}
        <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-800">
            <KeyRound className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Practice with demo credentials</span>
          </div>
          <button
            id="login-demo-btn"
            data-testid="login-demo-btn"
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 bg-white text-rose-700 font-semibold rounded-lg shadow-xs hover:bg-rose-100 transition-colors shrink-0"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div 
            id="login-error-alert" 
            data-testid="login-error-alert" 
            role="alert" 
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form id="login-form" data-testid="login-form" onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address *
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
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-gray-700 mb-1">
              Password *
            </label>
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
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                id="login-remember"
                data-testid="login-remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            id="login-submit-btn"
            data-testid="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Link to Registration */}
        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
          <span>New to Milan Matrimony? </span>
          <button
            id="link-to-register"
            data-testid="link-to-register"
            onClick={onNavigateRegister}
            className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Register basic details &amp; photos
          </button>
        </div>

      </div>
    </div>
  );
};
