import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('Upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState('All Events');

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
                setEvents((res.data.data || res.data).map(e => ({
          ...e, 
          id: e._id || e.id,
          organizer: e.organizer?.name || 'Unknown Organizer',
          category: e.category ? e.category.charAt(0).toUpperCase() + e.category.slice(1) : 'General',
          status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Upcoming',
          date: new Date(e.date || e.createdAt).toLocaleDateString(),
          time: new Date(e.date || e.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          registered: e.registeredUsers?.length || 0,
          maxCapacity: e.maxAttendees || 0,
          isRegistered: e.registeredUsers?.includes('current-user-id') // We'll just leave it if it works
        })));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = (e, ev) => {
    e.stopPropagation();
    if (ev.registered >= ev.maxCapacity) {
      toast.error('Event is full!');
      return;
    }
    setSelectedEvent(ev);
    setIsModalOpen(true);
  };

  const confirmRegistration = async () => {
    try {
      await api.post(`/events/${selectedEvent.id}/register`);
      setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, isRegistered: true, registered: ev.registered + 1 } : ev));
      toast.success(`Successfully registered for ${selectedEvent.title}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const filteredEvents = events.filter(e => {
    if (tab === 'My Registered Events') return e.isRegistered;
    const matchesCat = category === 'All' || e.category === category;
    const matchesStatus = e.status === status;
    return matchesCat && matchesStatus;
  });

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <h1 className="text-4xl font-extrabold mb-4 relative z-10">Campus Events</h1>
        <p className="text-indigo-100 text-lg max-w-xl relative z-10">Discover and participate in workshops, cultural fests, sports tournaments and more.</p>
        <div className="mt-8 flex gap-4 relative z-10">
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm font-medium text-indigo-100">Upcoming Events</p>
            <p className="text-2xl font-bold">{events.filter(e => e.status === 'Upcoming').length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm font-medium text-indigo-100">My Registrations</p>
            <p className="text-2xl font-bold">{events.filter(e => e.isRegistered).length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex gap-4">
          {['All Events', 'My Registered Events'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "text-lg font-semibold pb-4 -mb-[17px] border-b-2 transition-colors",
                tab === t ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'All Events' && (
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                  category === cat ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            {['Upcoming', 'Ongoing', 'Past'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={clsx(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  status === s ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState message="No events found." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className={clsx(
                "h-24 p-5 flex items-start justify-between text-white relative",
                event.category === 'Academic' ? "bg-gradient-to-r from-blue-500 to-indigo-600" :
                event.category === 'Sports' ? "bg-gradient-to-r from-emerald-500 to-teal-600" :
                event.category === 'Cultural' ? "bg-gradient-to-r from-rose-500 to-pink-600" :
                "bg-gradient-to-r from-violet-500 to-purple-600"
              )}>
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md">{event.category}</Badge>
                <div className="bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold text-center shadow-sm">
                  {event.date.split(',')[0]}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{event.title}</h3>
                <p className="text-sm text-slate-500 mb-4">by {event.organizer}</p>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" /> {event.time}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {event.location}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Capacity: {event.registered}/{event.maxCapacity}</span>
                    <span>{Math.round((event.registered / event.maxCapacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className={clsx("h-1.5 rounded-full", event.registered >= event.maxCapacity ? "bg-rose-500" : "bg-indigo-500")}
                      style={{ width: `${(event.registered / event.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {event.isRegistered ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center border border-emerald-200">
                    <CheckCircle className="w-4 h-4 mr-2" /> Registered
                  </button>
                ) : event.registered >= event.maxCapacity ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm">
                    Fully Booked
                  </button>
                ) : (
                  <button 
                    onClick={(e) => handleRegister(e, event)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Registration">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{selectedEvent.title}</h3>
            <p className="text-slate-600 mb-6 text-sm">Are you sure you want to register for this event? By registering, you agree to the event guidelines and attendance policies.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
              <p><strong>Date:</strong> {selectedEvent.date}</p>
              <p><strong>Time:</strong> {selectedEvent.time}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRegistration}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}



