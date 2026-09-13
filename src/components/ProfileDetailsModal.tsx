import React from 'react';
import { X, Heart, MessageSquare, MapPin, Briefcase, GraduationCap, DollarSign, Calendar, ShieldCheck, User } from 'lucide-react';
import { CandidateProfile } from '../types';

interface ProfileDetailsModalProps {
  profile: CandidateProfile | null;
  onClose: () => void;
  onSendInterest: (userId: number) => void;
  onOpenMessage: (partnerId: number) => void;
  currentUserId: number | null;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onSendInterest,
  onOpenMessage,
  currentUserId,
}) => {
  if (!profile) return null;

  const isSelf = currentUserId ? profile.user_id === currentUserId : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          id="close-profile-modal-btn"
          data-testid="close-profile-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Photo Banner */}
        <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden">
          <img
            src={profile.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
            alt={profile.full_name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-600/90 text-white capitalize shadow-xs">
                  {profile.gender === 'female' ? 'Bride' : 'Groom'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Member
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {profile.full_name}
              </h2>
              <p className="text-sm text-gray-200 mt-0.5 flex items-center gap-2">
                <span>{profile.age ? `${profile.age} Years` : '26 Years'}</span>
                <span>•</span>
                <span>{profile.height || '5 ft 6 in'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {profile.city}, {profile.state}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* About Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Me</h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-rose-50/40 p-4 rounded-2xl border border-rose-100/80">
              {profile.about || 'Looking for an understanding partner with traditional yet progressive outlook.'}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <Briefcase className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Occupation</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.occupation || 'Professional'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <GraduationCap className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Education</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.education || 'Graduate'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <DollarSign className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Annual Income</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.annual_income || 'Confidential'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <User className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Religion & Community</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.religion || 'Hindu'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <Calendar className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Date of Birth</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.date_of_birth}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <MapPin className="w-4 h-4 text-rose-600 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Current Location</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{profile.city}, {profile.state}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Search
          </button>

          {!isSelf && (
            <div className="flex items-center gap-2.5">
              <button
                id="modal-send-message-btn"
                data-testid="modal-send-message-btn"
                type="button"
                onClick={() => onOpenMessage(profile.user_id)}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-rose-600" />
                Message
              </button>

              <button
                id="modal-send-interest-btn"
                data-testid="modal-send-interest-btn"
                type="button"
                disabled={profile.interestStatus === 'accepted' || profile.interestStatus === 'pending'}
                onClick={() => onSendInterest(profile.user_id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  profile.interestStatus === 'accepted'
                    ? 'bg-emerald-600 text-white'
                    : profile.interestStatus === 'pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                {profile.interestStatus === 'accepted'
                  ? 'Matched & Connected'
                  : profile.interestStatus === 'pending'
                  ? 'Interest Requested'
                  : 'Express Interest'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
