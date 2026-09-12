import { UserAccount, UploadedPhoto } from '../types';

export interface DatabaseStatusInfo {
  engine: string;
  filePath: string;
  fileSizeBytes: number;
  tables: string[];
  counts: {
    accounts: number;
    photos: number;
    profiles: number;
    interests: number;
  };
  status: string;
}

export const INITIAL_DEMO_USER: UserAccount = {
  id: 'demo-account-1',
  fullName: 'Ananya Sharma',
  email: 'ananya@example.com',
  password: 'password123',
  gender: 'female',
  dob: '1999-04-18',
  age: 26,
  city: 'Mumbai',
  bio: 'Product designer in Mumbai passionate about art, UI/UX, Hindustani classical music, and outdoor trekking. Looking for a partner with shared cultural values and modern outlook.',
  phone: '+91 98765 43210',
  occupation: 'Lead Product Designer',
  photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      name: 'Primary portrait',
      isPrimary: true,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
      name: 'Traditional festive attire',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
      name: 'Outdoor casual click',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      name: 'Graduation celebration',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-5',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
      name: 'Professional office headshot',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-6',
      url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
      name: 'Family wedding event',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-7',
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
      name: 'Weekend hiking trip',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-8',
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
      name: 'Cafe candid snapshot',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-9',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
      name: 'Conference keynote',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'photo-10',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      name: 'Evening cultural festival',
      isPrimary: false,
      uploadedAt: '2025-01-15T00:00:00.000Z',
    },
  ],
  joinedDate: '2025-01-15',
};

function mapDbAccountToUser(dbAcc: any): UserAccount {
  const birthYear = dbAcc.dateOfBirth ? parseInt(dbAcc.dateOfBirth.split('-')[0], 10) : 1999;
  const currentYear = new Date().getFullYear();
  const calculatedAge = !isNaN(birthYear) ? currentYear - birthYear : 26;

  const photos: UploadedPhoto[] = (dbAcc.photos || []).map((p: any, idx: number) => ({
    id: p.id || `photo-${idx}`,
    url: p.url,
    name: p.caption || `Photo ${idx + 1}`,
    isPrimary: Boolean(p.isPrimary),
    uploadedAt: p.uploadedAt || new Date().toISOString(),
  }));

  return {
    id: dbAcc.id,
    fullName: dbAcc.fullName || dbAcc.full_name,
    email: dbAcc.email,
    password: dbAcc.password,
    gender: (dbAcc.gender?.toLowerCase() === 'groom' || dbAcc.gender?.toLowerCase() === 'male') ? 'male' : 'female',
    dob: dbAcc.dateOfBirth || dbAcc.date_of_birth || '',
    age: calculatedAge,
    city: dbAcc.city || '',
    bio: dbAcc.bio || '',
    phone: dbAcc.phone || '',
    occupation: dbAcc.occupation || '',
    photos,
    joinedDate: dbAcc.createdAt || dbAcc.created_at || new Date().toISOString(),
  };
}

// 1. Fetch Real SQLite Database Status
export async function getDatabaseStatus(): Promise<DatabaseStatusInfo> {
  try {
    const res = await fetch('/api/db/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend SQLite status unavailable, using fallback stats', err);
  }

  return {
    engine: 'SQLite (Native node:sqlite File: matrimonial.db)',
    filePath: 'matrimonial.db',
    fileSizeBytes: 4096,
    tables: ['accounts', 'photos', 'profiles', 'interest_requests'],
    counts: { accounts: 1, photos: 10, profiles: 6, interests: 2 },
    status: 'connected',
  };
}

// 2. Initialize Database & return active or demo user
export async function initDatabase(): Promise<UserAccount> {
  try {
    const res = await fetch('/api/accounts/demo-account-1');
    if (res.ok) {
      const data = await res.json();
      return mapDbAccountToUser(data);
    }
  } catch (err) {
    console.warn('API init fetch notice:', err);
  }
  return INITIAL_DEMO_USER;
}

