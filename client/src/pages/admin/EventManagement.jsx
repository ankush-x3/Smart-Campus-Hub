import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Plus, Edit2, Trash2, Search, Filter, XCircle 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const EventManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [events, setEvents] = useState([
    { id: 1, title: 'Annual Tech Fest 2023', category: 'Festival', date: '2023-12-15', organizer: 'Student Council', registered: 850, max: 1000, status: 'Upcoming' },
    { id: 2, title: 'Workshop on Machine Learning', category: 'Workshop', date: '2023-12-05', organizer: 'Prof. Smith', registered: 42, max: 50, status: 'Upcoming' },
    { id: 3, title: 'Alumni Meet & Greet', category: 'Networking', date: '2023-11-20', organizer: 'Alumni Association', registered: 150, max: 200, status: 'Completed' },
    { id: 4, title: 'Outdoor Sports Tournament', category: 'Sports', date: '2023-12-01', organizer: 'Sports Committee', registered: 120, max: 200, status: 'Cancelled' },
  ]);

  const handleCancelEvent = (id) => {
    if(window.confirm('Are you sure you want to cancel this event? Notifications will be sent to all registered users.')) {
      setEvents(events.map(e => e.id === id ? { ...e, status: 'Cancelled' } : e));
      toast.success('Event cancelled. Users notified.');
    }
  };

  const handleDeleteEvent = (id) => {
    if(window.confirm('Permanently delete this event record?')) {
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-500 mt-1">Oversee and moderate all campus events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white">
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Event Title</th>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Registrations</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-gray-500 text-xs">{event.category}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{event.organizer}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1"><Calendar size={14}/> {event.date}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={14}/> {event.registered}/{event.max}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={event.status === 'Upcoming' ? 'success' : event.status === 'Completed' ? 'primary' : 'danger'}>
                      {event.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1">Edit</button>
                      {event.status === 'Upcoming' && (
                        <button onClick={() => handleCancelEvent(event.id)} className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1">Cancel</button>
                      )}
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Admin Event" size="lg">
        <div className="p-4 text-center text-gray-500">
          <p>Standard event creation form goes here.</p>
          <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default EventManagement;
