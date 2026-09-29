import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Plus, Edit2, Trash2, Search, Filter, XCircle 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { format } from 'date-fns';

const EventManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events', { params: { search, status: status !== 'All' ? status.toLowerCase() : '' } });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [search, status]);

  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      category: formData.get('category').toLowerCase(),
      date: formData.get('date'),
      endDate: formData.get('endDate') || formData.get('date'),
      location: formData.get('location'),
      maxAttendees: formData.get('maxAttendees') ? parseInt(formData.get('maxAttendees')) : undefined,
      description: formData.get('description'),
    };

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, data);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', data);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleCancelEvent = async (id) => {
    if(window.confirm('Are you sure you want to cancel this event? Notifications will be sent to all registered users.')) {
      try {
        await api.put(`/events/${id}`, { status: 'cancelled' });
        toast.success('Event cancelled. Users notified.');
        fetchEvents();
      } catch (err) {
        toast.error('Failed to cancel event');
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if(window.confirm('Permanently delete this event record?')) {
      try {
        await api.delete(`/events/${id}`);
        toast.success('Event deleted');
        fetchEvents();
      } catch (err) {
        toast.error('Failed to delete event');
      }
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
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 text-sm bg-white"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No events found.</div>
          ) : (
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
                  <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-gray-500 text-xs capitalize">{event.category}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{event.organizer?.name || 'Admin'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1"><Calendar size={14}/> {format(new Date(event.date), 'MMM dd, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={14}/> {event.registeredUsers?.length || 0}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="capitalize" variant={event.status === 'upcoming' ? 'success' : event.status === 'completed' ? 'primary' : 'danger'}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(event)} className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1">Edit</button>
                        {event.status === 'upcoming' && (
                          <button onClick={() => handleCancelEvent(event._id)} className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1">Cancel</button>
                        )}
                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? "Edit Event" : "Create Event"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" name="title" required defaultValue={editingEvent?.title || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select name="category" required defaultValue={editingEvent?.category ? editingEvent.category.charAt(0).toUpperCase() + editingEvent.category.slice(1) : 'Academic'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500">
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" required defaultValue={editingEvent?.location || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Start Date & Time</label>
              <input type="datetime-local" name="date" required defaultValue={editingEvent?.date ? new Date(editingEvent.date).toISOString().slice(0,16) : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Max Attendees (optional)</label>
              <input type="number" name="maxAttendees" defaultValue={editingEvent?.maxAttendees || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows="4" required defaultValue={editingEvent?.description || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">{editingEvent ? 'Update Event' : 'Create Event'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventManagement;
