import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'matrimonial.db');

export interface DbAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  gender: 'Bride' | 'Groom';
  dateOfBirth: string;
  city: string;
  bio: string;
  phone?: string;
  occupation?: string;
  createdAt: string;
  photos?: DbPhoto[];
}

export interface DbPhoto {
  id: string;
  accountId: string;
  url: string;
  isPrimary: boolean;
  caption?: string;
  uploadedAt: string;
}

export interface DbProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Bride' | 'Groom';
  religion: string;
  motherTongue: string;
  maritalStatus: string;
  city: string;
  state: string;
  occupation: string;
  education: string;
  annualIncome: string;
  bio: string;
  verified: boolean;
  isShortlisted: boolean;
  interestStatus: 'none' | 'pending' | 'accepted' | 'declined';
  avatarUrl: string;
  joinedDate: string;
}

export interface DbInterestRequest {
  id: string;
  senderName: string;
  senderAge: number;
  senderCity: string;
  senderOccupation: string;
  senderAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    initTables(dbInstance);
    seedInitialDataIfEmpty(dbInstance);
  }
  return dbInstance;
}

function initTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
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
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      caption TEXT,
      uploaded_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS profiles (
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
    );

    CREATE TABLE IF NOT EXISTS interest_requests (
      id TEXT PRIMARY KEY,
      sender_name TEXT NOT NULL,
      sender_age INTEGER,
      sender_city TEXT,
      sender_occupation TEXT,
      sender_avatar TEXT,
      status TEXT DEFAULT 'pending',
      sent_at TEXT NOT NULL
    );
  `);
}

const SEED_PHOTOS = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    caption: 'Primary portrait',
    isPrimary: true,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    caption: 'Traditional festive attire',
    isPrimary: false,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    caption: 'Outdoor casual click',
    isPrimary: false,
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    caption: 'Graduation celebration',
    isPrimary: false,
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    caption: 'Professional office headshot',
    isPrimary: false,
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
    caption: 'Family wedding event',
    isPrimary: false,
  },
  {
    id: 'photo-7',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    caption: 'Weekend hiking trip',
    isPrimary: false,
  },
  {
    id: 'photo-8',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
    caption: 'Cafe candid snapshot',
    isPrimary: false,
  },
  {
    id: 'photo-9',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    caption: 'Conference keynote',
    isPrimary: false,
  },
  {
    id: 'photo-10',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    caption: 'Evening cultural festival',
    isPrimary: false,
  },
];

const SEED_PROFILES = [
  {
    id: 'profile-1',
    name: 'Ananya Sharma',
    age: 26,
    gender: 'Bride',
    religion: 'Hindu',
    motherTongue: 'Hindi',
    maritalStatus: 'Never Married',
    city: 'Mumbai',
    state: 'Maharashtra',
    occupation: 'Lead Product Designer',
    education: 'M.Des - IDC School of Design, IIT Bombay',
    annualIncome: '₹28 - 32 Lakhs',
    bio: 'Passionate designer, Hindustani classical vocalist, and avid weekend trekker. Believes in mutual respect and growth.',
    verified: 1,
    isShortlisted: 1,
    interestStatus: 'pending',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-01-15',
  },
  {
    id: 'profile-2',
    name: 'Rohan Verma',
    age: 29,
    gender: 'Groom',
    religion: 'Hindu',
    motherTongue: 'Hindi',
    maritalStatus: 'Never Married',
    city: 'Bengaluru',
    state: 'Karnataka',
    occupation: 'Staff Software Architect',
    education: 'B.Tech Computer Science, BITS Pilani',
    annualIncome: '₹42 - 50 Lakhs',
    bio: 'Tech enthusiast, marathon runner, and aspiring home chef. Seeking an intellectually curious life partner.',
    verified: 1,
    isShortlisted: 0,
    interestStatus: 'none',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-02-01',
  },
  {
    id: 'profile-3',
    name: 'Priyanka Sen',
    age: 27,
    gender: 'Bride',
    religion: 'Hindu',
    motherTongue: 'Bengali',
    maritalStatus: 'Never Married',
    city: 'Kolkata',
    state: 'West Bengal',
    occupation: 'Assistant Professor (Economics)',
    education: 'Ph.D. in Economics, Jadavpur University',
    annualIncome: '₹18 - 22 Lakhs',
    bio: 'Academic researcher who loves Rabindra Sangeet, indie literature, and historical architecture.',
    verified: 1,
    isShortlisted: 0,
    interestStatus: 'none',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-01-28',
  },
  {
    id: 'profile-4',
    name: 'Vikramaditya Rao',
    age: 31,
    gender: 'Groom',
    religion: 'Hindu',
    motherTongue: 'Telugu',
    maritalStatus: 'Never Married',
    city: 'Hyderabad',
    state: 'Telangana',
    occupation: 'Investment Director',
    education: 'MBA Finance, IIM Ahmedabad',
    annualIncome: '₹65 - 75 Lakhs',
    bio: 'Financier with an entrepreneurial mindset. Enjoys tennis, espresso brewing, and wildlife photography.',
    verified: 1,
    isShortlisted: 0,
    interestStatus: 'none',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-02-10',
  },
  {
    id: 'profile-5',
    name: 'Dr. Meera Nambiar',
    age: 28,
    gender: 'Bride',
    religion: 'Hindu',
    motherTongue: 'Malayalam',
    maritalStatus: 'Never Married',
    city: 'Kochi',
    state: 'Kerala',
    occupation: 'Dermatologist & Clinical Researcher',
    education: 'MD Dermatology, AIIMS New Delhi',
    annualIncome: '₹30 - 35 Lakhs',
    bio: 'Doctor dedicated to patient wellness. Bharatanatyam dancer, yoga enthusiast, and coastal cuisine lover.',
    verified: 1,
    isShortlisted: 0,
    interestStatus: 'none',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-02-14',
  },
  {
    id: 'profile-6',
    name: 'Kabir Singh Gill',
    age: 30,
    gender: 'Groom',
    religion: 'Sikh',
    motherTongue: 'Punjabi',
    maritalStatus: 'Never Married',
    city: 'Chandigarh',
    state: 'Punjab',
    occupation: 'Civil Aviation Commander (Pilot)',
    education: 'Commercial Pilot License, CAE Oxford',
    annualIncome: '₹55 - 60 Lakhs',
    bio: 'Commercial pilot who loves travelling the skies, vintage motorcycles, and farming on ancestral lands.',
    verified: 1,
    isShortlisted: 0,
    interestStatus: 'none',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800',
    joinedDate: '2025-01-20',
  },
];

const SEED_INTERESTS = [
  {
    id: 'req-1',
    senderName: 'Siddharth Deshmukh',
    senderAge: 30,
    senderCity: 'Pune',
    senderOccupation: 'VP of Product',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    sentAt: '2 hours ago',
  },
  {
    id: 'req-2',
    senderName: 'Aditya Mathur',
    senderAge: 32,
    senderCity: 'Jaipur',
    senderOccupation: 'Senior Architect',
    senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    sentAt: '1 day ago',
  },
];

function seedInitialDataIfEmpty(db: DatabaseSync) {
  const accountCount = (db.prepare('SELECT COUNT(*) as count FROM accounts').get() as { count: number }).count;
  if (accountCount === 0) {
    // Insert demo account
    const insertAccount = db.prepare(`
      INSERT INTO accounts (id, email, password, full_name, gender, date_of_birth, city, bio, phone, occupation, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAccount.run(
      'demo-account-1',
      'ananya@example.com',
      'password123',
      'Ananya Sharma',
      'Bride',
      '1999-04-18',
      'Mumbai',
      'Product designer in Mumbai passionate about art, UI/UX, Hindustani classical music, and outdoor trekking. Looking for a partner with shared cultural values and modern outlook.',
      '+91 98765 43210',
      'Lead Product Designer',
      new Date().toISOString()
    );

    // Insert 10 photos for demo account
    const insertPhoto = db.prepare(`
      INSERT INTO photos (id, account_id, url, is_primary, caption, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const p of SEED_PHOTOS) {
      insertPhoto.run(
        p.id,
        'demo-account-1',
        p.url,
        p.isPrimary ? 1 : 0,
        p.caption,
        new Date().toISOString()
      );
    }
  }

  const profileCount = (db.prepare('SELECT COUNT(*) as count FROM profiles').get() as { count: number }).count;
  if (profileCount === 0) {
    const insertProfile = db.prepare(`
      INSERT INTO profiles (id, name, age, gender, religion, mother_tongue, marital_status, city, state, occupation, education, annual_income, bio, verified, is_shortlisted, interest_status, avatar_url, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of SEED_PROFILES) {
      insertProfile.run(
        p.id,
        p.name,
        p.age,
        p.gender,
        p.religion,
        p.motherTongue,
        p.maritalStatus,
        p.city,
        p.state,
        p.occupation,
        p.education,
        p.annualIncome,
        p.bio,
        p.verified,
        p.isShortlisted,
        p.interestStatus,
        p.avatarUrl,
        p.joinedDate
      );
    }
  }

  const interestCount = (db.prepare('SELECT COUNT(*) as count FROM interest_requests').get() as { count: number }).count;
  if (interestCount === 0) {
    const insertInterest = db.prepare(`
      INSERT INTO interest_requests (id, sender_name, sender_age, sender_city, sender_occupation, sender_avatar, status, sent_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of SEED_INTERESTS) {
      insertInterest.run(
        r.id,
        r.senderName,
        r.senderAge,
        r.senderCity,
        r.senderOccupation,
        r.senderAvatar,
        r.status,
        r.sentAt
      );
    }
  }
}

// Database query helpers
export const dbQueries = {
  getDbInfo() {
    const db = getDatabase();
    const accountCount = (db.prepare('SELECT COUNT(*) as count FROM accounts').get() as any).count;
    const photoCount = (db.prepare('SELECT COUNT(*) as count FROM photos').get() as any).count;
    const profileCount = (db.prepare('SELECT COUNT(*) as count FROM profiles').get() as any).count;
    const interestCount = (db.prepare('SELECT COUNT(*) as count FROM interest_requests').get() as any).count;

    let fileSize = 0;
    try {
      const stat = fs.statSync(DB_FILE);
      fileSize = stat.size;
    } catch {
      fileSize = 0;
    }

    return {
      engine: 'SQLite (Native node:sqlite DatabaseSync)',
      filePath: 'matrimonial.db',
      fileSizeBytes: fileSize,
      tables: ['accounts', 'photos', 'profiles', 'interest_requests'],
      counts: {
        accounts: accountCount,
        photos: photoCount,
        profiles: profileCount,
        interests: interestCount,
      },
      status: 'healthy',
    };
  },

  resetDatabase() {
    const db = getDatabase();
    db.exec(`
      DELETE FROM photos;
      DELETE FROM accounts;
      DELETE FROM profiles;
      DELETE FROM interest_requests;
    `);
    seedInitialDataIfEmpty(db);
    return this.getDbInfo();
  },

  // Account queries
  findAccountByEmail(email: string): DbAccount | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM accounts WHERE LOWER(email) = LOWER(?)').get(email) as any;
    if (!row) return null;
    const photos = this.getPhotosForAccount(row.id);
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      fullName: row.full_name,
      gender: row.gender,
      dateOfBirth: row.date_of_birth,
      city: row.city,
      bio: row.bio,
      phone: row.phone,
      occupation: row.occupation,
      createdAt: row.created_at,
      photos,
    };
  },

  findAccountById(id: string): DbAccount | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id) as any;
    if (!row) return null;
    const photos = this.getPhotosForAccount(row.id);
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      fullName: row.full_name,
      gender: row.gender,
      dateOfBirth: row.date_of_birth,
      city: row.city,
      bio: row.bio,
      phone: row.phone,
      occupation: row.occupation,
      createdAt: row.created_at,
      photos,
    };
  },

  getPhotosForAccount(accountId: string): DbPhoto[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM photos WHERE account_id = ? ORDER BY is_primary DESC, uploaded_at ASC').all(accountId) as any[];
    return rows.map((r) => ({
      id: r.id,
      accountId: r.account_id,
      url: r.url,
      isPrimary: Boolean(r.is_primary),
      caption: r.caption,
      uploadedAt: r.uploaded_at,
    }));
  },

  createAccount(account: Omit<DbAccount, 'createdAt'>, photos: Array<{ id: string; url: string; isPrimary: boolean; caption?: string }>): DbAccount {
    const db = getDatabase();
    const createdAt = new Date().toISOString();

    const insertAcc = db.prepare(`
      INSERT INTO accounts (id, email, password, full_name, gender, date_of_birth, city, bio, phone, occupation, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAcc.run(
      account.id,
      account.email,
      account.password,
      account.fullName,
      account.gender,
      account.dateOfBirth || '',
      account.city || '',
      account.bio || '',
      account.phone || '',
      account.occupation || '',
      createdAt
    );

    const insertPhoto = db.prepare(`
      INSERT INTO photos (id, account_id, url, is_primary, caption, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Max 10 photos
    const photosToInsert = photos.slice(0, 10);
    for (let i = 0; i < photosToInsert.length; i++) {
      const p = photosToInsert[i];
      insertPhoto.run(
        p.id,
        account.id,
        p.url,
        p.isPrimary || (i === 0 && !photosToInsert.some(x => x.isPrimary)) ? 1 : 0,
        p.caption || `Photo ${i + 1}`,
        new Date().toISOString()
      );
    }

    return this.findAccountById(account.id)!;
  },

  updateAccount(id: string, updates: Partial<DbAccount>): DbAccount | null {
    const db = getDatabase();
    const existing = this.findAccountById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };

    db.prepare(`
      UPDATE accounts
      SET full_name = ?, gender = ?, date_of_birth = ?, city = ?, bio = ?, phone = ?, occupation = ?
      WHERE id = ?
    `).run(
      updated.fullName,
      updated.gender,
      updated.dateOfBirth,
      updated.city,
      updated.bio,
      updated.phone || '',
      updated.occupation || '',
      id
    );

    return this.findAccountById(id);
  },

  addPhotoToAccount(accountId: string, photo: { id: string; url: string; isPrimary?: boolean; caption?: string }): DbPhoto {
    const db = getDatabase();
    const currentCount = (db.prepare('SELECT COUNT(*) as count FROM photos WHERE account_id = ?').get(accountId) as any).count;
    if (currentCount >= 10) {
      throw new Error('Database photo limit reached: Maximum 10 photos per candidate account.');
    }

    if (photo.isPrimary || currentCount === 0) {
      db.prepare('UPDATE photos SET is_primary = 0 WHERE account_id = ?').run(accountId);
    }

    const isPrimaryVal = (photo.isPrimary || currentCount === 0) ? 1 : 0;
    const uploadedAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO photos (id, account_id, url, is_primary, caption, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(photo.id, accountId, photo.url, isPrimaryVal, photo.caption || '', uploadedAt);

    return {
      id: photo.id,
      accountId,
      url: photo.url,
      isPrimary: Boolean(isPrimaryVal),
      caption: photo.caption,
      uploadedAt,
    };
  },

  deletePhoto(accountId: string, photoId: string): boolean {
    const db = getDatabase();
    const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND account_id = ?').get(photoId, accountId) as any;
    if (!photo) return false;

    db.prepare('DELETE FROM photos WHERE id = ? AND account_id = ?').run(photoId, accountId);

    // If deleted photo was primary, make the first remaining photo primary
    if (photo.is_primary) {
      const remaining = db.prepare('SELECT id FROM photos WHERE account_id = ? ORDER BY uploaded_at ASC LIMIT 1').get(accountId) as any;
      if (remaining) {
        db.prepare('UPDATE photos SET is_primary = 1 WHERE id = ?').run(remaining.id);
      }
    }

    return true;
  },

  setPrimaryPhoto(accountId: string, photoId: string): boolean {
    const db = getDatabase();
    db.prepare('UPDATE photos SET is_primary = 0 WHERE account_id = ?').run(accountId);
    const res = db.prepare('UPDATE photos SET is_primary = 1 WHERE id = ? AND account_id = ?').run(photoId, accountId);
    return res.changes > 0;
  },

  // Profiles (candidate directory)
  getAllProfiles(): DbProfile[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM profiles ORDER BY joined_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      age: r.age,
      gender: r.gender,
      religion: r.religion,
      motherTongue: r.mother_tongue,
      maritalStatus: r.marital_status,
      city: r.city,
      state: r.state,
      occupation: r.occupation,
      education: r.education,
      annualIncome: r.annual_income,
      bio: r.bio,
      verified: Boolean(r.verified),
      isShortlisted: Boolean(r.is_shortlisted),
      interestStatus: r.interest_status,
      avatarUrl: r.avatar_url,
      joinedDate: r.joined_date,
    }));
  },

  toggleProfileShortlist(id: string): boolean {
    const db = getDatabase();
    const profile = db.prepare('SELECT is_shortlisted FROM profiles WHERE id = ?').get(id) as any;
    if (!profile) return false;
    const nextVal = profile.is_shortlisted ? 0 : 1;
    db.prepare('UPDATE profiles SET is_shortlisted = ? WHERE id = ?').run(nextVal, id);
    return Boolean(nextVal);
  },

  setProfileInterestStatus(id: string, status: string): boolean {
    const db = getDatabase();
    const res = db.prepare('UPDATE profiles SET interest_status = ? WHERE id = ?').run(status, id);
    return res.changes > 0;
  },

  // Interest requests
  getInterestRequests(): DbInterestRequest[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM interest_requests ORDER BY id DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      senderName: r.sender_name,
      senderAge: r.sender_age,
      senderCity: r.sender_city,
      senderOccupation: r.sender_occupation,
      senderAvatar: r.sender_avatar,
      status: r.status,
      sentAt: r.sent_at,
    }));
  },

  updateInterestStatus(id: string, status: 'accepted' | 'declined'): boolean {
    const db = getDatabase();
    const res = db.prepare('UPDATE interest_requests SET status = ? WHERE id = ?').run(status, id);
    return res.changes > 0;
  },
};
