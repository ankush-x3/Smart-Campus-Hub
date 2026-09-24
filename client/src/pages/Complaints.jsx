import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, Plus, MoreVertical } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const mockComplaints = [
  { id: 'CMP-001', title: 'Leaking tap in Bio Lab', category: 'Infrastructure', status: 'pending', priority: 'medium', date: '2024-10-23', comments: 0 },
  { id: 'CMP-002', title: 'Wi-Fi completely down in Block C', category: 'IT', status: 'in-progress', priority: 'high', date: '2024-10-22', comments: 2 },
  { id: 'CMP-003', title: 'Projector not working in Room 304', category: 'Equipment', status: 'resolved', priority: 'medium', date: '2024-10-20', comments: 1 },
  { id: 'CMP-004', title: 'Cafeteria hygiene concerns', category: 'Services', status: 'pending', priority: 'low', date: '2024-10-24', comments: 0 },
];

const Complaints = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: mockComplaints.length,
    pending: mockComplaints.filter(c => c.status === 'pending').length,
    inProgress: mockComplaints.filter(c => c.status === 'in-progress').length,
    resolved: mockComplaints.filter(c => c.status === 'resolved').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'emerald';
      case 'in-progress': return 'blue';
      case 'pending': return 'amber';
      default: return 'slate';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'rose';
      case 'medium': return 'amber';
      case 'low': return 'slate';
      default: return 'slate';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success('Complaint submitted successfully. Track status using ID.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {['all', 'pending', 'in-progress', 'resolved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> New Complaint
          </button>
        </div>

        {/* List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID & Title</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {mockComplaints
                .filter(c => activeTab === 'all' || c.status === activeTab)
                .map((complaint) => (
                <tr key={complaint.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-slate-400 mb-1">{complaint.id}</div>
                    <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{complaint.title}</div>
                  </td>
                  <td className="px-6 py-4">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <Badge variant="soft" color={getStatusColor(complaint.status)} className="capitalize">
                      {complaint.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" color={getPriorityColor(complaint.priority)} className="capitalize">
                      {complaint.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{complaint.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                       <span className="flex items-center text-xs"><MessageSquare className="w-3 h-3 mr-1" /> {complaint.comments}</span>
                       <button className="p-1 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="File a Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Brief summary of the issue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Infrastructure</option>
                <option>IT & Network</option>
                <option>Equipment</option>
                <option>Services</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea required rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Provide detailed information about the issue..."></textarea>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Attachment (Optional)</label>
             <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">Submit Complaint</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;
