import React, { useState } from 'react';
import { Search, RotateCcw, Heart, Eye, MapPin, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { CandidateProfile, SearchFilterState } from '../types';

interface SearchPageProps {
  profiles: CandidateProfile[];
  cities: { city_name: string; state: string }[];
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  onSelectProfile: (profile: CandidateProfile) => void;
  onSendInterest: (profileId: number) => void;
  currentUserId: number | null;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  profiles,
  cities,
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onSelectProfile,
  onSendInterest,
  currentUserId,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilterState>(filters);

  const handleGenderClick = (gender: 'all' | 'female' | 'male') => {
    const updated = { ...localFilters, gender };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
    onSearch();
  };

  const handleResetClick = () => {
    // BUG-003: Occupation filter is intentionally not cleared on reset
    const resetState: SearchFilterState = {
      gender: 'all',
      minAge: '',
      maxAge: '',
      city: 'all',
      education: '',
      occupation: localFilters.occupation, // retains previous value (BUG-003)
    };
    setLocalFilters(resetState);
    onFilterChange(resetState);
    onReset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Search Candidate Profiles</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Filter through eligible brides and grooms tailored to your preferences
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 self-start md:self-auto border border-rose-200">
          Showing {profiles.length} Matched Profiles
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-rose-100/90 rounded-2xl p-5 shadow-sm space-y-6 sticky top-24"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-600" />
                Refine Search
              </h2>
              <button
                id="filter-reset-btn"
                data-testid="filter-reset"
                type="button"
                onClick={handleResetClick}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Gender Filter Buttons */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Looking For</label>
              <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl">
                <button
                  id="filter-gender-all"
                  data-testid="filter-gender-all"
                  type="button"
                  value="all"
                  onClick={() => handleGenderClick('all')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    localFilters.gender === 'all'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  id="filter-gender-female"
                  data-testid="filter-gender-female"
                  type="button"
                  value="female"
                  onClick={() => handleGenderClick('female')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    localFilters.gender === 'female'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Brides
                </button>
                <button
                  id="filter-gender-male"
                  data-testid="filter-gender-male"
                  type="button"
                  value="male"
                  onClick={() => handleGenderClick('male')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    localFilters.gender === 'male'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grooms
                </button>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Age Range (Years)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    id="filter-min-age"
                    data-testid="filter-min-age"
                    name="minAge"
                    type="number"
                    min="18"
                    max="65"
                    value={localFilters.minAge}
                    onChange={handleChange}
                    placeholder="Min (e.g. 24)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <input
                    id="filter-max-age"
                    data-testid="filter-max-age"
                    name="maxAge"
                    type="number"
                    min="18"
                    max="65"
                    value={localFilters.maxAge}
                    onChange={handleChange}
                    placeholder="Max (e.g. 30)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label htmlFor="filter-city" className="block text-xs font-semibold text-gray-700 mb-1.5">
                City / Location
              </label>
              <select
                id="filter-city"
                data-testid="filter-city"
                name="city"
                value={localFilters.city}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="all">All Cities</option>
                {cities.map((c) => (
                  <option key={`${c.city_name}-${c.state}`} value={c.city_name}>
                    {c.city_name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Education Filter */}
            <div>
              <label htmlFor="filter-education" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Education Qualification
              </label>
              <input
                id="filter-education"
                data-testid="filter-education"
                name="education"
                type="text"
                value={localFilters.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech, MBA, CA, MBBS"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Occupation Filter */}
            <div>
              <label htmlFor="filter-occupation" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Profession / Occupation
              </label>
              <input
                id="filter-occupation"
                data-testid="filter-occupation"
                name="occupation"
                type="text"
                value={localFilters.occupation}
                onChange={handleChange}
                placeholder="e.g. Engineer, Doctor, Architect"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Search Submit Button */}
            <button
              id="filter-submit-btn"
              data-testid="filter-submit"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Profiles Results Grid */}
        <main className="lg:col-span-8 xl:col-span-9">
          {profiles.length === 0 ? (
            <div
              id="search-empty-state"
              data-testid="search-empty-state"
              className="p-12 text-center bg-white rounded-3xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No matching profiles found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try expanding your search criteria or resetting filters to explore more potential matches.
              </p>
              <button
                type="button"
                onClick={handleResetClick}
                className="mt-4 px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  id={`profile-card-${p.id}`}
                  data-testid="profile-card"
                  className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo Header */}
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <img
                        src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                        alt={p.full_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-xs text-gray-800 capitalize shadow-2xs">
                        {p.gender === 'female' ? 'Bride' : 'Groom'}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-950/70 text-white backdrop-blur-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {p.city}
                      </span>
                    </div>

                    {/* Candidate Details */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 leading-snug">{p.full_name}</h3>
                          <p className="text-xs font-medium text-rose-700">
                            {p.age ? `${p.age} yrs` : '26 yrs'} • {p.height || '5 ft 6 in'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{p.occupation || 'Professional'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{p.education || 'Graduate'}</span>
                        </div>
                      </div>

                      {p.about && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 pt-1 leading-relaxed">
                          {p.about}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      id={`view-details-btn-${p.id}`}
                      data-testid="view-profile-btn"
                      type="button"
                      onClick={() => onSelectProfile(p)}
                      className="flex-1 py-2 px-3 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      View Profile
                    </button>

                    {!p.isSelf && (
                      <button
                        id={`express-interest-btn-${p.id}`}
                        data-testid="send-interest-btn"
                        type="button"
                        disabled={p.interestStatus === 'pending' || p.interestStatus === 'accepted'}
                        onClick={() => onSendInterest(p.user_id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          p.interestStatus === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : p.interestStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-300'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs shadow-rose-200'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {p.interestStatus === 'accepted'
                          ? 'Connected'
                          : p.interestStatus === 'pending'
                          ? 'Requested'
                          : 'Send Interest'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
