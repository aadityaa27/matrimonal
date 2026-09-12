import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Table as TableIcon, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Users, 
  Bookmark, 
  Sparkles, 
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginPage } from './components/LoginPage';
import { UserProfileView } from './components/UserProfileView';
import { FilterSidebar } from './components/FilterSidebar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileTable } from './components/ProfileTable';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { InterestsView } from './components/InterestsView';
import { PlaywrightGuideModal } from './components/PlaywrightGuideModal';
import { DatabaseStatusModal } from './components/DatabaseStatusModal';
import { ToastContainer } from './components/ToastContainer';
import { INITIAL_PROFILES, INITIAL_INTEREST_REQUESTS } from './data/mockProfiles';
import { 
  initDatabase, 
  resetDatabase, 
  INITIAL_DEMO_USER,
  fetchProfilesFromDb,
  toggleShortlistInDb,
  sendInterestInDb
} from './db/matrimonialDb';
import { 
  Profile, 
  InterestRequest, 
  FilterState, 
  ToastNotification, 
  UserAccount 
} from './types';

const INITIAL_FILTERS: FilterState = {
  search: '',
  gender: 'all',
  religion: '',
  motherTongue: '',
  maritalStatus: '',
  minAge: 21,
  maxAge: 45,
  verifiedOnly: false,
  sortBy: 'relevance',
  viewMode: 'grid',
};

const ITEMS_PER_PAGE = 6;

