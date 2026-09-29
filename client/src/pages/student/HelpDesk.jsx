import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle, Paperclip } from 'lucide-react';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function HelpDesk() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/complaints');
        setTickets((res.data.data || res.data).map(t => ({ ...t, id: t._id || t.id })));
      } catch (err) {
        toast.error('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Pending').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'success';
      case 'In Progress': return 'primary';
      default: return 'warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-rose-100 text-rose-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleNewTicket = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      description: formData.get('description')
    };
    try {
      const res = await api.post('/complaints', data);
      const newTicket = { ...res.data, id: res.data._id || res.data.id };
      setTickets([newTicket, ...tickets]);
      toast.success('Ticket submitted successfully!');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to submit ticket');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    try {
      await api.post(`/complaints/${selectedTicket.id}/comment`, { text });
      toast.success('Comment added');
      e.target.reset();
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Help Desk</h1>
          <p className="text-slate-500 mt-1">Submit and track your complaints and requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> New Ticket
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-medium text-slate-500">Total Tickets</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm text-center">
          <p className="text-sm font-medium text-amber-600">Pending</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{stats.open}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm text-center">
          <p className="text-sm font-medium text-blue-600">In Progress</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm text-center">
          <p className="text-sm font-medium text-emerald-600">Resolved</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.resolved}</p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <EmptyState message="No tickets submitted yet." />
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="p-5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-400">{ticket.id}</span>
                    <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    <span className={clsx("text-xs px-2 py-0.5 rounded-md font-semibold", getPriorityColor(ticket.priority))}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{ticket.title}</h3>
                  <p className="text-sm text-slate-500">Category: {ticket.category} • Submitted on {ticket.date}</p>
                </div>
                
                <div className="flex items-center text-slate-400">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">{ticket.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Ticket">
        <form onSubmit={handleNewTicket} className="p-2 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Title</label>
            <input type="text" name="title" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Brief summary of the issue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select name="category" className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="infrastructure">Infrastructure</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
                <option value="hostel">Hostel</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
              <select name="priority" className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea name="description" required rows={4} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Provide detailed information about the issue..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attachment (Optional)</label>
            <div className="border border-slate-300 rounded-xl p-3 flex items-center cursor-pointer hover:bg-slate-50 relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <Paperclip className="w-5 h-5 text-slate-400 mr-2" />
              <span className="text-sm text-slate-500">Upload a photo or screenshot</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700">Submit Ticket</button>
          </div>
        </form>
      </Modal>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket.id}`}>
          <div className="p-2">
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <Badge variant={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                <span className={clsx("text-xs px-2 py-0.5 rounded-md font-semibold", getPriorityColor(selectedTicket.priority))}>{selectedTicket.priority} Priority</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedTicket.title}</h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed border border-slate-100">{selectedTicket.description}</p>
            </div>

            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Status Timeline</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle className="w-4 h-4" /></div>
                  <div className="w-0.5 h-10 bg-emerald-500 my-1"></div>
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Ticket Submitted</p>
                  <p className="text-xs text-slate-500">{selectedTicket.date}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white", selectedTicket.status !== 'Pending' ? "bg-emerald-500" : "bg-slate-200")}>
                    {selectedTicket.status !== 'Pending' && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className={clsx("w-0.5 h-10 my-1", selectedTicket.status === 'Resolved' ? "bg-emerald-500" : "bg-slate-200")}></div>
                </div>
                <div>
                  <p className={clsx("font-bold text-sm", selectedTicket.status !== 'Pending' ? "text-slate-800" : "text-slate-400")}>In Progress</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white", selectedTicket.status === 'Resolved' ? "bg-emerald-500" : "bg-slate-200")}>
                    {selectedTicket.status === 'Resolved' && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
                <div>
                  <p className={clsx("font-bold text-sm", selectedTicket.status === 'Resolved' ? "text-slate-800" : "text-slate-400")}>Resolved</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-200">
              <form onSubmit={handleComment} className="flex gap-2">
                <input type="text" name="comment" required className="flex-1 border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Add a comment..." />
                <button type="submit" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Send</button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

