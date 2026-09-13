import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, MapPin, Briefcase, GraduationCap, DollarSign, Calendar, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CandidateProfile } from '../types';
import { api } from '../services/api';

interface MyProfilePageProps {
  initialProfile: CandidateProfile | null;
  onProfileUpdated: (profile: CandidateProfile) => void;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ initialProfile, onProfileUpdated }) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    occupation: '',
    annual_income: '',
    about: '',
    education: '',
    height: '',
    religion: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        city: profile.city || '',
        occupation: profile.occupation || '',
        annual_income: profile.annual_income || '',
        about: profile.about || '',
        education: profile.education || '',
        height: profile.height || '',
        religion: profile.religion || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      // Calls update API. Due to BUG-006, backend omits annual_income from the SQL UPDATE
      const res = await api.updateProfile(profile.id, formData);
      const updated = res.profile;
      setProfile(updated);
      onProfileUpdated(updated);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-gray-500">Loading your profile information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification for Playwright detection */}
      {showToast && (
        <div
          id="toast-success"
          data-testid="toast-success"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-300"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white border border-rose-100 overflow-hidden shadow-sm">
        <div className="h-44 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500" />
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          <div className="flex items-end gap-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white bg-gray-100 shadow-lg shrink-0">
              <img
                src={profile.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                alt={profile.full_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1
                  id="profile-display-name"
                  data-testid="profile-display-name"
                  className="text-2xl font-serif font-bold text-gray-900"
                >
                  {profile.full_name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 capitalize">
                  {profile.gender}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile.age || 26} Years • {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          <div>
            {!isEditing ? (
              <button
                id="edit-profile-btn"
                data-testid="edit-profile-btn"
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-rose-600" />
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 text-xs font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Main Profile Body */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Edit Personal & Professional Details</h2>
            <span className="text-xs text-rose-600 font-medium">* Update your matrimony criteria</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                id="profile-fullname"
                data-testid="profile-fullname"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                id="profile-city"
                data-testid="profile-city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Profession / Occupation</label>
              <input
                id="profile-occupation"
                data-testid="profile-occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Annual Income</label>
              <input
                id="profile-income"
                data-testid="profile-income"
                name="annual_income"
                type="text"
                value={formData.annual_income}
                onChange={handleChange}
                placeholder="e.g. ₹18 - 22 Lakhs"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Education</label>
              <input
                id="profile-education"
                data-testid="profile-education"
                name="education"
                type="text"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Height</label>
              <input
                id="profile-height"
                data-testid="profile-height"
                name="height"
                type="text"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">About Me / Bio</label>
            <textarea
              id="profile-about"
              data-testid="profile-about"
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              id="save-profile-btn"
              data-testid="save-profile-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Candidate</h2>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {profile.about || 'No description provided yet.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Occupation</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.occupation || 'Professional'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <DollarSign className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Annual Income</p>
                <p
                  id="profile-display-income"
                  data-testid="profile-display-income"
                  className="text-xs font-bold text-gray-900 mt-0.5"
                >
                  {profile.annual_income || 'Confidential'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Education</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.education || 'Graduate'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Location</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.city}, {profile.state}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
