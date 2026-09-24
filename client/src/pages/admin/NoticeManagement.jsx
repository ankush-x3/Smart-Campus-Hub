import React, { useState } from 'react';
import { 
  Bell, Search, Plus, Edit2, Trash2, Pin, Calendar, Eye
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const NoticeManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [notices, setNotices] = useState([
    { id: 1, title: 'Semester Registration Deadline', category: 'Academic', author: 'Admin System', date: '2023-11-01', views: 1450, isPinned: true },
    { id: 2, title: 'Hostel Maintenance Schedule', category: 'General', author: 'Warden Office', date: '2023-11-05', views: 890, isPinned: false },
    { id: 3, title: 'Diwali Holidays Announcement', category: 'Administrative', author: 'Registrar', date: '2023-11-10', views: 2100, isPinned: true },
    { id: 4, title: 'Campus Placement Drive 2024', category: 'Career', author: 'Placement Cell', date: '2023-11-12', views: 1850, isPinned: false },
  ]);

  const handleOpenModal = (notice = null) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(editingNotice ? 'Notice updated successfully!' : 'Notice created successfully!');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this notice globally?')) {
      setNotices(notices.filter(n => n.id !== id));
      toast.success('Notice deleted');
    }
  };

  const togglePin = (id) => {
    setNotices(notices.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    toast.success('Notice pin status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board Administration</h1>
          <p className="text-gray-500 mt-1">Manage global campus announcements.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Notice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white">
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Administrative">Administrative</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notices..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" /></th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date & Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {notice.isPinned && <Pin size={16} className="text-rose-600 fill-rose-100" />}
                      <span className="font-medium text-gray-900">{notice.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant="neutral">{notice.category}</Badge></td>
                  <td className="px-6 py-4 text-gray-600">{notice.author}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {notice.date}</span>
                      <span className="flex items-center gap-1"><Eye size={12}/> {notice.views} views</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePin(notice.id)} className={`p-1.5 rounded-lg transition-colors ${notice.isPinned ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Pin/Unpin">
                        <Pin size={16} />
                      </button>
                      <button onClick={() => handleOpenModal(notice)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(notice.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNotice ? "Edit Notice" : "Create Global Notice"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notice Title</label>
            <input type="text" required defaultValue={editingNotice?.title || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select required defaultValue={editingNotice?.category || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Author Display Name</label>
              <input type="text" required defaultValue={editingNotice?.author || 'Admin System'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea rows="6" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPinnedGlobal" defaultChecked={editingNotice?.isPinned || false} className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4" />
            <label htmlFor="isPinnedGlobal" className="text-sm font-medium text-gray-700">Pin as important globally</label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">{editingNotice ? 'Update' : 'Publish'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
