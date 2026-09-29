import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Plus, Edit2, Trash2, Pin, Calendar, Eye
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { format } from 'date-fns';

const NoticeManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchNotices = async () => {
    try {
      const res = await api.get('/announcements', { params: { search, category: category !== 'All' ? category.toLowerCase() : '' } });
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotices();
  }, [search, category]);

  const handleOpenModal = (notice = null) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      category: formData.get('category').toLowerCase(),
      content: formData.get('content'),
      isPinned: formData.get('isPinned') === 'on'
    };

    try {
      if (editingNotice) {
        await api.put(`/announcements/${editingNotice._id}`, data);
        toast.success('Notice updated successfully!');
      } else {
        await api.post('/announcements', data);
        toast.success('Notice created successfully!');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save notice');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this notice globally?')) {
      try {
        await api.delete(`/announcements/${id}`);
        toast.success('Notice deleted');
        fetchNotices();
      } catch (err) {
        toast.error('Failed to delete notice');
      }
    }
  };

  const togglePin = async (notice) => {
    try {
      await api.put(`/announcements/${notice._id}`, { isPinned: !notice.isPinned });
      toast.success('Notice pin status updated');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to update pin status');
    }
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
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notices..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No notices found.</div>
          ) : (
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
                  <tr key={notice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && <Pin size={16} className="text-rose-600 fill-rose-100" />}
                        <span className="font-medium text-gray-900">{notice.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant="neutral" className="capitalize">{notice.category}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{notice.author?.name || 'System'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {format(new Date(notice.createdAt), 'MMM dd, yyyy')}</span>
                        <span className="flex items-center gap-1"><Eye size={12}/> {notice.views || 0} views</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => togglePin(notice)} className={`p-1.5 rounded-lg transition-colors ${notice.isPinned ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Pin/Unpin">
                          <Pin size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(notice)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(notice._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNotice ? "Edit Notice" : "Create Global Notice"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notice Title</label>
            <input type="text" name="title" required defaultValue={editingNotice?.title || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select name="category" required defaultValue={editingNotice?.category ? editingNotice.category.charAt(0).toUpperCase() + editingNotice.category.slice(1) : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="Academic">Academic</option>
                <option value="Event">Event</option>
                <option value="General">General</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea name="content" rows="6" required defaultValue={editingNotice?.content || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isPinned" id="isPinnedGlobal" defaultChecked={editingNotice?.isPinned || false} className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4" />
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
