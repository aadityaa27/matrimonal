import React, { useState } from 'react';
import { Mail, Check, X, Calendar, MapPin, Briefcase, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { InterestRequest } from '../types';

interface InterestsViewProps {
  requests: InterestRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export const InterestsView: React.FC<InterestsViewProps> = ({
  requests,
  onAccept,
  onDecline,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Header with Filter Pills */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-gray-900">Incoming Interest Requests</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Members who expressed an interest in connecting with your matrimonial profile.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl" role="group" aria-label="Filter status">
          {(['all', 'pending', 'accepted', 'declined'] as const).map((status) => (
            <button
              key={status}
              id={`filter-interests-${status}`}
              data-testid={`filter-interests-${status}`}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div 
        id="interests-list" 
        data-testid="interests-list" 
        className="space-y-4"
      >
        {filteredRequests.length === 0 ? (
          <div 
            data-testid="no-interests-msg"
            className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center"
          >
            <Mail className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No requests found</h3>
            <p className="text-xs text-gray-500 mt-1">
              There are no interest requests in the "{filter}" category.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              id={`interest-item-${req.id}`}
              data-testid={`interest-item-${req.id}`}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-rose-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={req.senderPhoto}
                  alt={req.senderName}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.senderName)}&background=rose&color=fff`;
                  }}
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 
                      data-testid={`interest-sender-name-${req.id}`} 
                      className="font-bold text-gray-900 text-base"
                    >
                      {req.senderName}
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">({req.senderAge} yrs)</span>
                    
                    {/* Status Badge */}
                    <span
                      id={`interest-status-${req.id}`}
                      data-testid={`interest-status-${req.id}`}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status === 'accepted' ? 'Connected' : req.status === 'declined' ? 'Declined' : 'Pending Review'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span>{req.senderOccupation}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{req.senderCity}</span>
                    </p>
                  </div>

                  {/* Intro Message */}
                  <p className="text-xs text-gray-700 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/50 italic mt-2">
                    "{req.message}"
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Sent on {req.sentDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto">
                {req.status === 'pending' ? (
                  <>
                    <button
                      id={`accept-interest-${req.id}`}
                      data-testid={`accept-interest-${req.id}`}
                      onClick={() => onAccept(req.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      id={`decline-interest-${req.id}`}
                      data-testid={`decline-interest-${req.id}`}
                      onClick={() => onDecline(req.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </>
                ) : req.status === 'accepted' ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-3 py-1.5 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Contact Revealed</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-medium italic">
                    Request archived
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
