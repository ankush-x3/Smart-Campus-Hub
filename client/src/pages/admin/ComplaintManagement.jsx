import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Search, Filter, MessageSquare 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const ComplaintManagement = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const complaints = [
    { id: 'C-2023-101', title: 'WiFi in Hostel B is very slow', category: 'IT Support', by: 'John Doe', priority: 'High', status: 'Pending', date: '2023-11-20' },
    { id: 'C-2023-102', title: 'Broken chair in Library', category: 'Infrastructure', by: 'Alice Smith', priority: 'Low', status: 'In Progress', date: '2023-11-19' },
    { id: 'C-2023-103', title: 'Mess food quality issue', category: 'Food & Dining', by: 'Mike Brown', priority: 'Medium', status: 'Resolved', date: '2023-11-15' },
    { id: 'C-2023-104', title: 'Lab computers not working', category: 'IT Support', by: 'Jane Doe', priority: 'High', status: 'Pending', date: '2023-11-21' },
  ];

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    toast.success('Complaint status updated successfully!');
    setIsModalOpen(false);
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
          <h3 className="text-2xl font-bold text-gray-900">124</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-amber-600">12</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500">In Progress</p>
          <h3 className="text-2xl font-bold text-blue-600">8</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-gray-500">Resolved</p>
          <h3 className="text-2xl font-bold text-emerald-600">104</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search ID or title..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {complaints.map((comp) => (
                <tr key={comp.id} className={`hover:bg-gray-50 ${comp.priority === 'High' && comp.status === 'Pending' ? 'bg-rose-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-500">{comp.id}</div>
                    <div className="font-medium text-gray-900">{comp.title}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{comp.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${comp.priority === 'High' ? 'bg-red-100 text-red-700' : comp.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {comp.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{comp.by}</td>
                  <td className="px-6 py-4">
                    <Badge variant={comp.status === 'Resolved' ? 'success' : comp.status === 'In Progress' ? 'primary' : 'warning'}>
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
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Update Complaint: ${selectedComplaint?.id}`}>
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4">
            <p className="font-semibold mb-1">{selectedComplaint?.title}</p>
            <p>Reported by: {selectedComplaint?.by}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Update Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" defaultValue={selectedComplaint?.status}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Official Comment</label>
            <textarea rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" placeholder="Add a comment to notify the user..."></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg">Save Update</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintManagement;
