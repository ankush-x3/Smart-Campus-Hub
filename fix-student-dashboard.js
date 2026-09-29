const fs = require('fs');
let content = fs.readFileSync('client/src/pages/student/Dashboard.jsx', 'utf8');

const newFetch = `useEffect(() => {
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
  }, []);`;

content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, newFetch);

// Also fix the EmptyState usage
content = content.replace(
  /<EmptyState message="Failed to load dashboard" \/>/g,
  '<EmptyState icon={AlertCircle} title="Failed to load dashboard" description="There was an error loading your dashboard data." />'
);
content = content.replace(
  /<EmptyState message="No classes scheduled for today." \/>/g,
  '<EmptyState icon={BookOpen} title="No classes today" description="You have no classes scheduled for today." />'
);

fs.writeFileSync('client/src/pages/student/Dashboard.jsx', content);
