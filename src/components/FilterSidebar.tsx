import React from 'react';
import { Search, RotateCcw, Filter, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { FilterState, Gender } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearFilters: () => void;
  totalFiltered: number;
}

const RELIGIONS = ['All Religions', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Parsi', 'Buddhist'];
const MOTHER_TONGUES = ['All Languages', 'Hindi', 'Bengali', 'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Malayalam', 'Punjabi', 'Urdu', 'English'];
const MARITAL_STATUSES = ['All Statuses', 'Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onClearFilters,
  totalFiltered,
}) => {
  const handleGenderChange = (value: Gender) => {
    setFilters((prev) => ({ ...prev, gender: value }));
  };

  return (
    <aside 
      id="filter-sidebar" 
      data-testid="filter-sidebar" 
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-base">
          <SlidersHorizontal className="w-4 h-4 text-rose-600" />
          <span>Filter Matches</span>
        </div>
        <button
          id="clear-filters-btn"
          data-testid="clear-filters-btn"
          onClick={onClearFilters}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label htmlFor="filter-search" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Search by Name / City / Role
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search"
            data-testid="filter-search"
            type="text"
            placeholder="e.g. Ananya, Seattle, Engineer..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Gender Selection (Pills / Radio behavior) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Looking for
        </label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg" role="group" aria-label="Gender filter">
          <button
            id="filter-gender-all"
            data-testid="filter-gender-all"
            type="button"
            value="all"
            onClick={() => handleGenderChange('all')}
            className={`py-1.5 px-2 text-xs font-medium rounded-md capitalize transition-all ${
              filters.gender === 'all'
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
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
            onClick={() => handleGenderChange('female')}
            className={`py-1.5 px-2 text-xs font-medium rounded-md capitalize transition-all ${
              filters.gender === 'female'
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
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
            onClick={() => handleGenderChange('male')}
            className={`py-1.5 px-2 text-xs font-medium rounded-md capitalize transition-all ${
              filters.gender === 'male'
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grooms
          </button>
        </div>
      </div>

      {/* Age Range Slider & Inputs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Age Range (Years)
          </label>
          <span data-testid="age-range-label" className="text-xs font-medium text-rose-600">
            {filters.minAge} - {filters.maxAge} yrs
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-gray-500">Min Age</span>
            <input
              id="filter-min-age"
              data-testid="filter-min-age"
              type="number"
              min={20}
              max={filters.maxAge}
              value={filters.minAge}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value) || 20, filters.maxAge);
                setFilters(prev => ({ ...prev, minAge: val }));
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-rose-500 text-gray-800"
            />
          </div>
          <div>
            <span className="text-[11px] text-gray-500">Max Age</span>
            <input
              id="filter-max-age"
              data-testid="filter-max-age"
              type="number"
              min={filters.minAge}
              max={60}
              value={filters.maxAge}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value) || filters.minAge, filters.minAge);
                setFilters(prev => ({ ...prev, maxAge: val }));
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-rose-500 text-gray-800"
            />
          </div>
        </div>
        <input
          id="filter-age-slider"
          data-testid="filter-age-slider"
          type="range"
          min={21}
          max={50}
          value={filters.maxAge}
          onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Number(e.target.value) }))}
          className="w-full accent-rose-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Religion Select */}
      <div className="space-y-1.5">
        <label htmlFor="filter-religion" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Religion
        </label>
        <select
          id="filter-religion"
          data-testid="filter-religion"
          value={filters.religion}
          onChange={(e) => setFilters(prev => ({ ...prev, religion: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900"
        >
          {RELIGIONS.map(rel => (
            <option key={rel} value={rel === 'All Religions' ? '' : rel}>
              {rel}
            </option>
          ))}
        </select>
      </div>

      {/* Mother Tongue Select */}
      <div className="space-y-1.5">
        <label htmlFor="filter-mother-tongue" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Mother Tongue
        </label>
        <select
          id="filter-mother-tongue"
          data-testid="filter-mother-tongue"
          value={filters.motherTongue}
          onChange={(e) => setFilters(prev => ({ ...prev, motherTongue: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900"
        >
          {MOTHER_TONGUES.map(lang => (
            <option key={lang} value={lang === 'All Languages' ? '' : lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Marital Status Select */}
      <div className="space-y-1.5">
        <label htmlFor="filter-marital-status" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Marital Status
        </label>
        <select
          id="filter-marital-status"
          data-testid="filter-marital-status"
          value={filters.maritalStatus}
          onChange={(e) => setFilters(prev => ({ ...prev, maritalStatus: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900"
        >
          {MARITAL_STATUSES.map(status => (
            <option key={status} value={status === 'All Statuses' ? '' : status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Verified Profiles Checkbox */}
      <div className="pt-2">
        <label 
          htmlFor="filter-verified" 
          className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700"
        >
          <input
            id="filter-verified"
            data-testid="filter-verified"
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
          />
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified Profiles Only
          </span>
        </label>
      </div>

      {/* Active Filter Summary / Badge count */}
      <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
        <span>Matching Profiles:</span>
        <span data-testid="sidebar-matches-count" className="font-bold text-gray-900">
          {totalFiltered}
        </span>
      </div>
    </aside>
  );
};
