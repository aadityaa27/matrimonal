import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Phone, 
  Mail, 
  Bookmark, 
  Send, 
  Check, 
  Calendar,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { Profile } from '../types';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onToggleShortlist,
  onSendInterest,
}) => {
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    setContactRevealed(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile, onClose]);

  if (!profile) return null;

  return (
    <div
      id="profile-modal-container"
      data-testid="profile-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="profile-modal"
        data-testid="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-profile-name"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Profile Overview
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-mono">ID: {profile.id}</span>
          </div>
          <button
            id="close-modal-btn"
            data-testid="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section with Photo and Basic Stats */}
        <div className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-sm bg-gray-100">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                data-testid="modal-profile-img"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=rose&color=fff&size=500`;
                }}
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="modal-profile-name"
                  data-testid="modal-profile-name"
                  className="text-2xl font-bold text-gray-900"
                >
                  {profile.name}
                </h2>
                {profile.verified && (
                  <span
                    data-testid="modal-verified-badge"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified ID
                  </span>
                )}
              </div>

              <p data-testid="modal-profile-subtitle" className="text-sm font-medium text-gray-600">
                {profile.age} Years • {profile.height} • {profile.maritalStatus}
              </p>

              <p className="text-xs text-gray-500 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{profile.city}, {profile.state}, {profile.country}</span>
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                <button
                  id="modal-shortlist-btn"
                  data-testid="modal-shortlist-btn"
                  onClick={() => onToggleShortlist(profile.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    profile.isShortlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${profile.isShortlisted ? 'fill-current' : ''}`} />
                  <span>{profile.isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}</span>
                </button>

                {profile.interestStatus === 'none' && (
                  <button
                    id="modal-send-interest-btn"
                    data-testid="modal-send-interest-btn"
                    onClick={() => onSendInterest(profile.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Interest</span>
                  </button>
                )}

                {profile.interestStatus === 'pending' && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Interest Sent
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="px-6 py-4 border-t border-gray-100 bg-rose-50/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            About {profile.name}
          </h3>
          <p data-testid="modal-bio-text" className="text-sm text-gray-700 leading-relaxed">
            {profile.bio}
          </p>

          {profile.hobbies && profile.hobbies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white border border-rose-100 text-rose-800 font-medium"
                >
                  {hobby}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Attribute Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Cultural Details */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Religious & Cultural Background
            </h4>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Religion:</span>
                <strong data-testid="modal-religion-value" className="text-gray-900">{profile.religion}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mother Tongue:</span>
                <strong className="text-gray-900">{profile.motherTongue}</strong>
              </div>
              <div className="flex justify-between">
                <span>Community / Caste:</span>
                <strong className="text-gray-900">{profile.community}</strong>
              </div>
              <div className="flex justify-between">
                <span>Date of Birth:</span>
                <span className="text-gray-900">{profile.dob}</span>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
              <Briefcase className="w-3.5 h-3.5 text-rose-500" />
              Career & Education
            </h4>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Highest Degree:</span>
                <strong className="text-gray-900">{profile.education}</strong>
              </div>
              <div className="flex justify-between">
                <span>Occupation:</span>
                <strong className="text-gray-900">{profile.occupation}</strong>
              </div>
              <div className="flex justify-between">
                <span>Employer:</span>
                <strong className="text-gray-900">{profile.company}</strong>
              </div>
              <div className="flex justify-between">
                <span>Annual Income:</span>
                <strong className="text-gray-900">{profile.annualIncome}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Preferences */}
        <div className="px-6 pb-4">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-600" />
              Desired Partner Preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-amber-800">
              <div>
                <span className="text-[11px] block text-amber-600">Age Bracket:</span>
                <strong>{profile.preferences.ageRange[0]} - {profile.preferences.ageRange[1]} yrs</strong>
              </div>
              <div>
                <span className="text-[11px] block text-amber-600">Preferred Religions:</span>
                <strong>{profile.preferences.religion.join(', ')}</strong>
              </div>
              <div>
                <span className="text-[11px] block text-amber-600">Preferred Location:</span>
                <strong>{profile.preferences.location || 'Flexible'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information (Gated / Click-to-Reveal for Playwright Interaction Testing) */}
        <div className="px-6 pb-6">
          <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                {contactRevealed ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-gray-500" />}
                Candidate Direct Contact Details
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Verified member contact info is protected for privacy.
              </p>
            </div>

            {!contactRevealed ? (
              <button
                id="reveal-contact-btn"
                data-testid="reveal-contact-btn"
                onClick={() => setContactRevealed(true)}
                className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Reveal Phone & Email
              </button>
            ) : (
              <div data-testid="contact-info-panel" className="text-xs space-y-1 text-right shrink-0">
                <div className="flex items-center justify-end gap-1.5 text-gray-800 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span data-testid="modal-phone-value">{profile.phone}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-gray-600">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span data-testid="modal-email-value">{profile.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
