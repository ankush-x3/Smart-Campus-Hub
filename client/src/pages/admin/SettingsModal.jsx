import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { Save, X, Server } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SystemSettingsModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    campusName: 'Smart Campus Hub',
    campusEmail: 'admin@campus.edu',
    allowRegistration: true,
    maintenanceMode: false,
    emailNotifications: true,
    complaintNotifications: true,
    eventNotifications: true
  });

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/settings');
      if (res.data.success && res.data.data) {
        setForm(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/admin/settings', form);
      if (res.data.success) {
        toast.success('System settings saved successfully');
        onClose();
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="System Settings" size="lg">
      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campus Name</label>
                <input 
                  type="text" 
                  value={form.campusName} 
                  onChange={(e) => setForm({...form, campusName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input 
                  type="email" 
                  value={form.campusEmail} 
                  onChange={(e) => setForm({...form, campusEmail: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">System Controls</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Allow New Registrations</p>
                <p className="text-xs text-gray-500">Enable or disable new user signups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={form.allowRegistration} onChange={(e) => setForm({...form, allowRegistration: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
              <div>
                <p className="font-medium text-rose-800">Maintenance Mode</p>
                <p className="text-xs text-rose-600">Temporarily block access for all non-admins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={form.maintenanceMode} onChange={(e) => setForm({...form, maintenanceMode: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={form.emailNotifications} onChange={(e) => setForm({...form, emailNotifications: e.target.checked})} className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
                <span className="text-gray-700 text-sm">System Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={form.complaintNotifications} onChange={(e) => setForm({...form, complaintNotifications: e.target.checked})} className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
                <span className="text-gray-700 text-sm">New Complaint Alerts for Admins</span>
              </label>
              <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={form.eventNotifications} onChange={(e) => setForm({...form, eventNotifications: e.target.checked})} className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
                <span className="text-gray-700 text-sm">Event Creation Alerts</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SystemSettingsModal;
