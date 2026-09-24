import { useState } from 'react';
import { Monitor, Video, Calendar as CalendarIcon, Clock, Users, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const mockResources = [
  { id: 1, name: 'Main Auditorium', type: 'Hall', capacity: 500, features: ['Projector', 'PA System', 'AC'], available: true, icon: Users },
  { id: 2, name: 'Computer Lab 3', type: 'Lab', capacity: 40, features: ['40 PCs', 'Projector', 'Whiteboard'], available: true, icon: Monitor },
  { id: 3, name: 'Conference Room A', type: 'Meeting', capacity: 15, features: ['Video Conferencing', 'Smart TV'], available: false, icon: Video },
  { id: 4, name: 'Seminar Hall B', type: 'Hall', capacity: 100, features: ['Projector', 'Mic System', 'AC'], available: true, icon: Users },
];

const Resources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const handleBookClick = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success('Resource booking request submitted for approval.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Campus Resources</h2>
        <p className="text-slate-500">Book labs, halls, and meeting rooms for your academic and extracurricular needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div key={resource.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="soft" color={resource.available ? 'emerald' : 'rose'}>
                  {resource.available ? 'Available' : 'Booked'}
                </Badge>
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{resource.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{resource.type} • Capacity: {resource.capacity}</p>
              
              <div className="flex flex-wrap gap-2 mb-6 flex-1">
                {resource.features.map((feature, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                    {feature}
                  </span>
                ))}
              </div>
              
              <button
                onClick={() => handleBookClick(resource)}
                disabled={!resource.available}
                className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${
                  resource.available
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {resource.available ? 'Book Now' : 'Currently Unavailable'}
                {resource.available && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Book ${selectedResource?.name}`}>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 flex gap-4 text-sm">
             <div>
               <span className="text-slate-500 block mb-1">Capacity</span>
               <span className="font-semibold text-slate-900">{selectedResource?.capacity} pax</span>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div>
               <span className="text-slate-500 block mb-1">Type</span>
               <span className="font-semibold text-slate-900">{selectedResource?.type}</span>
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input type="date" required className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="time" required className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="time" required className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Booking</label>
            <textarea required rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Briefly describe the purpose..."></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Resources;
