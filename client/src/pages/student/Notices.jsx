import React, { useState, useEffect } from 'react';
import { Search, Filter, Pin, Eye, Calendar, User, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Notices() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'Academic', 'Exam', 'Event', 'General', 'Urgent'];
  const dateFilters = ['All Time', 'Today', 'This Week', 'This Month'];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/student/notices');
        setNotices(res.data);
      } catch (err) {
        setNotices([
          { id: 1, title: 'Mid-Semester Examination Schedule', category: 'Exam', author: 'Examination Cell', date: '2026-10-10', daysAgo: 0, views: 342, content: 'The mid-semester examinations will commence from 25th October. Please find the detailed schedule attached.', hasAttachment: true, isPinned: true, isRead: false },
          { id: 2, title: 'Campus Drive: Google', category: 'Event', author: 'Placement Cell', date: '2026-10-09', daysAgo: 1, views: 512, content: 'Google is visiting our campus for hiring software engineers. All final year students with CGPA > 8.0 are eligible.', hasAttachment: false, isPinned: true, isRead: true },
          { id: 3, title: 'Library Timings Update', category: 'General', author: 'Chief Librarian', date: '2026-10-08', daysAgo: 2, views: 120, content: 'The central library will remain open 24/7 during the examination weeks.', hasAttachment: false, isPinned: false, isRead: false },
          { id: 4, title: 'URGENT: Server Maintenance', category: 'Urgent', author: 'IT Helpdesk', date: '2026-10-05', daysAgo: 5, views: 890, content: 'The student portal will be down for maintenance from 2 AM to 4 AM on Sunday.', hasAttachment: false, isPinned: false, isRead: true },
          { id: 5, title: 'Submission of Assignments', category: 'Academic', author: 'Prof. Davis', date: '2026-10-01', daysAgo: 9, views: 45, content: 'All students are reminded to submit their lab assignments by the end of this week.', hasAttachment: true, isPinned: false, isRead: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleMarkAsRead = (id) => {
    setNotices(notices.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Urgent': return 'danger';
      case 'Exam': return 'warning';
      case 'Academic': return 'primary';
      case 'Event': return 'success';
      default: return 'secondary';
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || n.category === category;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notices</h1>
          <p className="text-slate-500 mt-1">Stay updated with campus announcements</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border",
                category === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
          <select 
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            {dateFilters.map(df => <option key={df} value={df}>{df}</option>)}
          </select>
        </div>
      </div>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <Pin className="w-4 h-4 mr-2" /> Pinned
          </h2>
          {pinnedNotices.map(notice => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              isExpanded={expandedId === notice.id}
              onToggle={() => {
                setExpandedId(expandedId === notice.id ? null : notice.id);
                handleMarkAsRead(notice.id);
              }}
              getCategoryColor={getCategoryColor}
              isPinned={true}
            />
          ))}
        </div>
      )}

      {/* Regular Notices */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent</h2>
        {regularNotices.length === 0 ? (
          <EmptyState message="No notices found matching your criteria." />
        ) : (
          regularNotices.map(notice => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              isExpanded={expandedId === notice.id}
              onToggle={() => {
                setExpandedId(expandedId === notice.id ? null : notice.id);
                handleMarkAsRead(notice.id);
              }}
              getCategoryColor={getCategoryColor}
              isPinned={false}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NoticeCard({ notice, isExpanded, onToggle, getCategoryColor, isPinned }) {
  return (
    <div 
      className={clsx(
        "bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md",
        isPinned ? "border-amber-400" : "border-slate-200",
        !notice.isRead && !isPinned ? "border-l-4 border-l-indigo-600" : ""
      )}
      onClick={onToggle}
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-3">
            <Badge variant={getCategoryColor(notice.category)}>{notice.category}</Badge>
            {!notice.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
          </div>
          <div className="flex items-center text-xs text-slate-500 gap-4">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {notice.daysAgo === 0 ? 'Today' : `${notice.daysAgo} days ago`}</span>
            <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {notice.views}</span>
          </div>
        </div>

        <h3 className={clsx("text-lg font-bold mb-2", !notice.isRead ? "text-slate-900" : "text-slate-700")}>
          {notice.title}
        </h3>

        <div className="flex items-center text-sm text-slate-500 mb-2">
          <User className="w-4 h-4 mr-2" /> {notice.author}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
            <p className="text-slate-700 text-sm leading-relaxed mb-4">{notice.content}</p>
            {notice.hasAttachment && (
              <button className="flex items-center px-4 py-2 bg-slate-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                <Paperclip className="w-4 h-4 mr-2" /> Download Attachment
              </button>
            )}
          </div>
        )}
      </div>
      <div className="bg-slate-50 px-5 py-2 rounded-b-2xl border-t border-slate-100 flex justify-center text-slate-400">
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
    </div>
  );
}
