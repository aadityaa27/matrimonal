import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Clock, ShieldCheck, Heart } from 'lucide-react';
import { ConversationItem, MessageItem } from '../types';
import { api } from '../services/api';

interface MessagesPageProps {
  currentUserId: number;
  selectedPartnerId?: number | null;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ currentUserId, selectedPartnerId }) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activePartner, setActivePartner] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [selectedPartnerId]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const convList = await api.getConversations();
      setConversations(convList);

      if (convList.length > 0) {
        if (selectedPartnerId) {
          const match = convList.find((c) => c.partnerId === selectedPartnerId);
          setActivePartner(match || convList[0]);
        } else {
          setActivePartner(convList[0]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePartner) {
      loadThread(activePartner.partnerId);
    }
  }, [activePartner]);

  const loadThread = async (partnerId: number) => {
    try {
      const thread = await api.getThread(partnerId);
      setMessages(thread);
      setTimeout(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to load thread:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePartner) return;

    // BUG-007: We do NOT prevent empty or whitespace string submission on client or server!
    setSending(true);
    try {
      const res = await api.sendMessage(activePartner.partnerId, inputText);
      setInputText('');
      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        await loadThread(activePartner.partnerId);
      }
      setTimeout(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-rose-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh]">
        {/* Left Sidebar: Conversations List */}
        <aside className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-600" />
              Conversations ({conversations.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                <Heart className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                Connect with matched candidates to begin chatting.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.partnerId}
                  id={`conversation-${c.partnerId}`}
                  data-testid="conversation-item"
                  onClick={() => setActivePartner(c)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activePartner?.partnerId === c.partnerId
                      ? 'bg-rose-50/80 border-l-4 border-rose-600'
                      : 'hover:bg-gray-100/70'
                  }`}
                >
                  <img
                    src={c.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-rose-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900 truncate">{c.name}</p>
                      {c.lastMessageTime && (
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {c.lastMessage || 'Connected! Start the conversation.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Right Main Area: Active Thread */}
        <main className="flex-1 flex flex-col bg-white">
          {activePartner ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white/80">
                <div className="flex items-center gap-3">
                  <img
                    src={activePartner.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={activePartner.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-rose-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{activePartner.name}</h3>
                    <p className="text-[11px] text-gray-500">
                      {activePartner.city} • {activePartner.occupation || 'Professional'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Matrimonial Match
                </span>
              </div>

              {/* Messages Container */}
              <div
                id="message-thread"
                data-testid="message-thread"
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-gray-50/40"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                    <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold text-gray-600">No messages yet with {activePartner.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Send a warm greeting to start your matrimonial discussion.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === currentUserId;
                    return (
                      <div
                        key={m.id}
                        data-testid="message-bubble"
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-rose-600 text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="break-words whitespace-pre-wrap">{m.message}</p>
                          <span
                            className={`block text-[9px] mt-1 ${
                              isMe ? 'text-rose-100 text-right' : 'text-gray-400 text-left'
                            }`}
                          >
                            {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={threadEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-200 bg-white flex items-center gap-2">
                <input
                  id="message-input"
                  data-testid="message-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a polite message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <button
                  id="message-send-btn"
                  data-testid="message-send-btn"
                  type="submit"
                  disabled={sending}
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors disabled:opacity-50"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-gray-400">
              <p className="text-xs">Select a conversation from the left to view messages.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
