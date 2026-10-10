import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Calendar, CheckSquare, Clock, AlertCircle, 
  ChevronRight, MoreVertical, Plus, FileText, Bell 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    { title: 'Total Assignments Posted', value: '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Reviews', value: '45', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Students', value: '180', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Events Organized', value: '3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]);

  const [todaysClasses, setTodaysClasses] = useState([
    { id: 1, time: '09:00 AM - 10:30 AM', course: 'CS101 - Intro to Programming', room: 'Room 301', strength: 60 },
    { id: 2, time: '11:00 AM - 12:30 PM', course: 'CS201 - Data Structures', room: 'Lab 2', strength: 45 },
    { id: 3, time: '02:00 PM - 03:30 PM', course: 'CS301 - Algorithms', room: 'Room 405', strength: 50 },
  ]);

  const [assignmentStatusData, setAssignmentStatusData] = useState([
    { name: 'Submitted', value: 120, color: '#10b981' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
    { name: 'Overdue', value: 15, color: '#ef4444' },
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([
    { id: 1, student: 'John Doe', assignment: 'Graph Algorithms Implementation', time: '10 mins ago', status: 'pending', course: 'CS301' },
    { id: 2, student: 'Jane Smith', assignment: 'Binary Tree Traversal', time: '1 hour ago', status: 'pending', course: 'CS201' },
    { id: 3, student: 'Alice Johnson', assignment: 'Graph Algorithms Implementation', time: '2 hours ago', status: 'graded', course: 'CS301' },
    { id: 4, student: 'Bob Williams', assignment: 'React Basics', time: '3 hours ago', status: 'pending', course: 'CS101' },
  ]);

  const [myCourses, setMyCourses] = useState([
    { id: 'CS101', title: 'Intro to Programming', enrolled: 60, schedule: 'Mon, Wed 09:00 AM' },
    { id: 'CS201', title: 'Data Structures', enrolled: 45, schedule: 'Tue, Thu 11:00 AM' },
    { id: 'CS301', title: 'Algorithms', enrolled: 50, schedule: 'Mon, Fri 02:00 PM' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, coursesRes, assignmentsRes] = await Promise.all([
          api.get('/dashboard/stats').catch(() => null),
          api.get('/courses').catch(() => null),
          api.get('/assignments').catch(() => null)
        ]);

        if (statsRes && statsRes.data) {
          const sd = statsRes.data;
          setStats([
            { title: 'Total Assignments Posted', value: sd.totalAssignments || '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
            { title: 'Pending Reviews', value: sd.pendingReviews || '45', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
            { title: 'Total Students', value: sd.totalStudents || '180', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { title: 'Events Organized', value: sd.eventsOrganized || '3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
          ]);
        }
        
        if (coursesRes && coursesRes.data && true && coursesRes.data.length > 0) {
          setMyCourses((coursesRes.data.data || coursesRes.data).map(c => ({
            id: c._id || c.id,
            title: c.title || 'Course',
            enrolled: c.enrolled || 0,
            schedule: c.schedule || 'TBA'
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {user?.name || 'Faculty'}! 
            <Badge variant="success">Faculty Dashboard</Badge>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/faculty/notices?action=new')} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            <Bell size={18} />
            Post Notice
          </button>
          <button onClick={() => navigate('/faculty/assignments?action=new')} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium transition-colors">
            <Plus size={18} />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Classes & Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Today's Classes
              </h2>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Full Schedule</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {todaysClasses.map((cls, index) => (
                <div key={cls.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <BookOpen size={18} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-emerald-600">{cls.time}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{cls.course}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><CheckSquare size={14} /> {cls.room}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {cls.strength} Students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Submissions</h2>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Assignment</th>
                    <th className="px-6 py-3">Submitted</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{sub.student}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{sub.assignment}</div>
                        <div className="text-gray-500 text-xs">{sub.course}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{sub.time}</td>
                      <td className="px-6 py-4">
                        <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                          {sub.status === 'graded' ? 'Graded' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-emerald-600 font-medium hover:text-emerald-700">
                          {sub.status === 'graded' ? 'View' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Charts & Quick Actions */}
        <div className="space-y-6">
          {/* Assignment Status Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assignment Status Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assignmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assignmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* My Courses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Courses</h2>
            <div className="space-y-4">
              {myCourses.map(course => (
                <div key={course.id} className="p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="primary" className="bg-emerald-100 text-emerald-800">{course.id}</Badge>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Users size={14} /> {course.enrolled}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.schedule}</span>
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

export default FacultyDashboard;

