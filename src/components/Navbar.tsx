import React from 'react';
import { Heart, User, LogOut, Shield, MessageSquare, Search, RefreshCw, Home, Compass } from 'lucide-react';
import { User as UserType, CandidateProfile } from '../types';

interface NavbarProps {
  user: UserType | null;
  profile: CandidateProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onResetDb: () => void;
  receivedInterestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  activeTab,
  setActiveTab,
  onLogout,
  onResetDb,
  receivedInterestsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            id="brand-logo"
            data-testid="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-gray-900 font-serif">Bandhan</span>
                <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-700 tracking-wider">Matrimonial</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium tracking-wide">Find Your Perfect Connection</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              data-testid="nav-home"
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'home' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              id="nav-search"
              data-testid="nav-search"
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'search' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Search Profiles
            </button>

            {user && (
              <>
                <button
                  id="nav-dashboard"
                  data-testid="nav-dashboard"
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dashboard' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  id="nav-my-profile"
                  data-testid="nav-my-profile"
                  type="button"
                  onClick={() => setActiveTab('my-profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'my-profile' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>

                <button
                  id="nav-interests"
                  data-testid="nav-interests"
                  type="button"
                  onClick={() => setActiveTab('interests')}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'interests' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  My Interests
                  {receivedInterestsCount > 0 && (
                    <span
                      id="nav-interests-badge"
                      data-testid="nav-interests-badge"
                      className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full"
                    >
                      {receivedInterestsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-messages"
                  data-testid="nav-messages"
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'messages' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </button>
              </>
            )}

            {user?.role === 'admin' && (
              <button
                id="nav-admin"
                data-testid="nav-admin"
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* User actions / QA utilities */}
          <div className="flex items-center gap-2">
            {/* Quick Reset DB Button for QA Automation */}
            <button
              id="nav-reset-db"
              data-testid="nav-reset-db"
              type="button"
              onClick={onResetDb}
              title="Reset Database to Seed State (for QA automation)"
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1 border border-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2.5">
                <div
                  id="user-badge"
                  data-testid="user-badge"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-gray-50 rounded-full border border-gray-200"
                >
                  <img
                    src={profile?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt={profile?.full_name || user.email}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-rose-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {profile?.full_name || user.email.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  id="nav-logout"
                  data-testid="nav-logout"
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login"
                  data-testid="nav-login"
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-register"
                  data-testid="nav-register"
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs shadow-rose-200 transition-all hover:shadow-md"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
