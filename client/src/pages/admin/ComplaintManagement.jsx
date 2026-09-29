import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Search, Filter, MessageSquare 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { format } from 'date-fns';

const ComplaintManagement = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get('status').toLowerCase();
    const comment = formData.get('comment');

    try {
      await api.put(`/complaints/${selectedComplaint._id}/status`, { status });
      
      if (comment.trim()) {
        await api.post(`/complaints/${selectedComplaint._id}/comment`, { text: comment });
      }

      toast.success('Complaint updated successfully!');
      setIsModalOpen(false);
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to update complaint');
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c._id.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grievance & Complaints</h1>
        <p className="text-gray-500 mt-1">Track and resolve student and faculty complaints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Complaints</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500">In Progress</p>
          <h3 className="text-2xl font-bold text-blue-600">{stats.inProgress}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-gray-500">Resolved</p>
          <h3 className="text-2xl font-bold text-emerald-600">{stats.resolved}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No complaints found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID & Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Submitted By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((comp) => (
                  <tr key={comp._id} className={`hover:bg-gray-50 ${comp.priority === 'high' && comp.status === 'pending' ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-gray-500" title={comp._id}>#{comp._id.slice(-6).toUpperCase()}</div>
                      <div className="font-medium text-gray-900">{comp.title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{comp.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${comp.priority === 'high' ? 'bg-red-100 text-red-700' : comp.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {comp.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{comp.submittedBy?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <Badge className="capitalize" variant={comp.status === 'resolved' ? 'success' : comp.status === 'in-progress' ? 'primary' : comp.status === 'rejected' ? 'danger' : 'warning'}>
                        {comp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedComplaint(comp); setIsModalOpen(true); }}
                        className="text-rose-600 font-medium hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Update Complaint: #${selectedComplaint?._id?.slice(-6).toUpperCase()}`}>
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4">
            <p className="font-semibold mb-1">{selectedComplaint?.title}</p>
            <p>Reported by: {selectedComplaint?.submittedBy?.name || 'Unknown'}</p>
            <p className="text-gray-500 mt-2">{selectedComplaint?.description}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Update Status</label>
            <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" defaultValue={selectedComplaint?.status ? selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1) : 'Pending'}>
              <option value="Pending">Pending</option>
              <option value="In-progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Official Comment (Optional)</label>
            <textarea name="comment" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" placeholder="Add a comment to notify the user..."></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Save Update</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintManagement;
