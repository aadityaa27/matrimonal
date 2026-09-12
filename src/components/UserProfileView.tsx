import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  Camera, 
  Trash2, 
  Star, 
  LogOut, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Plus
} from 'lucide-react';
import { UserAccount, UploadedPhoto } from '../types';
import { saveAccount } from '../db/matrimonialDb';

interface UserProfileViewProps {
  user: UserAccount;
  onUpdateUser: (updated: UserAccount) => void;
  onLogout: () => void;
  onNavigateBrowse: () => void;
}

const MAX_PHOTOS = 10;

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigateBrowse,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user.fullName);
  const [editCity, setEditCity] = useState<string>(user.city);
  const [editBio, setEditBio] = useState<string>(user.bio);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [saveAlert, setSaveAlert] = useState<boolean>(false);

  // Sync state when user prop changes
  React.useEffect(() => {
    setEditName(user.fullName);
    setEditCity(user.city);
    setEditBio(user.bio);
  }, [user]);

  const primaryPhoto = user.photos.find((p) => p.isPrimary) || user.photos[0] || {
    id: 'placeholder',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    name: 'avatar.jpg',
    isPrimary: true,
    uploadedAt: '',
  };

  const handleSaveDetails = async () => {
    const updated: UserAccount = {
      ...user,
      fullName: editName,
      city: editCity,
      bio: editBio,
    };
    await saveAccount(updated);
    onUpdateUser(updated);
    setIsEditing(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleAddPhotoFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - user.photos.length;
    if (remaining <= 0) {
      alert(`Database limit is ${MAX_PHOTOS} photos.`);
      return;
    }

    const filesToRead = Array.from(files).slice(0, remaining);
    let newPhotos: UploadedPhoto[] = [];

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const photoObj: UploadedPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: dataUrl,
          name: file.name,
          isPrimary: user.photos.length === 0 && newPhotos.length === 0,
          uploadedAt: new Date().toISOString(),
        };
        newPhotos.push(photoObj);

        if (newPhotos.length === filesToRead.length) {
          const updated: UserAccount = {
            ...user,
            photos: [...user.photos, ...newPhotos],
          };
          await saveAccount(updated);
          onUpdateUser(updated);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoFromUrl = async () => {
    if (!newPhotoUrl.trim() || user.photos.length >= MAX_PHOTOS) return;

    const photoObj: UploadedPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      name: `album_photo_${user.photos.length + 1}.jpg`,
      isPrimary: user.photos.length === 0,
      uploadedAt: new Date().toISOString(),
    };

    const updated: UserAccount = {
      ...user,
      photos: [...user.photos, photoObj],
    };

    await saveAccount(updated);
    onUpdateUser(updated);
    setNewPhotoUrl('');
  };

  const handleDeletePhoto = async (photoId: string) => {
    const remaining = user.photos.filter((p) => p.id !== photoId);
    if (remaining.length > 0 && !remaining.some((p) => p.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    const updated: UserAccount = {
      ...user,
      photos: remaining,
    };
    await saveAccount(updated);
    onUpdateUser(updated);
  };

  const handleSetPrimary = async (photoId: string) => {
    const updatedPhotos = user.photos.map((p) => ({
      ...p,
      isPrimary: p.id === photoId,
    }));
    const updated: UserAccount = {
      ...user,
      photos: updatedPhotos,
    };
    await saveAccount(updated);
    onUpdateUser(updated);
  };

  return (
    <div id="user-profile-page" data-testid="user-profile-page" className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* Top Banner Alert on Save */}
      {saveAlert && (
        <div 
          id="profile-updated-alert"
          data-testid="profile-updated-alert"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and database records successfully updated!</span>
          </div>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        
        {/* Cover strip */}
        <div className="h-28 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="edit-profile-toggle"
              data-testid="edit-profile-toggle"
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-rose-600" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
            </button>

            <button
              id="logout-btn"
              data-testid="logout-btn"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Info Area */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 mb-4">
            {/* Primary Avatar Thumbnail */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-rose-50 shrink-0">
              <img
                src={primaryPhoto.url}
                alt={user.fullName}
                id="user-profile-avatar"
                data-testid="user-profile-avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-medium">
                Primary
              </div>
            </div>

            {/* Name & Basic info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h1 id="user-profile-name" data-testid="user-profile-name" className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold capitalize">
                  {user.gender === 'female' ? 'Bride' : 'Groom'} • {user.age} yrs
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span id="user-city" data-testid="user-city" className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {user.city}
                </span>
                <span id="user-email" data-testid="user-email" className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  DOB: {user.dob}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form or View Details */}
          {isEditing ? (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    id="input-edit-name"
                    data-testid="input-edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City / Location</label>
                  <input
                    id="input-edit-city"
                    data-testid="input-edit-city"
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">About Me / Biography</label>
                <textarea
                  id="textarea-edit-bio"
                  data-testid="textarea-edit-bio"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                id="save-profile-btn"
                data-testid="save-profile-btn"
                onClick={handleSaveDetails}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">About Candidate</h2>
              <p id="user-bio-display" data-testid="user-bio-display" className="text-xs text-gray-600 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Database Photos Section (Up to 10 photos) */}
      <div 
        id="profile-photos-section"
        data-testid="profile-photos-section"
        className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-600" />
              <span>Database Photo Album</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Images stored directly in the browser's IndexedDB database for Playwright validation.
            </p>
          </div>

          <div 
            id="profile-photo-counter"
            data-testid="profile-photo-counter"
            className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 self-start sm:self-auto"
          >
            {user.photos.length} / {MAX_PHOTOS} Photos
          </div>
        </div>

        {/* Upload More Photos when under 10 */}
        {user.photos.length < MAX_PHOTOS && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-300 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-600">
                <strong>Upload more photos to database:</strong> ({MAX_PHOTOS - user.photos.length} spots remaining)
              </div>

              <label 
                id="upload-more-btn"
                data-testid="upload-more-btn"
                className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-100 shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-rose-600" />
                <span>Select Image Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleAddPhotoFiles(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Photo Gallery Grid */}
        <div 
          id="profile-gallery-grid"
          data-testid="profile-gallery-grid"
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4"
        >
          {user.photos.map((photo, idx) => (
            <div
              key={photo.id}
              id={`album-photo-${idx}`}
              data-testid={`album-photo-${idx}`}
              className={`relative group rounded-2xl overflow-hidden aspect-square border-2 shadow-xs bg-gray-50 ${
                photo.isPrimary ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-200'
              }`}
            >
              <img
                src={photo.url}
                alt={`Photo ${idx + 1}`}
                id={`album-thumb-${idx}`}
                data-testid={`album-thumb-${idx}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Label */}
              {photo.isPrimary && (
                <div 
                  id={`album-primary-tag-${idx}`}
                  data-testid={`album-primary-tag-${idx}`}
                  className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs"
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Primary</span>
                </div>
              )}

              {/* Overlay on hover for delete & set primary */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    id={`album-delete-btn-${idx}`}
                    data-testid={`album-delete-btn-${idx}`}
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!photo.isPrimary && (
                  <button
                    id={`album-set-primary-${idx}`}
                    data-testid={`album-set-primary-${idx}`}
                    type="button"
                    onClick={() => handleSetPrimary(photo.id)}
                    className="w-full py-1 bg-white text-gray-900 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    Set as Avatar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
