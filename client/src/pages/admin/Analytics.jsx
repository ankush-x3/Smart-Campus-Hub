import React from 'react';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const dailyUsers = [
    { name: '1 Nov', users: 1200 }, { name: '5 Nov', users: 1800 }, 
    { name: '10 Nov', users: 2100 }, { name: '15 Nov', users: 1950 }, 
    { name: '20 Nov', users: 2400 }, { name: '25 Nov', users: 2800 }
  ];

  const complaintsData = [
    { name: 'IT Support', value: 45, color: '#e11d48' },
    { name: 'Infrastructure', value: 30, color: '#f59e0b' },
    { name: 'Food & Dining', value: 15, color: '#10b981' },
    { name: 'Academic', value: 10, color: '#3b82f6' },
  ];

  const eventsData = [
    { name: 'Workshops', count: 12 }, { name: 'Cultural', count: 5 }, 
    { name: 'Sports', count: 8 }, { name: 'Academic', count: 20 }
  ];

  const handleExport = () => toast.success('Analytics report generated and downloading...');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into platform usage and metrics.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 font-medium text-sm">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Usage Growth</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#e11d48" fill="#ffe4e6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Complaints Breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complaintsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {complaintsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Events Hosted by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
