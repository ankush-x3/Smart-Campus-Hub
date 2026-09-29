import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Bell, AlertTriangle, Activity,
  Database, Server, HardDrive, Shield
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SystemSettingsModal from './SettingsModal';
import ReportModal from './ReportModal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" className="text-rose-600" />
      </div>
    );
  }

  const stats = [
    { title: 'Total Users', value: data.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Students', value: data.totalStudents, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Faculty', value: data.totalFaculty, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Events', value: data.totalEvents, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Announcements', value: data.totalAnnouncements, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Complaints', value: data.totalComplaints, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

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
          <button 
            onClick={() => setIsReportOpen(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Generate Report
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 font-medium transition-colors"
          >
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
                  <BarChart data={data.userRegistrationData}>
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
                  <LineChart data={data.dailyActiveUsers}>
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

          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium text-gray-700">Auth Service</span>
                  </div>
                  <Badge variant="success">Secure</Badge>
                </div>
              </div>
            </div>

            {/* Role Distribution Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Role Distribution</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.roleDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {data.roleDistributionData.map(role => (
                  <div key={role.name} className="flex items-center gap-1 text-sm text-gray-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    {role.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Activity Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <button onClick={fetchDashboardData} className="text-sm text-rose-600 hover:text-rose-700 font-medium">Refresh</button>
            </div>
            <div className="space-y-6">
              {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.map((activity, index) => (
                <div key={activity._id || index} className="flex gap-4 relative">
                  {index !== data.recentActivity.length - 1 && (
                    <div className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-slate-100" />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'system' || activity.type === 'setting' ? 'bg-indigo-100 text-indigo-600' :
                    activity.type === 'complaint' ? 'bg-amber-100 text-amber-600' :
                    activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{activity.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{new Date(activity.time).toLocaleString()}</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">by {activity.user}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
              )}
            </div>
          </div>
          
          {/* Action Required Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
              Action Required
              <Badge variant="warning">{data.pendingComplaints} Pending</Badge>
            </h2>
            <button 
              onClick={() => navigate('/admin/complaints')}
              className="w-full mt-4 bg-white text-slate-900 rounded-lg py-2 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Go to Help Desk
            </button>
          </div>
        </div>
      </div>

      <SystemSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};

export default AdminDashboard;
