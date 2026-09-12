import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Table, 
  FileText, 
  HardDrive, 
  Layers,
  Sparkles
} from 'lucide-react';
import { DatabaseStatusInfo, getDatabaseStatus, resetDatabase } from '../db/matrimonialDb';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDbReset?: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onDbReset,
}) => {
  const [dbInfo, setDbInfo] = useState<DatabaseStatusInfo | null>(null);
  const [activeTableTab, setActiveTableTab] = useState<'overview' | 'schema'>('overview');
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const info = await getDatabaseStatus();
      setDbInfo(info);
    } catch (e) {
      console.warn('Failed to load DB stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      id="db-status-modal"
      data-testid="db-status-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">SQLite Relational Database</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active &amp; Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">File-backed persistent storage: <code className="text-rose-300">matrimonial.db</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-db-status-btn"
              data-testid="refresh-db-status-btn"
              onClick={fetchStatus}
              title="Refresh database statistics"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="close-db-modal-btn"
              data-testid="close-db-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <button
            onClick={() => setActiveTableTab('overview')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTableTab === 'overview'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Tables &amp; Live Record Counts
          </button>
          <button
            onClick={() => setActiveTableTab('schema')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTableTab === 'schema'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Database Schema (SQL DDL)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTableTab === 'overview' ? (
            <div className="space-y-5">
              
              {/* Metric stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div className="text-[11px] font-semibold text-rose-700">Accounts</div>
                  <div data-testid="db-stat-accounts" className="text-2xl font-black text-rose-900 mt-1">
                    {dbInfo?.counts.accounts ?? '–'}
                  </div>
                  <div className="text-[10px] text-rose-600/80 mt-0.5">Registered candidates</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
                  <div className="text-[11px] font-semibold text-pink-700">Photos Table</div>
                  <div data-testid="db-stat-photos" className="text-2xl font-black text-pink-900 mt-1">
                    {dbInfo?.counts.photos ?? '–'}
                  </div>
                  <div className="text-[10px] text-pink-600/80 mt-0.5">Max 10 / candidate</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="text-[11px] font-semibold text-blue-700">Directory Profiles</div>
                  <div data-testid="db-stat-profiles" className="text-2xl font-black text-blue-900 mt-1">
                    {dbInfo?.counts.profiles ?? '–'}
                  </div>
                  <div className="text-[10px] text-blue-600/80 mt-0.5">Searchable matches</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="text-[11px] font-semibold text-amber-700">Interests</div>
                  <div data-testid="db-stat-interests" className="text-2xl font-black text-amber-900 mt-1">
                    {dbInfo?.counts.interests ?? '–'}
                  </div>
                  <div className="text-[10px] text-amber-600/80 mt-0.5">Inbound requests</div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span>Physical Storage &amp; Engine Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-gray-400 font-medium">Engine: </span>
                    <span className="font-mono text-gray-800">Node 22 native node:sqlite (DatabaseSync)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Database File: </span>
                    <span className="font-mono text-gray-800">matrimonial.db</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Journal Mode: </span>
                    <span className="font-mono text-gray-800">WAL (Write-Ahead Logging)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Foreign Key Constraints: </span>
                    <span className="font-mono text-emerald-700 font-semibold">ON (CASCADE enabled)</span>
                  </div>
                </div>
              </div>

              {/* Reset action callout */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-900">Reset to Pristine Seed Fixtures</div>
                  <p className="text-[11px] text-amber-700">
                    Wipes candidate accounts, repopulates initial demo candidate and 10 verified test photos.
                  </p>
                </div>
                <button
                  id="modal-reset-db-btn"
                  data-testid="modal-reset-db-btn"
                  onClick={async () => {
                    await resetDatabase();
                    await fetchStatus();
                    if (onDbReset) onDbReset();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shrink-0 transition-colors"
                >
                  Reset Database
                </button>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-200 overflow-x-auto space-y-4">
                <div>
                  <span className="text-rose-400 font-bold">-- 1. Candidate Accounts Table</span>
                  <pre className="text-slate-300 mt-1">{`CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT,
  city TEXT,
  bio TEXT,
  phone TEXT,
  occupation TEXT,
  created_at TEXT NOT NULL
);`}</pre>
                </div>

                <div>
                  <span className="text-rose-400 font-bold">-- 2. Photos Table (Up to 10 photos per candidate)</span>
                  <pre className="text-slate-300 mt-1">{`CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  url TEXT NOT NULL,
  is_primary INTEGER DEFAULT 0,
  caption TEXT,
  uploaded_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);`}</pre>
                </div>

                <div>
                  <span className="text-rose-400 font-bold">-- 3. Profiles Table (Searchable directory)</span>
                  <pre className="text-slate-300 mt-1">{`CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  religion TEXT,
  mother_tongue TEXT,
  marital_status TEXT,
  city TEXT,
  state TEXT,
  occupation TEXT,
  education TEXT,
  annual_income TEXT,
  bio TEXT,
  verified INTEGER DEFAULT 0,
  is_shortlisted INTEGER DEFAULT 0,
  interest_status TEXT DEFAULT 'none',
  avatar_url TEXT,
  joined_date TEXT
);`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for Playwright test assertions via REST API and UI selectors</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
