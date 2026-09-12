export type Gender = 'all' | 'male' | 'female' | 'other';

export interface PartnerPreference {
  ageRange: [number, number];
  heightRange?: string;
  religion: string[];
  education: string[];
  location?: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  dob: string;
  height: string;
  religion: string;
  motherTongue: string;
  community: string;
  horoscope?: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  education: string;
  occupation: string;
  company: string;
  annualIncome: string;
  city: string;
  state: string;
  country: string;
  photoUrl: string;
  bio: string;
  hobbies: string[];
  verified: boolean;
  isShortlisted: boolean;
  interestStatus: 'none' | 'pending' | 'accepted' | 'declined';
  phone: string;
  email: string;
  joinedDate: string;
  viewsCount?: number;
  privacyPhone?: 'public' | 'matches_only' | 'hidden';
  preferences: PartnerPreference;
}

export interface InterestRequest {
  id: string;
  senderProfileId: string;
  senderName: string;
  senderAge: number;
  senderOccupation: string;
  senderCity: string;
  senderPhoto: string;
  message: string;
  sentDate: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FilterState {
  search: string;
  gender: Gender;
  religion: string;
  motherTongue: string;
  maritalStatus: string;
  minAge: number;
  maxAge: number;
  verifiedOnly: boolean;
  sortBy: 'relevance' | 'newest' | 'age-asc' | 'age-desc' | 'name-asc';
  viewMode: 'grid' | 'table';
}

export interface RegistrationFormData {
  fullName: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  height: string;
  religion: string;
  motherTongue: string;
  maritalStatus: string;
  education: string;
  occupation: string;
  annualIncome: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  agreeToTerms: boolean;
}

export interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  age: number;
  city: string;
  bio: string;
  phone?: string;
  occupation?: string;
  photos: UploadedPhoto[];
  joinedDate: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}
