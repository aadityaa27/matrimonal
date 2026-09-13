import React, { useState, useEffect } from 'react';
import { Heart, Check, X, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { InterestItem } from '../types';
import { api } from '../services/api';

interface InterestsPageProps {
  onOpenMessage: (partnerId: number) => void;
  onInterestsUpdated: () => void;
}

export const InterestsPage: React.FC<InterestsPageProps> = ({ onOpenMessage, onInterestsUpdated }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedList, setReceivedList] = useState<InterestItem[]>([]);
  const [sentList, setSentList] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const [received, sent] = await Promise.all([
        api.getReceivedInterests(),
        api.getSentInterests(),
      ]);
      setReceivedList(received);
      setSentList(sent);
    } catch (err: any) {
      console.error('Error fetching interests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleUpdateStatus = async (interestId: number, status: 'accepted' | 'rejected') => {
    try {
      // Due to BUG-005, backend allows transitioning from 'rejected' to 'accepted' without rejection validation!
      await api.updateInterestStatus(interestId, status);
      setActionMessage(`Interest marked as ${status}`);
      setTimeout(() => setActionMessage(null), 3000);
      await fetchInterests();
      onInterestsUpdated();
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to update interest status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Interests & Invitations</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review invitations from candidates or monitor your outgoing connection requests
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 bg-gray-100 rounded-xl self-start sm:self-auto">
          <button
            id="tab-received-interests"
            data-testid="tab-received-interests"
            type="button"
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'received'
                ? 'bg-white text-rose-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Received ({receivedList.length})
          </button>
          <button
            id="tab-sent-interests"
            data-testid="tab-sent-interests"
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sent'
                ? 'bg-white text-rose-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Sent ({sentList.length})
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {actionMessage}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading interests...</div>
      ) : activeTab === 'received' ? (
        <div className="space-y-4">
          {receivedList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No received interests yet</p>
              <p className="text-xs text-gray-500 mt-0.5">When other members express interest, they will appear here.</p>
            </div>
          ) : (
            receivedList.map((item) => (
              <div
                key={item.id}
                id={`received-interest-${item.id}`}
                data-testid="received-interest-card"
                className="bg-white border border-rose-100 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={item.full_name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-rose-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{item.full_name}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          item.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.age || 26} Yrs • {item.city} • {item.occupation || 'Professional'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Received on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.status === 'accepted' ? (
                    <button
                      type="button"
                      onClick={() => onOpenMessage(item.sender_id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Start Chat
                    </button>
                  ) : (
                    <>
                      <button
                        id={`accept-interest-${item.id}`}
                        data-testid="accept-interest-btn"
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                      <button
                        id={`reject-interest-${item.id}`}
                        data-testid="reject-interest-btn"
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sentList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No sent interests yet</p>
              <p className="text-xs text-gray-500 mt-0.5">Explore search and send interest to candidates you like.</p>
            </div>
          ) : (
            sentList.map((item) => (
              <div
                key={item.id}
                id={`sent-interest-${item.id}`}
                data-testid="sent-interest-card"
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={item.full_name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{item.full_name}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          item.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.age || 26} Yrs • {item.city} • {item.occupation || 'Professional'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Sent on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  {item.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => onOpenMessage(item.receiver_id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
