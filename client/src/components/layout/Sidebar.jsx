import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Megaphone, Calendar, FileText, 
  BookOpen, Headphones, CalendarDays, Users, 
  UserCircle, ClipboardList, Building2, AlertCircle, 
  BarChart3 
} from 'lucide-react';

const navConfigs = {
  student: {
    gradient: 'from-indigo-950 to-indigo-900',
    badge: '🎓 Student',
    items: [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'Notices', path: '/student/notices', icon: Megaphone },
      { name: 'Events', path: '/student/events', icon: Calendar },
      { name: 'Assignments', path: '/student/assignments', icon: FileText },
      { name: 'Resources', path: '/student/resources', icon: BookOpen },
      { name: 'Help Desk', path: '/student/help', icon: Headphones },
      { name: 'Calendar', path: '/student/calendar', icon: CalendarDays },
      { name: 'Community', path: '/student/community', icon: Users },
      { name: 'Profile', path: '/student/profile', icon: UserCircle },
    ]
  },
  faculty: {
    gradient: 'from-emerald-950 to-emerald-900',
    badge: '👨‍🏫 Faculty',
    items: [
      { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
      { name: 'Assignments', path: '/faculty/assignments', icon: FileText },
      { name: 'Notices', path: '/faculty/notices', icon: Megaphone },
      { name: 'Resources', path: '/faculty/resources', icon: BookOpen },
      { name: 'Events', path: '/faculty/events', icon: Calendar },
      { name: 'Submissions', path: '/faculty/submissions', icon: ClipboardList },
    ]
  },
  admin: {
    gradient: 'from-slate-950 to-slate-900',
    badge: '⚙️ Admin',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Notices', path: '/admin/notices', icon: Megaphone },
      { name: 'Events', path: '/admin/events', icon: Calendar },
      { name: 'Resources', path: '/admin/resources', icon: Building2 },
      { name: 'Complaints', path: '/admin/complaints', icon: AlertCircle },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ]
  }
};

const Sidebar = ({ role = 'student', isOpen }) => {
  const config = navConfigs[role] || navConfigs.student;

  return (
    <aside 
      className={`bg-gradient-to-b ${config.gradient} text-white transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-64' : 'w-16'} overflow-y-auto hidden md:flex`}
    >
      <div className="p-4 flex items-center justify-center border-b border-white/10 h-16 shrink-0">
        {isOpen ? (
          <span className="font-bold text-lg tracking-wider bg-white/10 px-3 py-1 rounded-full text-sm">
            {config.badge}
          </span>
        ) : (
          <span className="text-xl">{config.badge.split(' ')[0]}</span>
        )}
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {config.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 transition-colors duration-200 group ${
                    isActive 
                      ? 'bg-white/15 border-l-2 border-white rounded-r-none' 
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`
                }
                title={!isOpen ? item.name : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                {isOpen && <span className="font-medium truncate">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