type AppPageTab = 'landing' | 'register' | 'login' | 'profile' | 'browse' | 'shortlisted' | 'interests';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<AppPageTab>('landing');

  // Logged-in User Account (backed by IndexedDB database)
  const [loggedInUser, setLoggedInUser] = useState<UserAccount | null>(null);

  // Profiles State (for browse matches)
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('milan_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved profiles', e);
      }
    }
    return INITIAL_PROFILES;
  });

  // Interest Requests State
  const [interestRequests, setInterestRequests] = useState<InterestRequest[]>(() => {
    const saved = localStorage.getItem('milan_interests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved interests', e);
      }
    }
    return INITIAL_INTEREST_REQUESTS;
  });

  // Filters and Pagination
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & UI States
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [simulateLatency, setSimulateLatency] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Initialize SQLite Database & demo user on mount
  useEffect(() => {
    const init = async () => {
      try {
        const demoUser = await initDatabase();
        // Check if there is an active session
        const activeUserId = localStorage.getItem('milan_active_account_id');
        if (activeUserId) {
          setLoggedInUser(demoUser);
        }

        // Try syncing directory profiles from SQLite database
        const dbProfiles = await fetchProfilesFromDb();
        if (dbProfiles && dbProfiles.length > 0) {
          setProfiles(dbProfiles);
        }
      } catch (e) {
        console.warn('DB init note:', e);
      }
    };
    init();
  }, []);

  // Save changes to localStorage for profiles & interests
  useEffect(() => {
    localStorage.setItem('milan_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('milan_interests', JSON.stringify(interestRequests));
  }, [interestRequests]);

  // Helper Toast Trigger
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastNotification = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset Data to standard fixtures
  const handleResetData = async () => {
    await resetDatabase();
    localStorage.removeItem('milan_profiles');
    localStorage.removeItem('milan_interests');
    localStorage.removeItem('milan_active_account_id');
    setProfiles(INITIAL_PROFILES);
    setInterestRequests(INITIAL_INTEREST_REQUESTS);
    setLoggedInUser(INITIAL_DEMO_USER);
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    setSelectedProfile(null);
    addToast('Database and user records reset to pristine fixtures!', 'info');
  };

  // Handle successful registration
  const handleRegisterSuccess = (newUser: UserAccount) => {
    setLoggedInUser(newUser);
    localStorage.setItem('milan_active_account_id', newUser.id);
    addToast(`Registration complete! Saved ${newUser.photos.length} photos to database.`, 'success');
    setActiveTab('profile');
  };

  // Handle successful login
  const handleLoginSuccess = (user: UserAccount) => {
    setLoggedInUser(user);
    localStorage.setItem('milan_active_account_id', user.id);
    addToast(`Welcome back, ${user.fullName}!`, 'success');
    setActiveTab('profile');
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('milan_active_account_id');
    addToast('You have been logged out.', 'info');
    setActiveTab('landing');
  };

  // Profile actions
  const handleToggleShortlist = (id: string) => {
    toggleShortlistInDb(id);
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isShortlisted;
          addToast(
            nextState ? `${p.name} added to shortlist` : `${p.name} removed from shortlist`,
            'info'
          );
          return { ...p, isShortlisted: nextState };
        }
        return p;
      })
    );
  };

  const handleSendInterest = (id: string) => {
    sendInterestInDb(id);
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          addToast(`Interest sent to ${p.name}!`, 'success');
          return { ...p, interestStatus: 'pending' };
        }
        return p;
      })
    );
  };

  // Filtering profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (activeTab === 'shortlisted' && !p.isShortlisted) {
        return false;
      }
      if (filters.gender !== 'all' && p.gender !== filters.gender) {
        return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesOcc = p.occupation.toLowerCase().includes(q);
        const matchesEdu = p.education.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesOcc && !matchesEdu) {
          return false;
        }
      }
      if (filters.religion && p.religion !== filters.religion) {
        return false;
      }
      if (filters.motherTongue && p.motherTongue !== filters.motherTongue) {
        return false;
      }
      if (filters.maritalStatus && p.maritalStatus !== filters.maritalStatus) {
        return false;
      }
      if (p.age < filters.minAge || p.age > filters.maxAge) {
        return false;
      }
      if (filters.verifiedOnly && !p.verified) {
        return false;
      }
      return true;
    });
  }, [profiles, activeTab, filters]);

  // Sorting
  const sortedProfiles = useMemo(() => {
    const list = [...filteredProfiles];
    switch (filters.sortBy) {
      case 'age-asc':
        return list.sort((a, b) => a.age - b.age);
      case 'age-desc':
        return list.sort((a, b) => b.age - a.age);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return list.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
      case 'relevance':
      default:
        return list;
    }
  }, [filteredProfiles, filters.sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProfiles.length / ITEMS_PER_PAGE) || 1;
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProfiles.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProfiles, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInUser={loggedInUser}
        simulateLatency={simulateLatency}
        setSimulateLatency={setSimulateLatency}
        onResetData={handleResetData}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDbStatus={() => setIsDbModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. Landing Page UI */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={(page) => setActiveTab(page)}
            isLoggedIn={!!loggedInUser}
            activeUserName={loggedInUser?.fullName}
          />
        )}

        {/* 2. Registration Page (Basic Details + 10 Photo Database) */}
        {activeTab === 'register' && (
          <RegistrationPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateLogin={() => setActiveTab('login')}
            onNavigateHome={() => setActiveTab('landing')}
          />
        )}

        {/* 3. Login Page */}
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateRegister={() => setActiveTab('register')}
            onNavigateHome={() => setActiveTab('landing')}
          />
        )}

        {/* 4. User Profile Page (View, Edit & 10 Photo Album) */}
        {activeTab === 'profile' && loggedInUser && (
          <UserProfileView
            user={loggedInUser}
            onUpdateUser={(updated) => setLoggedInUser(updated)}
            onLogout={handleLogout}
            onNavigateBrowse={() => setActiveTab('browse')}
          />
        )}

        {/* Fallback if user navigates to profile without logging in */}
        {activeTab === 'profile' && !loggedInUser && (
          <div className="max-w-md mx-auto py-12 text-center space-y-4 bg-white p-8 rounded-3xl border border-gray-200 shadow-xs">
            <Heart className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Please Log In</h2>
            <p className="text-xs text-gray-500">
              You need to sign in or register to view and manage your candidate profile and 10 photos album.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* 5. Browse Matches Tab */}
        {(activeTab === 'browse' || activeTab === 'shortlisted') && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-20">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onClearFilters={() => setFilters(INITIAL_FILTERS)}
                totalFiltered={sortedProfiles.length}
              />
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div 
                id="listing-controls-bar" 
                data-testid="listing-controls-bar"
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {activeTab === 'shortlisted' ? (
                      <>
                        <Bookmark className="w-5 h-5 text-rose-600" />
                        <span>Shortlisted Profiles</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 text-rose-600" />
                        <span>Candidate Directory</span>
                      </>
                    )}
                  </h1>
                  <p data-testid="results-count" className="text-xs text-gray-500 mt-0.5">
                    Showing {sortedProfiles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, sortedProfiles.length)} of{' '}
                    <span className="font-semibold text-gray-800">{sortedProfiles.length}</span> profiles
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    <select
                      id="sort-by"
                      data-testid="sort-by"
                      value={filters.sortBy}
                      onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                      className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-rose-500 text-gray-800"
                    >
                      <option value="relevance">Sort: Relevance</option>
                      <option value="newest">Sort: Newly Joined</option>
                      <option value="age-asc">Sort: Age (Youngest)</option>
                      <option value="age-desc">Sort: Age (Oldest)</option>
                      <option value="name-asc">Sort: Name (A-Z)</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                      id="view-mode-grid"
                      data-testid="view-mode-grid"
                      onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'grid' }))}
                      className={`p-1.5 rounded-md transition-colors ${
                        filters.viewMode === 'grid'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      id="view-mode-table"
                      data-testid="view-mode-table"
                      onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'table' }))}
                      className={`p-1.5 rounded-md transition-colors ${
                        filters.viewMode === 'table'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid or Table */}
              {filters.viewMode === 'grid' ? (
                <div 
                  id="profiles-grid" 
                  data-testid="profiles-grid" 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {paginatedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onViewDetails={(p) => setSelectedProfile(p)}
                      onToggleShortlist={handleToggleShortlist}
                      onSendInterest={handleSendInterest}
                    />
                  ))}
                </div>
              ) : (
                <ProfileTable
                  profiles={paginatedProfiles}
                  onViewDetails={(p) => setSelectedProfile(p)}
                  onToggleShortlist={handleToggleShortlist}
                  onSendInterest={handleSendInterest}
                />
              )}

              {/* Pagination */}
              {sortedProfiles.length > ITEMS_PER_PAGE && (
                <div 
                  id="pagination-controls" 
                  data-testid="pagination-controls" 
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between"
                >
                  <button
                    id="pagination-prev"
                    data-testid="pagination-prev"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        id={`page-number-${pageNum}`}
                        data-testid={`page-number-${pageNum}`}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    id="pagination-next"
                    data-testid="pagination-next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Received Interests Tab */}
        {activeTab === 'interests' && (
          <InterestsView
            requests={interestRequests}
            onAccept={(reqId) => {
              setInterestRequests((prev) =>
                prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
              );
              addToast('Interest request accepted!', 'success');
            }}
            onDecline={(reqId) => {
              setInterestRequests((prev) =>
                prev.map((r) => (r.id === reqId ? { ...r, status: 'declined' } : r))
              );
              addToast('Interest request declined', 'info');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-gray-600 font-medium">
            Milan Matrimony • Simple Landing, Basic Registration, Login &amp; 10 Photo Relational Database
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SQLite Engine (matrimonial.db)
            </span>
            <span>•</span>
            <span>10 Photos Table</span>
            <span>•</span>
            <span>Playwright Automation Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileDetailModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onToggleShortlist={handleToggleShortlist}
        onSendInterest={handleSendInterest}
      />

      <DatabaseStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDbReset={handleResetData}
      />

      <PlaywrightGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
