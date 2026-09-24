import React, { useState, useEffect } from 'react';
import { Building2, Monitor, Users, DoorOpen, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Resources() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [tab, setTab] = useState('All');
  const [activeView, setActiveView] = useState('book'); // 'book' or 'my-bookings'
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const types = ['All', 'Classroom', 'Lab', 'Auditorium', 'Meeting Room'];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/student/resources');
        setResources(res.data);
      } catch (err) {
        setResources([
          { id: 1, name: 'Computer Lab 3', type: 'Lab', capacity: 40, building: 'Block A', isAvailable: true, amenities: ['PCs', 'Projector', 'AC', 'Whiteboard'], icon: 'Monitor' },
          { id: 2, name: 'Seminar Hall 1', type: 'Auditorium', capacity: 150, building: 'Block C', isAvailable: false, amenities: ['Projector', 'PA System', 'AC'], icon: 'Users' },
          { id: 3, name: 'Meeting Room B', type: 'Meeting Room', capacity: 10, building: 'Block B', isAvailable: true, amenities: ['TV', 'Whiteboard', 'AC'], icon: 'DoorOpen' },
          { id: 4, name: 'Classroom 301', type: 'Classroom', capacity: 60, building: 'Block A', isAvailable: true, amenities: ['Projector', 'Whiteboard'], icon: 'Building2' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Monitor': return <Monitor className="w-8 h-8" />;
      case 'Users': return <Users className="w-8 h-8" />;
      case 'DoorOpen': return <DoorOpen className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!bookingDate || !selectedSlot) {
      toast.error('Please select date and time slot.');
      return;
    }
    toast.success(`Booked ${selectedResource.name} successfully!`);
    setIsModalOpen(false);
    setSelectedResource(null);
    setBookingDate('');
    setSelectedSlot(null);
  };

  const filteredResources = resources.filter(r => tab === 'All' || r.type === tab);

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Resource Booking</h1>
          <p className="text-slate-500 mt-1">Book labs, meeting rooms, and auditoriums</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveView('book')} 
            className={clsx("px-6 py-2 rounded-lg font-medium text-sm transition-colors", activeView === 'book' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Book Resource
          </button>
          <button 
            onClick={() => setActiveView('my-bookings')} 
            className={clsx("px-6 py-2 rounded-lg font-medium text-sm transition-colors", activeView === 'my-bookings' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            My Bookings
          </button>
        </div>
      </div>

      {activeView === 'book' ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                  tab === t ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(res => (
              <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center">
                  <span className={clsx("w-2.5 h-2.5 rounded-full mr-2", res.isAvailable ? "bg-emerald-500" : "bg-rose-500")}></span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{res.isAvailable ? 'Available' : 'Booked'}</span>
                </div>
                
                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                  {getIcon(res.icon)}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{res.name}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {res.building}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {res.capacity} max</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {res.amenities.map(a => (
                    <span key={a} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">{a}</span>
                  ))}
                </div>

                <button 
                  onClick={() => { setSelectedResource(res); setIsModalOpen(true); }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="You have no upcoming bookings." />
      )}

      {/* Booking Modal */}
      {selectedResource && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Book ${selectedResource.name}`}>
          <form onSubmit={handleBook} className="p-2">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(slot => {
                  const isBooked = Math.random() > 0.7; // Mock booked slots
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={clsx(
                        "py-2 rounded-lg text-sm font-medium border transition-colors",
                        isBooked ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through" :
                        selectedSlot === slot ? "bg-indigo-600 text-white border-indigo-600 shadow-md" :
                        "bg-white text-slate-700 border-slate-300 hover:border-indigo-500"
                      )}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
