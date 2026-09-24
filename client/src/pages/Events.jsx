import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Filter, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const mockEvents = [
  { id: 1, title: 'Introduction to Machine Learning', date: '2024-10-24T14:00:00', location: 'Auditorium A', category: 'workshop', attendees: 145, maxCapacity: 200, image: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { id: 2, title: 'Career Fair 2024', date: '2024-10-25T10:00:00', location: 'Main Ground', category: 'general', attendees: 850, maxCapacity: 1000, image: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  { id: 3, title: 'Web Development Workshop', date: '2024-10-25T16:00:00', location: 'Lab 3', category: 'workshop', attendees: 40, maxCapacity: 40, image: 'bg-gradient-to-br from-purple-500 to-pink-600' },
  { id: 4, title: 'Annual Sports Meet', date: '2024-11-02T08:00:00', location: 'Sports Complex', category: 'sports', attendees: 320, maxCapacity: 500, image: 'bg-gradient-to-br from-orange-400 to-red-500' },
  { id: 5, title: 'Guest Lecture: Future of AI', date: '2024-11-05T11:00:00', location: 'Virtual', category: 'seminar', attendees: 120, maxCapacity: 300, image: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { id: 6, title: 'Cultural Night: Diwali Celebration', date: '2024-11-10T18:00:00', location: 'Open Air Theatre', category: 'cultural', attendees: 450, maxCapacity: 800, image: 'bg-gradient-to-br from-amber-400 to-orange-500' },
];

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = ['all', 'academic', 'cultural', 'sports', 'workshop', 'seminar', 'general'];

  const handleRegister = (e, eventId, isFull) => {
    e.stopPropagation();
    if (isFull) {
      toast.error('Event is full');
      return;
    }
    toast.success('Successfully registered for event!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-800/90 z-10"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] z-0"></div>
        
        <div className="relative z-20 p-8 sm:p-12 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Campus Events</h1>
            <p className="text-indigo-100 max-w-xl text-lg">Discover and register for workshops, seminars, sports, and cultural events happening around the campus.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center shrink-0">
            <p className="text-3xl font-bold text-white mb-1">12</p>
            <p className="text-sm font-medium text-indigo-200">Upcoming Events</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-slate-200 p-1 rounded-lg w-full sm:w-auto">
          {['upcoming', 'past', 'my-events'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map(cat => (
             <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors border",
                activeCategory === cat 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map(event => {
          const date = new Date(event.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const isFull = event.attendees >= event.maxCapacity;

          return (
            <div 
              key={event.id} 
              onClick={() => navigate(`/events/${event.id}`)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden cursor-pointer flex flex-col h-full"
            >
              <div className={clsx("h-32 p-4 relative flex items-start justify-between", event.image)}>
                <Badge variant="solid" color="white" className="bg-white/20 backdrop-blur-md text-white border-none shadow-sm">
                  {event.category}
                </Badge>
                
                <div className="bg-white rounded-lg p-2 text-center shadow-sm w-14">
                  <p className="text-xs font-bold text-slate-500 uppercase leading-none mb-1">{month}</p>
                  <p className="text-xl font-bold text-slate-900 leading-none">{day}</p>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center text-slate-500 text-sm">
                    <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                    {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    {event.attendees} / {event.maxCapacity} attendees
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full", isFull ? "bg-rose-500" : "bg-indigo-500")}
                    style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                  ></div>
                </div>
                
                <button 
                  onClick={(e) => handleRegister(e, event.id, isFull)}
                  disabled={isFull}
                  className={clsx(
                    "w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center transition-colors",
                    isFull 
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed" 
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                  )}
                >
                  {isFull ? 'Event Full' : 'Register Now'} 
                  {!isFull && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
