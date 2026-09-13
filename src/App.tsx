import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { SearchPage } from './components/SearchPage';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { MyProfilePage } from './components/MyProfilePage';
import { InterestsPage } from './components/InterestsPage';
import { MessagesPage } from './components/MessagesPage';
import { AdminDashboard } from './components/AdminDashboard';
import { DashboardPage } from './components/DashboardPage';
import { User, CandidateProfile, SearchFilterState } from './types';
import { api } from './services/api';

const DEFAULT_FILTERS: SearchFilterState = {
  gender: 'all',
  minAge: '',
  maxAge: '',
  city: 'all',
  education: '',
  occupation: '',
};

function getTabFromPath(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (clean === 'login') return 'login';
  if (clean === 'register') return 'register';
  if (clean === 'search') return 'search';
  if (clean === 'my-profile') return 'my-profile';
  if (clean === 'interests') return 'interests';
  if (clean === 'messages') return 'messages';
  if (clean === 'admin') return 'admin';
  if (clean === 'dashboard') return 'dashboard';
  return 'home';
}

function getPathFromTab(tab: string): string {
  if (tab === 'home') return '/';
  return `/${tab}`;
}

export function App() {
  const [activeTab, setActiveTabState] = useState<string>(() => getTabFromPath(window.location.pathname));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bandhan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<CandidateProfile | null>(() => {
    const saved = localStorage.getItem('bandhan_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [cities, setCities] = useState<{ city_name: string; state: string }[]>([]);
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [selectedProfile, setSelectedProfile] = useState<CandidateProfile | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
  const [receivedCount, setReceivedCount] = useState<number>(0);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetToast, setResetToast] = useState<string | null>(null);

  // Sync state with browser location
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const targetPath = getPathFromTab(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial profile & city data
  useEffect(() => {
    loadCities();
    loadProfiles(filters);
    if (user) {
      loadReceivedCount();
      loadMe();
    }
  }, [user]);

  const loadCities = async () => {
    try {
      const cityList = await api.getCities();
      setCities(cityList);
    } catch (e) {
      console.error('Failed to load cities', e);
    }
  };

  const loadProfiles = async (activeFilters: SearchFilterState) => {
    try {
      const data = await api.getProfiles(activeFilters);
      setProfiles(data);
    } catch (e) {
      console.error('Failed to load profiles', e);
    }
  };

  const loadMe = async () => {
    try {
      const res = await api.getMe();
      if (res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      // Token might be expired
      console.warn('Session expired or invalid:', e);
    }
  };

  const loadReceivedCount = async () => {
    try {
      const received = await api.getReceivedInterests();
      setReceivedCount(received.filter((r) => r.status === 'pending').length);
    } catch (e) {
      console.error('Failed to get received count', e);
    }
  };

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      setProfile(res.profile);
      if (res.user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      loadProfiles(filters);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSuccess = (res: any) => {
    setUser(res.user);
    setProfile(res.profile);
    setActiveTab('dashboard');
    loadProfiles(filters);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setProfile(null);
    setActiveTab('home');
    loadProfiles(filters);
  };

  const handleResetDb = async () => {
    try {
      await api.resetDatabase();
      setResetToast('Database restored to fresh seed state!');
      setTimeout(() => setResetToast(null), 3500);
      loadCities();
      loadProfiles(filters);
      if (user) {
        loadMe();
        loadReceivedCount();
      }
    } catch (err: any) {
      setResetToast('Failed to reset DB: ' + err.message);
      setTimeout(() => setResetToast(null), 3500);
    }
  };

  // Filter actions
  const handleFilterSearch = () => {
    loadProfiles(filters);
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    loadProfiles(DEFAULT_FILTERS);
  };

  // Interest & Messaging
  const handleSendInterest = async (receiverId: number) => {
    if (!user) {
      setActiveTab('login');
      return;
    }
    try {
      // Calls sendInterest API. Notice BUG-004: does not block duplicate pending requests!
      await api.sendInterest(receiverId);
      loadProfiles(filters);
      setResetToast('Connection interest sent successfully!');
      setTimeout(() => setResetToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to send interest');
    }
  };

  const handleOpenMessage = (partnerId: number) => {
    setSelectedProfile(null);
    setSelectedPartnerId(partnerId);
    setActiveTab('messages');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans text-gray-900">
      {/* QA Reset Toast Notification */}
      {resetToast && (
        <div
          id="toast-db-reset"
          data-testid="toast-db-reset"
          className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-gray-950 text-white text-xs font-semibold shadow-xl border border-gray-800 animate-in fade-in"
        >
          {resetToast}
        </div>
      )}

      {/* Primary Navigation Header */}
      <Navbar
        user={user}
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onResetDb={handleResetDb}
        receivedInterestsCount={receivedCount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onExploreClick={() => setActiveTab('search')}
            onRegisterClick={() => setActiveTab('register')}
            onLoginClick={() => setActiveTab('login')}
            featuredProfiles={profiles}
            onSelectProfile={(p) => setSelectedProfile(p)}
            onQuickDemoLogin={() => handleLogin('demo@bandhan.com', 'Demo@123')}
            onQuickAdminLogin={() => handleLogin('admin@bandhan.com', 'Admin@123')}
          />
        )}

        {activeTab === 'search' && (
          <SearchPage
            profiles={profiles}
            cities={cities}
            filters={filters}
            onFilterChange={(f) => setFilters(f)}
            onSearch={handleFilterSearch}
            onReset={handleFilterReset}
            onSelectProfile={(p) => setSelectedProfile(p)}
            onSendInterest={handleSendInterest}
            currentUserId={user ? user.id : null}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setActiveTab('register')}
            loading={loginLoading}
            errorMessage={loginError}
          />
        )}

        {activeTab === 'register' && (
          <RegisterPage
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'dashboard' && user && (
          <DashboardPage
            user={user}
            profile={profile}
            recommendedProfiles={profiles.filter((p) => (profile?.gender ? p.gender !== profile.gender : true))}
            onNavigate={(t) => setActiveTab(t)}
            onSelectProfile={(p) => setSelectedProfile(p)}
          />
        )}

        {activeTab === 'my-profile' && user && (
          <MyProfilePage
            initialProfile={profile}
            onProfileUpdated={(p) => setProfile(p)}
          />
        )}

        {activeTab === 'interests' && user && (
          <InterestsPage
            onOpenMessage={handleOpenMessage}
            onInterestsUpdated={loadReceivedCount}
          />
        )}

        {activeTab === 'messages' && user && (
          <MessagesPage
            currentUserId={user.id}
            selectedPartnerId={selectedPartnerId}
          />
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <ProfileDetailsModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSendInterest={(userId) => {
            handleSendInterest(userId);
            setSelectedProfile(null);
          }}
          onOpenMessage={handleOpenMessage}
          currentUserId={user ? user.id : null}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-700">
            Bandhan Matrimonial — Designed for Agentic AI QA, Automated Playwright Testing & Database Validation
          </p>
          <p className="text-[11px] text-gray-400">
            Intentionally seeded with 10 controlled defects documented in QA_KNOWN_BUGS.md
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
