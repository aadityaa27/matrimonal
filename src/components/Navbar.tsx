import React from 'react';
import { 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  Home,
  UserPlus, 
  LogIn, 
  User, 
  Users, 
  Bookmark,
  Camera,
  Database
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: 'landing' | 'register' | 'login' | 'profile' | 'browse' | 'shortlisted' | 'interests';
  setActiveTab: (tab: 'landing' | 'register' | 'login' | 'profile' | 'browse' | 'shortlisted' | 'interests') => void;
  loggedInUser: UserAccount | null;
  simulateLatency: boolean;
  setSimulateLatency: (val: boolean) => void;
  onResetData: () => void;
  onOpenGuide: () => void;
  onOpenDbStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  loggedInUser,
  simulateLatency,
  setSimulateLatency,
  onResetData,
  onOpenGuide,
  onOpenDbStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div 
              id="app-logo"
              data-testid="app-logo" 
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm cursor-pointer"
              onClick={() => setActiveTab('landing')}
            >
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  id="brand-name"
                  data-testid="app-title" 
                  onClick={() => setActiveTab('landing')}
                  className="font-bold text-gray-900 text-base sm:text-lg tracking-tight cursor-pointer"
                >
                  Milan Matrimony
                </span>
                <span 
                  data-testid="playwright-badge" 
                  className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Playwright Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">10-Photo DB • Automated Testbed</p>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
            
            {/* Landing Page */}
            <button
              id="nav-landing"
              data-testid="nav-landing"
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'landing'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Registration Page */}
            <button
              id="nav-register"
              data-testid="nav-register"
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>

            {/* Login or User Profile */}
            {loggedInUser ? (
              <button
                id="nav-my-profile"
                data-testid="nav-my-profile"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {loggedInUser.photos && loggedInUser.photos[0] ? (
                  <img
                    src={loggedInUser.photos[0].url}
                    alt={loggedInUser.fullName}
                    className="w-5 h-5 rounded-full object-cover border border-rose-300 shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 text-rose-600" />
                )}
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {loggedInUser.fullName.split(' ')[0]}
                </span>
                <span className="sm:hidden">Profile</span>
              </button>
            ) : (
              <button
                id="nav-login"
                data-testid="nav-login"
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'login'
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Browse Matches */}
            <button
              id="nav-browse"
              data-testid="nav-browse"
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'browse' || activeTab === 'shortlisted' || activeTab === 'interests'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Browse Matches</span>
              <span className="sm:hidden">Browse</span>
            </button>
          </nav>

          {/* Right Action Tools: Database Status, Latency, Reset DB, Guide */}
          <div className="flex items-center gap-2">
            {/* Live SQLite DB Indicator */}
            <button
              id="db-status-badge"
              data-testid="db-status-badge"
              onClick={onOpenDbStatus}
              title="Inspect SQLite Database tables & live record counts"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">SQLite DB</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Latency toggle */}
            <button
              id="toggle-latency-btn"
              data-testid="toggle-latency"
              title={simulateLatency ? "Latency mode: ON (800ms delay)" : "Latency mode: OFF"}
              onClick={() => setSimulateLatency(!simulateLatency)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                simulateLatency
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{simulateLatency ? '800ms: ON' : 'Delay: OFF'}</span>
            </button>

            {/* Reset Database */}
            <button
              id="reset-data-btn"
              data-testid="reset-data-btn"
              onClick={onResetData}
              title="Reset database and user records"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            {/* Playwright Guide */}
            <button
              id="open-guide-btn"
              data-testid="open-guide-btn"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide &amp; Tests</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
