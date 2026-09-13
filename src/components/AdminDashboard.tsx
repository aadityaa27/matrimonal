import React, { useState, useEffect } from 'react';
import { Shield, Users, Heart, MessageSquare, Trash2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { AdminStats, AdminUserItem } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
      ]);
      setStats(s);
      setUsers(u);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Are you sure you want to delete user #${userId}?`)) {
      return;
    }
    try {
      await api.deleteUser(userId);
      setActionMessage(`User #${userId} deleted successfully.`);
      setTimeout(() => setActionMessage(null), 3000);
      await fetchAdminData();
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5" />
            Super Administrator Control
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Bandhan Administration Portal</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor real-time system metrics, manage registered candidates, and oversee matrimonial activity
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdminData}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium">
          {actionMessage}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
          <p
            id="stat-total-users"
            data-testid="stat-total-users"
            className="text-2xl sm:text-3xl font-bold text-gray-900"
          >
            {stats ? stats.totalUsers : '--'}
          </p>
          <p className="text-[10px] text-gray-400">Registered accounts</p>
        </div>

        {/* Male Grooms */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Male Profiles</p>
          <p
            id="stat-male-users"
            data-testid="stat-male-users"
            className="text-2xl sm:text-3xl font-bold text-blue-600"
          >
            {stats ? stats.maleUsers : '--'}
          </p>
          <p className="text-[10px] text-gray-400">Grooms listed</p>
        </div>

        {/* Female Brides */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Female Profiles</p>
          <p
            id="stat-female-users"
            data-testid="stat-female-users"
            className="text-2xl sm:text-3xl font-bold text-rose-600"
          >
            {stats ? stats.femaleUsers : '--'}
          </p>
          <p className="text-[10px] text-gray-400">Brides listed</p>
        </div>

        {/* Pending Interests */}
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs space-y-1 bg-amber-50/20">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Interests</p>
          <p
            id="stat-pending-interests"
            data-testid="stat-pending-interests"
            className="text-2xl sm:text-3xl font-bold text-amber-600"
          >
            {stats ? stats.pendingInterests : '--'}
          </p>
          <p className="text-[10px] text-amber-700/80">Pending connections</p>
        </div>

        {/* Total Messages */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Messages</p>
          <p
            id="stat-total-messages"
            data-testid="stat-total-messages"
            className="text-2xl sm:text-3xl font-bold text-emerald-600"
          >
            {stats ? stats.totalMessages : '--'}
          </p>
          <p className="text-[10px] text-gray-400">Chats exchanged</p>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Registered Candidate Directory</h2>
            <p className="text-xs text-gray-500">Manage user profiles, accounts, and system access</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {users.length} Users Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-600 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">User / Profile</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Gender / Age</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr
                  key={u.id}
                  id={`admin-user-${u.id}`}
                  data-testid="admin-user-row"
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                        alt={u.full_name || u.email}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{u.full_name || 'No Profile'}</p>
                        <p className="text-[10px] text-gray-400">{u.occupation || 'N/A'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-gray-600 font-mono text-[11px]">{u.email}</td>

                  <td className="px-4 py-3.5 capitalize text-gray-700">
                    {u.gender || '-'} {u.age ? `(${u.age} yrs)` : ''}
                  </td>

                  <td className="px-4 py-3.5 text-gray-600">{u.city || '-'}</td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    {u.role !== 'admin' && (
                      <button
                        id={`delete-user-btn-${u.id}`}
                        data-testid="admin-delete-user-btn"
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
