import { useState } from 'react';
import { Search, Filter, Pin, Clock, Eye, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const mockAnnouncements = [
  { id: 1, title: 'Mid-term Exam Schedule Released', content: 'The mid-term examination schedule for the Fall 2024 semester has been released. Please check your respective department notice boards or the academic portal for detailed timings. All exams will be conducted in-person.', date: '2 hours ago', category: 'urgent', author: 'Academic Office', views: 342, pinned: true },
  { id: 2, title: 'Campus Wi-Fi Maintenance', content: 'There will be a scheduled maintenance of the campus Wi-Fi network this Saturday from 2:00 AM to 6:00 AM. Intermittent connectivity issues are expected during this window.', date: '5 hours ago', category: 'general', author: 'IT Dept', views: 156, pinned: true },
  { id: 3, title: 'Annual Tech Fest Registration Open', content: 'Registrations for the Annual Tech Fest "Innovate 2024" are now open! Participate in hackathons, coding challenges, and robotics competitions. Early bird registration ends next week.', date: '1 day ago', category: 'event', author: 'Student Council', views: 890, pinned: false },
  { id: 4, title: 'New Course Add/Drop Deadline', content: 'This is a gentle reminder that the deadline for adding or dropping courses for this semester is next Friday at 5:00 PM. No requests will be entertained after the deadline.', date: '2 days ago', category: 'academic', author: 'Registrar', views: 420, pinned: false },
  { id: 5, title: 'Library Hours Extended', content: 'Good news! The central library hours have been extended until 2:00 AM on weekdays to support students preparing for upcoming mid-term exams.', date: '3 days ago', category: 'general', author: 'Chief Librarian', views: 612, pinned: false },
];

const Announcements = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', 'academic', 'event', 'general', 'urgent'];

  const filteredAnnouncements = mockAnnouncements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || ann.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.pinned);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success('Announcement created successfully');
  };

  const AnnouncementCard = ({ announcement }) => {
    const isExpanded = expandedId === announcement.id;
    
    return (
      <div 
        className={clsx(
          "bg-white rounded-xl border p-5 transition-all shadow-sm",
          announcement.pinned ? "border-amber-200 bg-amber-50/30" : "border-slate-200 hover:shadow-md",
          isExpanded && !announcement.pinned ? "ring-2 ring-indigo-500 border-transparent" : ""
        )}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 items-center">
            {announcement.pinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />}
            <Badge 
              variant="soft" 
              color={announcement.category === 'urgent' ? 'rose' : announcement.category === 'event' ? 'emerald' : announcement.category === 'academic' ? 'blue' : 'slate'}
              className="capitalize"
            >
              {announcement.category}
            </Badge>
          </div>
          <div className="flex items-center text-slate-400 text-xs font-medium space-x-3">
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{announcement.date}</span>
            <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{announcement.views}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setExpandedId(isExpanded ? null : announcement.id)}>
          {announcement.title}
        </h3>
        
        <p className={clsx("text-slate-600 text-sm mb-4 transition-all", !isExpanded && "line-clamp-2")}>
          {announcement.content}
        </p>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-2">
              {announcement.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-700">{announcement.author}</span>
          </div>
          <button 
            onClick={() => setExpandedId(isExpanded ? null : announcement.id)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center p-1"
          >
            {isExpanded ? (
              <><ChevronUp className="w-4 h-4 mr-1"/> Show Less</>
            ) : (
              <><ChevronDown className="w-4 h-4 mr-1"/> Read More</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors",
                activeCategory === cat 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
          
          {(user?.role === 'admin' || user?.role === 'faculty') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="ml-auto sm:ml-4 flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Create
            </button>
          )}
        </div>
      </div>

      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Pin className="w-4 h-4" /> Pinned Announcements
          </h3>
          <div className="grid gap-4">
            {pinnedAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {pinnedAnnouncements.length > 0 && (
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8">Recent Announcements</h3>
        )}
        <div className="grid gap-4">
          {regularAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
          {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 && (
             <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
               <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-900">No announcements found</h3>
               <p className="text-slate-500">Try adjusting your search or filters.</p>
             </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Announcement title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="event">Event</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea required rows={5} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Type the announcement details here..."></textarea>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="pinned" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
            <label htmlFor="pinned" className="ml-2 block text-sm text-slate-700">Pin to top</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">Publish</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
