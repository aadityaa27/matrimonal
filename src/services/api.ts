import {
  User,
  CandidateProfile,
  InterestItem,
  MessageItem,
  ConversationItem,
  AdminStats,
  AdminUserItem,
  SearchFilterState,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('bandhan_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    localStorage.setItem('bandhan_token', data.token);
    localStorage.setItem('bandhan_user', JSON.stringify(data.user));
    if (data.profile) {
      localStorage.setItem('bandhan_profile', JSON.stringify(data.profile));
    }
    return data;
  },

  async register(formData: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Registration failed');
    }
    if (data.token) {
      localStorage.setItem('bandhan_token', data.token);
      localStorage.setItem('bandhan_user', JSON.stringify(data.user));
      localStorage.setItem('bandhan_profile', JSON.stringify(data.profile));
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  },

  logout() {
    localStorage.removeItem('bandhan_token');
    localStorage.removeItem('bandhan_user');
    localStorage.removeItem('bandhan_profile');
  },

  // Profiles
  async getProfiles(filters?: Partial<SearchFilterState>) {
    const params = new URLSearchParams();
    if (filters?.gender && filters.gender !== 'all') params.append('gender', filters.gender);
    if (filters?.minAge) params.append('minAge', String(filters.minAge));
    if (filters?.maxAge) params.append('maxAge', String(filters.maxAge));
    if (filters?.city && filters.city !== 'all') params.append('city', filters.city);
    if (filters?.education) params.append('education', filters.education);
    if (filters?.occupation) params.append('occupation', filters.occupation);

    const res = await fetch(`${API_BASE}/profiles?${params.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return (await res.json()) as CandidateProfile[];
  },

  async getProfileById(id: number | string) {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile details');
    return (await res.json()) as CandidateProfile;
  },

  async updateProfile(id: number | string, data: Partial<CandidateProfile>) {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update profile');
    return result;
  },

  async getCities() {
    const res = await fetch(`${API_BASE}/profiles/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return await res.json();
  },

  // Interests
  async sendInterest(receiver_id: number) {
    const res = await fetch(`${API_BASE}/interests`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ receiver_id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send interest');
    return data;
  },

  async getSentInterests() {
    const res = await fetch(`${API_BASE}/interests/sent`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch sent interests');
    return (await res.json()) as InterestItem[];
  },

  async getReceivedInterests() {
    const res = await fetch(`${API_BASE}/interests/received`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch received interests');
    return (await res.json()) as InterestItem[];
  },

  async updateInterestStatus(id: number, status: 'accepted' | 'rejected') {
    const res = await fetch(`${API_BASE}/interests/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update interest status');
    return data;
  },

  // Messages
  async getConversations() {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return (await res.json()) as ConversationItem[];
  },

  async getThread(partnerId: number) {
    const res = await fetch(`${API_BASE}/messages/${partnerId}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch message thread');
    return (await res.json()) as MessageItem[];
  },

  async sendMessage(receiver_id: number, message: string) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ receiver_id, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return (await res.json()) as AdminStats;
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch users list');
    return (await res.json()) as AdminUserItem[];
  },

  async deleteUser(id: number) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  },

  // DB Reset
  async resetDatabase() {
    const res = await fetch(`${API_BASE}/db/reset`, {
      method: 'POST',
    });
    return await res.json();
  },
};
