const fs = require('fs');
let content = fs.readFileSync('client/src/pages/admin/UserManagement.jsx', 'utf8');

// Replace handleAddUser
const oldHandleAddUser = `  const handleAddUser = (e) => {
    e.preventDefault();
    toast.error('Direct user creation by admin is not fully implemented in API yet. Use Registration portal.');
    setIsAddUserModalOpen(false);
  };`;

const newHandleAddUser = `  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Ensure lowercase role
    data.role = data.role.toLowerCase();

    try {
      const res = await api.post('/admin/users', data);
      if (res.data.success) {
        toast.success('User created successfully');
        setIsAddUserModalOpen(false);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };`;

content = content.replace(oldHandleAddUser, newHandleAddUser);

// Replace Add User form
const oldForm = `<form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option>Student</option>
                <option>Faculty</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Add User</button>
          </div>
        </form>`;

const newForm = `<form onSubmit={handleAddUser} className="space-y-4">
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
        </form>`;

content = content.replace(oldForm, newForm);

fs.writeFileSync('client/src/pages/admin/UserManagement.jsx', content);
