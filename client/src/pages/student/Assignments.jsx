import React, { useState, useEffect } from 'react';
import { Book, Clock, CheckCircle, AlertCircle, UploadCloud, FileText } from 'lucide-react';
import api from '../../utils/api';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Assignments() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/assignments');
                setAssignments((res.data.data || res.data).map(a => ({
          ...a, 
          id: a._id || a.id,
          course: a.course?.title || 'Unknown Course',
          faculty: a.faculty?.name || 'Unknown Faculty'
        })));
      } catch (err) {
        toast.error('Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const courses = ['All Courses', ...new Set(assignments.map(a => a.course))];

  const filteredAssignments = assignments.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter;
    const matchCourse = courseFilter === 'All Courses' || a.course === courseFilter;
    return matchFilter && matchCourse;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'Pending').length,
    submitted: assignments.filter(a => a.status === 'Submitted').length,
    overdue: assignments.filter(a => a.status === 'Overdue').length
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitFile) {
      toast.error('Please select a file to submit.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', submitFile);
      await api.post(`/assignments/${selectedAssignment.id}/submit`, formData);
      toast.success('Assignment submitted successfully!');
      setAssignments(assignments.map(a => a.id === selectedAssignment.id ? { ...a, status: 'Submitted' } : a));
      setIsSubmitModalOpen(false);
      setSubmitFile(null);
    } catch (err) {
      toast.error('Failed to submit assignment');
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
          <p className="text-slate-500 mt-1">Manage your course work and deadlines</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-sm font-medium text-amber-600">Pending</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Submitted</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.submitted}</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-sm font-medium text-rose-600">Overdue</p>
          <p className="text-3xl font-bold text-rose-700 mt-1">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {['All', 'Pending', 'Submitted', 'Overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none"
        >
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <EmptyState message="No assignments found." />
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map(asgn => (
            <div key={asgn.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="primary">{asgn.course}</Badge>
                  <Badge variant={asgn.status === 'Submitted' ? 'success' : asgn.status === 'Overdue' ? 'danger' : 'warning'}>
                    {asgn.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{asgn.title}</h3>
                <p className="text-sm text-slate-500">Faculty: {asgn.faculty} • Total Marks: {asgn.totalMarks}</p>
              </div>

              <div className="flex flex-col md:items-end w-full md:w-auto gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className={clsx("flex items-center text-sm font-bold", 
                  asgn.status === 'Overdue' ? "text-rose-600" : asgn.status === 'Submitted' ? "text-emerald-600" : asgn.daysLeft <= 2 ? "text-amber-600" : "text-slate-600"
                )}>
                  {asgn.status === 'Submitted' ? (
                    <><CheckCircle className="w-5 h-5 mr-1" /> Submitted</>
                  ) : asgn.status === 'Overdue' ? (
                    <><AlertCircle className="w-5 h-5 mr-1" /> Overdue</>
                  ) : (
                    <><Clock className="w-5 h-5 mr-1" /> Due in {asgn.daysLeft} days</>
                  )}
                </div>
                <p className="text-xs text-slate-500">{asgn.dueDate}</p>
                
                {asgn.status === 'Submitted' ? (
                  <button className="w-full md:w-auto px-6 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors">
                    View Submission
                  </button>
                ) : (
                  <button 
                    onClick={() => { setSelectedAssignment(asgn); setIsSubmitModalOpen(true); }}
                    className={clsx("w-full md:w-auto px-6 py-2 rounded-xl font-semibold transition-colors text-white",
                      asgn.status === 'Overdue' ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                  >
                    {asgn.status === 'Overdue' ? 'Late Submit' : 'Submit Assignment'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Submit Modal */}
      {selectedAssignment && (
        <Modal isOpen={isSubmitModalOpen} onClose={() => {setIsSubmitModalOpen(false); setSubmitFile(null);}} title="Submit Assignment">
          <form onSubmit={handleSubmit} className="p-2">
            <div className="bg-indigo-50 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-indigo-900">{selectedAssignment.title}</h4>
              <p className="text-sm text-indigo-700">{selectedAssignment.course}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upload File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => setSubmitFile(e.target.files[0])}
                />
                <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  {submitFile ? submitFile.name : 'Click or drag file to this area to upload'}
                </p>
                <p className="text-xs text-slate-500">Support for a single or bulk upload. Max size 10MB.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Submission Notes (Optional)</label>
              <textarea 
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={3} 
                placeholder="Add any comments for your instructor..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Submit Work
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

