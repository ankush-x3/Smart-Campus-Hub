import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar as CalendarIcon, Bell, 
  Map as MapIcon, HelpCircle, Users, Activity,
  Clock, CheckCircle, AlertCircle, FileText, ChevronRight,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch real stats
        const statsRes = await api.get('/dashboard/stats');
        const statsData = statsRes.data.data || {};
        
        // Fetch recent announcements
        const noticesRes = await api.get('/announcements').catch(() => ({ data: { data: [] } }));
        const noticesData = noticesRes.data?.data || [];
        
        // Fetch recent events
        const eventsRes = await api.get('/events').catch(() => ({ data: { data: [] } }));
        const eventsData = eventsRes.data?.data || [];

        // Fetch recent assignments
        const assignmentsRes = await api.get('/assignments').catch(() => ({ data: { data: [] } }));
        const assignmentsData = assignmentsRes.data?.data || [];
        
        // Fetch user info for name
        const authRes = await api.get('/auth/me').catch(() => ({ data: { data: { name: 'Student' } } }));
        const authData = authRes.data?.data || { name: 'Student' };

        const mapId = (arr) => arr?.map(item => ({...item, id: item._id || item.id})) || [];
        
        setData({
          name: authData.name,
          stats: {
            activeCourses: statsData.enrolledCourses || 0,
            upcomingDeadlines: assignmentsData.length || 0,
            eventsRegistered: statsData.registeredEvents || 0,
            unreadNotices: statsData.unreadNotices || 0
          },
          todaySchedule: [],
          recentAssignments: mapId(assignmentsData.slice(0, 3)),
          upcomingEvents: mapId(eventsData.slice(0, 3)),
          recentNotices: mapId(noticesData.slice(0, 3)),
          studyHours: [
            { name: 'Mon', hours: 2 },
            { name: 'Tue', hours: 4 },
            { name: 'Wed', hours: 3 },
            { name: 'Thu', hours: 5 },
            { name: 'Fri', hours: 2 },
            { name: 'Sat', hours: 6 },
            { name: 'Sun', hours: 4 }
          ]
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!data) return <div className="p-8"><EmptyState icon={AlertCircle} title="Failed to load dashboard" description="There was an error loading your dashboard data." /></div>;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Good morning, {data.name}! 👋</h1>
        <p className="text-indigo-100 flex items-center"><CalendarIcon className="w-4 h-4 mr-2" /> {today}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Courses" value={data.stats.activeCourses} icon={<BookOpen />} color="bg-blue-50 text-blue-600" trend="up" />
        <StatCard title="Upcoming Deadlines" value={data.stats.upcomingDeadlines} icon={<Clock />} color="bg-amber-50 text-amber-600" trend="down" />
        <StatCard title="Events Registered" value={data.stats.eventsRegistered} icon={<CalendarIcon />} color="bg-emerald-50 text-emerald-600" trend="up" />
        <StatCard title="Unread Notices" value={data.stats.unreadNotices} icon={<Bell />} color="bg-rose-50 text-rose-600" trend="up" />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="mr-2 text-indigo-600" /> Today's Schedule</h2>
        {data.todaySchedule.length === 0 ? (
          <EmptyState icon={BookOpen} title="No classes today" description="You have no classes scheduled for today." />
        ) : (
          <div className="space-y-4">
            {data.todaySchedule.map(cls => (
              <div key={cls.id} className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold mr-4 min-w-[100px] text-center">
                  {cls.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{cls.course}</h3>
                  <p className="text-sm text-slate-500">{cls.faculty} • {cls.room}</p>
                </div>
                <Badge variant={cls.type === 'Lecture' ? 'primary' : 'secondary'}>{cls.type}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Assignments</h2>
            <button className="text-indigo-600 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {data.recentAssignments.map(asgn => (
              <div key={asgn.id} className="p-4 border border-slate-100 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">{asgn.subject}</span>
                  <Badge variant={asgn.status === 'submitted' ? 'success' : asgn.daysLeft <= 2 ? 'danger' : 'warning'}>
                    {asgn.status === 'submitted' ? 'Submitted' : `${asgn.daysLeft} days left`}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{asgn.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Upcoming Events</h2>
            <button className="text-indigo-600 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {data.upcomingEvents.map(evt => (
              <div key={evt.id} className="flex items-start p-3 border border-slate-100 rounded-xl">
                <div className="bg-indigo-50 p-2 rounded-lg mr-3 text-indigo-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">{evt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{evt.date} • {evt.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={<FileText />} label="Assignments" />
            <ActionButton icon={<CalendarIcon />} label="Book Resource" />
            <ActionButton icon={<AlertCircle />} label="File Complaint" />
            <ActionButton icon={<MapIcon />} label="View Map" />
            <ActionButton icon={<Users />} label="Community" />
            <ActionButton icon={<HelpCircle />} label="Help Desk" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Weekly Study Hours</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.studyHours}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Motivational Quote */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-4">"The beautiful thing about learning is nobody can take it away from you."</h3>
          <p className="text-indigo-200">- B.B. King</p>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Recent Notices</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {data.recentNotices.map(notice => (
            <div key={notice.id} className="min-w-[250px] p-4 border border-slate-200 rounded-xl flex-shrink-0 hover:shadow-md transition-shadow">
              <Badge variant={notice.category === 'Urgent' ? 'danger' : notice.category === 'Academic' ? 'primary' : 'success'} className="mb-2">
                {notice.category}
              </Badge>
              <h3 className="font-bold text-slate-800 text-sm mb-2">{notice.title}</h3>
              <p className="text-xs text-slate-500">{notice.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>
        <div className={clsx("p-3 rounded-xl", color)}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" /> : <TrendingDown className="w-4 h-4 text-rose-500 mr-1" />}
        <span className={trend === 'up' ? "text-emerald-500" : "text-rose-500"}>From last week</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-colors group">
      <div className="text-slate-400 group-hover:text-indigo-600 mb-2">
        {icon}
      </div>
      <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-700">{label}</span>
    </button>
  );
}
