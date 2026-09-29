import React, { useState } from 'react';
import { 
  Bell, Plus, Search, Edit2, Trash2, Pin, Eye, Calendar, Tag
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FacultyNotices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [notices, setNotices] = useState([]);

  React.useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/announcements');
                setNotices((res.data.data || res.data).map(n => ({
          ...n, 
          id: n._id || n.id,
          title: n.title || 'Untitled',
          category: n.category ? n.category.charAt(0).toUpperCase() + n.category.slice(1) : 'General',
          date: new Date(n.createdAt).toLocaleDateString()
        })));
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      }
    };
    fetchNotices();
  }, []);

  const handleOpenModal = (notice = null) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const noticeData = {
      title: formData.get('title'),
      category: formData.get('category'),
      content: formData.get('content'),
      isPinned: formData.get('isPinned') === 'on'
    };

    try {
      if (editingNotice) {
        const res = await api.put(`/announcements/${editingNotice.id}`, noticeData);
        const updatedNotice = res.data;
        setNotices(notices.map(n => n.id === editingNotice.id ? { ...updatedNotice, id: updatedNotice._id || updatedNotice.id } : n));
        toast.success('Notice updated successfully!');
      } else {
        const res = await api.post('/announcements', noticeData);
        const newNotice = res.data;
        setNotices([...notices, { ...newNotice, id: newNotice._id || newNotice.id }]);
        toast.success('Notice posted successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save notice');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/announcements/${id}`);
        setNotices(notices.filter(n => n.id !== id));
        toast.success('Notice deleted');
      } catch (error) {
        toast.error('Failed to delete notice');
      }
    }
  };

  const togglePin = async (id) => {
    const notice = notices.find(n => n.id === id);
    if (!notice) return;
    try {
      const res = await api.put(`/announcements/${id}`, { ...notice, isPinned: !notice.isPinned });
      setNotices(notices.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      toast.success('Pin status updated');
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board Management</h1>
          <p className="text-gray-500 mt-1">Post and manage announcements for students.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Post Notice
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search notices..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date Posted</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.length > 0 ? notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {notice.isPinned && <Pin size={16} className="text-emerald-600 fill-emerald-100" />}
                      <span className="font-medium text-gray-900">{notice.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral">{notice.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {notice.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {notice.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => togglePin(notice.id)}
                        className={`p-1.5 rounded-lg transition-colors ${notice.isPinned ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                        title={notice.isPinned ? "Unpin" : "Pin"}
                      >
                        <Pin size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(notice)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(notice.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8">
                    <EmptyState icon={Bell} title="No notices posted" description="You haven't posted any notices yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNotice ? "Edit Notice" : "Post New Notice"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input 
              name="title"
              type="text" 
              required 
              defaultValue={editingNotice?.title || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Notice title..." 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select 
              name="category"
              required
              defaultValue={editingNotice?.category || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Category</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea 
              name="content"
              rows="5" 
              required
              defaultValue={editingNotice?.content || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Write the notice details here..."
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input 
              name="isPinned"
              type="checkbox" 
              id="isPinned" 
              defaultChecked={editingNotice?.isPinned || false}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" 
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">Pin to top of notice board</label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              {editingNotice ? 'Update Notice' : 'Post Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyNotices;


