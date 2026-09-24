import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import clsx from 'clsx';
import { 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  Megaphone,
  ArrowRight,
  Clock,
  MapPin,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockActivityData = [
  { name: 'Mon', events: 4, logins: 24, complaints: 2 },
  { name: 'Tue', events: 3, logins: 35, complaints: 1 },
  { name: 'Wed', events: 5, logins: 42, complaints: 4 },
  { name: 'Thu', events: 2, logins: 28, complaints: 0 },
  { name: 'Fri', events: 6, logins: 45, complaints: 1 },
  { name: 'Sat', events: 8, logins: 12, complaints: 0 },
  { name: 'Sun', events: 1, logins: 15, complaints: 0 },
];

const mockAnnouncements = [
  { id: 1, title: 'Mid-term Exam Schedule Released', date: '2 hours ago', type: 'urgent', author: 'Academic Office' },
  { id: 2, title: 'Campus Wi-Fi Maintenance', date: '5 hours ago', type: 'general', author: 'IT Dept' },
  { id: 3, title: 'Annual Tech Fest Registration Open', date: '1 day ago', type: 'event', author: 'Student Council' },
];

const mockEvents = [
  { id: 1, title: 'Introduction to Machine Learning', date: 'Today, 2:00 PM', location: 'Auditorium A' },
  { id: 2, title: 'Career Fair 2024', date: 'Tomorrow, 10:00 AM', location: 'Main Ground' },
  { id: 3, title: 'Web Development Workshop', date: 'Oct 25, 4:00 PM', location: 'Lab 3' },
];

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{getGreeting()}, {user?.name}! 👋</h2>
          <p className="text-slate-500">Here's what's happening on campus today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Courses Enrolled" 
          value="5" 
          icon={BookOpen} 
          color="indigo" 
          trend="neutral"
          trendValue="Same"
        />
        <StatCard 
          title="Upcoming Events" 
          value="12" 
          icon={Calendar} 
          color="emerald" 
          trend="up"
          trendValue="+2"
        />
        <StatCard 
          title="Pending Complaints" 
          value="1" 
          icon={AlertCircle} 
          color="rose"
          trend="down"
          trendValue="-1"
        />
        <StatCard 
          title="New Announcements" 
          value="3" 
          icon={Megaphone} 
          color="amber"
          trend="up"
          trendValue="+3"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Spans 2 columns on lg screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Campus Activity</h3>
              <select className="text-sm border-slate-200 rounded-lg text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="logins" name="Active Users" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="events" name="Events" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/complaints" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <AlertCircle className="w-6 h-6" />
               </div>
               <h4 className="font-semibold text-slate-800">File Complaint</h4>
               <p className="text-xs text-slate-500 mt-1">Report an issue on campus</p>
            </Link>
            <Link to="/resources" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Building2 className="w-6 h-6" />
               </div>
               <h4 className="font-semibold text-slate-800">Book Resource</h4>
               <p className="text-xs text-slate-500 mt-1">Reserve labs or halls</p>
            </Link>
            <Link to="/courses" className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <BookOpen className="w-6 h-6" />
               </div>
               <h4 className="font-semibold text-slate-800">My Courses</h4>
               <p className="text-xs text-slate-500 mt-1">View materials & schedule</p>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Announcements Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-600" />
                Recent Announcements
              </h3>
              <Link to="/announcements" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              {mockAnnouncements.map((ann, index) => (
                <div key={ann.id} className={clsx("p-4 hover:bg-slate-50 transition-colors cursor-pointer", index !== mockAnnouncements.length - 1 && "border-b border-slate-100")}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="soft" color={ann.type === 'urgent' ? 'rose' : ann.type === 'event' ? 'emerald' : 'indigo'} className="capitalize text-[10px]">
                      {ann.type}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" />{ann.date}</span>
                  </div>
                  <h4 className="font-medium text-slate-800 text-sm leading-tight mb-1">{ann.title}</h4>
                  <p className="text-xs text-slate-500">{ann.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Upcoming Events
              </h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {mockEvents.map(event => (
                <div key={event.id} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex flex-col items-center justify-center border border-emerald-100 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                     <span className="text-xs font-semibold uppercase">{event.date.split(',')[0]}</span>
                     <span className="text-lg font-bold leading-none">{event.date.split(' ')[1] || '25'}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors">{event.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1" />{event.location}</p>
                    <p className="text-xs text-slate-400 mt-1">{event.date.split(',')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
