export type Gender = 'all' | 'male' | 'female' | 'other';

export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface CandidateProfile {
  id: number;
  user_id: number;
  full_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  age?: number;
  city: string;
  state: string;
  occupation?: string;
  education?: string;
  height?: string;
  religion?: string;
  annual_income?: string;
  about?: string;
  photo_url?: string;
  interestStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
  interestDirection?: 'sent' | 'received';
  interestId?: number;
  isSelf?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InterestItem {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  age?: number;
  city: string;
  occupation?: string;
  photo_url?: string;
  education?: string;
  created_at: string;
}

export interface MessageItem {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  sender_name?: string;
  sender_photo?: string;
}

export interface ConversationItem {
  partnerId: number;
  name: string;
  photo_url?: string;
  city?: string;
  occupation?: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  interestStatus?: string;
}

export interface AdminStats {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  pendingInterests: number;
  totalMessages: number;
}

export interface AdminUserItem {
  id: number;
  email: string;
  role: string;
  created_at: string;
  full_name?: string;
  gender?: string;
  city?: string;
  occupation?: string;
  photo_url?: string;
  age?: number;
}

export interface SearchFilterState {
  gender: 'all' | 'female' | 'male';
  minAge: number | '';
  maxAge: number | '';
  city: string;
  education: string;
  occupation: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

// Backward-compatible type aliases for legacy components
export type Profile = {
  id?: number | string;
  user_id?: number | string;
  full_name?: string;
  name?: string;
  gender?: any;
  date_of_birth?: string;
  age?: number;
  city?: string;
  state?: string;
  occupation?: string;
  education?: string;
  height?: string;
  religion?: string;
  annual_income?: string;
  about?: string;
  photo_url?: string;
  interestStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
  interestDirection?: 'sent' | 'received';
  interestId?: number;
  isSelf?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};
export type FilterState = SearchFilterState & {
  search?: string;
  religion?: string;
  motherTongue?: string;
  maritalStatus?: string;
  verifiedOnly?: boolean;
  sortBy?: string;
  viewMode?: string;
};
export type InterestRequest = {
  id?: number | string;
  sender_id?: number | string;
  receiver_id?: number | string;
  status?: 'pending' | 'accepted' | 'rejected' | string;
  full_name?: string;
  gender?: string;
  date_of_birth?: string;
  age?: number;
  city?: string;
  occupation?: string;
  photo_url?: string;
  education?: string;
  created_at?: string;
  [key: string]: any;
};
export type RegistrationFormData = Record<string, any>;
export type UserAccount = {
  id?: number | string;
  email?: string;
  role?: 'user' | 'admin' | string;
  name?: string;
  fullName?: string;
  gender?: string;
  dob?: string;
  city?: string;
  bio?: string;
  phone?: string;
  occupation?: string;
  password?: string;
  profile?: CandidateProfile;
  [key: string]: any;
};
export type UploadedPhoto = Record<string, any>;