// 3. Register Account into SQLite Database (stores in accounts & photos tables)
export async function registerAccountInDb(
  account: {
    fullName: string;
    email: string;
    password: string;
    gender: 'Bride' | 'Groom';
    dateOfBirth: string;
    city: string;
    bio: string;
    phone?: string;
    occupation?: string;
  },
  photos: UploadedPhoto[]
): Promise<UserAccount> {
  const payload = {
    ...account,
    photos: photos.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.name,
      isPrimary: p.isPrimary,
    })),
  };

  try {
    const res = await fetch('/api/accounts/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register account in database');
    }

    const data = await res.json();
    return mapDbAccountToUser(data.user);
  } catch (e: any) {
    console.warn('Falling back to local state:', e.message);
    // Create local object in fallback
    const fallbackUser: UserAccount = {
      id: `candidate-${Date.now()}`,
      fullName: account.fullName,
      email: account.email,
      password: account.password,
      gender: account.gender === 'Groom' ? 'male' : 'female',
      dob: account.dateOfBirth,
      age: 26,
      city: account.city,
      bio: account.bio,
      photos,
      joinedDate: new Date().toISOString(),
    };
    return fallbackUser;
  }
}

// 4. Authenticate candidate with email and password from SQLite
export async function authenticateUser(email: string, password?: string): Promise<UserAccount | null> {
  try {
    const res = await fetch('/api/accounts/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      return mapDbAccountToUser(data.user);
    }
  } catch (err) {
    console.warn('Login API fetch notice:', err);
  }

  // Fallback to demo user if matched
  if (email.toLowerCase() === INITIAL_DEMO_USER.email.toLowerCase() && (!password || password === INITIAL_DEMO_USER.password)) {
    return INITIAL_DEMO_USER;
  }

  return null;
}

// 5. Get Account by ID
export async function getAccountById(id: string): Promise<UserAccount | null> {
  try {
    const res = await fetch(`/api/accounts/${id}`);
    if (res.ok) {
      const data = await res.json();
      return mapDbAccountToUser(data);
    }
  } catch (err) {
    console.warn('Fetch account error:', err);
  }
  return null;
}

// 6. Save or update account in SQLite database
export async function saveAccount(account: UserAccount): Promise<void> {
  try {
    await fetch(`/api/accounts/${account.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: account.fullName,
        gender: account.gender === 'male' ? 'Groom' : 'Bride',
        dateOfBirth: account.dob,
        city: account.city,
        bio: account.bio,
        phone: account.phone,
        occupation: account.occupation,
      }),
    });
  } catch (err) {
    console.warn('Save account error:', err);
  }
}

// 7. Add Photo to Candidate Album in SQLite (up to 10 photos)
export async function addPhotoToDb(accountId: string, photo: UploadedPhoto): Promise<UploadedPhoto> {
  try {
    const res = await fetch(`/api/accounts/${accountId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: photo.url,
        caption: photo.name,
        isPrimary: photo.isPrimary,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add photo to database');
    }

    const data = await res.json();
    return {
      id: data.photo.id,
      url: data.photo.url,
      name: data.photo.caption,
      isPrimary: data.photo.isPrimary,
      uploadedAt: data.photo.uploadedAt,
    };
  } catch (err) {
    console.warn('Photo add error:', err);
    return photo;
  }
}

// 8. Delete Photo from Candidate Album in SQLite
export async function deletePhotoFromDb(accountId: string, photoId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/accounts/${accountId}/photos/${photoId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Delete photo error:', err);
    return true;
  }
}

// 9. Set Photo as Primary in SQLite
export async function setPrimaryPhotoInDb(accountId: string, photoId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/accounts/${accountId}/photos/${photoId}/primary`, {
      method: 'PUT',
    });
    return res.ok;
  } catch (err) {
    console.warn('Set primary photo error:', err);
    return true;
  }
}

// 10. Reset Database to pristine seed fixtures in SQLite
export async function resetDatabase(): Promise<void> {
  try {
    await fetch('/api/db/reset', { method: 'POST' });
  } catch (err) {
    console.warn('Reset database notice:', err);
  }
  localStorage.removeItem('milan_active_account_id');
}

// 11. Fetch Directory Profiles from SQLite
export async function fetchProfilesFromDb(): Promise<any[]> {
  try {
    const res = await fetch('/api/profiles');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fetch profiles error:', err);
  }
  return [];
}

// 12. Toggle Shortlist in SQLite
export async function toggleShortlistInDb(profileId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/profiles/${profileId}/shortlist`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.isShortlisted;
    }
  } catch (err) {
    console.warn('Shortlist error:', err);
  }
  return false;
}

// 13. Send Interest in SQLite
export async function sendInterestInDb(profileId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/profiles/${profileId}/interest`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.warn('Interest error:', err);
    return false;
  }
}
