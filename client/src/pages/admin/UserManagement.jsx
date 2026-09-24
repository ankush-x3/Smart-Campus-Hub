import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, 
  MoreVertical, Shield, User, GraduationCap, Download
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  
  // Mock Data
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Student', dept: 'Computer Science', year: '3rd Year', status: 'Active' },
    { id: 2, name: 'Dr. Sarah Smith', email: 's.smith@example.com', role: 'Faculty', dept: 'Mechanical', year: '-', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@system.com', role: 'Admin', dept: 'IT Services', year: '-', status: 'Active' },
    { id: 4, name: 'Mike Brown', email: 'mike.b@example.com', role: 'Student', dept: 'Civil', year: '1st Year', status: 'Suspended' },
    { id: 5, name: 'Prof. David Lee', email: 'd.lee@example.com', role: 'Faculty', dept: 'Computer Science', year: '-', status: 'Active' },
  ];

  const filteredUsers = roleFilter === 'All' ? users : users.filter(u => u.role === roleFilter);

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      toast.success('User deleted successfully');
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    toast.success('User created successfully');
    setIsAddUserModalOpen(false);
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
            <h3 className="text-xl font-bold text-gray-900">2,845</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><GraduationCap size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Students</p>
            <h3 className="text-xl font-bold text-gray-900">2,500</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><User size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Faculty</p>
            <h3 className="text-xl font-bold text-gray-900">320</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Shield size={20} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Admins</p>
            <h3 className="text-xl font-bold text-gray-900">25</h3>
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
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white hidden sm:block">
              <option value="All">All Departments</option>
              <option value="CS">Computer Science</option>
              <option value="Mech">Mechanical</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                </th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department & Year</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
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
                      user.role === 'Admin' ? 'danger' : 
                      user.role === 'Faculty' ? 'success' : 'primary'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{user.dept}</div>
                    <div className="text-gray-500 text-xs">{user.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to 5 of 2,845 results</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-rose-600 bg-rose-50 text-rose-600 rounded font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="CS">Computer Science</option>
                <option value="ME">Mechanical</option>
                <option value="EE">Electrical</option>
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium text-gray-700">Initial Password</label>
              <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Create User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
