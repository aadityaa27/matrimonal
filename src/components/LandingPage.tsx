import React from 'react';
import { Heart, Search, ShieldCheck, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CandidateProfile } from '../types';

interface LandingPageProps {
  onExploreClick: () => void;
  onRegisterClick: () => void;
  onLoginClick: () => void;
  featuredProfiles: CandidateProfile[];
  onSelectProfile: (profile: CandidateProfile) => void;
  onQuickDemoLogin: () => void;
  onQuickAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreClick,
  onRegisterClick,
  onLoginClick,
  featuredProfiles,
  onSelectProfile,
  onQuickDemoLogin,
  onQuickAdminLogin,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-amber-50/30 to-white pt-12 pb-20 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>India's Trusted Matchmaking Community</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-950 tracking-tight leading-[1.15]">
                Where Meaningful <br />
                <span className="text-rose-600 underline decoration-amber-300 decoration-wavy decoration-2">
                  Lifelong Bonds
                </span>{' '}
                Begin.
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Connect with genuine, verified Indian brides and grooms. Designed for families and modern professionals
                seeking authentic life partners rooted in shared traditions and values.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-register-btn"
                  data-testid="hero-register-btn"
                  type="button"
                  onClick={onRegisterClick}
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base shadow-lg shadow-rose-200 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Create Free Profile
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-btn"
                  data-testid="hero-explore-btn"
                  type="button"
                  onClick={onExploreClick}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base border border-gray-300 shadow-xs transition-all hover:border-gray-400 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-rose-600" />
                  Browse Profiles
                </button>
              </div>

              {/* QA & Demo Quick Access Banner */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-left max-w-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">QA Demo Sandbox</span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">1-Click Auto Login</span>
                </div>
                <div className="flex flex-wrap gap-2.5 mt-2.5">
                  <button
                    id="quick-demo-login-btn"
                    data-testid="quick-demo-login-btn"
                    type="button"
                    onClick={onQuickDemoLogin}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-xs font-semibold text-amber-900 border border-amber-300 shadow-2xs transition-colors"
                  >
                    Login as Demo User (Rohan Sharma)
                  </button>
                  <button
                    id="quick-admin-login-btn"
                    data-testid="quick-admin-login-btn"
                    type="button"
                    onClick={onQuickAdminLogin}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-xs font-semibold text-purple-900 border border-purple-300 shadow-2xs transition-colors"
                  >
                    Login as Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                <div className="relative overflow-hidden rounded-2xl aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
                    alt="Traditional Indian Wedding"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-[11px] font-semibold mb-1">
                      <Heart className="w-3 h-3 fill-white" />
                      100% Verified Profiles
                    </div>
                    <p className="text-lg font-serif font-bold">Celebrating 5,000+ Happy Unions</p>
                    <p className="text-xs text-rose-100 mt-0.5">Across Madhya Pradesh, Delhi NCR, and nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Candidates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">Featured Profiles Today</h2>
            <p className="text-sm text-gray-600 mt-1">Discover educated and ambitious professionals looking for companionship</p>
          </div>
          <button
            id="view-all-profiles-btn"
            data-testid="view-all-profiles-btn"
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Explore all 20+ profiles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfiles.slice(0, 4).map((p) => (
            <div
              key={p.id}
              id={`featured-profile-${p.id}`}
              data-testid={`featured-profile-${p.id}`}
              onClick={() => onSelectProfile(p)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                  alt={p.full_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-gray-800 capitalize shadow-xs">
                  {p.gender === 'female' ? 'Bride' : 'Groom'}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-950/70 text-white backdrop-blur-xs">
                  {p.city}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {p.full_name}, {p.age || 26}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{p.occupation || 'Professional'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.education || 'Graduate'}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600">View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="bg-rose-50/50 border-y border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Why Families Trust Bandhan</h2>
            <p className="text-sm text-gray-600 mt-1">Built with high privacy standards and authentic verification workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">100% Screened Profiles</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every candidate is authenticated with contact validation and basic background checks to prevent bots and impersonation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Mutual Interest Messaging</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect respectfully. Express interest and converse once your prospective match accepts your invitation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Privacy First Architecture</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                You control who sees your photos, direct contact details, and family preferences at every stage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
