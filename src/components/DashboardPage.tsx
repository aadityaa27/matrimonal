import React from 'react';
import { Heart, Search, MessageSquare, User, ArrowRight, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { User as UserType, CandidateProfile } from '../types';

interface DashboardPageProps {
  user: UserType;
  profile: CandidateProfile | null;
  recommendedProfiles: CandidateProfile[];
  onNavigate: (tab: string) => void;
  onSelectProfile: (profile: CandidateProfile) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  profile,
  recommendedProfiles,
  onNavigate,
  onSelectProfile,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-6 sm:p-8 text-white shadow-lg shadow-rose-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome to your matrimonial portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Namaste, {profile?.full_name || user.email.split('@')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Your profile is active and visible to verified matches. Explore newly joined brides and grooms curated for you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="px-4 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Search Matches
          </button>
          <button
            type="button"
            onClick={() => onNavigate('my-profile')}
            className="px-4 py-2.5 rounded-xl bg-rose-700/60 hover:bg-rose-700 text-white font-bold text-xs transition-colors border border-white/20 flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('search')}
          className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Browse New Matches</h3>
          <p className="text-xs text-gray-500 mt-1">Discover candidates based on age, city, and occupation.</p>
        </div>

        <div
          onClick={() => onNavigate('interests')}
          className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Manage Interests</h3>
          <p className="text-xs text-gray-500 mt-1">Check invitations received and requests you have sent.</p>
        </div>

        <div
          onClick={() => onNavigate('messages')}
          className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Direct Conversations</h3>
          <p className="text-xs text-gray-500 mt-1">Chat securely with members after mutual interest acceptance.</p>
        </div>
      </div>

      {/* Recommended Candidates */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900">Recommended For You</h2>
            <p className="text-xs text-gray-500">Curated based on active criteria and verified profiles</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            See All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProfiles.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                  alt={p.full_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-gray-800 capitalize shadow-xs">
                  {p.gender === 'female' ? 'Bride' : 'Groom'}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-950/70 text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {p.city}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                  {p.full_name}, {p.age || 26}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  {p.occupation || 'Professional'}
                </p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{p.education || 'Graduate'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
