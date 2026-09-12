import React, { useState } from 'react';
import { 
  UserPlus, 
  Upload, 
  Trash2, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Image as ImageIcon,
  Plus,
  Camera
} from 'lucide-react';
import { UserAccount, UploadedPhoto } from '../types';
import { registerAccountInDb, saveAccount } from '../db/matrimonialDb';

interface RegistrationPageProps {
  onRegisterSuccess: (account: UserAccount) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

const MAX_PHOTOS = 10;

// Curated sample photos so testers can quickly populate up to 10 images with 1 click
const SAMPLE_10_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
];

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateHome,
}) => {
  // Basic Form Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [dob, setDob] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  // 10 Photo Database State
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // File Upload Handler (reads images as Data URLs and adds up to 10)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      alert(`You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhotos((prev) => {
          if (prev.length >= MAX_PHOTOS) return prev;
          const newPhoto: UploadedPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: dataUrl,
            name: file.name,
            isPrimary: prev.length === 0, // First photo is default primary
            uploadedAt: new Date().toISOString(),
          };
          return [...prev, newPhoto];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Photo from URL input
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    if (photos.length >= MAX_PHOTOS) {
      alert(`You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const newPhoto: UploadedPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: photoUrlInput.trim(),
      name: `web_photo_${photos.length + 1}.jpg`,
      isPrimary: photos.length === 0,
      uploadedAt: new Date().toISOString(),
    };

    setPhotos((prev) => [...prev, newPhoto]);
    setPhotoUrlInput('');
  };

  // Helper to load sample 10 photos instantly
  const handleLoadSample10Photos = () => {
    const loaded = SAMPLE_10_PHOTOS.map((url, idx) => ({
      id: `photo-sample-${idx + 1}`,
      url,
      name: `matrimonial_photo_${idx + 1}.jpg`,
      isPrimary: idx === 0,
      uploadedAt: new Date().toISOString(),
    }));
    setPhotos(loaded);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photoId);
      // Ensure there's still a primary photo if items remain
      if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryPhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isPrimary: p.id === photoId,
      }))
    );
  };

  // Pre-fill basic details for rapid test automation
  const handlePrefillBasicDetails = () => {
    setFullName('Pooja Nair');
    setEmail('pooja.nair@example.com');
    setPassword('SecretPass123!');
    setGender('female');
    setDob('1998-05-20');
    setCity('San Francisco, CA');
    setBio('UX Designer who enjoys filter coffee, weekend hikes, and indie music.');
    setErrors({});

    // Also populate initial sample photos
    if (photos.length === 0) {
      setPhotos(
        SAMPLE_10_PHOTOS.slice(0, 4).map((url, idx) => ({
          id: `prefill-photo-${idx}`,
          url,
          name: `profile_${idx + 1}.jpg`,
          isPrimary: idx === 0,
          uploadedAt: new Date().toISOString(),
        }))
      );
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Valid email address is required';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Brief about-me bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const birthYear = new Date(dob).getFullYear();
      const calculatedAge = Math.max(18, new Date().getFullYear() - birthYear);

      // Fallback photo if none uploaded
      const finalPhotos = photos.length > 0 
        ? photos 
        : [{
            id: `default-photo-${Date.now()}`,
            url: gender === 'female' ? SAMPLE_10_PHOTOS[0] : SAMPLE_10_PHOTOS[4],
            name: 'avatar_default.jpg',
            isPrimary: true,
            uploadedAt: new Date().toISOString(),
          }];

      // Save candidate account and up to 10 photos into real SQLite database
      const newAccount = await registerAccountInDb(
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          gender: gender === 'female' ? 'Bride' : 'Groom',
          dateOfBirth: dob,
          city: city.trim(),
          bio: bio.trim(),
        },
        finalPhotos
      );

      // Callback to app coordinator
      onRegisterSuccess(newAccount);
    } catch (err: any) {
      alert(err.message || 'Error saving registration to database');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="registration-page" data-testid="registration-page" className="max-w-3xl mx-auto py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          id="reg-back-home"
          data-testid="reg-back-home"
          onClick={onNavigateHome}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </button>

        <button
          id="reg-prefill-btn"
          data-testid="reg-prefill-btn"
          type="button"
          onClick={handlePrefillBasicDetails}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pre-fill Basic Details</span>
        </button>
      </div>

      {/* Main Registration Form Container */}
      <form 
        id="registration-form"
        data-testid="registration-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-8"
      >
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-rose-600" />
            <h1 id="reg-title" data-testid="reg-title" className="text-2xl font-bold text-gray-900">
              Basic Registration &amp; Photo Database
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Provide your basic profile credentials and upload up to 10 photos saved to your client database.
          </p>
        </div>

        {/* Section 1: Basic Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            1. Basic Personal &amp; Login Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="reg-fullname"
                data-testid="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Pooja Nair"
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.fullName && (
                <p data-testid="error-reg-fullname" className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address (Login ID) *
              </label>
              <input
                id="reg-email"
                data-testid="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.email && (
                <p data-testid="error-reg-email" className="text-xs text-rose-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="reg-password"
                data-testid="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.password && (
                <p data-testid="error-reg-password" className="text-xs text-rose-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Gender Radio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gender *</label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    id="reg-gender-bride"
                    data-testid="reg-gender-bride"
                    type="radio"
                    name="reg-gender"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>Bride</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    id="reg-gender-groom"
                    data-testid="reg-gender-groom"
                    type="radio"
                    name="reg-gender"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>Groom</span>
                </label>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="reg-dob" className="block text-xs font-semibold text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                id="reg-dob"
                data-testid="reg-dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.dob ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.dob && (
                <p data-testid="error-reg-dob" className="text-xs text-rose-600 mt-1">{errors.dob}</p>
              )}
            </div>

            {/* City / Location */}
            <div>
              <label htmlFor="reg-city" className="block text-xs font-semibold text-gray-700 mb-1">
                City / Location *
              </label>
              <input
                id="reg-city"
                data-testid="reg-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.city ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
                }`}
              />
              {errors.city && (
                <p data-testid="error-reg-city" className="text-xs text-rose-600 mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          {/* About Me Bio */}
          <div>
            <label htmlFor="reg-bio" className="block text-xs font-semibold text-gray-700 mb-1">
              About Me / Brief Introduction *
            </label>
            <textarea
              id="reg-bio"
              data-testid="reg-bio"
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce yourself, hobbies, values, and what you seek in a partner..."
              className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 ${
                errors.bio ? 'border-rose-500 ring-rose-200' : 'border-gray-300 focus:ring-rose-500'
              }`}
            />
            {errors.bio && (
              <p data-testid="error-reg-bio" className="text-xs text-rose-600 mt-1">{errors.bio}</p>
            )}
          </div>
        </div>

        {/* Section 2: Upload Database Images (Up to 10) */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-600" />
                <span>2. Upload Profile Photos (Up to 10 Images in Database)</span>
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Saved in local IndexedDB storage. You can upload via file browser, drag &amp; drop, or URL.
              </p>
            </div>

            {/* Photo counter */}
            <div 
              id="photo-counter"
              data-testid="photo-counter" 
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                photos.length === MAX_PHOTOS 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {photos.length} / {MAX_PHOTOS} Photos
            </div>
          </div>

          {/* Upload Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* File Dropzone / File Picker */}
            <div 
              id="photo-dropzone"
              data-testid="photo-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="sm:col-span-2 border-2 border-dashed border-gray-300 hover:border-rose-400 bg-gray-50/70 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors"
              onClick={() => document.getElementById('photo-file-input')?.click()}
            >
              <Upload className="w-6 h-6 text-rose-600" />
              <div className="text-xs text-gray-600">
                <strong className="text-rose-600 underline">Click to choose image files</strong> or drag &amp; drop here
              </div>
              <span className="text-[11px] text-gray-400">Supports PNG, JPG, WebP (select multiple at once)</span>
              <input
                id="photo-file-input"
                data-testid="photo-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {/* 1-Click Load 10 Sample Photos for automated tests */}
            <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Playwright Shortcut
              </span>
              <p className="text-[11px] text-rose-700 leading-tight">
                Instantly attach 10 high-resolution photos with 1 click.
              </p>
              <button
                id="load-sample-photos-btn"
                data-testid="load-sample-photos-btn"
                type="button"
                onClick={handleLoadSample10Photos}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Load 10 Photos
              </button>
            </div>
          </div>

          {/* Alternative URL Input */}
          <div className="flex gap-2">
            <input
              id="photo-url-input"
              data-testid="photo-url-input"
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="Or paste an image web URL: https://..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
            />
            <button
              id="photo-url-add-btn"
              data-testid="photo-url-add-btn"
              type="button"
              onClick={handleAddPhotoUrl}
              disabled={!photoUrlInput.trim() || photos.length >= MAX_PHOTOS}
              className="px-4 py-1.5 rounded-xl bg-gray-800 text-white hover:bg-gray-900 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>

          {/* Photo Gallery Grid */}
          {photos.length > 0 && (
            <div 
              id="photo-gallery-grid"
              data-testid="photo-gallery-grid" 
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2"
            >
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  id={`photo-item-${idx}`}
                  data-testid={`photo-item-${idx}`}
                  className={`relative group rounded-2xl overflow-hidden border-2 aspect-square bg-gray-100 ${
                    photo.isPrimary ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Upload ${idx + 1}`}
                    id={`photo-thumb-${idx}`}
                    data-testid={`photo-thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {photo.isPrimary && (
                    <div 
                      id={`photo-primary-badge-${idx}`}
                      data-testid={`photo-primary-badge-${idx}`}
                      className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs"
                    >
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Primary</span>
                    </div>
                  )}

                  {/* Hover / Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        id={`photo-delete-${idx}`}
                        data-testid={`photo-delete-${idx}`}
                        type="button"
                        title="Delete this photo"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!photo.isPrimary && (
                      <button
                        id={`photo-make-primary-${idx}`}
                        data-testid={`photo-make-primary-${idx}`}
                        type="button"
                        onClick={() => handleSetPrimaryPhoto(photo.id)}
                        className="w-full py-1 bg-white text-gray-900 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        Set as Primary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit & Login Link */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            Already registered?{' '}
            <button
              id="link-to-login"
              data-testid="link-to-login"
              type="button"
              onClick={onNavigateLogin}
              className="text-rose-600 font-bold underline hover:text-rose-700"
            >
              Sign in here
            </button>
          </div>

          <button
            id="reg-submit-btn"
            data-testid="reg-submit-btn"
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Database...' : 'Register Profile & Photos'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
