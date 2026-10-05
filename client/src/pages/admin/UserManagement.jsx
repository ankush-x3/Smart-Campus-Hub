import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, 
  Shield, User, GraduationCap, Download
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const UserManagement = () => {
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, students: 0, faculty: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('student');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', { params: { search, role: roleFilter === 'All' ? '' : roleFilter.toLowerCase() } });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchStats()]).finally(() => setLoading(false));
  }, [roleFilter, search]);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await api.delete(`/users/${id}`);
        if (res.data.success) {
          toast.success('User deleted successfully');
          fetchUsers();
          fetchStats();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const openEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsEditRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    try {
      const res = await api.put(`/users/${selectedUser._id}/role`, { role: newRole });
      if (res.data.success) {
        toast.success('Role updated successfully');
        setIsEditRoleModalOpen(false);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Ensure lowercase role
    data.role = data.role.toLowerCase();

    try {
      const res = await api.post('/users', data);
      if (res.data.success) {
        toast.success('User created successfully');
        setIsAddUserModalOpen(false);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage students, faculty, and administrators.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Users</p>
            <h3 className="text-xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><GraduationCap size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Students</p>
            <h3 className="text-xl font-bold text-gray-900">{stats.students}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><User size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Faculty</p>
            <h3 className="text-xl font-bold text-gray-900">{stats.faculty}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Shield size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Admins</p>
            <h3 className="text-xl font-bold text-gray-900">{stats.admins}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                  </th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department & Year</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-gray-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.role === 'admin' ? 'danger' : 
                        user.role === 'faculty' ? 'success' : 'primary'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{user.department || '-'}</div>
                      <div className="text-gray-500 text-xs">{user.year || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditRole(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Role">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Add New User">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" minLength="6" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" name="department" className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student / Faculty ID</label>
              <input type="text" name="idNumber" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Add User</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditRoleModalOpen} onClose={() => setIsEditRoleModalOpen(false)} title="Edit User Role">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Change role for <strong>{selectedUser?.name}</strong></p>
          <select 
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setIsEditRoleModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleUpdateRole} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Role</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;

