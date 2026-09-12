import React, { useState } from 'react';
import { 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  Eye, 
  UserCheck 
} from 'lucide-react';
import { Profile, RegistrationFormData } from '../types';

interface RegistrationFormProps {
  onProfileCreated: (newProfile: Profile) => void;
  onNavigateToProfile?: () => void;
}

const INITIAL_FORM: RegistrationFormData = {
  fullName: '',
  gender: 'female',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dob: '',
  height: "5' 5\"",
  religion: 'Hindu',
  motherTongue: 'Hindi',
  maritalStatus: 'Never Married',
  education: '',
  occupation: '',
  annualIncome: '$100,000',
  city: '',
  state: '',
  country: 'USA',
  bio: '',
  agreeToTerms: false,
};

const SAMPLE_AVATARS = [
  { label: 'Bride 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80', gender: 'female' },
  { label: 'Bride 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80', gender: 'female' },
  { label: 'Groom 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80', gender: 'male' },
  { label: 'Groom 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80', gender: 'male' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onProfileCreated,
  onNavigateToProfile
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(SAMPLE_AVATARS[0].url);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1 || step === 0) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Name must be at least 3 characters';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Valid email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
      } else {
        const birthDate = new Date(formData.dob);
        const ageDiff = (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (ageDiff < 18) {
          newErrors.dob = 'Must be at least 18 years old to register';
        }
      }
    }

    if (step === 2 || step === 0) {
      if (!formData.education.trim()) {
        newErrors.education = 'Education qualification is required';
      }
      if (!formData.occupation.trim()) {
        newErrors.occupation = 'Occupation is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    }

    if (step === 3 || step === 0) {
      if (!formData.bio.trim()) {
        newErrors.bio = 'About me bio is required';
      } else if (formData.bio.trim().length < 15) {
        newErrors.bio = 'Bio must be at least 15 characters';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the Terms of Service';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(0)) return;

    const birthYear = new Date(formData.dob).getFullYear();
    const calculatedAge = Math.max(18, new Date().getFullYear() - birthYear);

    const newId = `profile-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      name: formData.fullName,
      gender: formData.gender,
      age: calculatedAge,
      dob: formData.dob,
      height: formData.height,
      religion: formData.religion,
      motherTongue: formData.motherTongue,
      community: 'General',
      horoscope: 'Leo / Magha',
      maritalStatus: formData.maritalStatus as any,
      education: formData.education,
      occupation: formData.occupation,
      company: 'Private Enterprise',
      annualIncome: formData.annualIncome,
      city: formData.city,
      state: formData.state || 'WA',
      country: formData.country,
      photoUrl: selectedPhoto,
      bio: formData.bio,
      hobbies: ['Reading', 'Travel', 'Fine Dining'],
      verified: true,
      isShortlisted: false,
      interestStatus: 'none',
      phone: formData.phone,
      email: formData.email,
      joinedDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      privacyPhone: 'matches_only',
      preferences: {
        ageRange: [24, 34],
        religion: [formData.religion],
        education: [formData.education],
        location: `${formData.city}, ${formData.country}`
      }
    };

    setCreatedProfile(newProfile);
    onProfileCreated(newProfile);
  };

  const handlePrefillSample = () => {
    setFormData({
      fullName: 'Tara Kapoor',
      gender: 'female',
      email: 'tara.kapoor@example.com',
      phone: '+1 (415) 555-0988',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      dob: '1998-07-16',
      height: "5' 6\"",
      religion: 'Hindu',
      motherTongue: 'Hindi',
      maritalStatus: 'Never Married',
      education: 'M.S. Artificial Intelligence',
      occupation: 'Machine Learning Engineer',
      annualIncome: '$150,000',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      bio: 'Enthusiastic machine learning researcher who loves outdoor trails, playing violin, and artisanal coffee.',
      agreeToTerms: true,
    });
    setSelectedPhoto(SAMPLE_AVATARS[0].url);
    setErrors({});
  };

  return (
    <div id="registration-page" data-testid="registration-page" className="max-w-3xl mx-auto py-4 space-y-6">
      
      {/* Header Banner with quick prefill */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-gray-900">Candidate Registration Page</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Register your matrimonial profile to connect with compatible verified members.
          </p>
        </div>

        <button
          id="prefill-sample-btn"
          data-testid="prefill-sample-btn"
          type="button"
          onClick={handlePrefillSample}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pre-fill Sample Data</span>
        </button>
      </div>

      {/* Success Banner if registered */}
      {createdProfile && (
        <div 
          id="registration-success-msg"
          data-testid="registration-success-msg" 
          role="alert" 
          className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold block">Account &amp; Profile Successfully Registered!</strong>
              <p className="text-xs text-emerald-800 mt-0.5">
                Welcome, <span className="font-bold">{createdProfile.name}</span>! Your profile ID is <span className="font-mono font-semibold">{createdProfile.id}</span>.
              </p>
            </div>
          </div>

          {onNavigateToProfile && (
            <button
              id="go-to-my-profile-btn"
              data-testid="go-to-my-profile-btn"
              onClick={onNavigateToProfile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>View My Profile</span>
            </button>
          )}
        </div>
      )}

      {/* Multi-Step Stepper Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <button
            id="step-tab-1"
            data-testid="step-tab-1"
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              currentStep === 1
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
            <span className="hidden sm:inline">Identity & Login</span>
          </button>

          <button
            id="step-tab-2"
            data-testid="step-tab-2"
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              currentStep === 2
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
            <span className="hidden sm:inline">Career & Culture</span>
          </button>

          <button
            id="step-tab-3"
            data-testid="step-tab-3"
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              currentStep === 3
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
            <span className="hidden sm:inline">Bio & Verification</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form 
        id="registration-form"
        data-testid="registration-form"
        onSubmit={handleSubmit} 
        noValidate
        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6"
      >
        
        {/* STEP 1: Basic Information & Authentication */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>Step 1: Account Credentials & Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="input-fullName" className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  id="input-fullName"
                  data-testid="input-fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tara Kapoor"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.fullName ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.fullName && (
                  <p data-testid="error-fullName" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Gender Radio */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Looking for Marriage as *</label>
                <div className="flex items-center gap-4 pt-2">
                  {(['female', 'male', 'other'] as const).map((g) => (
                    <label key={g} className="flex items-center gap-1.5 text-xs text-gray-700 capitalize cursor-pointer">
                      <input
                        id={`radio-gender-${g}`}
                        data-testid={`radio-gender-${g}`}
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={() => setFormData({ ...formData, gender: g })}
                        className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>{g === 'female' ? 'Bride' : g === 'male' ? 'Groom' : 'Other'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="input-email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address (Username) *
                </label>
                <input
                  id="input-email"
                  data-testid="input-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.email && (
                  <p data-testid="error-email" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="input-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  id="input-phone"
                  data-testid="input-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.phone && (
                  <p data-testid="error-phone" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="input-password" className="block text-xs font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="input-password"
                  data-testid="input-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.password && (
                  <p data-testid="error-password" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="input-confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="input-confirmPassword"
                  data-testid="input-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.confirmPassword && (
                  <p data-testid="error-confirmPassword" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="input-dob" className="block text-xs font-semibold text-gray-700 mb-1">
                  Date of Birth * (Must be 18+)
                </label>
                <input
                  id="input-dob"
                  data-testid="input-dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.dob ? 'border-rose-500 ring-rose-200 bg-rose-50/20' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.dob && (
                  <p data-testid="error-dob" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Height */}
              <div>
                <label htmlFor="select-height" className="block text-xs font-semibold text-gray-700 mb-1">
                  Height
                </label>
                <select
                  id="select-height"
                  data-testid="select-height"
                  name="height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                >
                  {["5' 0\"", "5' 2\"", "5' 4\"", "5' 5\"", "5' 6\"", "5' 7\"", "5' 8\"", "5' 10\"", "6' 0\"", "6' 2\""].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="btn-next-step-1"
                data-testid="btn-next-step"
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Cultural, Career & Location */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>Step 2: Cultural Background, Education &amp; Career</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="select-religion" className="block text-xs font-semibold text-gray-700 mb-1">
                  Religion *
                </label>
                <select
                  id="select-religion"
                  data-testid="select-religion"
                  name="religion"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                >
                  {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Parsi', 'Buddhist', 'Spiritual'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-motherTongue" className="block text-xs font-semibold text-gray-700 mb-1">
                  Mother Tongue *
                </label>
                <select
                  id="select-motherTongue"
                  data-testid="select-motherTongue"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                >
                  {['Hindi', 'Bengali', 'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Malayalam', 'Punjabi', 'Urdu', 'English'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-maritalStatus" className="block text-xs font-semibold text-gray-700 mb-1">
                  Marital Status *
                </label>
                <select
                  id="select-maritalStatus"
                  data-testid="select-maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                >
                  {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="input-education" className="block text-xs font-semibold text-gray-700 mb-1">
                  Highest Degree Qualification *
                </label>
                <input
                  id="input-education"
                  data-testid="input-education"
                  name="education"
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. M.S. Computer Science"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.education ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.education && (
                  <p data-testid="error-education" className="text-xs text-rose-600 mt-1">{errors.education}</p>
                )}
              </div>

              <div>
                <label htmlFor="input-occupation" className="block text-xs font-semibold text-gray-700 mb-1">
                  Occupation Title *
                </label>
                <input
                  id="input-occupation"
                  data-testid="input-occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.occupation ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.occupation && (
                  <p data-testid="error-occupation" className="text-xs text-rose-600 mt-1">{errors.occupation}</p>
                )}
              </div>

              <div>
                <label htmlFor="input-city" className="block text-xs font-semibold text-gray-700 mb-1">
                  Current City *
                </label>
                <input
                  id="input-city"
                  data-testid="input-city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Seattle"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                  }`}
                />
                {errors.city && (
                  <p data-testid="error-city" className="text-xs text-rose-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="select-annualIncome" className="block text-xs font-semibold text-gray-700 mb-1">
                  Annual Income Bracket
                </label>
                <select
                  id="select-annualIncome"
                  data-testid="select-annualIncome"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                >
                  {['$60,000 - $80,000', '$80,000 - $100,000', '$100,000 - $150,000', '$150,000 - $200,000', '$200,000+'].map(inc => (
                    <option key={inc} value={inc}>{inc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                id="btn-next-step-2"
                data-testid="btn-next-step"
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Bio, Photo & Verification Agreement */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>Step 3: Profile Photo, Biography &amp; Agreement</span>
            </h2>

            {/* Profile Photo Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Select a Profile Picture Avatar (or paste custom image URL)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {SAMPLE_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-testid={`avatar-option-${idx}`}
                    onClick={() => setSelectedPhoto(avatar.url)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedPhoto === avatar.url
                        ? 'border-rose-600 ring-2 ring-rose-300 scale-102'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                    {selectedPhoto === avatar.url && (
                      <div className="absolute inset-0 bg-rose-600/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Or manual photo URL */}
              <div className="mt-3">
                <input
                  id="input-photoUrl"
                  data-testid="input-photoUrl"
                  type="url"
                  value={selectedPhoto}
                  onChange={(e) => setSelectedPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 text-gray-700 bg-gray-50"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="textarea-bio" className="block text-xs font-semibold text-gray-700 mb-1">
                About Yourself &amp; Partner Expectations *
              </label>
              <textarea
                id="textarea-bio"
                data-testid="textarea-bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your personal lifestyle, family values, hobbies, and the qualities you desire in your life partner..."
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.bio ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.bio && (
                <p data-testid="error-bio" className="text-xs text-rose-600 mt-1">{errors.bio}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label htmlFor="checkbox-terms" className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700">
                <input
                  id="checkbox-terms"
                  data-testid="checkbox-terms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer"
                />
                <span>
                  I certify that all details submitted are genuine and agree to the{' '}
                  <strong className="text-rose-600">Terms of Service</strong> &amp; community safety standards.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p data-testid="error-agreeToTerms" className="text-xs text-rose-600 mt-1 flex items-center gap-1 pl-6">
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                id="register-submit-btn"
                data-testid="register-submit-btn"
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Complete Registration</span>
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
