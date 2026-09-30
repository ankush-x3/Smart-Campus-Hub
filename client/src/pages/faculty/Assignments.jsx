import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  Eye, FileText, CheckCircle, XCircle, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FacultyAssignments = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'John Doe', submittedAt: '2023-11-19 14:30', status: 'submitted', marks: null },
    { id: 2, student: 'Jane Smith', submittedAt: '2023-11-18 09:15', status: 'graded', marks: 95 },
    { id: 3, student: 'Alice Johnson', submittedAt: '-', status: 'overdue', marks: null },
    { id: 4, student: 'Bob Williams', submittedAt: '2023-11-20 23:50', status: 'submitted', marks: null },
  ]);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments((res.data.data || res.data).map(a => ({ ...a, id: a._id || a.id, course: a.course?.title || (typeof a.course === 'string' ? a.course : 'Unknown Course'), faculty: a.faculty?.name || (typeof a.faculty === 'string' ? a.faculty : 'Unknown Faculty') })));
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const res = await api.get('/courses');
      setCourses(res.data.data || res.data);
      setCoursesError('');
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCoursesError('Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const filteredAssignments = assignments.filter(a => activeTab === 'All' ? true : a.status === activeTab);

  const stats = {
    active: assignments.filter(a => a.status === 'Active').length,
    closed: assignments.filter(a => a.status === 'Closed').length,
    total: assignments.length
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      course: formData.get('course'),
      totalMarks: Number(formData.get('totalMarks')),
      dueDate: formData.get('dueDate'),
      description: formData.get('description'),
      attachmentUrl: formData.get('attachmentUrl'),
      status: 'active',
      submitted: 0,
      total: 0 // Mock total students
    };
    
    try {
      const res = await api.post('/assignments', data);
      fetchAssignments();
      toast.success('Assignment created successfully!');
      setIsCreateModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleGradeSubmit = (studentId) => {
    toast.success(`Grades saved successfully!`);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success('Assignment deleted');
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };

  const handleClose = async (id) => {
    try {
      const assignment = assignments.find(a => a.id === id);
      const res = await api.put(`/assignments/${id}`, { ...assignment, status: 'closed' });
      fetchAssignments();
      toast.success('Assignment closed');
    } catch (err) {
      toast.error('Failed to close assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments Management</h1>
          <p className="text-gray-500 mt-1">Create and manage course assignments.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Assignments</p>
          <h3 className="text-2xl font-bold text-emerald-600">{stats.active}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Closed Assignments</p>
          <h3 className="text-2xl font-bold text-slate-600">{stats.closed}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Assignments</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px px-6">
            {['All', 'Active', 'Closed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Assignments Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="primary" className="bg-emerald-100 text-emerald-800">{assignment.course}</Badge>
                  <Badge variant={assignment.status === 'Active' ? 'success' : 'neutral'}>
                    {assignment.status}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2">{assignment.title}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <CalendarIcon size={14} />
                  <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>

                <div className="mt-auto space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Submissions</span>
                      <span className="font-medium text-gray-900">{assignment.submitted}/{assignment.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${assignment.submitted === assignment.total ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-gray-700">{assignment.totalMarks} Marks</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedAssignment(assignment); setIsSubmissionsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger"
                        title="View Submissions"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState 
                icon={FileText} 
                title={`No ${activeTab.toLowerCase()} assignments found`}
                description="Try creating a new assignment or changing the filter."
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        size="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Assignment Title</label>
              <input name="title" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Final Project Proposal" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Course</label>
                            <select name="course" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {coursesLoading ? (
                  <option value="">Loading courses...</option>
                ) : coursesError ? (
                  <option value="">{coursesError}</option>
                ) : courses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  <>
                    <option value="">Select Course...</option>
                    {courses.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.title} ({c.code})</option>)}
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Total Marks</label>
              <input name="totalMarks" type="number" required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 100" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Due Date & Time</label>
              <input name="dueDate" type="datetime-local" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows="4" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Provide detailed instructions..."></textarea>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Attachment URL (Optional)</label>
              <input name="attachmentUrl" type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Create Assignment</button>
          </div>
        </form>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        isOpen={isSubmissionsModalOpen}
        onClose={() => setIsSubmissionsModalOpen(false)}
        title={selectedAssignment ? `Submissions: ${selectedAssignment.title}` : 'Submissions'}
        size="xl"
      >
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Student Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Submitted At</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 w-32">Marks</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className={`hover:bg-gray-50 ${sub.status === 'overdue' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.student}</td>
                  <td className="px-4 py-3 text-gray-500">{sub.submittedAt}</td>
                  <td className="px-4 py-3">
                    <Badge variant={sub.status === 'graded' ? 'success' : sub.status === 'submitted' ? 'warning' : 'danger'}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue={sub.marks} 
                      max={selectedAssignment?.totalMarks || 100}
                      min="0"
                      disabled={sub.status === 'overdue'}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
                      placeholder="/ 100"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleGradeSubmit(sub.id)}
                      disabled={sub.status === 'overdue'}
                      className="text-emerald-600 hover:text-emerald-800 font-medium disabled:text-gray-400"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pt-4 flex justify-end mt-4 border-t border-gray-100">
          <button onClick={() => setIsSubmissionsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default FacultyAssignments;











