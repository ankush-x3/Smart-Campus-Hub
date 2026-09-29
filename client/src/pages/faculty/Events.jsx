import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Users, Plus, Edit2, Trash2, Search, Filter 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FacultyEvents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      const data = res.data.data || res.data;
      
      const mappedEvents = data.map(e => ({
        id: e._id || e.id,
        title: e.title,
        date: e.startDate ? new Date(e.startDate).toLocaleDateString() : 'N/A',
        endDate: e.endDate ? new Date(e.endDate).toLocaleDateString() : 'N/A',
        time: e.startDate && e.endDate ? `${new Date(e.startDate).toLocaleTimeString()} - ${new Date(e.endDate).toLocaleTimeString()}` : 'N/A',
        location: e.location || 'Campus',
        category: e.category || 'Event',
        maxAttendees: e.capacity || 100,
        registered: e.attendees ? e.attendees.length : 0,
        status: e.status || 'Upcoming',
        attendees: e.attendees || []
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      title: formData.get('title'),
      category: formData.get('category'),
      location: formData.get('location'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      capacity: parseInt(formData.get('maxAttendees')),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl')
    };

    try {
      await api.post('/events', newEvent);
      toast.success('Event created successfully!');
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to cancel this event?')) {
      try {
        await api.delete(`/events/${id}`);
        toast.success('Event cancelled');
        fetchEvents();
      } catch (error) {
        console.error(error);
        toast.error('Failed to cancel event');
      }
    }
  };

  const openAttendeesModal = (event) => {
    setSelectedEvent(event);
    setIsAttendeesModalOpen(true);
  };

  const attendees = selectedEvent?.attendees || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-500 mt-1">Organize and manage your events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-32 bg-emerald-100 flex items-center justify-center relative">
              <Calendar size={48} className="text-emerald-300" />
              <div className="absolute top-4 right-4">
                <Badge variant="success">{event.status}</Badge>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-2">
                <Badge variant="neutral" className="mb-2">{event.category}</Badge>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
              </div>
              
              <div className="space-y-3 mt-4 text-sm text-gray-600 flex-1">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.date}</p>
                    <p>{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p>{event.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <p>{event.registered} / {event.maxAttendees} Registered</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 mb-6">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${(event.registered / event.maxAttendees) * 100}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button 
                  onClick={() => openAttendeesModal(event)}
                  className="py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 font-medium transition-colors"
                >
                  Attendees
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex justify-center items-center py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 flex justify-center items-center py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Event"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Event Title</label>
              <input type="text" name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="Workshop">Workshop</option>
                <option value="Lecture">Guest Lecture</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startDate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input type="date" name="endDate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Max Attendees</label>
              <input type="number" name="maxAttendees" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" name="imageUrl" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows="4" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Create Event</button>
          </div>
        </form>
      </Modal>

      {/* Attendees Modal */}
      <Modal
        isOpen={isAttendeesModalOpen}
        onClose={() => setIsAttendeesModalOpen(false)}
        title="Registered Attendees"
        size="md"
      >
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 font-medium text-gray-600">Roll No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendees.map(a => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-gray-900 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-gray-500">{a.rollNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default FacultyEvents;


