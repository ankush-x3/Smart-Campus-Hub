import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Bell, AlertTriangle, Activity,
  TrendingUp, CheckCircle, Database, Server, HardDrive 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: 'Total Users', value: '2,845', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Students', value: '2,500', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Faculty', value: '320', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Events', value: '45', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Announcements', value: '128', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Complaints', value: '12', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const userRegistrationData = [
    { name: 'Jan', users: 120 }, { name: 'Feb', users: 150 }, { name: 'Mar', users: 180 },
    { name: 'Apr', users: 140 }, { name: 'May', users: 210 }, { name: 'Jun', users: 250 },
  ];

  const roleDistributionData = [
    { name: 'Students', value: 2500, color: '#4f46e5' }, // indigo-600
    { name: 'Faculty', value: 320, color: '#10b981' }, // emerald-500
    { name: 'Admin', value: 25, color: '#e11d48' },   // rose-600
  ];

  const dailyActiveUsers = [
    { day: 'Mon', active: 1800 }, { day: 'Tue', active: 2100 }, { day: 'Wed', active: 2300 },
    { day: 'Thu', active: 2200 }, { day: 'Fri', active: 1900 }, { day: 'Sat', active: 800 }, { day: 'Sun', active: 600 },
  ];

  const recentActivity = [
    { id: 1, action: 'User Registration', details: 'New student account created (CS21045)', time: '5 mins ago', type: 'user' },
    { id: 2, action: 'System Alert', details: 'Database backup completed successfully', time: '1 hour ago', type: 'system' },
    { id: 3, action: 'Complaint Resolved', details: 'Hostel WiFi issue marked as resolved by Admin_02', time: '2 hours ago', type: 'complaint' },
    { id: 4, action: 'Event Published', details: 'Annual Tech Fest 2023 published by Faculty_JD', time: '4 hours ago', type: 'event' },
    { id: 5, action: 'Notice Posted', details: 'Mid-term schedule published for CS Dept', time: '5 hours ago', type: 'notice' },
  ];

  const complaints = [
    { id: 'C-101', title: 'Library AC not working', status: 'Pending', priority: 'High' },
    { id: 'C-102', title: 'Hostel Mess Food Quality', status: 'In Progress', priority: 'Medium' },
    { id: 'C-103', title: 'Lab computers software update', status: 'Resolved', priority: 'Low' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" className="text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            System Overview 
            <Badge variant="danger">Admin Dashboard</Badge>
          </h1>
          <p className="text-gray-500 mt-1">Monitor platform health and user activity.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 font-medium transition-colors">
            Generate Report
          </button>
          <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 font-medium transition-colors">
            System Settings
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center hover:border-rose-300 transition-colors">
            <div className={`p-3 rounded-full mb-2 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-xs font-medium text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">User Registrations (6 Months)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRegistrationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="users" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DAU Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Active Users</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="active" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* System Health & Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Health */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">System Health</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-gray-700">API Status</span>
                  </div>
                  <Badge variant="success">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-gray-700">Database</span>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-gray-700">Storage (85%)</span>
                  </div>
                  <Badge variant="warning">Warning</Badge>
                </div>
              </div>
            </div>

            {/* Top Complaints */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Complaints</h2>
                <button className="text-sm text-rose-600 font-medium hover:text-rose-700">View All</button>
              </div>
              <div className="space-y-3">
                {complaints.map(comp => (
                  <div key={comp.id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-0.5">{comp.id}</p>
                      <p className="font-medium text-gray-900 text-sm">{comp.title}</p>
                    </div>
                    <Badge variant={comp.status === 'Resolved' ? 'success' : comp.status === 'In Progress' ? 'warning' : 'danger'}>
                      {comp.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Role Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Roles</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {roleDistributionData.map(role => (
                <div key={role.name} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: role.color}}></div>
                  {role.name}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              Activity Feed
            </h2>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="relative pl-6 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-white"></div>
                  <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
