import React from 'react';
import { 
  Bookmark, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Eye, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onViewDetails: (profile: Profile) => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onToggleShortlist,
  onSendInterest,
}) => {
  return (
    <article
      id={`profile-card-${profile.id}`}
      data-testid={`profile-card-${profile.id}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Profile Image & Badges */}
        <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            data-testid={`profile-img-${profile.id}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            onError={(e) => {
              // Fallback to initials avatar if image fails
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=rose&color=fff&size=500`;
            }}
          />

          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {profile.verified ? (
              <span 
                data-testid={`verified-badge-${profile.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : <span />}

            <button
              id={`shortlist-btn-${profile.id}`}
              data-testid={`shortlist-btn-${profile.id}`}
              aria-label={profile.isShortlisted ? `Remove ${profile.name} from shortlist` : `Shortlist ${profile.name}`}
              aria-pressed={profile.isShortlisted}
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist(profile.id);
              }}
              className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                profile.isShortlisted 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${profile.isShortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Floating name and age inside image bottom */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 
              data-testid={`profile-name-${profile.id}`} 
              className="text-lg font-bold leading-tight drop-shadow-xs"
            >
              {profile.name}
            </h3>
            <p 
              data-testid={`profile-age-${profile.id}`} 
              className="text-xs text-white/90 drop-shadow-xs mt-0.5"
            >
              {profile.age} yrs • {profile.height} • {profile.religion} ({profile.motherTongue})
            </p>
          </div>
        </div>

        {/* Profile Attributes */}
        <div className="p-4 space-y-3">
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span 
                data-testid={`profile-occupation-${profile.id}`}
                className="truncate font-medium text-gray-800"
              >
                {profile.occupation}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate text-gray-600">
                {profile.education}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span 
                data-testid={`profile-location-${profile.id}`}
                className="truncate text-gray-600"
              >
                {profile.city}, {profile.country}
              </span>
            </div>
          </div>

          {/* Quick Bio snippet */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">
            "{profile.bio}"
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 text-[11px] bg-rose-50 text-rose-700 rounded-md font-medium">
              {profile.community || profile.religion}
            </span>
            <span className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-md font-medium">
              {profile.maritalStatus}
            </span>
            <span className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-md font-medium">
              {profile.annualIncome}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="p-4 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
        <button
          id={`view-profile-btn-${profile.id}`}
          data-testid={`view-profile-btn-${profile.id}`}
          onClick={() => onViewDetails(profile)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        {profile.interestStatus === 'pending' ? (
          <button
            id={`send-interest-btn-${profile.id}`}
            data-testid={`send-interest-btn-${profile.id}`}
            disabled
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-100 rounded-xl cursor-not-allowed opacity-90"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Interest Sent</span>
          </button>
        ) : profile.interestStatus === 'accepted' ? (
          <button
            id={`send-interest-btn-${profile.id}`}
            data-testid={`send-interest-btn-${profile.id}`}
            disabled
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-xl cursor-not-allowed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connected</span>
          </button>
        ) : (
          <button
            id={`send-interest-btn-${profile.id}`}
            data-testid={`send-interest-btn-${profile.id}`}
            onClick={() => onSendInterest(profile.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Interest</span>
          </button>
        )}
      </div>
    </article>
  );
};
