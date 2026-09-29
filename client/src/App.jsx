import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentNotices from './pages/student/Notices';
import StudentEvents from './pages/student/Events';
import StudentAssignments from './pages/student/Assignments';
import StudentResources from './pages/student/Resources';
import StudentHelpDesk from './pages/student/HelpDesk';
import StudentCalendar from './pages/student/Calendar';
import StudentCommunity from './pages/student/Community';
import StudentProfile from './pages/student/Profile';

// Faculty pages
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyNotices from './pages/faculty/Notices';
import FacultyResources from './pages/faculty/Resources';
import FacultyEvents from './pages/faculty/Events';
import FacultySubmissions from './pages/faculty/StudentSubmissions';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/UserManagement';
import AdminNotices from './pages/admin/NoticeManagement';
import AdminEvents from './pages/admin/EventManagement';
import AdminResources from './pages/admin/ResourceManagement';
import AdminComplaints from './pages/admin/ComplaintManagement';
import AdminAnalytics from './pages/admin/Analytics';
import AdminProfile from './pages/admin/Profile';

// Notifications
import { NotificationProvider } from './context/NotificationContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'student':
      return <Navigate to="/student" replace />;
    case 'faculty':
      return <Navigate to="/faculty" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <NotificationProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirect Root */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="events" element={<StudentEvents />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="resources" element={<StudentResources />} />
          <Route path="help" element={<StudentHelpDesk />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="community" element={<StudentCommunity />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<FacultyDashboard />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="notices" element={<FacultyNotices />} />
          <Route path="resources" element={<FacultyResources />} />
          <Route path="events" element={<FacultyEvents />} />
          <Route path="submissions" element={<FacultySubmissions />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </NotificationProvider>
  );
};

export default App;
