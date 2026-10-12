import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Phone, BookOpen, Shield, Download, Camera,
  QrCode, Trash2, CheckCircle2, AlertCircle, RefreshCw, FileText
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const getOrdinalSuffix = (n) => {
  const num = parseInt(n, 10);
  if (!num) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'S';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Edit Profile', 'Security', 'QR Card'];

  const { user: authUser, setUser, updateProfile } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Upload loading states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Controlled form state for Edit Profile tab
  const [editForm, setEditForm] = useState({
    name: '',
    department: '',
    year: 1,
    phone: '',
    bio: ''
  });

  // File input refs
  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      const u = response.data?.data || response.data;
      if (u) {
        setStudent({
          ...u,
          id: u.studentId || u._id,
          name: u.name || 'Student',
          email: u.email || '',
          phone: u.phone || '',
          department: u.department || 'Not specified',
          yearDisplay: u.year ? `${u.year}${getOrdinalSuffix(u.year)} Year` : 'Student',
          rawYear: u.year || 1,
          role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : 'Student',
          profileImage: u.profileImage || '',
          coverImage: u.coverImage || '',
          bio: u.bio || '',
          stats: u.stats || { courses: 0, events: 0, complaints: 0, posts: 0 }
        });
        if (setUser) setUser(u);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Sync with authUser when updated or on account switch
  useEffect(() => {
    if (authUser) {
      setStudent(prev => {
        if (prev && (prev._id === authUser._id || prev.id === authUser._id) && prev.name === authUser.name && prev.profileImage === authUser.profileImage && prev.coverImage === authUser.coverImage) {
          return prev;
        }
        return {
          ...authUser,
          id: authUser.studentId || authUser._id,
          name: authUser.name || 'Student',
          email: authUser.email || '',
          phone: authUser.phone || '',
          department: authUser.department || 'Not specified',
          yearDisplay: authUser.year ? `${authUser.year}${getOrdinalSuffix(authUser.year)} Year` : 'Student',
          rawYear: authUser.year || 1,
          role: authUser.role ? (authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)) : 'Student',
          profileImage: authUser.profileImage || '',
          coverImage: authUser.coverImage || '',
          bio: authUser.bio || '',
          stats: authUser.stats || { courses: 0, events: 0, complaints: 0, posts: 0 }
        };
      });
    }
  }, [authUser]);

  // Sync editForm state whenever student data is loaded or updated
  useEffect(() => {
    if (student) {
      setEditForm({
        name: student.name || '',
        department: student.department === 'Not specified' ? '' : (student.department || ''),
        year: student.rawYear || 1,
        phone: student.phone || '',
        bio: student.bio || ''
      });
    }
  }, [student]);

  // ── Profile Photo Upload ──────────────────────────────────────────────────
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Allow Axios/browser to set the multipart boundary automatically
      const res = await api.post('/auth/profile/photo', formData);
      const updatedUser = res.data?.data || res.data;
      const newUrl = res.data?.url || updatedUser?.profileImage;

      setStudent(prev => ({ ...prev, profileImage: newUrl, avatar: newUrl }));
      if (setUser) setUser(updatedUser);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      setUploadingPhoto(true);
      const res = await api.delete('/auth/profile/photo');
      const updatedUser = res.data?.data;
      setStudent(prev => ({ ...prev, profileImage: '', avatar: 'default.jpg' }));
      if (setUser) setUser(updatedUser);
      toast.success('Profile picture removed');
    } catch (err) {
      toast.error('Failed to remove profile picture');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ── Cover Image Upload ────────────────────────────────────────────────────
  const handleCoverSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('cover', file);

    try {
      // Allow Axios/browser to set the multipart boundary automatically
      const res = await api.post('/auth/profile/cover', formData);
      const updatedUser = res.data?.data || res.data;
      const newUrl = res.data?.url || updatedUser?.coverImage;

      setStudent(prev => ({ ...prev, coverImage: newUrl }));
      if (setUser) setUser(updatedUser);
      toast.success('Cover image updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleRemoveCover = async () => {
    if (!window.confirm('Reset cover to default gradient?')) return;
    try {
      setUploadingCover(true);
      const res = await api.delete('/auth/profile/cover');
      const updatedUser = res.data?.data;
      setStudent(prev => ({ ...prev, coverImage: '' }));
      if (setUser) setUser(updatedUser);
      toast.success('Cover reset to default');
    } catch (err) {
      toast.error('Failed to reset cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  // ── Edit Profile Form Submission ──────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updatedName = editForm.name?.trim();
    const updatedPhone = editForm.phone?.trim() || '';
    const updatedDept = editForm.department?.trim() || '';
    const updatedYear = parseInt(editForm.year, 10) || 1;
    const updatedBio = editForm.bio?.trim() || '';

    if (!updatedName) {
      toast.error('Full Name cannot be empty');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateProfile({
        name: updatedName,
        phone: updatedPhone,
        department: updatedDept,
        year: updatedYear,
        bio: updatedBio,
      });

      if (res?.success) {
        const u = res.data;
        setStudent(prev => ({
          ...prev,
          ...u,
          id: u.studentId || u._id || prev?.id,
          name: u.name,
          phone: u.phone || '',
          department: u.department || 'Not specified',
          rawYear: u.year || 1,
          yearDisplay: u.year ? `${u.year}${getOrdinalSuffix(u.year)} Year` : 'Student',
          bio: u.bio || '',
        }));
        setActiveTab('Overview');
      }
    } catch (err) {
      console.error('Failed to save profile changes:', err);
      toast.error(err.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── Change Email ──────────────────────────────────────────────────────────
  const handleEmailChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newEmail = formData.get('newEmail')?.trim().toLowerCase();

    if (!currentPassword || !newEmail) {
      toast.error('Please fill in all email fields');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const res = await api.put('/auth/change-email', { currentPassword, newEmail });
      toast.success(res.data.message || 'Email updated successfully!');
      setStudent(prev => ({ ...prev, email: newEmail }));
      if (setUser && res.data.data) setUser(res.data.data);
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // ── Change Password ───────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success(res.data.message || 'Password changed successfully!');
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading && !student) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const initials = getInitials(student?.name);

  return (
    <div className="space-y-6 animate-in fade-in p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* ── Cover & Header Banner ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div
          className={clsx(
            "h-48 sm:h-56 relative transition-all bg-cover bg-center",
            !student?.coverImage && "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
          )}
          style={student?.coverImage ? { backgroundImage: `url(${student.coverImage})` } : {}}
        >
          {/* Subtle overlay for text contrast */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          {/* Cover controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {student?.coverImage && (
              <button
                type="button"
                onClick={handleRemoveCover}
                disabled={uploadingCover}
                className="bg-black/40 hover:bg-black/60 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5"
                title="Remove cover image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="bg-white/25 hover:bg-white/40 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors flex items-center shadow-sm"
            >
              {uploadingCover ? (
                <>
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-1.5" />
                  <span>{student?.coverImage ? 'Change Cover' : 'Add Cover'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Profile Details Bar ── */}
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-indigo-700 shadow-md relative overflow-hidden">
                  {student?.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}

                  {/* Upload overlay on hover */}
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  >
                    <Camera className="w-7 h-7 mb-1" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">
                      {uploadingPhoto ? 'Uploading...' : 'Change'}
                    </span>
                  </div>
                </div>

                {/* Quick remove photo button */}
                {student?.profileImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={uploadingPhoto}
                    title="Remove profile photo"
                    className="absolute -top-1 -right-1 bg-white hover:bg-rose-50 text-rose-600 p-1.5 rounded-full shadow-md border border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Student Name & Subtitle */}
              <div className="pb-1 sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student?.name}
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-0.5">
                  {student?.department} &bull; ID: <span className="font-mono text-xs text-slate-700">{student?.id}</span>
                </p>
                {student?.bio && (
                  <p className="text-slate-600 text-xs mt-1.5 max-w-lg italic">
                    &ldquo;{student.bio}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs sm:text-sm px-3.5 py-1.5 font-semibold">
                {student?.yearDisplay}
              </Badge>
              <Badge variant="success" className="text-xs sm:text-sm px-3.5 py-1.5 font-semibold">
                {student?.role}
              </Badge>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={clsx(
                  "px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === t
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info Box */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-base flex items-center justify-between">
                <span>Personal Info</span>
                <button
                  onClick={() => setActiveTab('Edit Profile')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Edit &rarr;
                </button>
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center text-slate-600">
                  <User className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{student?.name}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{student?.email}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                  <span>{student?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <BookOpen className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                  <span>{student?.department}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Shield className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                  <span>{student?.yearDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 text-base">Campus Activity</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100 hover:border-indigo-200 transition-colors">
                  <p className="text-3xl font-extrabold text-indigo-600 mb-1">{student?.stats?.courses || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100 hover:border-emerald-200 transition-colors">
                  <p className="text-3xl font-extrabold text-emerald-600 mb-1">{student?.stats?.events || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Events</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100 hover:border-rose-200 transition-colors">
                  <p className="text-3xl font-extrabold text-rose-600 mb-1">{student?.stats?.complaints || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Help Desk</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100 hover:border-amber-200 transition-colors">
                  <p className="text-3xl font-extrabold text-amber-600 mb-1">{student?.stats?.posts || 0}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Posts</p>
                </div>
              </div>

              {/* Account summary note */}
              <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-950">Verified Student Account</p>
                  <p className="text-indigo-800 mt-0.5">
                    Your account is registered on the Smart Campus Hub network with full access to semester registrations, notices, events, and resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: EDIT PROFILE ── */}
      {activeTab === 'Edit Profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Edit Personal Information</h3>
            <p className="text-slate-500 text-sm mt-0.5">
              Update your basic details visible on your student profile and campus records.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Student ID <span className="text-xs text-slate-400 font-normal">(System Assigned)</span>
                </label>
                <input
                  type="text"
                  value={student?.id || ''}
                  disabled
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Year of Study
                </label>
                <select
                  name="year"
                  value={editForm.year}
                  onChange={(e) => setEditForm(prev => ({ ...prev, year: parseInt(e.target.value, 10) || 1 }))}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                About / Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                placeholder="Tell us a little about your academic interests or hobbies..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('Overview')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB 3: SECURITY ── */}
      {activeTab === 'Security' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Change Email */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-4 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Change Email Address</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Current email: <span className="font-semibold text-slate-700">{student?.email}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleEmailChange} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  name="newEmail"
                  required
                  placeholder="new.email@example.com"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Current Password (to verify identity)
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="Enter current password"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  disabled={isUpdatingEmail}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isUpdatingEmail ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    'Update Email'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-4 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mr-3">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Change Password</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Ensure your account uses a secure password of at least 6 characters.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="Enter current password"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  placeholder="Repeat new password"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isUpdatingPassword ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 4: QR CARD ── */}
      {activeTab === 'QR Card' && (
        <div className="flex flex-col items-center">
          <div className="w-[320px] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            {/* Top header */}
            <div className="bg-indigo-600 p-6 text-center text-white">
              <h2 className="text-xl font-black tracking-widest uppercase">Smart Campus</h2>
              <p className="text-indigo-200 text-xs mt-0.5 uppercase tracking-widest">Digital Student ID</p>
            </div>

            {/* Card Body */}
            <div className="p-8 flex flex-col items-center bg-slate-50 relative">
              <div className="absolute top-0 left-0 w-full h-14 bg-indigo-600 rounded-b-[50%]" />

              {/* Avatar circle */}
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md z-10 mb-4 overflow-hidden">
                <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-black text-indigo-700 overflow-hidden">
                  {student?.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>

              {/* Student Name */}
              <h3 className="text-xl font-extrabold text-slate-900 text-center">
                {student?.name}
              </h3>
              <p className="text-slate-500 font-mono text-xs mb-5">
                {student?.id}
              </p>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-5 flex flex-col items-center">
                <QrCode className="w-28 h-28 text-slate-800" />
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                  Campus Scan ID
                </span>
              </div>

              {/* Card Meta Details */}
              <div className="w-full space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-medium">Department</span>
                  <span className="font-bold text-slate-800 text-right">{student?.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-medium">Year</span>
                  <span className="font-bold text-slate-800">{student?.yearDisplay}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-6 flex items-center px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 mr-2" /> Print / Save ID Card
          </button>
        </div>
      )}
    </div>
  );
}
