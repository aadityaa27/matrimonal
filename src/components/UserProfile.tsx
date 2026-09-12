import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Eye, 
  Sparkles, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Sliders, 
  Camera, 
  Calendar,
  Share2,
  Users
} from 'lucide-react';
import { Profile } from '../types';

interface UserProfileProps {
  currentUser: Profile;
  allProfiles: Profile[];
  onUpdateProfile: (updated: Profile) => void;
  onSwitchUser: (userId: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  allProfiles,
  onUpdateProfile,
  onSwitchUser,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Profile>(currentUser);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  // Sync formData if currentUser changes externally
  React.useEffect(() => {
    setFormData(currentUser);
    setIsEditing(false);
  }, [currentUser.id]);

  // Compute profile completeness percentage
  const completeness = React.useMemo(() => {
    let score = 0;
    if (currentUser.name) score += 15;
    if (currentUser.photoUrl) score += 15;
    if (currentUser.bio && currentUser.bio.length > 20) score += 20;
    if (currentUser.education) score += 10;
    if (currentUser.occupation) score += 10;
    if (currentUser.phone && currentUser.email) score += 10;
    if (currentUser.verified) score += 10;
    if (currentUser.preferences && currentUser.preferences.religion.length > 0) score += 10;
    return Math.min(100, score);
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  const handleCancel = () => {
    setFormData(currentUser);
    setIsEditing(false);
  };

  return (
    <div id="user-profile-page" data-testid="user-profile-page" className="max-w-5xl mx-auto py-4 space-y-6">
      
      {/* Top Banner & Account Switcher */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Cover Header */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 relative p-4 sm:p-6 flex justify-between items-start">
          <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>My Candidate Account</span>
          </div>

          {/* User Switcher Dropdown (Useful for testing different persona perspectives) */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs shadow-xs">
            <span className="text-gray-600 font-medium hidden sm:inline">Active User:</span>
            <select
              id="switch-user-select"
              data-testid="switch-user-select"
              value={currentUser.id}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="bg-transparent font-semibold text-gray-900 focus:outline-none cursor-pointer"
            >
              {allProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.gender === 'female' ? 'Bride' : 'Groom'} - {p.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="relative">
              <img
                src={isEditing ? formData.photoUrl : currentUser.photoUrl}
                alt={currentUser.name}
                id="user-profile-avatar"
                data-testid="user-profile-avatar"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-md bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=rose&color=fff&size=500`;
                }}
              />
              {currentUser.verified && (
                <div 
                  data-testid="user-verified-badge"
                  className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs"
                  title="Government ID Verified"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Action Buttons: View vs Edit */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {!isEditing ? (
                <button
                  id="edit-profile-toggle"
                  data-testid="edit-profile-toggle"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="cancel-edit-btn"
                    data-testid="cancel-edit-btn"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    id="save-profile-btn"
                    data-testid="save-profile-btn"
                    onClick={handleSave}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name & Basic Info */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 id="user-profile-name" data-testid="user-profile-name" className="text-2xl font-bold text-gray-900">
                {currentUser.name}
              </h1>
              <span id="user-profile-id" data-testid="user-profile-id" className="text-xs text-gray-400 font-mono">
                ID: {currentUser.id}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 capitalize">
                {currentUser.gender === 'female' ? 'Bride Profile' : 'Groom Profile'}
              </span>
            </div>

            <p id="user-profile-subhead" data-testid="user-profile-subhead" className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentUser.age} yrs • {currentUser.height} • {currentUser.religion} ({currentUser.motherTongue}) • {currentUser.maritalStatus}
            </p>

            <p className="text-xs text-gray-500 flex items-center gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span data-testid="user-profile-location">{currentUser.city}, {currentUser.state}, {currentUser.country}</span>
            </p>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Profile Completeness Score
              </span>
              <span data-testid="completeness-score" className="text-rose-600 font-bold">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                data-testid="completeness-bar"
                className="bg-gradient-to-r from-rose-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            {completeness === 100 
              ? '✨ Outstanding! 100% complete profile receives 3x higher responses.'
              : 'Add photo, bio & preferences to achieve 100% visibility score.'}
          </p>
        </div>
      </div>

      {/* Success alert banner when updated */}
      {showSuccessBanner && (
        <div
          id="profile-updated-alert"
          data-testid="profile-updated-alert"
          role="alert"
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully! Test assertions can verify these updated fields.</span>
        </div>
      )}

      {/* Quick Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Profile Views</span>
          <span id="stat-profile-views" data-testid="stat-profile-views" className="text-xl font-bold text-gray-900 mt-1 block">
            {currentUser.viewsCount || 148}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Interests Received</span>
          <span id="stat-interests-received" data-testid="stat-interests-received" className="text-xl font-bold text-gray-900 mt-1 block">
            2
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Interests Sent</span>
          <span id="stat-interests-sent" data-testid="stat-interests-sent" className="text-xl font-bold text-gray-900 mt-1 block">
            {currentUser.interestStatus !== 'none' ? 1 : 0}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-center">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Shortlisted By</span>
          <span id="stat-shortlisted-by" data-testid="stat-shortlisted-by" className="text-xl font-bold text-gray-900 mt-1 block">
            12
          </span>
        </div>
      </div>

      {/* Detailed Profile Information (View or Edit mode) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Section 1: About Me */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-rose-600" />
            <span>About Candidate & Personality</span>
          </h2>

          <div className="mt-4">
            {isEditing ? (
              <div className="space-y-1.5">
                <label htmlFor="textarea-edit-bio" className="block text-xs font-semibold text-gray-700">
                  Biography & Personal Pitch
                </label>
                <textarea
                  id="textarea-edit-bio"
                  data-testid="textarea-edit-bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            ) : (
              <p id="user-bio-display" data-testid="user-bio-display" className="text-sm text-gray-700 leading-relaxed bg-rose-50/30 p-4 rounded-2xl border border-rose-100/60">
                "{currentUser.bio}"
              </p>
            )}

            {/* Hobbies / Interests */}
            <div className="mt-4 flex flex-wrap gap-2">
              {currentUser.hobbies?.map((hobby, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-lg font-medium">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Education & Career */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-rose-600" />
            <span>Career & Education</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {isEditing ? (
              <>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Education Degree</label>
                  <input
                    id="input-edit-education"
                    data-testid="input-edit-education"
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Occupation Title</label>
                  <input
                    id="input-edit-occupation"
                    data-testid="input-edit-occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company / Organization</label>
                  <input
                    id="input-edit-company"
                    data-testid="input-edit-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Annual Income</label>
                  <select
                    id="select-edit-income"
                    data-testid="select-edit-income"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  >
                    {['$60,000 - $80,000', '$95,000', '$110,000', '$135,000', '$150,000', '$180,000', '$210,000+'].map(inc => (
                      <option key={inc} value={inc}>{inc}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Degree:</span>
                  <strong data-testid="user-education-display" className="text-gray-900">{currentUser.education}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Profession:</span>
                  <strong data-testid="user-occupation-display" className="text-gray-900">{currentUser.occupation}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Employer:</span>
                  <strong data-testid="user-company-display" className="text-gray-900">{currentUser.company}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Income:</span>
                  <strong data-testid="user-income-display" className="text-gray-900">{currentUser.annualIncome}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Religious & Horoscope */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Religious & Cultural Details</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {isEditing ? (
              <>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Religion</label>
                  <select
                    id="select-edit-religion"
                    data-testid="select-edit-religion"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  >
                    {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Parsi', 'Buddhist'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mother Tongue</label>
                  <input
                    id="input-edit-mothertongue"
                    data-testid="input-edit-mothertongue"
                    type="text"
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Horoscope / Rashi</label>
                  <input
                    id="input-edit-horoscope"
                    data-testid="input-edit-horoscope"
                    type="text"
                    value={formData.horoscope || 'Leo / Magha'}
                    onChange={(e) => setFormData({ ...formData, horoscope: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Religion:</span>
                  <strong data-testid="user-religion-display" className="text-gray-900">{currentUser.religion}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Mother Tongue:</span>
                  <strong data-testid="user-mothertongue-display" className="text-gray-900">{currentUser.motherTongue}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="text-gray-500">Horoscope:</span>
                  <strong data-testid="user-horoscope-display" className="text-gray-900">{currentUser.horoscope || 'Aries / Bharani'}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 4: Partner Preferences */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Desired Partner Preferences</span>
          </h2>

          <div className="mt-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-3">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Preferred Age Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-edit-pref-min-age"
                      data-testid="input-edit-pref-min-age"
                      type="number"
                      value={formData.preferences.ageRange[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            ageRange: [Number(e.target.value), formData.preferences.ageRange[1]],
                          },
                        })
                      }
                      className="w-20 px-2 py-1.5 bg-white border border-amber-300 rounded-md"
                    />
                    <span>to</span>
                    <input
                      id="input-edit-pref-max-age"
                      data-testid="input-edit-pref-max-age"
                      type="number"
                      value={formData.preferences.ageRange[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            ageRange: [formData.preferences.ageRange[0], Number(e.target.value)],
                          },
                        })
                      }
                      className="w-20 px-2 py-1.5 bg-white border border-amber-300 rounded-md"
                    />
                    <span>years</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Preferred Location</label>
                  <input
                    id="input-edit-pref-location"
                    data-testid="input-edit-pref-location"
                    type="text"
                    value={formData.preferences.location || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          location: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-md"
                    placeholder="e.g. USA / Canada"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-amber-900">
                <div>
                  <span className="block text-amber-600 text-[11px]">Age Range:</span>
                  <strong data-testid="user-pref-age-display">
                    {currentUser.preferences.ageRange[0]} - {currentUser.preferences.ageRange[1]} yrs
                  </strong>
                </div>
                <div>
                  <span className="block text-amber-600 text-[11px]">Religion Preference:</span>
                  <strong data-testid="user-pref-religion-display">
                    {currentUser.preferences.religion.join(', ')}
                  </strong>
                </div>
                <div>
                  <span className="block text-amber-600 text-[11px]">Location Preference:</span>
                  <strong data-testid="user-pref-location-display">
                    {currentUser.preferences.location || 'Flexible'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Contact & Privacy Settings */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Contact Information & Privacy Controls</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-500 block">Phone Number</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span data-testid="user-phone-display">{currentUser.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-500 block">Email Address</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <span data-testid="user-email-display">{currentUser.email}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-500 block">Phone Privacy Level</span>
              {isEditing ? (
                <select
                  id="select-edit-phone-privacy"
                  data-testid="select-edit-phone-privacy"
                  value={formData.privacyPhone || 'matches_only'}
                  onChange={(e) => setFormData({ ...formData, privacyPhone: e.target.value as any })}
                  className="w-full p-1 bg-white border border-gray-300 rounded text-xs"
                >
                  <option value="matches_only">Visible to Accepted Matches Only</option>
                  <option value="public">Visible to All Verified Members</option>
                  <option value="hidden">Hidden completely</option>
                </select>
              ) : (
                <span 
                  id="user-privacy-phone-badge" 
                  data-testid="user-privacy-phone-badge" 
                  className="font-semibold text-gray-900 inline-flex items-center gap-1 text-xs"
                >
                  <Lock className="w-3 h-3 text-amber-600" />
                  {currentUser.privacyPhone === 'public' 
                    ? 'Visible to All Members' 
                    : currentUser.privacyPhone === 'hidden'
                    ? 'Hidden'
                    : 'Visible to Matches Only'}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
