import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Building, Phone, Shield, Edit3, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab]     = useState('overview');
  const [editing, setEditing]         = useState(false);
  const [showPwd, setShowPwd]         = useState(false);
  const [form, setForm] = useState({
    name:       user?.name || '',
    department: user?.department || '',
    phone:      user?.phone || '',
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

    const handlePasswordChange = async () => {
    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      toast.error('Please fill current and new password');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      if (res.data.success) {
        updateProfile && updateProfile(res.data.data);
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const infoRow = (Icon, label, value) => (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-800 font-semibold">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-5 -translate-y-10 translate-x-10" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-rose-200 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 bg-white/20 px-3 py-0.5 rounded-full text-xs font-semibold">
              ⚙️ Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['overview', 'edit', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'edit' ? 'Edit Profile' : tab === 'security' ? 'Security' : 'Overview'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-lg">
          <h3 className="font-semibold text-slate-800 mb-4">Account Information</h3>
          {infoRow(User,     'Full Name',   user?.name)}
          {infoRow(Mail,     'Email',        user?.email)}
          {infoRow(Shield,   'Role',         'Administrator')}
          {infoRow(Building, 'Department',   user?.department)}
          {infoRow(Phone,    'Phone',        user?.phone)}
          <button
            onClick={() => setActiveTab('edit')}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      )}

      {/* Edit */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-lg">
          <h3 className="font-semibold text-slate-800 mb-5">Edit Profile</h3>
          <div className="space-y-4">
            {[
              { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Department', key: 'department', type: 'text', placeholder: 'e.g. IT Services' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
              🔒 Email and Role cannot be changed from here. Contact system administrator.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setForm({ name: user?.name||'', department: user?.department||'', phone: user?.phone||'' }); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-lg">
          <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" /> Change Password
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Current Password', key: 'currentPassword' },
              { label: 'New Password', key: 'newPassword' },
              { label: 'Confirm New Password', key: 'confirmPassword' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={pwdForm[key]}
                    onChange={e => setPwdForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full pr-10 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Lock className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

