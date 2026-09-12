import React from 'react';
import { Eye, Bookmark, Send, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { Profile } from '../types';

interface ProfileTableProps {
  profiles: Profile[];
  onViewDetails: (profile: Profile) => void;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
}

export const ProfileTable: React.FC<ProfileTableProps> = ({
  profiles,
  onViewDetails,
  onToggleShortlist,
  onSendInterest,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table 
          id="profiles-data-table" 
          data-testid="profiles-data-table" 
          className="min-w-full divide-y divide-gray-200 text-left text-xs text-gray-600"
        >
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[11px] tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Candidate</th>
              <th scope="col" className="px-3 py-3.5">Age & Height</th>
              <th scope="col" className="px-3 py-3.5">Culture & Mother Tongue</th>
              <th scope="col" className="px-3 py-3.5">Location</th>
              <th scope="col" className="px-3 py-3.5">Profession & Education</th>
              <th scope="col" className="px-3 py-3.5">Status</th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                  No profiles found matching the criteria.
                </td>
              </tr>
            ) : (
              profiles.map((profile, index) => (
                <tr 
                  key={profile.id}
                  id={`table-row-${index}`}
                  data-testid={`table-row-${index}`}
                  className="hover:bg-rose-50/40 transition-colors"
                >
                  {/* Candidate Name & Photo */}
                  <td className="py-4 pl-4 pr-3 sm:pl-6 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={profile.photoUrl} 
                        alt={profile.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=rose&color=fff`;
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            data-testid={`table-row-${index}-name`}
                            className="font-semibold text-gray-900"
                          >
                            {profile.name}
                          </span>
                          {profile.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Profile" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 capitalize">{profile.gender}</span>
                      </div>
                    </div>
                  </td>

                  {/* Age & Height */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">{profile.age} yrs</div>
                    <div className="text-gray-400 text-[11px]">{profile.height}</div>
                  </td>

                  {/* Culture */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">{profile.religion}</div>
                    <div className="text-gray-400 text-[11px]">{profile.motherTongue} • {profile.community}</div>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">{profile.city}</div>
                    <div className="text-gray-400 text-[11px]">{profile.country}</div>
                  </td>

                  {/* Profession & Education */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium truncate max-w-xs">{profile.occupation}</div>
                    <div className="text-gray-400 text-[11px] truncate max-w-xs">{profile.education}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    {profile.interestStatus === 'accepted' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                        Connected
                      </span>
                    ) : profile.interestStatus === 'pending' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
                        Interest Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                        Available
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-4 sm:pr-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Shortlist */}
                      <button
                        data-testid={`table-shortlist-btn-${profile.id}`}
                        onClick={() => onToggleShortlist(profile.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          profile.isShortlisted 
                            ? 'bg-rose-50 border-rose-200 text-rose-600' 
                            : 'bg-white border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-gray-50'
                        }`}
                        title={profile.isShortlisted ? 'Remove shortlist' : 'Shortlist profile'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${profile.isShortlisted ? 'fill-current' : ''}`} />
                      </button>

                      {/* View */}
                      <button
                        data-testid={`table-view-btn-${profile.id}`}
                        onClick={() => onViewDetails(profile)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        title="View profile modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Interest */}
                      {profile.interestStatus === 'none' && (
                        <button
                          data-testid={`table-interest-btn-${profile.id}`}
                          onClick={() => onSendInterest(profile.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
