import React from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  Users, 
  CheckCircle2,
  Database
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'register' | 'login' | 'profile' | 'browse') => void;
  isLoggedIn: boolean;
  activeUserName?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  isLoggedIn,
  activeUserName,
}) => {
  return (
    <div id="landing-page" data-testid="landing-page" className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section 
        id="landing-hero-section"
        data-testid="landing-hero-section"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 text-white p-8 sm:p-14 shadow-lg"
      >
        {/* Background ambient accents */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trusted Matrimony &amp; Automated Testing Sandbox</span>
          </div>

          <h1 
            id="hero-title"
            data-testid="hero-title"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white"
          >
            Find Your Soulmate with Genuine Profiles &amp; Photo Albums
          </h1>

          <p 
            id="hero-subtitle"
            data-testid="hero-subtitle"
            className="text-sm sm:text-base text-rose-100 leading-relaxed max-w-2xl"
          >
            Connect with verified prospective brides and grooms. Create your profile with basic details, upload up to 10 photos stored securely in your database, and explore matches.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isLoggedIn ? (
              <>
                <button
                  id="hero-register-btn"
                  data-testid="hero-register-btn"
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Register Free (Upload 10 Photos)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-login-btn"
                  data-testid="hero-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-5 py-3 rounded-xl bg-black/25 hover:bg-black/35 text-white font-semibold text-sm border border-white/30 backdrop-blur-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Candidate Login</span>
                </button>
              </>
            ) : (
              <button
                id="hero-profile-btn"
                data-testid="hero-profile-btn"
                onClick={() => onNavigate('profile')}
                className="px-6 py-3 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Welcome, {activeUserName}! Go to My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="hero-explore-btn"
              data-testid="hero-explore-btn"
              onClick={() => onNavigate('browse')}
              className="px-5 py-3 rounded-xl bg-rose-500/40 hover:bg-rose-500/60 text-white font-medium text-sm transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Browse Profiles</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 text-xs">
            <div>
              <strong className="block text-lg font-bold text-white">10 Photos</strong>
              <span className="text-rose-200">Database Storage</span>
            </div>
            <div>
              <strong className="block text-lg font-bold text-white">100%</strong>
              <span className="text-rose-200">Verified Candidates</span>
            </div>
            <div>
              <strong className="block text-lg font-bold text-white">End-to-End</strong>
              <span className="text-rose-200">Playwright Test Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">How Milan Matrimony Works</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Simple, transparent steps to create your candidate profile and upload album photos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-gray-900">Register with Basic Details</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fill in your full name, email, password, gender, date of birth, city, and a warm about-me bio.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-gray-900">Upload Up to 10 Photos</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Attach multiple portrait and lifestyle photos. All 10 images are stored locally in the browser database.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-gray-900">Login &amp; View User Profile</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Login anytime using your registered email and password to view your profile album and manage details.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Card */}
      <section className="bg-gray-50 border border-gray-200 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-rose-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Database-backed 10 Photo Uploads</h3>
            <p className="text-xs text-gray-500">
              Integrated IndexedDB database engine allows testing heavy file uploads, drag &amp; drop, and photo gallery management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <strong className="block text-gray-900">Multi-File Upload</strong>
            <span className="text-gray-500">Select multiple files simultaneously</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
            <Camera className="w-4 h-4 text-rose-600" />
            <strong className="block text-gray-900">Primary Avatar</strong>
            <span className="text-gray-500">Choose which photo is the primary display</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <strong className="block text-gray-900">Deterministic Testids</strong>
            <span className="text-gray-500">Every input and button has a Playwright testid</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
            <Lock className="w-4 h-4 text-amber-600" />
            <strong className="block text-gray-900">Local DB Persistence</strong>
            <span className="text-gray-500">Survives page reloads &amp; test steps</span>
          </div>
        </div>
      </section>

    </div>
  );
};
