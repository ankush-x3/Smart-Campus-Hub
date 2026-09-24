import { useState } from 'react';
import { Search, BookOpen, Clock, User, Check, Plus } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const mockCourses = [
  { id: 'CS101', title: 'Introduction to Programming', instructor: 'Dr. Alan Smith', credits: 4, schedule: 'Mon, Wed 10:00 AM', enrolled: 120, max: 150, department: 'Computer Science', isEnrolled: true },
  { id: 'CS202', title: 'Data Structures and Algorithms', instructor: 'Prof. Jane Doe', credits: 4, schedule: 'Tue, Thu 2:00 PM', enrolled: 145, max: 150, department: 'Computer Science', isEnrolled: false },
  { id: 'MTH101', title: 'Calculus I', instructor: 'Dr. Robert Brown', credits: 3, schedule: 'Mon, Wed, Fri 9:00 AM', enrolled: 80, max: 100, department: 'Mathematics', isEnrolled: true },
  { id: 'PHY101', title: 'Physics I: Mechanics', instructor: 'Dr. Emily White', credits: 4, schedule: 'Tue, Thu 11:00 AM', enrolled: 65, max: 80, department: 'Physics', isEnrolled: false },
  { id: 'ENG101', title: 'Academic Writing', instructor: 'Prof. Michael Johnson', credits: 3, schedule: 'Mon, Wed 1:00 PM', enrolled: 45, max: 50, department: 'Humanities', isEnrolled: false },
  { id: 'CS301', title: 'Database Management Systems', instructor: 'Dr. Alan Smith', credits: 4, schedule: 'Tue, Thu 10:00 AM', enrolled: 110, max: 120, department: 'Computer Science', isEnrolled: true },
];

const Courses = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [courses, setCourses] = useState(mockCourses);

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Humanities'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || course.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleEnrollment = (id, currentlyEnrolled) => {
    const updatedCourses = courses.map(c => {
      if (c.id === id) {
        const newEnrolledCount = currentlyEnrolled ? c.enrolled - 1 : c.enrolled + 1;
        return { ...c, isEnrolled: !currentlyEnrolled, enrolled: newEnrolledCount };
      }
      return c;
    });
    setCourses(updatedCourses);
    toast.success(currentlyEnrolled ? 'Successfully unenrolled' : 'Successfully enrolled in course');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Catalog</h2>
          <p className="text-slate-500 text-sm mt-1">Browse and enroll in courses for the current semester.</p>
        </div>
        
        {user?.role === 'faculty' && (
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Create Course
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by course code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
          />
        </div>
        
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="block w-full sm:w-64 pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept} Department</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden">
            {course.isEnrolled && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                <Check className="w-3 h-3 mr-1" /> Enrolled
              </div>
            )}
            
            <div className="mb-4">
              <Badge variant="soft" color="indigo" className="mb-3 font-mono">
                {course.id}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{course.title}</h3>
              <p className="text-sm text-indigo-600 font-medium">{course.department}</p>
            </div>
            
            <div className="space-y-3 mb-6 flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center text-sm text-slate-700">
                <User className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                <span className="truncate">{course.instructor}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <Clock className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                <span>{course.schedule}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <BookOpen className="w-4 h-4 mr-3 text-slate-400 shrink-0" />
                <span>{course.credits} Credits</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="text-sm font-medium text-slate-500">
                <span className={course.enrolled >= course.max ? "text-rose-500 font-bold" : "text-slate-900"}>{course.enrolled}</span> / {course.max} seats
              </div>
              
              {user?.role === 'student' && (
                <button
                  onClick={() => handleEnrollment(course.id, course.isEnrolled)}
                  disabled={!course.isEnrolled && course.enrolled >= course.max}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    course.isEnrolled
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : course.enrolled >= course.max
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {course.isEnrolled ? 'Unenroll' : course.enrolled >= course.max ? 'Full' : 'Enroll'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
         <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
           <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <h3 className="text-lg font-medium text-slate-900 mb-1">No courses found</h3>
           <p className="text-slate-500">Try adjusting your search criteria.</p>
         </div>
      )}
    </div>
  );
};

export default Courses;
